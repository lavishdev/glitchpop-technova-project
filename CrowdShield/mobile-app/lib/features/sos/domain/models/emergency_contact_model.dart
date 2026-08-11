import 'package:equatable/equatable.dart';

class EmergencyContactModel extends Equatable {
  final String id;
  final String title;
  final String phone;
  final String subtitle;

  const EmergencyContactModel({
    required this.id,
    required this.title,
    required this.phone,
    required this.subtitle,
  });

  @override
  List<Object?> get props => [id, title, phone, subtitle];
}
