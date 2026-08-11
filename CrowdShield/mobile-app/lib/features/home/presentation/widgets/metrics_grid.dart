import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/cards/app_cards.dart';

class MetricsGrid extends StatelessWidget {
  final int crowdCount;
  final int densityPercentage;
  final String riskLevel;
  final int activeAlerts;

  const MetricsGrid({
    super.key,
    required this.crowdCount,
    required this.densityPercentage,
    required this.riskLevel,
    required this.activeAlerts,
  });

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final crossAxisCount = constraints.maxWidth > 600 ? 4 : 2;
        return GridView.count(
          crossAxisCount: crossAxisCount,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
          childAspectRatio: constraints.maxWidth > 600 ? 1.4 : 1.35,
          children: [
            MetricCard(
              label: 'People Count',
              value: crowdCount.toString(),
              icon: Icons.groups_outlined,
              accentColor: AppColors.primary,
            ),
            MetricCard(
              label: 'Crowd Density',
              value: '$densityPercentage%',
              icon: Icons.pie_chart_outline,
              accentColor: AppColors.warning,
            ),
            MetricCard(
              label: 'Risk Level',
              value: riskLevel,
              icon: Icons.shield_outlined,
              accentColor: AppColors.danger,
            ),
            MetricCard(
              label: 'Active Alerts',
              value: activeAlerts.toString(),
              icon: Icons.notifications_active_outlined,
              accentColor: AppColors.danger,
            ),
          ],
        );
      },
    );
  }
}
