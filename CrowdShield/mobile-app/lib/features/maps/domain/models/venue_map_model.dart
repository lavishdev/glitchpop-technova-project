import 'package:equatable/equatable.dart';
import 'safe_route_model.dart';
import 'venue_zone_model.dart';

class VenueMapModel extends Equatable {
  final String venueName;
  final List<VenueZoneModel> zones;
  final SafeRouteModel safeRoute;
  final String currentLocationZoneId;

  const VenueMapModel({
    required this.venueName,
    required this.zones,
    required this.safeRoute,
    required this.currentLocationZoneId,
  });

  @override
  List<Object?> get props => [
        venueName,
        zones,
        safeRoute,
        currentLocationZoneId,
      ];
}
