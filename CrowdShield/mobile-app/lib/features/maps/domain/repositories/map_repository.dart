import '../models/venue_map_model.dart';

abstract class MapRepository {
  Future<VenueMapModel> getVenueMapData();
}
