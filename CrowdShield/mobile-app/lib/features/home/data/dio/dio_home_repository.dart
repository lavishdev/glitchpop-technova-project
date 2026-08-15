import 'package:dio/dio.dart';
import '../../../../core/constants/api_constants.dart';
import '../../domain/models/home_model.dart';
import '../../domain/repositories/home_repository.dart';

class DioHomeRepository implements HomeRepository {
  final Dio dio;

  DioHomeRepository(this.dio);

  @override
  Future<HomeModel> getHomeData() async {
    try {
      final response = await dio.get(ApiConstants.mobileHome);
      
      if (response.statusCode == 200) {
        final data = response.data['data'];
        final venue = data['venue'];
        final metrics = data['metrics'];
        final recommendation = data['recommendation'];

        return HomeModel(
          userName: 'Officer', // Default or fetch from profile if needed
          venueName: venue['name'] ?? 'TechNova Arena',
          crowdStatus: venue['status'] ?? 'Normal',
          crowdCount: (metrics['peopleCount'] ?? 0).toInt(),
          densityPercentage: (metrics['crowdDensity'] ?? 0).toInt(),
          riskLevel: metrics['riskLevel'] ?? 'LOW',
          activeAlerts: (metrics['activeAlerts'] ?? 0).toInt(),
          recommendation: recommendation?['message'] ?? 'Maintain current patrols.',
          nearestExit: 'Main Gate', // Not provided by backend MVP
          recentAlerts: const [], // Fetch from /api/alerts if needed
        );
      }
      throw Exception('Failed to load home data');
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Network error occurred fetching home data');
    }
  }
}
