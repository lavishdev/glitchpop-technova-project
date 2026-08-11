import 'package:equatable/equatable.dart';

class VenueZoneModel extends Equatable {
  final String id;
  final String name;
  final String riskLevel;
  final int crowdCount;
  final int density;
  final String status;
  final double xPosition;
  final double yPosition;
  final bool isExit;
  final String iconType;
  final String recommendation;

  const VenueZoneModel({
    required this.id,
    required this.name,
    required this.riskLevel,
    required this.crowdCount,
    required this.density,
    required this.status,
    required this.xPosition,
    required this.yPosition,
    this.isExit = false,
    required this.iconType,
    required this.recommendation,
  });

  @override
  List<Object?> get props => [
        id,
        name,
        riskLevel,
        crowdCount,
        density,
        status,
        xPosition,
        yPosition,
        isExit,
        iconType,
        recommendation,
      ];
}
