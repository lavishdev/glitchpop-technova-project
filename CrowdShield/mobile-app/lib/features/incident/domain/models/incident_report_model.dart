import 'package:equatable/equatable.dart';

class IncidentReportModel extends Equatable {
  final String id;
  final String category;
  final String title;
  final String description;
  final String location;
  final String reportedBy;
  final String priority;
  final String status;
  final String? photoPath;
  final DateTime timestamp;

  const IncidentReportModel({
    required this.id,
    required this.category,
    required this.title,
    required this.description,
    required this.location,
    required this.reportedBy,
    required this.priority,
    required this.status,
    this.photoPath,
    required this.timestamp,
  });

  IncidentReportModel copyWith({
    String? id,
    String? category,
    String? title,
    String? description,
    String? location,
    String? reportedBy,
    String? priority,
    String? status,
    String? photoPath,
    DateTime? timestamp,
  }) {
    return IncidentReportModel(
      id: id ?? this.id,
      category: category ?? this.category,
      title: title ?? this.title,
      description: description ?? this.description,
      location: location ?? this.location,
      reportedBy: reportedBy ?? this.reportedBy,
      priority: priority ?? this.priority,
      status: status ?? this.status,
      photoPath: photoPath ?? this.photoPath,
      timestamp: timestamp ?? this.timestamp,
    );
  }

  @override
  List<Object?> get props => [
        id,
        category,
        title,
        description,
        location,
        reportedBy,
        priority,
        status,
        photoPath,
        timestamp,
      ];
}
