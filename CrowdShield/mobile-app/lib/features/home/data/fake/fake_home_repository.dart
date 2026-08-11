import '../../domain/models/home_model.dart';
import '../../domain/repositories/home_repository.dart';

class FakeHomeRepository implements HomeRepository {
  @override
  Future<HomeModel> getHomeData() async {
    await Future.delayed(const Duration(milliseconds: 500));

    return HomeModel(
      userName: 'Officer Smith',
      venueName: 'TechNova Arena',
      crowdStatus: 'High Density Warning',
      crowdCount: 342,
      densityPercentage: 82,
      riskLevel: 'HIGH',
      activeAlerts: 3,
      recommendation: 'Use Gate 4 due to congestion near Gate 2.',
      nearestExit: 'Gate 4',
      recentAlerts: [
        HomeAlertItem(
          id: 'alt_1',
          title: 'Congestion near Gate 2',
          location: 'Sector B - Main Entrance',
          riskLevel: 'HIGH',
          time: DateTime.now().subtract(const Duration(minutes: 5)),
        ),
        HomeAlertItem(
          id: 'alt_2',
          title: 'Unusual crowd movement',
          location: 'Sector B - Concourse',
          riskLevel: 'MEDIUM',
          time: DateTime.now().subtract(const Duration(minutes: 18)),
        ),
        HomeAlertItem(
          id: 'alt_3',
          title: 'Temperature spike',
          location: 'Stage A - Enclosure',
          riskLevel: 'LOW',
          time: DateTime.now().subtract(const Duration(minutes: 42)),
        ),
      ],
    );
  }
}
