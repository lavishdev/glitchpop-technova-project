import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../domain/models/safe_route_model.dart';

class SafeRouteCard extends StatelessWidget {
  final SafeRouteModel route;

  const SafeRouteCard({
    super.key,
    required this.route,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      color: AppColors.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: AppColors.safe, width: 1.5),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.navigation_outlined, color: AppColors.safe, size: 24),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'Safe Evacuation Route',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: AppColors.text,
                        ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.safe.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    '~${route.estimatedTime}',
                    style: const TextStyle(
                      color: AppColors.safe,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            const Divider(color: AppColors.border),
            const SizedBox(height: 8),
            Row(
              children: [
                const Text('Recommended Exit: ', style: TextStyle(fontWeight: FontWeight.w600, color: AppColors.textSecondary)),
                Text(
                  route.recommendedExit,
                  style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.safe, fontSize: 16),
                ),
              ],
            ),
            const SizedBox(height: 10),
            ...route.instructions.map(
              (instruction) => Padding(
                padding: const EdgeInsets.only(bottom: 6.0),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.check_circle_outline, size: 16, color: AppColors.safe),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        instruction,
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: AppColors.text,
                            ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
