import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class PrioritySelector extends StatelessWidget {
  final String selectedPriority;
  final ValueChanged<String> onSelect;

  const PrioritySelector({
    super.key,
    required this.selectedPriority,
    required this.onSelect,
  });

  static const priorities = ['Low', 'Medium', 'High', 'Critical'];

  Color _getPriorityColor(String p) {
    switch (p.toUpperCase()) {
      case 'LOW':
        return AppColors.safe;
      case 'MEDIUM':
        return AppColors.warning;
      case 'HIGH':
        return const Color(0xFFFF9800);
      case 'CRITICAL':
        return AppColors.danger;
      default:
        return AppColors.primary;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Priority Level',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppColors.text),
        ),
        const SizedBox(height: 8),
        Row(
          children: priorities.map((priority) {
            final isSelected = selectedPriority == priority;
            final color = _getPriorityColor(priority);
            return Expanded(
              child: Padding(
                padding: const EdgeInsets.only(right: 6.0),
                child: ChoiceChip(
                  label: Text(
                    priority,
                    style: TextStyle(
                      fontSize: 12,
                      color: isSelected ? Colors.white : AppColors.text,
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                    ),
                  ),
                  selected: isSelected,
                  selectedColor: color,
                  onSelected: (_) => onSelect(priority),
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
}
