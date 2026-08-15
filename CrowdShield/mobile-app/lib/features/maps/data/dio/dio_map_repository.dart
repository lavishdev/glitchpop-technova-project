import 'package:dio/dio.dart';
import '../../../../core/constants/api_constants.dart';
import '../../domain/models/safe_route_model.dart';
import '../../domain/models/venue_map_model.dart';
import '../../domain/models/venue_zone_model.dart';
import '../../domain/repositories/map_repository.dart';

class DioMapRepository implements MapRepository {
  final Dio dio;

  DioMapRepository(this.dio);

  @override
  Future<VenueMapModel> getVenueMapData() async {
    try {
      final response = await dio.get(ApiConstants.mobileMap);
      
      List<VenueZoneModel> zones = _getStaticBaseZones();
      
      if (response.statusCode == 200) {
        final List<dynamic> backendZones = response.data['data'] ?? [];
        
        // Merge backend data with static layout
        zones = zones.map((zone) {
          // Attempt to find matching backend data by id or index (MVP mapping)
          final bz = backendZones.firstWhere(
            (z) => z['id'].toString() == zone.id || 'zone_${z['id']}' == zone.id, 
            orElse: () => null
          );
          
          if (bz != null) {
            return VenueZoneModel(
              id: zone.id,
              name: zone.name,
              riskLevel: bz['riskLevel'] ?? zone.riskLevel,
              crowdCount: (bz['crowdDensity'] ?? zone.crowdCount).toInt(), // using density as count for MVP
              density: (bz['crowdDensity'] ?? zone.density).toInt(),
              status: (bz['activeAlert'] == true) ? 'Alert Active' : 'Normal',
              xPosition: zone.xPosition,
              yPosition: zone.yPosition,
              isExit: zone.isExit,
              iconType: zone.iconType,
              recommendation: zone.recommendation,
            );
          }
          return zone;
        }).toList();
      }

      return VenueMapModel(
        venueName: 'Venue Zone Map',
        zones: zones,
        safeRoute: const SafeRouteModel(
          startGate: 'Central Concourse (Sector B)',
          destination: 'West Exit Gate 4',
          recommendedExit: 'Gate 4',
          estimatedTime: '2 minutes',
          instructions: [
            'Turn West from Central Concourse',
            'Bypass Gate 2 congestion area',
            'Follow green illuminated emergency route to Gate 4',
          ],
        ),
        currentLocationZoneId: 'zone_restroom',
      );
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Network error occurred fetching map data');
    }
  }

  List<VenueZoneModel> _getStaticBaseZones() {
    return const [
      VenueZoneModel(
        id: 'zone_stage',
        name: 'Main Stage Pit',
        riskLevel: 'CRITICAL',
        crowdCount: 1200,
        density: 88,
        status: 'Extreme Crowd Compression',
        xPosition: 0.5,
        yPosition: 0.15,
        isExit: false,
        iconType: 'stage',
        recommendation: 'Avoid central barrier zone. Move towards West aisles.',
      ),
      VenueZoneModel(
        id: 'zone_gate1',
        name: 'Gate 1 (North Entrance)',
        riskLevel: 'LOW',
        crowdCount: 80,
        density: 25,
        status: 'Clear Access',
        xPosition: 0.2,
        yPosition: 0.1,
        isExit: true,
        iconType: 'gate',
        recommendation: 'Open for entry and exit.',
      ),
      VenueZoneModel(
        id: 'zone_vip',
        name: 'VIP Balcony',
        riskLevel: 'LOW',
        crowdCount: 90,
        density: 30,
        status: 'Normal Flow',
        xPosition: 0.85,
        yPosition: 0.15,
        isExit: false,
        iconType: 'vip',
        recommendation: 'Secure area operating normally.',
      ),
      VenueZoneModel(
        id: 'zone_food',
        name: 'North Food Court',
        riskLevel: 'MEDIUM',
        crowdCount: 340,
        density: 54,
        status: 'Moderate Queue Bottleneck',
        xPosition: 0.25,
        yPosition: 0.35,
        isExit: false,
        iconType: 'food',
        recommendation: 'Expect 5-min queue delays.',
      ),
      VenueZoneModel(
        id: 'zone_gate2',
        name: 'Gate 2 (East Main Exit)',
        riskLevel: 'HIGH',
        crowdCount: 520,
        density: 82,
        status: 'Congested Bottleneck',
        xPosition: 0.8,
        yPosition: 0.38,
        isExit: true,
        iconType: 'gate',
        recommendation: 'Heavy congestion. Reroute via Gate 4.',
      ),
      VenueZoneModel(
        id: 'zone_parking',
        name: 'Parking Lot B Access',
        riskLevel: 'LOW',
        crowdCount: 110,
        density: 22,
        status: 'Smooth Movement',
        xPosition: 0.1,
        yPosition: 0.45,
        isExit: false,
        iconType: 'parking',
        recommendation: 'Clear access route to vehicles.',
      ),
      VenueZoneModel(
        id: 'zone_restroom',
        name: 'Central Concourse',
        riskLevel: 'MEDIUM',
        crowdCount: 290,
        density: 60,
        status: 'Steady Flow',
        xPosition: 0.5,
        yPosition: 0.52,
        isExit: false,
        iconType: 'restroom',
        recommendation: 'Restrooms available.',
      ),
      VenueZoneModel(
        id: 'zone_gate4',
        name: 'Gate 4 (West Recommended Exit)',
        riskLevel: 'LOW',
        crowdCount: 60,
        density: 18,
        status: 'Fast Evacuation Route',
        xPosition: 0.1,
        yPosition: 0.68,
        isExit: true,
        iconType: 'gate',
        recommendation: 'Optimal exit route. Proceed directly here.',
      ),
      VenueZoneModel(
        id: 'zone_medical',
        name: 'Medical Aid Station',
        riskLevel: 'LOW',
        crowdCount: 15,
        density: 10,
        status: 'Safe First Aid Zone',
        xPosition: 0.22,
        yPosition: 0.85,
        isExit: false,
        iconType: 'medical',
        recommendation: 'Paramedics & first aid personnel on standby.',
      ),
      VenueZoneModel(
        id: 'zone_gate3',
        name: 'Gate 3 (South Entry)',
        riskLevel: 'MEDIUM',
        crowdCount: 150,
        density: 45,
        status: 'Controlled Access',
        xPosition: 0.5,
        yPosition: 0.88,
        isExit: true,
        iconType: 'gate',
        recommendation: 'Secondary exit option.',
      ),
    ];
  }
}
