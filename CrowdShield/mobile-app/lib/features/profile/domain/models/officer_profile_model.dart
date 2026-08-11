import 'package:equatable/equatable.dart';

class OfficerProfileModel extends Equatable {
  final String id;
  final String name;
  final String email;
  final String designation;
  final String department;
  final String badgeNumber;
  final String phone;
  final String? profileImage;
  final String language;
  final bool notificationsEnabled;
  final String joinedDate;
  final int reportsSubmitted;
  final int alertsReceived;
  final int sosRequests;
  final int daysActive;

  const OfficerProfileModel({
    required this.id,
    required this.name,
    required this.email,
    required this.designation,
    required this.department,
    required this.badgeNumber,
    required this.phone,
    this.profileImage,
    required this.language,
    required this.notificationsEnabled,
    required this.joinedDate,
    required this.reportsSubmitted,
    required this.alertsReceived,
    required this.sosRequests,
    required this.daysActive,
  });

  OfficerProfileModel copyWith({
    String? id,
    String? name,
    String? email,
    String? designation,
    String? department,
    String? badgeNumber,
    String? phone,
    String? profileImage,
    String? language,
    bool? notificationsEnabled,
    String? joinedDate,
    int? reportsSubmitted,
    int? alertsReceived,
    int? sosRequests,
    int? daysActive,
  }) {
    return OfficerProfileModel(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      designation: designation ?? this.designation,
      department: department ?? this.department,
      badgeNumber: badgeNumber ?? this.badgeNumber,
      phone: phone ?? this.phone,
      profileImage: profileImage ?? this.profileImage,
      language: language ?? this.language,
      notificationsEnabled: notificationsEnabled ?? this.notificationsEnabled,
      joinedDate: joinedDate ?? this.joinedDate,
      reportsSubmitted: reportsSubmitted ?? this.reportsSubmitted,
      alertsReceived: alertsReceived ?? this.alertsReceived,
      sosRequests: sosRequests ?? this.sosRequests,
      daysActive: daysActive ?? this.daysActive,
    );
  }

  @override
  List<Object?> get props => [
        id,
        name,
        email,
        designation,
        department,
        badgeNumber,
        phone,
        profileImage,
        language,
        notificationsEnabled,
        joinedDate,
        reportsSubmitted,
        alertsReceived,
        sosRequests,
        daysActive,
      ];
}
