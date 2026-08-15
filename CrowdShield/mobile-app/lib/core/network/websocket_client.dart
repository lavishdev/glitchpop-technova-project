import 'dart:async';
import 'dart:convert';
import 'package:stomp_dart_client/stomp_dart_client.dart';
import '../constants/api_constants.dart';

class WebSocketClient {
  StompClient? _stompClient;
  
  final _alertsController = StreamController<Map<String, dynamic>>.broadcast();
  Stream<Map<String, dynamic>> get alertsStream => _alertsController.stream;

  final _mapController = StreamController<Map<String, dynamic>>.broadcast();
  Stream<Map<String, dynamic>> get mapStream => _mapController.stream;

  void connect() {
    if (_stompClient != null && _stompClient!.isActive) return;

    _stompClient = StompClient(
      config: StompConfig(
        url: ApiConstants.wsUrl,
        onConnect: onConnect,
        beforeConnect: () async {
          print('WebSocket connecting...');
        },
        onWebSocketError: (dynamic error) => print('WebSocket error: $error'),
      ),
    );
    _stompClient?.activate();
  }

  void onConnect(StompFrame frame) {
    print('WebSocket connected!');

    _stompClient?.subscribe(
      destination: '/topic/alerts',
      callback: (frame) {
        if (frame.body != null) {
          final data = json.decode(frame.body!);
          _alertsController.add(data);
        }
      },
    );

    _stompClient?.subscribe(
      destination: '/topic/map',
      callback: (frame) {
        if (frame.body != null) {
          final data = json.decode(frame.body!);
          _mapController.add(data);
        }
      },
    );
  }

  void disconnect() {
    _stompClient?.deactivate();
    _stompClient = null;
  }

  void dispose() {
    disconnect();
    _alertsController.close();
    _mapController.close();
  }
}
