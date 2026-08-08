import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/providers/demo_provider.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/buttons/app_buttons.dart';
import '../../../../core/widgets/dialogs/app_dialogs.dart';
import '../../../../core/widgets/inputs/app_inputs.dart';
import '../../../../core/widgets/navigation/navigation_components.dart';
import '../../../../routes/route_names.dart';
import '../providers/incident_provider.dart';
import '../widgets/category_selector.dart';
import '../widgets/photo_upload_placeholder.dart';
import '../widgets/priority_selector.dart';

class ReportIncidentPage extends ConsumerStatefulWidget {
  const ReportIncidentPage({super.key});

  @override
  ConsumerState<ReportIncidentPage> createState() => _ReportIncidentPageState();
}

class _ReportIncidentPageState extends ConsumerState<ReportIncidentPage> {
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _locationController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _titleController.addListener(_onFieldChanged);
    _descriptionController.addListener(_onFieldChanged);
    _locationController.addListener(_onFieldChanged);

    WidgetsBinding.instance.addPostFrameCallback((_) {
      final demo = ref.read(demoProvider);
      if (_locationController.text.isEmpty) {
        _locationController.text = demo.currentLocation;
      }
    });
  }

  void _onFieldChanged() {
    setState(() {});
  }

  @override
  void dispose() {
    _titleController.removeListener(_onFieldChanged);
    _descriptionController.removeListener(_onFieldChanged);
    _locationController.removeListener(_onFieldChanged);
    _titleController.dispose();
    _descriptionController.dispose();
    _locationController.dispose();
    super.dispose();
  }

  bool get _isFormValid {
    final state = ref.watch(incidentProvider);
    return state.selectedCategory != null &&
        _titleController.text.trim().isNotEmpty &&
        _descriptionController.text.trim().isNotEmpty &&
        _locationController.text.trim().isNotEmpty;
  }

  Future<void> _handleSubmit() async {
    if (!_isFormValid) return;

    final notifier = ref.read(incidentProvider.notifier);
    final report = await notifier.submitIncident(
      title: _titleController.text,
      description: _descriptionController.text,
      location: _locationController.text,
    );

    if (report != null && mounted) {
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (dCtx) => SuccessDialog(
          title: 'Incident Submitted',
          message: 'Report created successfully.\nReference ID: ${report.id}',
          onClose: () {
            context.push(RouteNames.incidentHistory);
          },
        ),
      );

      _titleController.clear();
      _descriptionController.clear();
      _locationController.clear();
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(incidentProvider);
    final notifier = ref.read(incidentProvider.notifier);
    final isSubmitting = state.formStatus == IncidentFormStatus.submitting;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: CustomAppBar(
        title: 'Report Incident',
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.text),
          onPressed: () => context.pop(),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.history, color: AppColors.primary),
            tooltip: 'Incident History',
            onPressed: () => context.push(RouteNames.incidentHistory),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CategorySelector(
              selectedCategory: state.selectedCategory,
              onSelect: (cat) {
                notifier.selectCategory(cat);
                setState(() {});
              },
            ).animate().fadeIn(duration: 300.ms),
            const SizedBox(height: 20),
            CustomTextField(
              label: 'Incident Title',
              hint: 'e.g. Overcrowding near Gate 2 Corridor',
              controller: _titleController,
            ).animate().fadeIn(duration: 300.ms, delay: 50.ms),
            const SizedBox(height: 16),
            CustomTextField(
              label: 'Detailed Description',
              hint: 'Provide details about what happened, people involved...',
              controller: _descriptionController,
            ).animate().fadeIn(duration: 300.ms, delay: 100.ms),
            const SizedBox(height: 16),
            CustomTextField(
              label: 'Location / Venue Sector',
              hint: 'e.g. Gate 2 Entrance Corridor, Sector B',
              controller: _locationController,
              prefixIcon: const Icon(Icons.location_on_outlined),
            ).animate().fadeIn(duration: 300.ms, delay: 150.ms),
            const SizedBox(height: 20),
            PrioritySelector(
              selectedPriority: state.selectedPriority,
              onSelect: (priority) => notifier.selectPriority(priority),
            ).animate().fadeIn(duration: 300.ms, delay: 200.ms),
            const SizedBox(height: 20),
            const PhotoUploadPlaceholder().animate().fadeIn(duration: 300.ms, delay: 250.ms),
            const SizedBox(height: 32),
            AppPrimaryButton(
              text: 'Submit Incident Report',
              icon: Icons.send_rounded,
              isLoading: isSubmitting,
              onPressed: _isFormValid ? _handleSubmit : null,
            ).animate().fadeIn(duration: 300.ms, delay: 300.ms),
          ],
        ),
      ),
    );
  }
}
