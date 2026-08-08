import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/empty/empty_components.dart';
import '../../../../core/widgets/inputs/app_inputs.dart';
import '../../../../core/widgets/loading/loading_components.dart';
import '../../../../core/widgets/navigation/navigation_components.dart';
import '../../../../routes/route_names.dart';
import '../providers/alerts_provider.dart';
import '../widgets/alert_card_item.dart';

class AlertsPage extends ConsumerWidget {
  const AlertsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final alertsState = ref.watch(alertsProvider);
    final notifier = ref.read(alertsProvider.notifier);

    final filters = ['All', 'Unread', 'High', 'Critical'];

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: const CustomAppBar(
        title: 'Alerts & Advisories',
        centerTitle: true,
      ),
      body: Column(
        children: [
          Container(
            color: AppColors.surface,
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
            child: Column(
              children: [
                CustomSearchBar(
                  hintText: 'Search alerts by keyword or location...',
                  onChanged: (query) => notifier.setSearchQuery(query),
                ),
                const SizedBox(height: 12),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: filters.map((filter) {
                      final isSelected = alertsState.selectedFilter == filter;
                      return Padding(
                        padding: const EdgeInsets.only(right: 8.0),
                        child: FilterChip(
                          label: Text(filter),
                          selected: isSelected,
                          selectedColor: AppColors.primary.withValues(alpha: 0.15),
                          checkmarkColor: AppColors.primary,
                          labelStyle: TextStyle(
                            color: isSelected ? AppColors.primary : AppColors.text,
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                          ),
                          onSelected: (_) => notifier.setFilter(filter),
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 1, color: AppColors.border),
          Expanded(
            child: alertsState.isLoading
                ? const CircularLoader()
                : alertsState.errorMessage != null
                    ? GenericEmptyState(
                        title: 'Failed to load alerts',
                        description: alertsState.errorMessage!,
                        icon: Icons.error_outline,
                        action: ElevatedButton.icon(
                          onPressed: () => notifier.loadAlerts(),
                          icon: const Icon(Icons.refresh),
                          label: const Text('Retry'),
                        ),
                      )
                    : alertsState.filteredAlerts.isEmpty
                        ? const NoAlertsEmptyState()
                        : RefreshIndicator(
                            onRefresh: () => notifier.loadAlerts(),
                            child: ListView.builder(
                              padding: const EdgeInsets.all(16.0),
                              itemCount: alertsState.filteredAlerts.length,
                              itemBuilder: (context, index) {
                                final alert = alertsState.filteredAlerts[index];
                                return Padding(
                                  padding: const EdgeInsets.only(bottom: 10.0),
                                  child: AlertCardItem(
                                    alert: alert,
                                    onTap: () {
                                      notifier.selectAlert(alert);
                                      notifier.markAsRead(alert.id);
                                      context.push(RouteNames.alertDetails);
                                    },
                                  ),
                                ).animate().fadeIn(duration: 300.ms, delay: (index * 40).ms);
                              },
                            ),
                          ),
          ),
        ],
      ),
    );
  }
}
