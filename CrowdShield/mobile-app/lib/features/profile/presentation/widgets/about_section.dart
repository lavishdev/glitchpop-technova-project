import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class AboutSection extends StatelessWidget {
  const AboutSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 1,
      color: AppColors.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(14),
        side: const BorderSide(color: AppColors.border),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withValues(alpha: 0.15),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.shield_outlined, color: AppColors.primary, size: 28),
                ),
                const SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'CrowdShield Mobile',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: AppColors.text,
                          ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Version 1.0.0 (Build 102)',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: AppColors.textSecondary,
                          ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 12),
            const Divider(color: AppColors.border),
            const SizedBox(height: 8),
            Text(
              'AI-powered crowd monitoring and disaster prevention platform using existing CCTV infrastructure.',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: AppColors.text,
                    height: 1.4,
                  ),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.code_outlined, size: 14, color: AppColors.primary),
                const SizedBox(width: 6),
                Text(
                  'Developed by TechNova Team',
                  style: Theme.of(context).textTheme.labelSmall?.copyWith(
                        color: AppColors.primary,
                        fontWeight: FontWeight.bold,
                      ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
