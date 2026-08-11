import 'package:equatable/equatable.dart';

class AlertModel extends Equatable {
  final String id;
  final String title;
  final String description;
  final String severity;
  final String location;
  final DateTime timestamp;
  final bool isRead;
  final String category;

  const AlertModel({
    required this.id,
    required this.title,
    required this.description,
    required this.severity,
    required this.location,
    required this.timestamp,
    this.isRead = false,
    required this.category,
  });

  AlertModel copyWith({
    String? id,
    String? title,
    String? description,
    String? severity,
    String? location,
    DateTime? timestamp,
    bool? isRead,
    String? category,
  }) {
    return AlertModel(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      severity: severity ?? this.severity,
      location: location ?? this.location,
      timestamp: timestamp ?? this.timestamp,
      isRead: isRead ?? this.isRead,
      category: category ?? this.category,
    );
  }

  @override
  List<Object?> get props => [
        id,
        title,
        description,
        severity,
        location,
        timestamp,
        isRead,
        category,
      ];
}
