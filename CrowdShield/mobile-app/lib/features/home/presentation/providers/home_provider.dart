import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/demo_provider.dart';
import '../../../../core/providers/websocket_provider.dart';
import '../../domain/models/home_model.dart';
import '../../domain/repositories/home_repository.dart';
import '../../../../core/providers/network_providers.dart';
import '../../data/dio/dio_home_repository.dart';

final homeRepositoryProvider = Provider<HomeRepository>((ref) {
  return DioHomeRepository(ref.watch(dioProvider));
});

class HomeNotifier extends StateNotifier<AsyncValue<HomeModel>> {
  final Ref _ref;

  HomeNotifier(this._ref) : super(const AsyncValue.loading()) {
    loadHomeData();
  }

  Future<void> loadHomeData() async {
    try {
      state = const AsyncValue.loading();
      
      // Initialize WebSocket
      final wsClient = _ref.read(webSocketClientProvider);
      wsClient.connect();
      
      // Listen to map updates
      wsClient.mapStream.listen((data) {
        // Refresh home data when map updates occur, or handle specifically
        _fetchHomeData();
      });

      // Listen to alerts updates
      wsClient.alertsStream.listen((data) {
        _fetchHomeData();
      });

      await _fetchHomeData();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> _fetchHomeData() async {
    final repository = _ref.read(homeRepositoryProvider);
    final homeData = await repository.getHomeData();
    state = AsyncValue.data(homeData);
  }
}

final homeProvider = StateNotifierProvider<HomeNotifier, AsyncValue<HomeModel>>((ref) {
  return HomeNotifier(ref);
});
