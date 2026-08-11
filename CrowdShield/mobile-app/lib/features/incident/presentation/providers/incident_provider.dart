import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/fake/fake_incident_repository.dart';
import '../../domain/models/incident_report_model.dart';
import '../../domain/repositories/incident_repository.dart';

enum IncidentFormStatus { idle, submitting, submitted, error }

final incidentRepositoryProvider = Provider<IncidentRepository>((ref) {
  return FakeIncidentRepository();
});

class IncidentState {
  final bool isLoadingHistory;
  final IncidentFormStatus formStatus;
  final List<IncidentReportModel> reports;
  final String? selectedCategory;
  final String selectedPriority;
  final IncidentReportModel? lastSubmittedReport;
  final String? errorMessage;

  const IncidentState({
    this.isLoadingHistory = false,
    this.formStatus = IncidentFormStatus.idle,
    this.reports = const [],
    this.selectedCategory,
    this.selectedPriority = 'Medium',
    this.lastSubmittedReport,
    this.errorMessage,
  });

  IncidentState copyWith({
    bool? isLoadingHistory,
    IncidentFormStatus? formStatus,
    List<IncidentReportModel>? reports,
    String? selectedCategory,
    String? selectedPriority,
    IncidentReportModel? lastSubmittedReport,
    String? errorMessage,
    bool clearCategory = false,
  }) {
    return IncidentState(
      isLoadingHistory: isLoadingHistory ?? this.isLoadingHistory,
      formStatus: formStatus ?? this.formStatus,
      reports: reports ?? this.reports,
      selectedCategory: clearCategory ? null : (selectedCategory ?? this.selectedCategory),
      selectedPriority: selectedPriority ?? this.selectedPriority,
      lastSubmittedReport: lastSubmittedReport ?? this.lastSubmittedReport,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}

class IncidentNotifier extends StateNotifier<IncidentState> {
  final IncidentRepository _repository;

  IncidentNotifier(this._repository) : super(const IncidentState()) {
    loadReports();
  }

  Future<void> loadReports() async {
    state = state.copyWith(isLoadingHistory: true);
    try {
      final list = await _repository.getReports();
      state = state.copyWith(isLoadingHistory: false, reports: list);
    } catch (e) {
      state = state.copyWith(isLoadingHistory: false, errorMessage: e.toString());
    }
  }

  void selectCategory(String category) {
    state = state.copyWith(selectedCategory: category);
  }

  void selectPriority(String priority) {
    state = state.copyWith(selectedPriority: priority);
  }

  Future<IncidentReportModel?> submitIncident({
    required String title,
    required String description,
    required String location,
  }) async {
    if (state.selectedCategory == null) return null;

    state = state.copyWith(formStatus: IncidentFormStatus.submitting);

    try {
      final draft = IncidentReportModel(
        id: '',
        category: state.selectedCategory!,
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        reportedBy: 'Officer Sharma',
        priority: state.selectedPriority,
        status: 'Pending',
        timestamp: DateTime.now(),
      );

      final submitted = await _repository.submitIncident(draft);
      final updatedReports = [submitted, ...state.reports];

      state = state.copyWith(
        formStatus: IncidentFormStatus.submitted,
        reports: updatedReports,
        lastSubmittedReport: submitted,
        clearCategory: true,
        selectedPriority: 'Medium',
      );

      return submitted;
    } catch (e) {
      state = state.copyWith(
        formStatus: IncidentFormStatus.error,
        errorMessage: e.toString(),
      );
      return null;
    }
  }

  Future<void> deleteReport(String id) async {
    try {
      await _repository.deleteReport(id);
      final updatedList = state.reports.where((r) => r.id != id).toList();
      state = state.copyWith(reports: updatedList);
    } catch (e) {
      state = state.copyWith(errorMessage: e.toString());
    }
  }

  void resetFormStatus() {
    state = state.copyWith(formStatus: IncidentFormStatus.idle);
  }
}

final incidentProvider = StateNotifierProvider<IncidentNotifier, IncidentState>((ref) {
  final repository = ref.watch(incidentRepositoryProvider);
  return IncidentNotifier(repository);
});
