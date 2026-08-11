import '../models/officer_profile_model.dart';

abstract class ProfileRepository {
  Future<OfficerProfileModel> getProfile();
  Future<OfficerProfileModel> updateNotifications(bool enabled);
  Future<OfficerProfileModel> updateLanguage(String language);
  Future<void> logout();
}
