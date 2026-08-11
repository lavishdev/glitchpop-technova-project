import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/buttons/app_buttons.dart';
import '../../../../core/widgets/dialogs/app_dialogs.dart';
import '../../../../core/widgets/loading/loading_components.dart';
import '../../../../core/widgets/navigation/navigation_components.dart';
import '../../../../routes/route_names.dart';
import '../providers/profile_provider.dart';
import '../widgets/about_section.dart';
import '../widgets/officer_profile_card.dart';
import '../widgets/profile_stats_grid.dart';
import '../widgets/settings_section.dart';
import '../widgets/support_section.dart';

class ProfilePage extends ConsumerWidget {
  const ProfilePage({super.key});

  void _handleLogout(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (dCtx) => ConfirmationDialog(
        title: 'Logout',
        message: 'Are you sure you want to log out of CrowdShield Mobile?',
        confirmText: 'Logout',
        onConfirm: () async {
          await ref.read(profileProvider.notifier).logout();
          if (context.mounted) {
            context.go(RouteNames.login);
          }
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(profileProvider);
    final notifier = ref.read(profileProvider.notifier);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: const CustomAppBar(
        title: 'Officer Profile & Settings',
        centerTitle: true,
      ),
      body: state.isLoading || state.profile == null
          ? const CircularLoader()
          : RefreshIndicator(
              onRefresh: () => notifier.loadProfile(),
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    OfficerProfileCard(profile: state.profile!)
                        .animate()
                        .fadeIn(duration: 350.ms),
                    const SizedBox(height: 16),
                    const SectionHeader(title: 'Activity Metrics'),
                    const SizedBox(height: 8),
                    ProfileStatsGrid(profile: state.profile!)
                        .animate()
                        .fadeIn(duration: 350.ms, delay: 100.ms),
                    const SizedBox(height: 20),
                    SettingsSection(
                      profile: state.profile!,
                      onToggleNotifications: (val) => notifier.toggleNotifications(val),
                      onChangeLanguage: (lang) => notifier.setLanguage(lang),
                    ).animate().fadeIn(duration: 350.ms, delay: 150.ms),
                    const SizedBox(height: 20),
                    const SupportSection()
                        .animate()
                        .fadeIn(duration: 350.ms, delay: 200.ms),
                    const SizedBox(height: 20),
                    const AboutSection()
                        .animate()
                        .fadeIn(duration: 350.ms, delay: 250.ms),
                    const SizedBox(height: 28),
                    AppDangerButton(
                      text: 'Logout of Account',
                      icon: Icons.logout,
                      onPressed: () => _handleLogout(context, ref),
                    ).animate().fadeIn(duration: 350.ms, delay: 300.ms),
                    const SizedBox(height: 16),
                  ],
                ),
              ),
            ),
    );
  }
}
