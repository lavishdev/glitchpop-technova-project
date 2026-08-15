import 'package:dio/dio.dart';
import '../../../../core/constants/api_constants.dart';
import '../../domain/models/alert_model.dart';
import '../../domain/repositories/alerts_repository.dart';

class DioAlertsRepository implements AlertsRepository {
  final Dio dio;

  DioAlertsRepository(this.dio);

  @override
  Future<List<AlertModel>> getAlerts({
    String? category,
    String? severity,
    String? location,
    bool? isRead,
    String? query,
  }) async {
    try {
      final queryParameters = <String, dynamic>{
        if (category != null && category != 'All') 'type': category,
        if (severity != null && severity != 'All') 'severity': severity,
        if (location != null && location != 'All') 'location': location,
        if (isRead != null) 'isRead': isRead,
        if (query != null && query.isNotEmpty) 'search': query,
      };

      final response = await dio.get(
        ApiConstants.alerts,
        queryParameters: queryParameters,
      );

      if (response.statusCode == 200) {
        final List<dynamic> content = response.data['data']['content'] ?? [];
        return content.map((json) {
          return AlertModel(
            id: json['id'].toString(),
            title: json['type'] ?? 'Alert',
            description: json['message'] ?? '',
            severity: json['severity']?.toString().toUpperCase() ?? 'INFO',
            location: json['location'] ?? 'Unknown',
            timestamp: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : DateTime.now(),
            isRead: json['read'] ?? json['isRead'] ?? false,
            category: json['type'] ?? 'SYSTEM',
          );
        }).toList();
      }
      throw Exception('Failed to load alerts');
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Network error occurred fetching alerts');
    }
  }

  @override
  Future<void> markAsRead(String alertId) async {
    try {
      await dio.patch('${ApiConstants.alerts}/$alertId/read');
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Failed to mark alert as read');
    }
  }
}
