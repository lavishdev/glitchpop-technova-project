import 'package:dio/dio.dart';
import '../../../../core/constants/api_constants.dart';
import '../../../../core/providers/demo_provider.dart';
import '../../domain/models/chat_message_model.dart';
import '../../domain/models/suggestion_model.dart';
import '../../domain/repositories/assistant_repository.dart';

class DioAssistantRepository implements AssistantRepository {
  final Dio dio;

  DioAssistantRepository(this.dio);

  @override
  Future<ChatMessageModel> getAIResponse(String userPrompt, [DemoState? demoState]) async {
    try {
      final Map<String, dynamic> requestData = {'query': userPrompt};
      
      if (demoState != null) {
        requestData['context'] = {
          'venueName': demoState.venueName,
          'crowdCount': demoState.crowdCount,
          'densityPercentage': demoState.densityPercentage,
          'riskLevel': demoState.riskLevel,
          'activeAlertsCount': demoState.activeAlertsCount,
          'emergencyStatus': demoState.emergencyStatus,
          'isSimulation': true,
        };
      }

      final response = await dio.post(
        ApiConstants.assistantChat,
        data: requestData,
      );

      if (response.statusCode == 200) {
        final aiMessage = response.data['data'] ?? 'I have no response at the moment.';
        return ChatMessageModel(
          id: 'ai_${DateTime.now().millisecondsSinceEpoch}',
          message: aiMessage,
          isUser: false,
          timestamp: DateTime.now(),
          messageType: 'Assistant',
        );
      }
      throw Exception('Failed to get AI response');
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Network error communicating with AI');
    }
  }

  @override
  Future<List<SuggestionModel>> getSuggestions() async {
    return const [
      SuggestionModel(
        id: 'sug_1',
        iconName: 'status',
        title: 'Current Status',
        prompt: 'What is the current crowd status?',
      ),

      SuggestionModel(
        id: 'sug_2',
        iconName: 'warning',
        title: 'Active Alerts',
        prompt: 'Are there any active alerts?',
      ),
      SuggestionModel(
        id: 'sug_3',
        iconName: 'route',
        title: 'Evacuation Route',
        prompt: 'What is the fastest evacuation route?',
      ),
    ];
  }
}
