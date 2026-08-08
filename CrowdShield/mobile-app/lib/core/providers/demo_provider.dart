import 'dart:async';
import 'dart:math';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class DemoState {
  final String venueName;
  final int crowdCount;
  final int densityPercentage;
  final String riskLevel; // LOW, MEDIUM, HIGH, CRITICAL
  final String currentLocation;
  final String currentZoneId;
  final String recommendedExit;
  final String nearestExit;
  final int activeAlertsCount;
  final String emergencyStatus;
  final DateTime lastUpdated;

  const DemoState({
    this.venueName = 'TechNova Arena',
    this.crowdCount = 14850,
    this.densityPercentage = 82,
    this.riskLevel = 'HIGH',
    this.currentLocation = 'Central Concourse - Sector B',
    this.currentZoneId = 'zone_restroom',
    this.recommendedExit = 'Gate 4 (West Exit)',
    this.nearestExit = 'Gate 4',
    this.activeAlertsCount = 15,
    this.emergencyStatus = 'Active Monitoring',
    required this.lastUpdated,
  });

  DemoState copyWith({
    String? venueName,
    int? crowdCount,
    int? densityPercentage,
    String? riskLevel,
    String? currentLocation,
    String? currentZoneId,
    String? recommendedExit,
    String? nearestExit,
    int? activeAlertsCount,
    String? emergencyStatus,
    DateTime? lastUpdated,
  }) {
    return DemoState(
      venueName: venueName ?? this.venueName,
      crowdCount: crowdCount ?? this.crowdCount,
      densityPercentage: densityPercentage ?? this.densityPercentage,
      riskLevel: riskLevel ?? this.riskLevel,
      currentLocation: currentLocation ?? this.currentLocation,
      currentZoneId: currentZoneId ?? this.currentZoneId,
      recommendedExit: recommendedExit ?? this.recommendedExit,
      nearestExit: nearestExit ?? this.nearestExit,
      activeAlertsCount: activeAlertsCount ?? this.activeAlertsCount,
      emergencyStatus: emergencyStatus ?? this.emergencyStatus,
      lastUpdated: lastUpdated ?? this.lastUpdated,
    );
  }
}

class DemoNotifier extends StateNotifier<DemoState> {
  Timer? _periodicTimer;
  final Random _random = Random();

  DemoNotifier() : super(DemoState(lastUpdated: DateTime.now())) {
    _startPeriodicUpdates();
  }

  void _startPeriodicUpdates() {
    _periodicTimer?.cancel();
    _periodicTimer = Timer.periodic(const Duration(seconds: 18), (_) {
      _triggerSubtleUpdate();
    });
  }

  void _triggerSubtleUpdate() {
    // Subtle crowd count variation +/- 120
    final countDelta = _random.nextInt(240) - 120;
    final newCount = (state.crowdCount + countDelta).clamp(12000, 18000);

    // Subtle density variation +/- 2%
    final densityDelta = _random.nextInt(5) - 2;
    final newDensity = (state.densityPercentage + densityDelta).clamp(65, 95);

    // Determine risk level based on density
    String newRisk = 'HIGH';
    if (newDensity >= 85) {
      newRisk = 'CRITICAL';
    } else if (newDensity >= 75) {
      newRisk = 'HIGH';
    } else if (newDensity >= 50) {
      newRisk = 'MEDIUM';
    } else {
      newRisk = 'LOW';
    }

    state = state.copyWith(
      crowdCount: newCount,
      densityPercentage: newDensity,
      riskLevel: newRisk,
      lastUpdated: DateTime.now(),
    );
  }

  @override
  void dispose() {
    _periodicTimer?.cancel();
    super.dispose();
  }
}

final demoProvider = StateNotifierProvider<DemoNotifier, DemoState>((ref) {
  return DemoNotifier();
});
