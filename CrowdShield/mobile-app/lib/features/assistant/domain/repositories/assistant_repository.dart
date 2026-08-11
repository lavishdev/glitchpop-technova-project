import '../../../../core/providers/demo_provider.dart';
import '../models/chat_message_model.dart';
import '../models/suggestion_model.dart';

abstract class AssistantRepository {
  Future<ChatMessageModel> getAIResponse(String userPrompt, [DemoState? demoState]);
  Future<List<SuggestionModel>> getSuggestions();
}
