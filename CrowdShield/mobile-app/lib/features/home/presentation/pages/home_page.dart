import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/cards/app_cards.dart';
import '../../../../core/widgets/empty/empty_components.dart';
import '../../../../core/widgets/loading/loading_components.dart';
import '../../../../core/widgets/navigation/navigation_components.dart';
import '../../../../routes/route_names.dart';
import '../../../authentication/presentation/providers/auth_provider.dart';
import '../providers/home_provider.dart';
import '../widgets/metrics_grid.dart';
import '../widgets/quick_actions_grid.dart';
import '../widgets/venue_card.dart';

class HomePage extends ConsumerWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final homeState = ref.watch(homeProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: CustomAppBar(
        title: AppConstants.appName,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout_outlined, color: AppColors.text),
            tooltip: 'Logout',
            onPressed: () async {
              await ref.read(authProvider.notifier).logout();
              if (context.mounted) {
                context.go(RouteNames.login);
              }
            },
          ),
        ],
      ),

      body: homeState.when(
        loading: () => const LoadingOverlay(
          isLoading: true,
          child: SizedBox.expand(),
        ),
        error: (error, stack) => GenericEmptyState(
          title: 'Failed to load dashboard',
          description: error.toString(),
          icon: Icons.error_outline,
          action: ElevatedButton.icon(
            onPressed: () => ref.read(homeProvider.notifier).loadHomeData(),
            icon: const Icon(Icons.refresh),
            label: const Text('Retry'),
          ),
        ),
        data: (homeData) {
          return RefreshIndicator(
            onRefresh: () => ref.read(homeProvider.notifier).loadHomeData(),
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Good Morning, ${homeData.userName}',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: AppColors.text,
                        ),
                  ).animate().fadeIn(duration: 300.ms).slideY(begin: -0.1, end: 0),
                  const SizedBox(height: 4),
                  Text(
                    'Live Emergency & Crowd Monitoring',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: AppColors.textSecondary,
                        ),
                  ).animate().fadeIn(duration: 300.ms, delay: 100.ms),
                  const SizedBox(height: 16),
                  VenueCard(
                    venueName: homeData.venueName,
                    crowdStatus: homeData.crowdStatus,
                    riskLevel: homeData.riskLevel,
                  ).animate().fadeIn(duration: 400.ms, delay: 150.ms),
                  const SizedBox(height: 16),
                  const SectionHeader(title: 'Live Metrics'),
                  const SizedBox(height: 8),
                  MetricsGrid(
                    crowdCount: homeData.crowdCount,
                    densityPercentage: homeData.densityPercentage,
                    riskLevel: homeData.riskLevel,
                    activeAlerts: homeData.activeAlerts,
                  ).animate().fadeIn(duration: 400.ms, delay: 200.ms),
                  const SizedBox(height: 20),
                  const SectionHeader(title: 'AI Safety Recommendation'),
                  const SizedBox(height: 8),
                  InformationCard(
                    title: 'System Recommendation',
                    description: homeData.recommendation,
                    icon: Icons.auto_awesome_outlined,
                  ).animate().fadeIn(duration: 400.ms, delay: 250.ms),
                  const SizedBox(height: 16),
                  const SectionHeader(title: 'Evacuation Route'),
                  const SizedBox(height: 8),
                  ActionCard(
                    title: 'Nearest Exit: ${homeData.nearestExit}',
                    subtitle: 'Tap to view evacuation path on map',
                    icon: Icons.exit_to_app_outlined,
                    onTap: () => context.go(RouteNames.map),
                  ).animate().fadeIn(duration: 400.ms, delay: 300.ms),
                  const SizedBox(height: 20),
                  const SectionHeader(title: 'Quick Actions'),
                  const SizedBox(height: 8),
                  const QuickActionsGrid().animate().fadeIn(duration: 400.ms, delay: 350.ms),
                  const SizedBox(height: 20),
                  SectionHeader(
                    title: 'Recent Alerts',
                    actionText: 'View All (${homeData.activeAlerts})',
                    onActionTap: () => context.go(RouteNames.alerts),
                  ),
                  const SizedBox(height: 8),
                  ...homeData.recentAlerts.map(
                    (alert) => Padding(
                      padding: const EdgeInsets.only(bottom: 8.0),
                      child: AlertCard(
                        title: alert.title,
                        message: '${alert.location} • ${alert.riskLevel} Risk',
                        alertColor: alert.riskLevel == 'HIGH'
                            ? AppColors.danger
                            : alert.riskLevel == 'MEDIUM'
                                ? AppColors.warning
                                : AppColors.safe,
                        onTap: () => context.go(RouteNames.alerts),
                      ),
                    ),
                  ).toList().animate().fadeIn(duration: 400.ms, delay: 400.ms),
                  const SizedBox(height: 16),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
