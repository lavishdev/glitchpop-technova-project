import 'package:equatable/equatable.dart';

class ChatMessageModel extends Equatable {
  final String id;
  final String message;
  final bool isUser;
  final DateTime timestamp;
  final String messageType;

  const ChatMessageModel({
    required this.id,
    required this.message,
    required this.isUser,
    required this.timestamp,
    required this.messageType,
  });

  @override
  List<Object?> get props => [id, message, isUser, timestamp, messageType];
}
