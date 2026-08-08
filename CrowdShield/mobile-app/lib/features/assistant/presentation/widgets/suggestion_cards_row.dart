import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../domain/models/suggestion_model.dart';

class SuggestionCardsRow extends StatelessWidget {
  final List<SuggestionModel> suggestions;
  final ValueChanged<String> onSelectPrompt;

  const SuggestionCardsRow({
    super.key,
    required this.suggestions,
    required this.onSelectPrompt,
  });

  IconData _getIcon(String iconName) {
    switch (iconName) {
      case 'exit_to_app':
        return Icons.exit_to_app_rounded;
      case 'groups':
        return Icons.groups_outlined;
      case 'medical_services':
        return Icons.medical_services_outlined;
      case 'notifications_active':
        return Icons.notifications_active_outlined;
      case 'warning_amber':
        return Icons.warning_amber_rounded;
      case 'phone':
        return Icons.phone_in_talk_outlined;
      default:
        return Icons.lightbulb_outline;
    }
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: suggestions.map((s) {
          return Padding(
            padding: const EdgeInsets.only(right: 8.0),
            child: ActionChip(
              avatar: Icon(_getIcon(s.iconName), size: 16, color: AppColors.primary),
              label: Text(s.title),
              backgroundColor: AppColors.surface,
              side: const BorderSide(color: AppColors.border),
              labelStyle: const TextStyle(
                color: AppColors.text,
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
              onPressed: () => onSelectPrompt(s.prompt),
            ),
          );
        }).toList(),
      ),
    );
  }
}
