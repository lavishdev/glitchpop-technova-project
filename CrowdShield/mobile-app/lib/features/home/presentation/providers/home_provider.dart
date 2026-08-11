import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/demo_provider.dart';
import '../../domain/models/home_model.dart';

class HomeNotifier extends StateNotifier<AsyncValue<HomeModel>> {
  final Ref _ref;

  HomeNotifier(this._ref) : super(const AsyncValue.loading()) {
    _init();
  }

  void _init() {
    _ref.listen<DemoState>(demoProvider, (previous, next) {
      _updateWithDemoState(next);
    }, fireImmediately: true);
  }

  void _updateWithDemoState(DemoState demo) {
    final homeData = HomeModel(
      userName: 'Officer Sharma',
      venueName: demo.venueName,
      crowdStatus: demo.emergencyStatus,
      crowdCount: demo.crowdCount,
      densityPercentage: demo.densityPercentage,
      riskLevel: demo.riskLevel,
      activeAlerts: demo.activeAlertsCount,
      recommendation: 'Reroute via ${demo.recommendedExit}. Heavy congestion near Gate 2.',
      nearestExit: demo.nearestExit,
      recentAlerts: [
        HomeAlertItem(
          id: 'alt_1',
          title: 'Congestion near Gate 2 Bottleneck',
          location: 'Sector B - Main Exit',
          riskLevel: demo.riskLevel,
          time: demo.lastUpdated.subtract(const Duration(minutes: 3)),
        ),
        HomeAlertItem(
          id: 'alt_2',
          title: 'Medical Emergency near Stage A',
          location: 'Stage A Pit',
          riskLevel: 'CRITICAL',
          time: demo.lastUpdated.subtract(const Duration(minutes: 8)),
        ),
        HomeAlertItem(
          id: 'alt_3',
          title: 'Gate 5 Temporarily Closed',
          location: 'Gate 5 Entrance',
          riskLevel: 'MEDIUM',
          time: demo.lastUpdated.subtract(const Duration(minutes: 25)),
        ),
      ],
    );
    state = AsyncValue.data(homeData);
  }

  Future<void> loadHomeData() async {
    final demo = _ref.read(demoProvider);
    _updateWithDemoState(demo);
  }
}

final homeProvider = StateNotifierProvider<HomeNotifier, AsyncValue<HomeModel>>((ref) {
  return HomeNotifier(ref);
});
