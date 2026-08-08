import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../routes/route_names.dart';

class QuickActionItem {
  final String label;
  final IconData icon;
  final String route;
  final Color color;

  const QuickActionItem({
    required this.label,
    required this.icon,
    required this.route,
    required this.color,
  });
}

class QuickActionsGrid extends StatelessWidget {
  const QuickActionsGrid({super.key});

  static const List<QuickActionItem> actions = [
    QuickActionItem(
      label: 'Alerts',
      icon: Icons.notifications_outlined,
      route: RouteNames.alerts,
      color: AppColors.warning,
    ),
    QuickActionItem(
      label: 'Map',
      icon: Icons.map_outlined,
      route: RouteNames.map,
      color: AppColors.primary,
    ),
    QuickActionItem(
      label: 'SOS',
      icon: Icons.sos_outlined,
      route: RouteNames.sos,
      color: AppColors.danger,
    ),
    QuickActionItem(
      label: 'Incident',
      icon: Icons.report_problem_outlined,
      route: RouteNames.incident,
      color: AppColors.secondary,
    ),
    QuickActionItem(
      label: 'Assistant',
      icon: Icons.smart_toy_outlined,
      route: RouteNames.assistant,
      color: AppColors.safe,
    ),
    QuickActionItem(
      label: 'Profile',
      icon: Icons.person_outlined,
      route: RouteNames.profile,
      color: AppColors.primary,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final crossAxisCount = constraints.maxWidth > 600 ? 6 : 3;
        return GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: crossAxisCount,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 1.1,
          ),
          itemCount: actions.length,
          itemBuilder: (context, index) {
            final action = actions[index];
            return Card(
              elevation: 1,
              color: AppColors.surface,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
                side: const BorderSide(color: AppColors.border),
              ),
              child: InkWell(
                onTap: () => context.go(action.route),
                borderRadius: BorderRadius.circular(12),
                child: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(action.icon, color: action.color, size: 28),
                      const SizedBox(height: 6),
                      Text(
                        action.label,
                        style: Theme.of(context).textTheme.labelMedium?.copyWith(
                              fontWeight: FontWeight.w600,
                              color: AppColors.text,
                            ),
                        textAlign: TextAlign.center,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }
}
