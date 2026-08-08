import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/buttons/app_buttons.dart';
import '../../../../core/widgets/dialogs/app_dialogs.dart';
import '../../domain/models/sos_request_model.dart';

class SOSStatusCard extends StatelessWidget {
  final SOSRequestModel request;
  final int cancelTimerSeconds;
  final VoidCallback onCancel;
  final VoidCallback onReset;

  const SOSStatusCard({
    super.key,
    required this.request,
    required this.cancelTimerSeconds,
    required this.onCancel,
    required this.onReset,
  });

  @override
  Widget build(BuildContext context) {
    final isCancelled = request.status == 'CANCELLED';

    return Card(
      elevation: 3,
      color: AppColors.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(
          color: isCancelled ? AppColors.border : AppColors.safe,
          width: 2,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  isCancelled ? Icons.cancel_outlined : Icons.check_circle_rounded,
                  color: isCancelled ? AppColors.textSecondary : AppColors.safe,
                  size: 28,
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    isCancelled ? 'SOS Cancelled' : 'SOS Signal Dispatched',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: isCancelled ? AppColors.textSecondary : AppColors.safe,
                        ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            const Divider(color: AppColors.border),
            const SizedBox(height: 12),
            if (!isCancelled) ...[
              Row(
                children: [
                  const Icon(Icons.shield_outlined, color: AppColors.primary, size: 20),
                  const SizedBox(width: 10),
                  Text('Assigned Responder: ', style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppColors.textSecondary)),
                  Expanded(
                    child: Text(
                      request.officerAssigned,
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.bold, color: AppColors.text),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.timer_outlined, color: AppColors.warning, size: 20),
                  const SizedBox(width: 10),
                  Text('Estimated Arrival: ', style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppColors.textSecondary)),
                  Text(
                    request.estimatedArrival,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.bold, color: AppColors.warning),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.location_on_outlined, color: AppColors.primary, size: 20),
                  const SizedBox(width: 10),
                  Text('Location: ', style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppColors.textSecondary)),
                  Expanded(
                    child: Text(
                      request.currentLocation,
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w600, color: AppColors.text),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.safe.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  request.message,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppColors.text, height: 1.3),
                ),
              ),
              const SizedBox(height: 20),
              if (cancelTimerSeconds > 0) ...[
                AppDangerButton(
                  text: 'Cancel SOS (${cancelTimerSeconds}s)',
                  icon: Icons.close,
                  onPressed: () {
                    showDialog(
                      context: context,
                      builder: (dCtx) => ConfirmationDialog(
                        title: 'Cancel Emergency Signal',
                        message: 'Are you sure you want to cancel the dispatched SOS response?',
                        confirmText: 'Yes, Cancel SOS',
                        onConfirm: () {
                          context.pop();
                          onCancel();
                        },
                      ),
                    );
                  },
                ),
              ],
            ] else ...[
              Text(
                'The emergency signal has been cancelled. Emergency units have been notified.',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AppColors.textSecondary),
              ),
              const SizedBox(height: 16),
              AppOutlinedButton(
                text: 'Back to Emergency Screen',
                icon: Icons.refresh,
                onPressed: onReset,
              ),
            ],
          ],
        ),
      ),
    );
  }
}
