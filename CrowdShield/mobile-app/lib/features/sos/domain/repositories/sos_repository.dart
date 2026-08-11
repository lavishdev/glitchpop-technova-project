import '../models/emergency_contact_model.dart';
import '../models/sos_request_model.dart';

abstract class SOSRepository {
  Future<SOSRequestModel> sendSOS();
  Future<bool> cancelSOS(String requestId);
  Future<List<EmergencyContactModel>> getEmergencyContacts();
}
