import '../models/incident_report_model.dart';

abstract class IncidentRepository {
  Future<IncidentReportModel> submitIncident(IncidentReportModel report);
  Future<List<IncidentReportModel>> getReports();
  Future<bool> deleteReport(String id);
}
