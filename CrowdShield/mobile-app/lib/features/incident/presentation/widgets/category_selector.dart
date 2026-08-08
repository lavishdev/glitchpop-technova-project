import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class CategorySelector extends StatelessWidget {
  final String? selectedCategory;
  final ValueChanged<String> onSelect;

  const CategorySelector({
    super.key,
    required this.selectedCategory,
    required this.onSelect,
  });

  static const categories = [
    'Medical',
    'Security',
    'Crowd',
    'Fire',
    'Infrastructure',
    'Other',
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Row(
          children: [
            Text(
              'Incident Category',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppColors.text),
            ),
            Text(' *', style: TextStyle(color: AppColors.danger, fontWeight: FontWeight.bold)),
          ],
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: categories.map((cat) {
            final isSelected = selectedCategory == cat;
            return FilterChip(
              label: Text(cat),
              selected: isSelected,
              selectedColor: AppColors.primary.withValues(alpha: 0.15),
              checkmarkColor: AppColors.primary,
              labelStyle: TextStyle(
                color: isSelected ? AppColors.primary : AppColors.text,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
              onSelected: (_) => onSelect(cat),
            );
          }).toList(),
        ),
      ],
    );
  }
}
