import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/buttons/app_buttons.dart';
import '../../../../core/widgets/dialogs/app_dialogs.dart';
import '../../../../core/widgets/navigation/navigation_components.dart';
import '../../../../core/widgets/status/status_components.dart';
import '../providers/alerts_provider.dart';

class AlertDetailsPage extends ConsumerWidget {
  const AlertDetailsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final alert = ref.watch(alertsProvider).selectedAlert;
    final notifier = ref.read(alertsProvider.notifier);

    if (alert == null) {
      return Scaffold(
        appBar: CustomAppBar(
          title: 'Alert Details',
          leading: IconButton(
            icon: const Icon(Icons.arrow_back, color: AppColors.text),
            onPressed: () => context.pop(),
          ),
        ),
        body: const Center(
          child: Text('No alert selected.'),
        ),
      );
    }

    final formattedTime = DateFormat('MMMM d, yyyy • h:mm a').format(alert.timestamp);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: CustomAppBar(
        title: 'Alert Details',
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.text),
          onPressed: () => context.pop(),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Card(
              elevation: 2,
              color: AppColors.surface,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: const BorderSide(color: AppColors.border),
              ),
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        StatusChip(label: alert.category),
                        RiskBadge(level: alert.severity),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Text(
                      alert.title,
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: AppColors.text,
                          ),
                    ),
                    const SizedBox(height: 16),
                    const Divider(color: AppColors.border),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        const Icon(Icons.location_on_outlined, color: AppColors.primary, size: 20),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            alert.location,
                            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                  fontWeight: FontWeight.w600,
                                  color: AppColors.text,
                                ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        const Icon(Icons.access_time_outlined, color: AppColors.textSecondary, size: 20),
                        const SizedBox(width: 8),
                        Text(
                          formattedTime,
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                color: AppColors.textSecondary,
                              ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Icon(
                          alert.isRead ? Icons.mark_email_read_outlined : Icons.mark_email_unread_outlined,
                          color: alert.isRead ? AppColors.safe : AppColors.warning,
                          size: 20,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          alert.isRead ? 'Status: Read' : 'Status: Unread',
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                color: alert.isRead ? AppColors.safe : AppColors.warning,
                                fontWeight: FontWeight.w600,
                              ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'Incident Details',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: AppColors.text,
                  ),
            ),
            const SizedBox(height: 8),
            Card(
              elevation: 1,
              color: AppColors.surface,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
                side: const BorderSide(color: AppColors.border),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Text(
                  alert.description,
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        color: AppColors.text,
                        height: 1.5,
                      ),
                ),
              ),
            ),
            const SizedBox(height: 32),
            AppPrimaryButton(
              text: alert.isRead ? 'Marked as Read' : 'Mark as Read',
              icon: Icons.check_circle_outline,
              onPressed: alert.isRead
                  ? null
                  : () {
                      notifier.markAsRead(alert.id);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Alert marked as read')),
                      );
                    },
            ),
            const SizedBox(height: 12),
            AppDangerButton(
              text: 'Delete Alert',
              icon: Icons.delete_outline,
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (dialogCtx) => ConfirmationDialog(
                    title: 'Delete Alert',
                    message: 'Are you sure you want to remove this alert?',
                    confirmText: 'Delete',
                    onConfirm: () {
                      notifier.deleteAlert(alert.id);
                      context.pop();
                    },
                  ),
                );
              },
            ),
            const SizedBox(height: 12),
            AppOutlinedButton(
              text: 'Back to Alerts',
              icon: Icons.arrow_back,
              onPressed: () => context.pop(),
            ),
          ],
        ),
      ),
    );
  }
}
