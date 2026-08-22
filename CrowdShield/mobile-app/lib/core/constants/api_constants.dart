class ApiConstants {
  // Configurable via --dart-define=API_URL=...
  // Defaults to 10.0.2.2 for Android emulator
  static const String baseUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'http://192.168.1.5:8080/api',
  );
  
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  
  static const String mobileHome = '/mobile/home';
  static const String mobileMap = '/mobile/map';
  static const String mobileSos = '/mobile/sos';
  static const String mobileReport = '/mobile/report';
  static const String mobileDeviceToken = '/mobile/device-token';
  
  static const String alerts = '/alerts';
  static const String assistantChat = '/assistant/chat';
  static const String userMe = '/users/me';
  
  // Configurable via --dart-define=WS_URL=...
  static const String wsUrl = String.fromEnvironment(
    'WS_URL',
    defaultValue: 'ws://192.168.1.5:8080/ws-crowdshield',
  );
}
