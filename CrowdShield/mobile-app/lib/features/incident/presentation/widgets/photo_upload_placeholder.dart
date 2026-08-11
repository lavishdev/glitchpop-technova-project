import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class PhotoUploadPlaceholder extends StatelessWidget {
  const PhotoUploadPlaceholder({super.key});

  void _showComingSoonDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.surface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Row(
          children: [
            Icon(Icons.camera_alt_outlined, color: AppColors.primary),
            SizedBox(width: 8),
            Text('Photo Capture'),
          ],
        ),
        content: const Text(
          'Camera and photo upload integration is simulated for the hackathon MVP demo.',
          style: TextStyle(color: AppColors.textSecondary),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('OK', style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Attachment (Optional)',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppColors.text),
        ),
        const SizedBox(height: 8),
        InkWell(
          onTap: () => _showComingSoonDialog(context),
          borderRadius: BorderRadius.circular(12),
          child: Container(
            width: double.infinity,
            height: 100,
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.border, style: BorderStyle.solid),
            ),
            child: const Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.add_a_photo_outlined, color: AppColors.primary, size: 28),
                SizedBox(height: 6),
                Text(
                  'Add Photo Attachment',
                  style: TextStyle(color: AppColors.textSecondary, fontSize: 12, fontWeight: FontWeight.w600),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
