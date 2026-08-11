import '../../../../core/providers/demo_provider.dart';
import '../../domain/models/chat_message_model.dart';
import '../../domain/models/suggestion_model.dart';
import '../../domain/repositories/assistant_repository.dart';

class FakeAssistantRepository implements AssistantRepository {
  @override
  Future<List<SuggestionModel>> getSuggestions() async {
    return const [
      SuggestionModel(
        id: 's1',
        title: 'Safe Exit',
        iconName: 'exit_to_app',
        prompt: 'Which exit is safest?',
      ),
      SuggestionModel(
        id: 's2',
        title: 'Crowd Status',
        iconName: 'groups',
        prompt: 'Current crowd status?',
      ),
      SuggestionModel(
        id: 's3',
        title: 'Medical Help',
        iconName: 'medical_services',
        prompt: 'Where is the nearest medical station?',
      ),
      SuggestionModel(
        id: 's4',
        title: 'Current Alerts',
        iconName: 'notifications_active',
        prompt: 'How many alerts are active?',
      ),
      SuggestionModel(
        id: 's5',
        title: 'Congestion Advice',
        iconName: 'warning_amber',
        prompt: 'What should I do during congestion?',
      ),
      SuggestionModel(
        id: 's6',
        title: 'Emergency Contacts',
        iconName: 'phone',
        prompt: 'Emergency contacts?',
      ),
    ];
  }

  @override
  Future<ChatMessageModel> getAIResponse(String userPrompt, [DemoState? demoState]) async {
    await Future.delayed(const Duration(milliseconds: 1500));

    final query = userPrompt.toLowerCase();
    String replyText = '';

    final venue = demoState?.venueName ?? 'TechNova Arena';
    final crowdCount = demoState?.crowdCount ?? 14850;
    final density = demoState?.densityPercentage ?? 82;
    final risk = demoState?.riskLevel ?? 'HIGH';
    final recommendedExit = demoState?.recommendedExit ?? 'Gate 4 (West Exit)';

    if (query.contains('safest exit') || query.contains('which exit')) {
      replyText = '$recommendedExit is currently the safest exit with low crowd density and clear evacuation corridors.';
    } else if (query.contains('medical') || query.contains('first aid')) {
      replyText = 'The nearest medical aid station is located beside the Food Court in Sector West. Paramedics are on standby.';
    } else if (query.contains('crowd status') || query.contains('density')) {
      replyText = 'Overall $venue status: $risk risk level ($density% density, $crowdCount attendees). High congestion detected at Gate 2.';
    } else if (query.contains('congestion') || query.contains('stuck') || query.contains('pushing')) {
      replyText = 'Move perpendicular to the crowd flow toward outer aisles. Bypass Gate 2 and head toward $recommendedExit.';
    } else if (query.contains('nearest emergency exit') || query.contains('nearest exit')) {
      replyText = '$recommendedExit is approximately 2 minutes away from Central Concourse.';
    } else if (query.contains('active incidents') || query.contains('incidents')) {
      replyText = 'Active incidents logged: 1) Sector B Bottleneck ($risk), 2) Stage A Heat Exhaustion (Medical), and 3) Gate 2 Corridor Obstruction.';
    } else if (query.contains('alerts') || query.contains('how many alerts')) {
      replyText = 'There are currently ${demoState?.activeAlertsCount ?? 15} safety alerts logged in the system for $venue.';
    } else if (query.contains('parking') || query.contains('car')) {
      replyText = 'Head West past Central Concourse toward Gate 4 to reach Parking Lot B Access smoothly.';
    } else if (query.contains('restroom') || query.contains('toilet')) {
      replyText = 'Restroom Block 4 is located at Central Concourse, operating with steady pedestrian flow.';
    } else if (query.contains('gate 2')) {
      replyText = 'Gate 2 is open but heavily congested ($density% density). Rerouting via $recommendedExit is strongly advised.';
    } else if (query.contains('contacts') || query.contains('phone') || query.contains('call')) {
      replyText = 'Emergency Lines: Security Control (+1 800 555-0199), Medical Aid (+1 800 555-0198), and Fire Safety (+1 800 555-0197).';
    } else if (query.contains('crowdshield') || query.contains('who are you')) {
      replyText = 'I am CrowdShield AI Assistant, providing real-time crowd safety monitoring and intelligent evacuation routing for $venue.';
    } else if (query.contains('evacuate') || query.contains('evacuation')) {
      replyText = 'Evacuation Notice: Remain calm, walk toward illuminated green exit signs leading to $recommendedExit, assist injured individuals, and avoid escalators.';
    } else if (query.contains('vip')) {
      replyText = 'VIP Balcony is operating normally at 30% capacity with clear access corridors.';
    } else {
      replyText = 'I have analyzed your query "$userPrompt". Current safety guidance for $venue: risk level is $risk ($density% density). Stay aware of your nearest exit ($recommendedExit).';
    }

    return ChatMessageModel(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      message: replyText,
      isUser: false,
      timestamp: DateTime.now(),
      messageType: 'Assistant',
    );
  }
}
