import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/buttons/app_buttons.dart';
import '../../../../core/widgets/dialogs/app_dialogs.dart';
import '../../../../core/widgets/inputs/app_inputs.dart';
import '../../../../routes/route_names.dart';
import '../providers/auth_provider.dart';

class LoginForm extends ConsumerStatefulWidget {
  const LoginForm({super.key});

  @override
  ConsumerState<LoginForm> createState() => _LoginFormState();
}

class _LoginFormState extends ConsumerState<LoginForm> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _rememberMe = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  String? _validateEmail(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Email is required';
    }
    final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    if (!emailRegex.hasMatch(value.trim())) {
      return 'Enter a valid email address';
    }
    return null;
  }

  String? _validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Password is required';
    }
    return null;
  }

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;

    final success = await ref
        .read(authProvider.notifier)
        .login(_emailController.text, _passwordController.text);

    if (!mounted) return;

    if (success) {
      context.go(RouteNames.home);
    } else {
      final errorMessage = ref.read(authProvider).errorMessage ?? 'Login failed';
      showDialog(
        context: context,
        builder: (context) => ErrorDialog(
          title: 'Authentication Error',
          message: errorMessage,
        ),
      );
    }
  }

  void _showForgotPasswordDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Forgot Password'),
        content: const Text('Coming Soon'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);

    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          CustomTextField(
            label: 'Email',
            hint: 'admin@crowdshield.com',
            controller: _emailController,
            keyboardType: TextInputType.emailAddress,
            prefixIcon: const Icon(Icons.email_outlined),
            validator: _validateEmail,
          ),
          const SizedBox(height: 16),
          PasswordField(
            label: 'Password',
            controller: _passwordController,
            validator: _validatePassword,
          ),
          const SizedBox(height: 12),
          Wrap(
            alignment: WrapAlignment.spaceBetween,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Checkbox(
                    value: _rememberMe,
                    activeColor: AppColors.primary,
                    onChanged: (value) {
                      setState(() {
                        _rememberMe = value ?? false;
                      });
                    },
                  ),
                  const Text('Remember Me'),
                ],
              ),
              TextButton(
                onPressed: _showForgotPasswordDialog,
                child: const Text('Forgot Password?'),
              ),
            ],
          ),
          const SizedBox(height: 24),
          AppPrimaryButton(
            text: 'Login',
            isLoading: authState.isLoading,
            onPressed: authState.isLoading ? null : _handleLogin,
          ),
        ],
      ),
    );
  }
}
