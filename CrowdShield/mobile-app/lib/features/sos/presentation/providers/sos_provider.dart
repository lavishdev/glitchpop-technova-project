import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/fake/fake_sos_repository.dart';
import '../../domain/models/emergency_contact_model.dart';
import '../../domain/models/sos_request_model.dart';
import '../../domain/repositories/sos_repository.dart';

enum SOSStatus { idle, holding, sending, sent, cancelled, error }

final sosRepositoryProvider = Provider<SOSRepository>((ref) {
  return FakeSOSRepository();
});

class SOSState {
  final SOSStatus status;
  final SOSRequestModel? request;
  final int countdownSeconds;
  final int cancelTimerSeconds;
  final String? errorMessage;
  final List<EmergencyContactModel> contacts;

  const SOSState({
    this.status = SOSStatus.idle,
    this.request,
    this.countdownSeconds = 3,
    this.cancelTimerSeconds = 10,
    this.errorMessage,
    this.contacts = const [],
  });

  SOSState copyWith({
    SOSStatus? status,
    SOSRequestModel? request,
    int? countdownSeconds,
    int? cancelTimerSeconds,
    String? errorMessage,
    List<EmergencyContactModel>? contacts,
    bool clearRequest = false,
  }) {
    return SOSState(
      status: status ?? this.status,
      request: clearRequest ? null : (request ?? this.request),
      countdownSeconds: countdownSeconds ?? this.countdownSeconds,
      cancelTimerSeconds: cancelTimerSeconds ?? this.cancelTimerSeconds,
      errorMessage: errorMessage ?? this.errorMessage,
      contacts: contacts ?? this.contacts,
    );
  }
}

class SOSNotifier extends StateNotifier<SOSState> {
  final SOSRepository _repository;
  Timer? _holdTimer;
  Timer? _cancelCountdownTimer;

  SOSNotifier(this._repository) : super(const SOSState()) {
    loadContacts();
  }

  Future<void> loadContacts() async {
    final contacts = await _repository.getEmergencyContacts();
    state = state.copyWith(contacts: contacts);
  }

  void startHold() {
    if (state.status != SOSStatus.idle) return;

    state = state.copyWith(status: SOSStatus.holding, countdownSeconds: 3);

    _holdTimer?.cancel();
    _holdTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (state.countdownSeconds > 1) {
        state = state.copyWith(countdownSeconds: state.countdownSeconds - 1);
      } else {
        _holdTimer?.cancel();
        _triggerSOS();
      }
    });
  }

  void releaseHold() {
    if (state.status == SOSStatus.holding) {
      _holdTimer?.cancel();
      state = state.copyWith(status: SOSStatus.idle, countdownSeconds: 3);
    }
  }

  Future<void> _triggerSOS() async {
    state = state.copyWith(status: SOSStatus.sending);
    try {
      final req = await _repository.sendSOS();
      state = state.copyWith(
        status: SOSStatus.sent,
        request: req,
        cancelTimerSeconds: 10,
      );
      _startCancelWindowTimer();
    } catch (e) {
      state = state.copyWith(
        status: SOSStatus.error,
        errorMessage: e.toString(),
      );
    }
  }

  void _startCancelWindowTimer() {
    _cancelCountdownTimer?.cancel();
    _cancelCountdownTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (state.cancelTimerSeconds > 1) {
        state = state.copyWith(cancelTimerSeconds: state.cancelTimerSeconds - 1);
      } else {
        _cancelCountdownTimer?.cancel();
        state = state.copyWith(cancelTimerSeconds: 0);
      }
    });
  }

  Future<void> cancelSOS() async {
    if (state.request == null) return;
    _cancelCountdownTimer?.cancel();

    try {
      await _repository.cancelSOS(state.request!.id);
      final updatedReq = state.request!.copyWith(status: 'CANCELLED');
      state = state.copyWith(
        status: SOSStatus.cancelled,
        request: updatedReq,
      );
    } catch (e) {
      state = state.copyWith(errorMessage: e.toString());
    }
  }

  void resetSOS() {
    _holdTimer?.cancel();
    _cancelCountdownTimer?.cancel();
    state = state.copyWith(
      status: SOSStatus.idle,
      countdownSeconds: 3,
      cancelTimerSeconds: 10,
      clearRequest: true,
    );
  }

  @override
  void dispose() {
    _holdTimer?.cancel();
    _cancelCountdownTimer?.cancel();
    super.dispose();
  }
}

final sosProvider = StateNotifierProvider<SOSNotifier, SOSState>((ref) {
  final repository = ref.watch(sosRepositoryProvider);
  return SOSNotifier(repository);
});
