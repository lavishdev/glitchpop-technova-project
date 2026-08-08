import '../../domain/models/emergency_contact_model.dart';
import '../../domain/models/sos_request_model.dart';
import '../../domain/repositories/sos_repository.dart';

class FakeSOSRepository implements SOSRepository {
  @override
  Future<SOSRequestModel> sendSOS() async {
    await Future.delayed(const Duration(seconds: 2));

    return SOSRequestModel(
      id: 'sos_req_789',
      timestamp: DateTime.now(),
      currentLocation: 'Central Concourse - Sector B',
      status: 'SENT',
      officerAssigned: 'Officer Sharma (Unit 4)',
      estimatedArrival: '3 minutes',
      message: 'Emergency response team dispatched. Help is on the way. Remain calm.',
    );
  }

  @override
  Future<bool> cancelSOS(String requestId) async {
    await Future.delayed(const Duration(milliseconds: 500));
    return true;
  }

  @override
  Future<List<EmergencyContactModel>> getEmergencyContacts() async {
    return const [
      EmergencyContactModel(
        id: 'c_01',
        title: 'Security Control Room',
        subtitle: '24/7 Command Center',
        phone: '+1 (800) 555-0199',
      ),
      EmergencyContactModel(
        id: 'c_02',
        title: 'Medical Aid Response',
        subtitle: 'First Aid Paramedics',
        phone: '+1 (800) 555-0198',
      ),
      EmergencyContactModel(
        id: 'c_03',
        title: 'Fire & Safety Command',
        subtitle: 'Evacuation Marshals',
        phone: '+1 (800) 555-0197',
      ),
    ];
  }
}
