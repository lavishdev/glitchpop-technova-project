import '../../domain/models/incident_report_model.dart';
import '../../domain/repositories/incident_repository.dart';

class FakeIncidentRepository implements IncidentRepository {
  final List<IncidentReportModel> _inMemoryReports = [
    IncidentReportModel(
      id: 'INC-0001',
      category: 'Crowd',
      title: 'Gate 2 Entrance Bottleneck',
      description: 'Pedestrian flow obstructed due to narrow queue ropes.',
      location: 'Gate 2 Corridor',
      reportedBy: 'Officer Sharma',
      priority: 'High',
      status: 'Submitted',
      timestamp: DateTime.now().subtract(const Duration(minutes: 45)),
    ),
    IncidentReportModel(
      id: 'INC-0002',
      category: 'Medical',
      title: 'Dehydration near Stage A',
      description: 'Attendee fainted due to heat; medical team requested.',
      location: 'Stage A Pit',
      reportedBy: 'Officer Sharma',
      priority: 'Medium',
      status: 'Resolved',
      timestamp: DateTime.now().subtract(const Duration(hours: 2)),
    ),
    IncidentReportModel(
      id: 'INC-0003',
      category: 'Security',
      title: 'Unattended Backpack',
      description: 'Bag left under bench near Food Court Table 12.',
      location: 'North Food Plaza',
      reportedBy: 'Officer Sharma',
      priority: 'High',
      status: 'Pending',
      timestamp: DateTime.now().subtract(const Duration(hours: 4)),
    ),
    IncidentReportModel(
      id: 'INC-0004',
      category: 'Infrastructure',
      title: 'Water Hydration Station Empty',
      description: 'Refill required for Station 3.',
      location: 'West Stand Zone',
      reportedBy: 'Officer Sharma',
      priority: 'Low',
      status: 'Resolved',
      timestamp: DateTime.now().subtract(const Duration(hours: 6)),
    ),
  ];

  @override
  Future<List<IncidentReportModel>> getReports() async {
    await Future.delayed(const Duration(milliseconds: 500));
    return List.from(_inMemoryReports);
  }

  @override
  Future<IncidentReportModel> submitIncident(IncidentReportModel report) async {
    await Future.delayed(const Duration(seconds: 2));

    final nextIdNumber = _inMemoryReports.length + 1;
    final generatedId = 'INC-${nextIdNumber.toString().padLeft(4, '0')}';

    final createdReport = report.copyWith(
      id: generatedId,
      status: 'Submitted',
      timestamp: DateTime.now(),
    );

    _inMemoryReports.insert(0, createdReport);
    return createdReport;
  }

  @override
  Future<bool> deleteReport(String id) async {
    await Future.delayed(const Duration(milliseconds: 300));
    _inMemoryReports.removeWhere((r) => r.id == id);
    return true;
  }
}
