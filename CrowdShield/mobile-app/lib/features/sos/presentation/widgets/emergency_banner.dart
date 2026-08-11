import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class EmergencyBanner extends StatelessWidget {
  const EmergencyBanner({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: AppColors.danger.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.danger.withValues(alpha: 0.4)),
      ),
      child: const Row(
        children: [
          Icon(Icons.warning_amber_rounded, color: AppColors.danger, size: 24),
          SizedBox(width: 12),
          Expanded(
            child: Text(
              'PRESS & HOLD SOS FOR 3 SECONDS IN CASE OF IMMEDIATE DANGER',
              style: TextStyle(
                color: AppColors.danger,
                fontWeight: FontWeight.bold,
                fontSize: 12,
                letterSpacing: 0.3,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
