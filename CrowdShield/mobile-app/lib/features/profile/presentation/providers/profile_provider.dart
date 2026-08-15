import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/network_providers.dart';
import '../../domain/models/officer_profile_model.dart';
import '../../domain/repositories/profile_repository.dart';
import '../../data/dio/dio_profile_repository.dart';

final profileRepositoryProvider = Provider<ProfileRepository>((ref) {
  return DioProfileRepository(ref.watch(dioProvider));
});

class ProfileState {
  final bool isLoading;
  final bool isUpdating;
  final OfficerProfileModel? profile;
  final String? errorMessage;

  const ProfileState({
    this.isLoading = false,
    this.isUpdating = false,
    this.profile,
    this.errorMessage,
  });

  ProfileState copyWith({
    bool? isLoading,
    bool? isUpdating,
    OfficerProfileModel? profile,
    String? errorMessage,
  }) {
    return ProfileState(
      isLoading: isLoading ?? this.isLoading,
      isUpdating: isUpdating ?? this.isUpdating,
      profile: profile ?? this.profile,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}

class ProfileNotifier extends StateNotifier<ProfileState> {
  final ProfileRepository _repository;

  ProfileNotifier(this._repository) : super(const ProfileState()) {
    loadProfile();
  }

  Future<void> loadProfile() async {
    state = state.copyWith(isLoading: true);
    try {
      final p = await _repository.getProfile();
      state = state.copyWith(isLoading: false, profile: p);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  Future<void> toggleNotifications(bool value) async {
    state = state.copyWith(isUpdating: true);
    try {
      final updated = await _repository.updateNotifications(value);
      state = state.copyWith(isUpdating: false, profile: updated);
    } catch (e) {
      state = state.copyWith(isUpdating: false, errorMessage: e.toString());
    }
  }

  Future<void> setLanguage(String lang) async {
    state = state.copyWith(isUpdating: true);
    try {
      final updated = await _repository.updateLanguage(lang);
      state = state.copyWith(isUpdating: false, profile: updated);
    } catch (e) {
      state = state.copyWith(isUpdating: false, errorMessage: e.toString());
    }
  }

  Future<void> logout() async {
    await _repository.logout();
  }
}

final profileProvider = StateNotifierProvider<ProfileNotifier, ProfileState>((ref) {
  final repository = ref.watch(profileRepositoryProvider);
  return ProfileNotifier(repository);
});
