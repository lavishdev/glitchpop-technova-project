import 'package:flutter/material.dart';
import '../../theme/app_colors.dart';

/// Reusable Risk Badge
class RiskBadge extends StatelessWidget {
  final String level;
  final Color? color;

  const RiskBadge({
    super.key,
    required this.level,
    this.color,
  });

  Color _resolveColor() {
    if (color != null) return color!;
    switch (level.toLowerCase()) {
      case 'low':
      case 'safe':
        return AppColors.safe;
      case 'medium':
      case 'warning':
        return AppColors.warning;
      case 'high':
      case 'danger':
      case 'critical':
        return AppColors.danger;
      default:
        return AppColors.primary;
    }
  }

  @override
  Widget build(BuildContext context) {
    final badgeColor = _resolveColor();
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: badgeColor.withValues(alpha:0.15),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: badgeColor, width: 1),
      ),
      child: Text(
        level.toUpperCase(),
        style: Theme.of(context).textTheme.labelSmall?.copyWith(
              color: badgeColor,
              fontWeight: FontWeight.bold,
            ),
      ),
    );
  }
}

/// Reusable Status Chip
class StatusChip extends StatelessWidget {
  final String label;
  final Color color;

  const StatusChip({
    super.key,
    required this.label,
    this.color = AppColors.primary,
  });

  @override
  Widget build(BuildContext context) {
    return Chip(
      backgroundColor: color.withValues(alpha:0.1),
      side: BorderSide(color: color.withValues(alpha:0.3)),
      label: Text(
        label,
        style: TextStyle(color: color, fontWeight: FontWeight.w600),
      ),
    );
  }
}

/// Reusable Severity Indicator
class SeverityIndicator extends StatelessWidget {
  final int severityLevel;

  const SeverityIndicator({
    super.key,
    required this.severityLevel,
  });

  Color _getColor() {
    if (severityLevel <= 1) return AppColors.safe;
    if (severityLevel == 2) return AppColors.warning;
    return AppColors.danger;
  }

  @override
  Widget build(BuildContext context) {
    final color = _getColor();
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(
        3,
        (index) => Container(
          width: 8,
          height: 16,
          margin: const EdgeInsets.symmetric(horizontal: 2),
          decoration: BoxDecoration(
            color: index < severityLevel ? color : AppColors.border,
            borderRadius: BorderRadius.circular(4),
          ),
        ),
      ),
    );
  }
}
