import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/network_providers.dart';
import '../../domain/models/venue_map_model.dart';
import '../../domain/models/venue_zone_model.dart';
import '../../domain/repositories/map_repository.dart';
import '../../data/dio/dio_map_repository.dart';

final mapRepositoryProvider = Provider<MapRepository>((ref) {
  return DioMapRepository(ref.watch(dioProvider));
});

class MapState {
  final bool isLoading;
  final VenueMapModel? venueMap;
  final VenueZoneModel? selectedZone;
  final String? errorMessage;

  const MapState({
    this.isLoading = false,
    this.venueMap,
    this.selectedZone,
    this.errorMessage,
  });

  MapState copyWith({
    bool? isLoading,
    VenueMapModel? venueMap,
    VenueZoneModel? selectedZone,
    String? errorMessage,
    bool clearSelectedZone = false,
  }) {
    return MapState(
      isLoading: isLoading ?? this.isLoading,
      venueMap: venueMap ?? this.venueMap,
      selectedZone: clearSelectedZone ? null : (selectedZone ?? this.selectedZone),
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}

class MapNotifier extends StateNotifier<MapState> {
  final MapRepository _repository;

  MapNotifier(this._repository) : super(const MapState()) {
    loadMapData();
  }

  Future<void> loadMapData() async {
    state = state.copyWith(isLoading: true);
    try {
      final mapData = await _repository.getVenueMapData();
      final defaultSelected = mapData.zones.firstWhere(
        (z) => z.id == mapData.currentLocationZoneId,
        orElse: () => mapData.zones.first,
      );

      state = state.copyWith(
        isLoading: false,
        venueMap: mapData,
        selectedZone: defaultSelected,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  void selectZone(VenueZoneModel zone) {
    state = state.copyWith(selectedZone: zone);
  }
}

final mapProvider = StateNotifierProvider<MapNotifier, MapState>((ref) {
  final repository = ref.watch(mapRepositoryProvider);
  return MapNotifier(repository);
});
