import 'package:dio/dio.dart';
import '../../../../core/constants/api_constants.dart';
import '../../../../core/network/secure_storage.dart';
import '../../domain/models/user_model.dart';
import '../../domain/repositories/auth_repository.dart';

class DioAuthRepository implements AuthRepository {
  final Dio dio;

  DioAuthRepository(this.dio);

  @override
  Future<UserModel> login(String username, String password) async {
    try {
      final response = await dio.post(
        ApiConstants.login,
        data: {'username': username, 'password': password},
      );

      if (response.statusCode == 200) {
        final data = response.data['data'];
        final token = data['token'];
        
        await SecureStorage.saveToken(token);

        return UserModel(
          id: username, // Actual ID will be loaded by ProfileRepository
          email: username,
          name: username,
        );
      }
      throw Exception('Login failed');
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Network error occurred during login');
    }
  }

  @override
  Future<void> logout() async {
    await SecureStorage.deleteToken();
  }

  @override
  Future<bool> isLoggedIn() async {
    final token = await SecureStorage.getToken();
    return token != null && token.isNotEmpty;
  }
}
