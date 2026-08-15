import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/network_providers.dart';
import '../../domain/models/alert_model.dart';
import '../../domain/repositories/alerts_repository.dart';
import '../../data/dio/dio_alerts_repository.dart';

final alertsRepositoryProvider = Provider<AlertsRepository>((ref) {
  return DioAlertsRepository(ref.watch(dioProvider));
});

class AlertsState {
  final bool isLoading;
  final List<AlertModel> allAlerts;
  final String searchQuery;
  final String selectedFilter;
  final String? errorMessage;
  final AlertModel? selectedAlert;

  const AlertsState({
    this.isLoading = false,
    this.allAlerts = const [],
    this.searchQuery = '',
    this.selectedFilter = 'All',
    this.errorMessage,
    this.selectedAlert,
  });

  List<AlertModel> get filteredAlerts {
    return allAlerts.where((alert) {
      bool matchesFilter = true;
      if (selectedFilter == 'Unread') {
        matchesFilter = !alert.isRead;
      } else if (selectedFilter == 'High') {
        matchesFilter = alert.severity == 'HIGH';
      } else if (selectedFilter == 'Critical') {
        matchesFilter = alert.severity == 'CRITICAL';
      }

      bool matchesSearch = true;
      if (searchQuery.trim().isNotEmpty) {
        final query = searchQuery.toLowerCase().trim();
        matchesSearch = alert.title.toLowerCase().contains(query) ||
            alert.description.toLowerCase().contains(query) ||
            alert.location.toLowerCase().contains(query) ||
            alert.category.toLowerCase().contains(query);
      }

      return matchesFilter && matchesSearch;
    }).toList();
  }

  AlertsState copyWith({
    bool? isLoading,
    List<AlertModel>? allAlerts,
    String? searchQuery,
    String? selectedFilter,
    String? errorMessage,
    AlertModel? selectedAlert,
    bool clearSelectedAlert = false,
  }) {
    return AlertsState(
      isLoading: isLoading ?? this.isLoading,
      allAlerts: allAlerts ?? this.allAlerts,
      searchQuery: searchQuery ?? this.searchQuery,
      selectedFilter: selectedFilter ?? this.selectedFilter,
      errorMessage: errorMessage ?? this.errorMessage,
      selectedAlert: clearSelectedAlert ? null : (selectedAlert ?? this.selectedAlert),
    );
  }
}

class AlertsNotifier extends StateNotifier<AlertsState> {
  final AlertsRepository _repository;

  AlertsNotifier(this._repository) : super(const AlertsState()) {
    loadAlerts();
  }

  Future<void> loadAlerts() async {
    state = state.copyWith(isLoading: true);
    try {
      final alerts = await _repository.getAlerts();
      state = state.copyWith(isLoading: false, allAlerts: alerts);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  void setSearchQuery(String query) {
    state = state.copyWith(searchQuery: query);
  }

  void setFilter(String filter) {
    state = state.copyWith(selectedFilter: filter);
  }

  void selectAlert(AlertModel alert) {
    state = state.copyWith(selectedAlert: alert);
  }

  void markAsRead(String id) {
    final updatedList = state.allAlerts.map((alert) {
      if (alert.id == id) {
        return alert.copyWith(isRead: true);
      }
      return alert;
    }).toList();

    AlertModel? updatedSelectedAlert = state.selectedAlert;
    if (updatedSelectedAlert != null && updatedSelectedAlert.id == id) {
      updatedSelectedAlert = updatedSelectedAlert.copyWith(isRead: true);
    }

    state = state.copyWith(
      allAlerts: updatedList,
      selectedAlert: updatedSelectedAlert,
    );
  }

  void deleteAlert(String id) {
    final updatedList = state.allAlerts.where((alert) => alert.id != id).toList();
    state = state.copyWith(
      allAlerts: updatedList,
      clearSelectedAlert: state.selectedAlert?.id == id,
    );
  }
}

final alertsProvider = StateNotifierProvider<AlertsNotifier, AlertsState>((ref) {
  final repository = ref.watch(alertsRepositoryProvider);
  return AlertsNotifier(repository);
});
