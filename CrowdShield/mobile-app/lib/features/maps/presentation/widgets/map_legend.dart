import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class MapLegend extends StatelessWidget {
  const MapLegend({super.key});

  Widget _buildLegendItem(String label, Color color) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 12,
          height: 12,
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle,
          ),
        ),
        const SizedBox(width: 6),
        Text(
          label,
          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: AppColors.text),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 1,
      color: AppColors.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: const BorderSide(color: AppColors.border),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 10.0),
        child: Wrap(
          spacing: 16,
          runSpacing: 8,
          alignment: WrapAlignment.center,
          children: [
            _buildLegendItem('Safe', AppColors.safe),
            _buildLegendItem('Moderate', AppColors.warning),
            _buildLegendItem('High', const Color(0xFFFF9800)),
            _buildLegendItem('Critical', AppColors.danger),
            _buildLegendItem('Exit Gate', AppColors.primary),
            _buildLegendItem('Medical', Colors.purple),
          ],
        ),
      ),
    );
  }
}
