import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/navigation/navigation_components.dart';
import '../providers/sos_provider.dart';
import '../widgets/emergency_banner.dart';
import '../widgets/emergency_contacts_list.dart';
import '../widgets/sos_hold_button.dart';
import '../widgets/sos_status_card.dart';

class SOSPage extends ConsumerWidget {
  const SOSPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final sosState = ref.watch(sosProvider);
    final notifier = ref.read(sosProvider.notifier);

    final isSentOrCancelled = sosState.status == SOSStatus.sent || sosState.status == SOSStatus.cancelled;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: CustomAppBar(
        title: 'SOS Emergency Alert',
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.text),
          onPressed: () => context.pop(),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            const EmergencyBanner().animate().fadeIn(duration: 300.ms),
            const SizedBox(height: 28),
            if (!isSentOrCancelled) ...[
              Center(
                child: SOSHoldButton(
                  status: sosState.status,
                  countdownSeconds: sosState.countdownSeconds,
                  onHoldStart: () => notifier.startHold(),
                  onHoldRelease: () => notifier.releaseHold(),
                ).animate().fadeIn(duration: 400.ms).scale(begin: const Offset(0.9, 0.9)),
              ),
              const SizedBox(height: 24),
              Text(
                'Hold button for 3 seconds to trigger emergency dispatch',
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: AppColors.textSecondary,
                    ),
                textAlign: TextAlign.center,
              ),
            ] else if (sosState.request != null) ...[
              SOSStatusCard(
                request: sosState.request!,
                cancelTimerSeconds: sosState.cancelTimerSeconds,
                onCancel: () => notifier.cancelSOS(),
                onReset: () => notifier.resetSOS(),
              ).animate().fadeIn(duration: 400.ms),
            ],
            const SizedBox(height: 32),
            const Divider(color: AppColors.border),
            const SizedBox(height: 16),
            EmergencyContactsList(contacts: sosState.contacts)
                .animate()
                .fadeIn(duration: 400.ms, delay: 150.ms),
          ],
        ),
      ),
    );
  }
}
