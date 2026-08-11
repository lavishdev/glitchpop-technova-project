import 'package:equatable/equatable.dart';

class SafeRouteModel extends Equatable {
  final String startGate;
  final String destination;
  final String recommendedExit;
  final String estimatedTime;
  final List<String> instructions;

  const SafeRouteModel({
    required this.startGate,
    required this.destination,
    required this.recommendedExit,
    required this.estimatedTime,
    required this.instructions,
  });

  @override
  List<Object?> get props => [
        startGate,
        destination,
        recommendedExit,
        estimatedTime,
        instructions,
      ];
}
