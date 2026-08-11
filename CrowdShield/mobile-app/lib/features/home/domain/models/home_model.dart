import 'package:equatable/equatable.dart';

class HomeAlertItem extends Equatable {
  final String id;
  final String title;
  final String location;
  final String riskLevel;
  final DateTime time;

  const HomeAlertItem({
    required this.id,
    required this.title,
    required this.location,
    required this.riskLevel,
    required this.time,
  });

  @override
  List<Object?> get props => [id, title, location, riskLevel, time];
}

class HomeModel extends Equatable {
  final String userName;
  final String venueName;
  final String crowdStatus;
  final int crowdCount;
  final int densityPercentage;
  final String riskLevel;
  final int activeAlerts;
  final String recommendation;
  final String nearestExit;
  final List<HomeAlertItem> recentAlerts;

  const HomeModel({
    required this.userName,
    required this.venueName,
    required this.crowdStatus,
    required this.crowdCount,
    required this.densityPercentage,
    required this.riskLevel,
    required this.activeAlerts,
    required this.recommendation,
    required this.nearestExit,
    required this.recentAlerts,
  });

  @override
  List<Object?> get props => [
        userName,
        venueName,
        crowdStatus,
        crowdCount,
        densityPercentage,
        riskLevel,
        activeAlerts,
        recommendation,
        nearestExit,
        recentAlerts,
      ];
}
