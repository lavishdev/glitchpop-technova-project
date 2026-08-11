import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../core/theme/app_colors.dart';
import '../core/widgets/navigation/navigation_components.dart';
import '../features/alerts/presentation/pages/alert_details_page.dart';
import '../features/alerts/presentation/pages/alerts_page.dart';
import '../features/assistant/presentation/pages/assistant_page.dart';
import '../features/authentication/presentation/pages/login_page.dart';
import '../features/home/presentation/pages/home_page.dart';
import '../features/incident/presentation/pages/incident_history_page.dart';
import '../features/incident/presentation/pages/report_incident_page.dart';
import '../features/maps/presentation/pages/map_page.dart';
import '../features/profile/presentation/pages/profile_page.dart';
import '../features/sos/presentation/pages/sos_page.dart';
import 'route_names.dart';

/// Helper to build consistent smooth page transitions (Fade & Slide)
CustomTransitionPage<void> buildPageWithTransition({
  required BuildContext context,
  required GoRouterState state,
  required Widget child,
}) {
  return CustomTransitionPage<void>(
    key: state.pageKey,
    child: child,
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      return FadeTransition(
        opacity: CurveTween(curve: Curves.easeInOut).animate(animation),
        child: SlideTransition(
          position: Tween<Offset>(
            begin: const Offset(0.04, 0),
            end: Offset.zero,
          ).animate(
            CurvedAnimation(parent: animation, curve: Curves.easeOutCubic),
          ),
          child: child,
        ),
      );
    },
    transitionDuration: const Duration(milliseconds: 250),
  );
}

/// Main Shell Scaffold hosting the persistent bottom navigation bar
class MainShellScaffold extends StatelessWidget {
  final StatefulNavigationShell navigationShell;

  const MainShellScaffold({
    super.key,
    required this.navigationShell,
  });

  void _onTabTap(int index) {
    navigationShell.goBranch(
      index,
      initialLocation: index == navigationShell.currentIndex,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 12),
            color: AppColors.primary.withValues(alpha: 0.12),
            child: SafeArea(
              bottom: false,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: 6,
                    height: 6,
                    decoration: const BoxDecoration(
                      color: AppColors.safe,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 6),
                  const Text(
                    'DEMO MODE • Real-Time Simulation Active (TechNova Arena)',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: AppColors.primary,
                      letterSpacing: 0.3,
                    ),
                  ),
                ],
              ),
            ),
          ),
          Expanded(child: navigationShell),
        ],
      ),
      bottomNavigationBar: CustomBottomNavigationBar(
        currentIndex: navigationShell.currentIndex,
        onTap: _onTabTap,
      ),
    );
  }
}

/// Generic Feature Placeholder Screen with consistent CustomAppBar & Back Navigation
class FeaturePlaceholderPage extends StatelessWidget {
  final String title;
  final IconData icon;

  const FeaturePlaceholderPage({
    super.key,
    required this.title,
    this.icon = Icons.dashboard_outlined,
  });

  @override
  Widget build(BuildContext context) {
    final canPop = context.canPop();
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: CustomAppBar(
        title: title,
        leading: canPop
            ? IconButton(
                icon: const Icon(Icons.arrow_back, color: AppColors.text),
                onPressed: () => context.pop(),
              )
            : null,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 64, color: AppColors.primary),
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
                'This module is fully configured and ready for feature implementation.',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: AppColors.textSecondary,
                    ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

final GoRouter appRouter = GoRouter(
  initialLocation: RouteNames.login,
  routes: <RouteBase>[
    // Unauthenticated & Splash Routes
    GoRoute(
      path: RouteNames.splash,
      pageBuilder: (context, state) => buildPageWithTransition(
        context: context,
        state: state,
        child: const LoginPage(),
      ),
    ),
    GoRoute(
      path: RouteNames.login,
      pageBuilder: (context, state) => buildPageWithTransition(
        context: context,
        state: state,
        child: const LoginPage(),
      ),
    ),

    // Standalone Full-screen Feature Routes (with back navigation)
    GoRoute(
      path: RouteNames.sos,
      pageBuilder: (context, state) => buildPageWithTransition(
        context: context,
        state: state,
        child: const SOSPage(),
      ),
    ),
    GoRoute(
      path: RouteNames.incident,
      pageBuilder: (context, state) => buildPageWithTransition(
        context: context,
        state: state,
        child: const ReportIncidentPage(),
      ),
    ),
    GoRoute(
      path: RouteNames.incidentHistory,
      pageBuilder: (context, state) => buildPageWithTransition(
        context: context,
        state: state,
        child: const IncidentHistoryPage(),
      ),
    ),
    GoRoute(
      path: RouteNames.alertDetails,
      pageBuilder: (context, state) => buildPageWithTransition(
        context: context,
        state: state,
        child: const AlertDetailsPage(),
      ),
    ),

    // Main App Shell Route (5 persistent tabs: Home, Alerts, Map, Assistant, Profile)
    StatefulShellRoute.indexedStack(
      builder: (context, state, navigationShell) {
        return MainShellScaffold(navigationShell: navigationShell);
      },
      branches: [
        // Tab 0: Home
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: RouteNames.home,
              pageBuilder: (context, state) => buildPageWithTransition(
                context: context,
                state: state,
                child: const HomePage(),
              ),
            ),
          ],
        ),
        // Tab 1: Alerts
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: RouteNames.alerts,
              pageBuilder: (context, state) => buildPageWithTransition(
                context: context,
                state: state,
                child: const AlertsPage(),
              ),
            ),
          ],
        ),
        // Tab 2: Map
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: RouteNames.map,
              pageBuilder: (context, state) => buildPageWithTransition(
                context: context,
                state: state,
                child: const MapPage(),
              ),
            ),
          ],
        ),
        // Tab 3: Assistant
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: RouteNames.assistant,
              pageBuilder: (context, state) => buildPageWithTransition(
                context: context,
                state: state,
                child: const AssistantPage(),
              ),
            ),
          ],
        ),
        // Tab 4: Profile
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: RouteNames.profile,
              pageBuilder: (context, state) => buildPageWithTransition(
                context: context,
                state: state,
                child: const ProfilePage(),
              ),
            ),
          ],
        ),
      ],
    ),
  ],
);
