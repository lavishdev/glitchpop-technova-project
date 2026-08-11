import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/status/status_components.dart';
import '../../domain/models/incident_report_model.dart';

class IncidentCardItem extends StatelessWidget {
  final IncidentReportModel report;
  final VoidCallback onDelete;

  const IncidentCardItem({
    super.key,
    required this.report,
    required this.onDelete,
  });

  Color _getStatusColor(String status) {
    switch (status.toUpperCase()) {
      case 'RESOLVED':
        return AppColors.safe;
      case 'SUBMITTED':
        return AppColors.primary;
      case 'PENDING':
        return AppColors.warning;
      default:
        return AppColors.textSecondary;
    }
  }

  @override
  Widget build(BuildContext context) {
    final statusColor = _getStatusColor(report.status);
    final timeStr = DateFormat('MMM d • h:mm a').format(report.timestamp);

    return Card(
      elevation: 1.5,
      color: AppColors.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(14),
        side: const BorderSide(color: AppColors.border),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                StatusChip(label: report.category),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: statusColor.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    report.status,
                    style: TextStyle(color: statusColor, fontWeight: FontWeight.bold, fontSize: 11),
                  ),
                ),
                const Spacer(),
                RiskBadge(level: report.priority),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                Text(
                  '${report.id} • ',
                  style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.primary, fontSize: 13),
                ),
                Expanded(
                  child: Text(
                    report.title,
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: AppColors.text,
                        ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 6),
            Text(
              report.description,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppColors.textSecondary),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                const Icon(Icons.location_on_outlined, size: 14, color: AppColors.textSecondary),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    report.location,
                    style: Theme.of(context).textTheme.labelSmall?.copyWith(color: AppColors.textSecondary),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                Text(
                  timeStr,
                  style: Theme.of(context).textTheme.labelSmall?.copyWith(color: AppColors.textSecondary),
                ),
                IconButton(
                  icon: const Icon(Icons.delete_outline, color: AppColors.textSecondary, size: 18),
                  onPressed: onDelete,
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
