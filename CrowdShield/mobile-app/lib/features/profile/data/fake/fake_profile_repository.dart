import '../../domain/models/officer_profile_model.dart';
import '../../domain/repositories/profile_repository.dart';

class FakeProfileRepository implements ProfileRepository {
  OfficerProfileModel _currentProfile = const OfficerProfileModel(
    id: 'OFF-4092',
    name: 'Officer Sharma',
    email: 'admin@crowdshield.com',
    designation: 'Senior Crowd Safety Marshal',
    department: 'Emergency Operations & Safety',
    badgeNumber: 'CS-8842',
    phone: '+1 (800) 555-0199',
    language: 'English (US)',
    notificationsEnabled: true,
    joinedDate: 'Jan 2024',
    reportsSubmitted: 14,
    alertsReceived: 48,
    sosRequests: 3,
    daysActive: 120,
  );

  @override
  Future<OfficerProfileModel> getProfile() async {
    await Future.delayed(const Duration(milliseconds: 500));
    return _currentProfile;
  }

  @override
  Future<OfficerProfileModel> updateNotifications(bool enabled) async {
    await Future.delayed(const Duration(milliseconds: 300));
    _currentProfile = _currentProfile.copyWith(notificationsEnabled: enabled);
    return _currentProfile;
  }

  @override
  Future<OfficerProfileModel> updateLanguage(String language) async {
    await Future.delayed(const Duration(milliseconds: 300));
    _currentProfile = _currentProfile.copyWith(language: language);
    return _currentProfile;
  }

  @override
  Future<void> logout() async {
    await Future.delayed(const Duration(milliseconds: 300));
  }
}
