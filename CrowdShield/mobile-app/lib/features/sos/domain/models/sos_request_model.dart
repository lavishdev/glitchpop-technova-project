import 'package:equatable/equatable.dart';

class SOSRequestModel extends Equatable {
  final String id;
  final DateTime timestamp;
  final String currentLocation;
  final String status;
  final String officerAssigned;
  final String estimatedArrival;
  final String message;

  const SOSRequestModel({
    required this.id,
    required this.timestamp,
    required this.currentLocation,
    required this.status,
    required this.officerAssigned,
    required this.estimatedArrival,
    required this.message,
  });

  SOSRequestModel copyWith({
    String? id,
    DateTime? timestamp,
    String? currentLocation,
    String? status,
    String? officerAssigned,
    String? estimatedArrival,
    String? message,
  }) {
    return SOSRequestModel(
      id: id ?? this.id,
      timestamp: timestamp ?? this.timestamp,
      currentLocation: currentLocation ?? this.currentLocation,
      status: status ?? this.status,
      officerAssigned: officerAssigned ?? this.officerAssigned,
      estimatedArrival: estimatedArrival ?? this.estimatedArrival,
      message: message ?? this.message,
    );
  }

  @override
  List<Object?> get props => [
        id,
        timestamp,
        currentLocation,
        status,
        officerAssigned,
        estimatedArrival,
        message,
      ];
}
