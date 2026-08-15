import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../network/websocket_client.dart';

final webSocketClientProvider = Provider<WebSocketClient>((ref) {
  final client = WebSocketClient();
  
  ref.onDispose(() {
    client.dispose();
  });
  
  return client;
});
