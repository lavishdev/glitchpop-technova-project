import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/dialogs/app_dialogs.dart';
import '../../../../core/widgets/empty/empty_components.dart';
import '../../../../core/widgets/loading/loading_components.dart';
import '../../../../core/widgets/navigation/navigation_components.dart';
import '../providers/incident_provider.dart';
import '../widgets/incident_card_item.dart';

class IncidentHistoryPage extends ConsumerWidget {
  const IncidentHistoryPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(incidentProvider);
    final notifier = ref.read(incidentProvider.notifier);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: CustomAppBar(
        title: 'Incident History',
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.text),
          onPressed: () => context.pop(),
        ),
      ),
      body: state.isLoadingHistory
          ? const CircularLoader()
          : state.reports.isEmpty
              ? const NoIncidentsEmptyState()
              : RefreshIndicator(
                  onRefresh: () => notifier.loadReports(),
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16.0),
                    itemCount: state.reports.length,
                    itemBuilder: (context, index) {
                      final report = state.reports[index];
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 10.0),
                        child: IncidentCardItem(
                          report: report,
                          onDelete: () {
                            showDialog(
                              context: context,
                              builder: (dCtx) => ConfirmationDialog(
                                title: 'Delete Report',
                                message: 'Remove incident record ${report.id}?',
                                confirmText: 'Delete',
                                onConfirm: () {
                                  context.pop();
                                  notifier.deleteReport(report.id);
                                },
                              ),
                            );
                          },
                        ),
                      ).animate().fadeIn(duration: 300.ms, delay: (index * 40).ms);
                    },
                  ),
                ),
    );
  }
}
