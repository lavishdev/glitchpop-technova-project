import 'package:dio/dio.dart';
import '../../../../core/constants/api_constants.dart';
import '../../../../core/network/secure_storage.dart';
import '../../domain/models/officer_profile_model.dart';
import '../../domain/repositories/profile_repository.dart';

class DioProfileRepository implements ProfileRepository {
  final Dio dio;
  OfficerProfileModel? _cachedProfile;

  DioProfileRepository(this.dio);

  @override
  Future<OfficerProfileModel> getProfile() async {
    if (_cachedProfile != null) return _cachedProfile!;
    
    try {
      final response = await dio.get(ApiConstants.userMe);
      
      if (response.statusCode == 200) {
        final data = response.data['data'];
        
        _cachedProfile = OfficerProfileModel(
          id: data['id']?.toString() ?? 'unknown',
          name: data['username'] ?? 'Officer',
          badgeNumber: 'BDG-${data['id']}', // Derived for MVP since backend lacks this
          department: 'General Assignment',
          designation: data['role'] ?? 'OFFICER',
          email: data['email'] ?? '${data['username']}@crowdshield.com',
          phone: 'Not Provided',
          notificationsEnabled: true,
          language: 'English',
          joinedDate: DateTime.now().toIso8601String().split('T')[0],
          reportsSubmitted: 0,
          alertsReceived: 0,
          sosRequests: 0,
          daysActive: 0,
        );
        return _cachedProfile!;
      }
      throw Exception('Failed to load profile');
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Network error fetching profile');
    }
  }

  @override
  Future<OfficerProfileModel> updateNotifications(bool enabled) async {
    // Hidden from UI for MVP, returns cached
    return _cachedProfile ?? await getProfile();
  }

  @override
  Future<OfficerProfileModel> updateLanguage(String language) async {
    // Hidden from UI for MVP, returns cached
    return _cachedProfile ?? await getProfile();
  }

  @override
  Future<void> logout() async {
    await SecureStorage.deleteToken();
    _cachedProfile = null;
  }
}
