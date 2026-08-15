import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers/demo_provider.dart';
import '../../../../core/providers/network_providers.dart';
import '../../domain/models/chat_message_model.dart';
import '../../domain/models/suggestion_model.dart';
import '../../domain/repositories/assistant_repository.dart';
import '../../data/dio/dio_assistant_repository.dart';

final assistantRepositoryProvider = Provider<AssistantRepository>((ref) {
  return DioAssistantRepository(ref.watch(dioProvider));
});

class AssistantState {
  final List<ChatMessageModel> messages;
  final List<SuggestionModel> suggestions;
  final bool isTyping;
  final String? errorMessage;

  const AssistantState({
    this.messages = const [],
    this.suggestions = const [],
    this.isTyping = false,
    this.errorMessage,
  });

  AssistantState copyWith({
    List<ChatMessageModel>? messages,
    List<SuggestionModel>? suggestions,
    bool? isTyping,
    String? errorMessage,
  }) {
    return AssistantState(
      messages: messages ?? this.messages,
      suggestions: suggestions ?? this.suggestions,
      isTyping: isTyping ?? this.isTyping,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}

class AssistantNotifier extends StateNotifier<AssistantState> {
  final AssistantRepository _repository;
  final Ref _ref;

  AssistantNotifier(this._repository, this._ref) : super(const AssistantState()) {
    _init();
  }

  Future<void> _init() async {
    final suggestions = await _repository.getSuggestions();
    state = state.copyWith(
      suggestions: suggestions,
      messages: [
        ChatMessageModel(
          id: 'welcome_01',
          message: 'Hello Officer! I am your CrowdShield AI Safety Assistant. Live telemetry from TechNova Arena is synchronized. How can I assist you?',
          isUser: false,
          timestamp: DateTime.now(),
          messageType: 'Assistant',
        ),
      ],
    );
  }

  Future<void> sendMessage(String text) async {
    final userMsgText = text.trim();
    if (userMsgText.isEmpty) return;

    final userMessage = ChatMessageModel(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      message: userMsgText,
      isUser: true,
      timestamp: DateTime.now(),
      messageType: 'User',
    );

    final updatedMessages = [...state.messages, userMessage];
    state = state.copyWith(messages: updatedMessages, isTyping: true);

    try {
      final demoState = _ref.read(demoProvider);
      final aiResponse = await _repository.getAIResponse(userMsgText, demoState);
      state = state.copyWith(
        messages: [...state.messages, aiResponse],
        isTyping: false,
      );
    } catch (e) {
      state = state.copyWith(isTyping: false, errorMessage: e.toString());
    }
  }

  void clearChat() {
    state = state.copyWith(
      messages: [
        ChatMessageModel(
          id: 'welcome_${DateTime.now().millisecondsSinceEpoch}',
          message: 'Conversation cleared. Ask me anything about venue safety.',
          isUser: false,
          timestamp: DateTime.now(),
          messageType: 'Assistant',
        ),
      ],
    );
  }
}

final assistantProvider = StateNotifierProvider<AssistantNotifier, AssistantState>((ref) {
  final repository = ref.watch(assistantRepositoryProvider);
  return AssistantNotifier(repository, ref);
});
