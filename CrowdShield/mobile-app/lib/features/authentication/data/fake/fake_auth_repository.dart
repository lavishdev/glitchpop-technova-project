import '../../domain/models/user_model.dart';
import '../../domain/repositories/auth_repository.dart';

class FakeAuthRepository implements AuthRepository {
  bool _isLoggedIn = false;
  UserModel? _currentUser;

  @override
  Future<UserModel> login(String email, String password) async {
    await Future.delayed(const Duration(seconds: 1));

    if (email.trim() == 'admin@crowdshield.com' && password == 'password123') {
      _isLoggedIn = true;
      _currentUser = const UserModel(
        id: 'user_001',
        email: 'admin@crowdshield.com',
        name: 'Admin User',
      );
      return _currentUser!;
    } else {
      throw Exception('Invalid email or password. Please check your credentials.');
    }
  }

  @override
  Future<void> logout() async {
    await Future.delayed(const Duration(milliseconds: 500));
    _isLoggedIn = false;
    _currentUser = null;
  }

  @override
  Future<bool> isLoggedIn() async {
    return _isLoggedIn;
  }
}
