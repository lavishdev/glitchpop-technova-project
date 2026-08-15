import 'package:dio/dio.dart';
import '../../../../core/constants/api_constants.dart';
import '../../domain/models/incident_report_model.dart';
import '../../domain/repositories/incident_repository.dart';

class DioIncidentRepository implements IncidentRepository {
  final Dio dio;

  DioIncidentRepository(this.dio);

  @override
  Future<IncidentReportModel> submitIncident(IncidentReportModel report) async {
    try {
      final response = await dio.post(
        ApiConstants.mobileReport,
        data: {
          'type': report.category,
          'description': report.description,
          'latitude': 30.7333, // Use actual device location in production
          'longitude': 76.7794,
        },
      );

      if (response.statusCode == 200) {
        return report.copyWith(
          id: 'inc_${DateTime.now().millisecondsSinceEpoch}',
          status: 'SUBMITTED',
        );
      }
      throw Exception('Failed to submit incident');
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Network error occurred while submitting incident');
    }
  }

  @override
  Future<List<IncidentReportModel>> getReports() async {
    // MVP: Local history can be cached, returning empty for now
    return [];
  }

  @override
  Future<bool> deleteReport(String id) async {
    try {
      final response = await dio.delete('${ApiConstants.mobileReport}/$id');
      if (response.statusCode == 200) {
        return true;
      }
      throw Exception('Failed to delete incident report');
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Network error occurred while deleting report');
    }
  }
}
