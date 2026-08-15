import 'package:dio/dio.dart';
import '../../../../core/constants/api_constants.dart';
import '../../domain/models/emergency_contact_model.dart';
import '../../domain/models/sos_request_model.dart';
import '../../domain/repositories/sos_repository.dart';

class DioSOSRepository implements SOSRepository {
  final Dio dio;

  DioSOSRepository(this.dio);

  @override
  Future<SOSRequestModel> sendSOS() async {
    try {
      final response = await dio.post(
        ApiConstants.mobileSos,
        data: {
          'latitude': 30.7333,
          'longitude': 76.7794,
          'message': 'Mobile user triggered SOS'
        },
      );

      if (response.statusCode == 200) {
        return SOSRequestModel(
          id: 'sos_req_${DateTime.now().millisecondsSinceEpoch}',
          timestamp: DateTime.now(),
          currentLocation: 'Reported Location',
          status: 'SENT',
          officerAssigned: 'Awaiting Assignment',
          estimatedArrival: 'Pending',
          message: 'Emergency response team has been alerted.',
        );
      }
      throw Exception('Failed to send SOS');
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Network error occurred while sending SOS');
    }
  }

  @override
  Future<bool> cancelSOS(String requestId) async {
    try {
      final response = await dio.patch('${ApiConstants.mobileSos}/$requestId/cancel');
      if (response.statusCode == 200) {
        return true;
      }
      throw Exception('Failed to cancel SOS request');
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Network error occurred while cancelling SOS');
    }
  }

  @override
  Future<List<EmergencyContactModel>> getEmergencyContacts() async {
    try {
      final response = await dio.get('/api/mobile/emergency-contacts');
      if (response.statusCode == 200 && response.data['data'] != null) {
        final List<dynamic> contactsData = response.data['data'];
        return contactsData.map((e) => EmergencyContactModel(
          id: e['id'] ?? '',
          title: e['title'] ?? '',
          subtitle: e['subtitle'] ?? '',
          phone: e['phone'] ?? '',
        )).toList();
      }
      throw Exception('Failed to load emergency contacts');
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Network error occurred fetching contacts');
    }
  }
}
