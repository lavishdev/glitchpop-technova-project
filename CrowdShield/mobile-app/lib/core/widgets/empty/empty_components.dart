import 'package:flutter/material.dart';
import '../../theme/app_colors.dart';

/// Reusable Generic Empty State
class GenericEmptyState extends StatelessWidget {
  final String title;
  final String description;
  final IconData icon;
  final Widget? action;

  const GenericEmptyState({
    super.key,
    required this.title,
    required this.description,
    this.icon = Icons.inbox_outlined,
    this.action,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 64, color: AppColors.textSecondary),
            const SizedBox(height: 16),
            Text(
              title,
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: AppColors.text,
                  ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              description,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: AppColors.textSecondary,
                  ),
              textAlign: TextAlign.center,
            ),
            if (action != null) ...[
              const SizedBox(height: 24),
              action!,
            ],
          ],
        ),
      ),
    );
  }
}

/// Reusable No Alerts Empty State
class NoAlertsEmptyState extends StatelessWidget {
  const NoAlertsEmptyState({super.key});

  @override
  Widget build(BuildContext context) {
    return const GenericEmptyState(
      title: 'No Active Alerts',
      description: 'Everything looks clear in your monitored safety zone.',
      icon: Icons.notifications_off_outlined,
    );
  }
}

/// Reusable No Incidents Empty State
class NoIncidentsEmptyState extends StatelessWidget {
  const NoIncidentsEmptyState({super.key});

  @override
  Widget build(BuildContext context) {
    return const GenericEmptyState(
      title: 'No Reported Incidents',
      description: 'There are currently no incidents reported nearby.',
      icon: Icons.shield_outlined,
    );
  }
}

/// Reusable No Internet Empty State
class NoInternetEmptyState extends StatelessWidget {
  final VoidCallback? onRetry;

  const NoInternetEmptyState({super.key, this.onRetry});

  @override
  Widget build(BuildContext context) {
    return GenericEmptyState(
      title: 'No Connection',
      description: 'Please check your network settings and try again.',
      icon: Icons.wifi_off_outlined,
      action: onRetry != null
          ? ElevatedButton.icon(
              onPressed: onRetry,
              icon: const Icon(Icons.refresh),
              label: const Text('Retry'),
            )
          : null,
    );
  }
}
