import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class SupportSection extends StatelessWidget {
  const SupportSection({super.key});

  void _showSupportDialog(BuildContext context, String title, String content) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.surface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: [
            const Icon(Icons.help_outline, color: AppColors.primary),
            const SizedBox(width: 8),
            Expanded(child: Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold))),
          ],
        ),
        content: Text(content, style: const TextStyle(color: AppColors.textSecondary)),
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
        Text(
          'Support & Help',
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
                color: AppColors.text,
              ),
        ),
        const SizedBox(height: 10),
        Card(
          elevation: 1,
          color: AppColors.surface,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
            side: const BorderSide(color: AppColors.border),
          ),
          child: Column(
            children: [
              ListTile(
                leading: const Icon(Icons.support_agent_outlined, color: AppColors.primary),
                title: const Text('Help Center', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                trailing: const Icon(Icons.chevron_right, color: AppColors.textSecondary),
                onTap: () => _showSupportDialog(
                  context,
                  'Help Center',
                  'Access 24/7 technical documentation, operational user guides, and field escalation guidelines.',
                ),
              ),
              const Divider(height: 1, color: AppColors.border),
              ListTile(
                leading: const Icon(Icons.headset_mic_outlined, color: AppColors.primary),
                title: const Text('Contact Control Room', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                trailing: const Icon(Icons.chevron_right, color: AppColors.textSecondary),
                onTap: () => _showSupportDialog(
                  context,
                  'Control Room Contact',
                  'Direct radio patch: Channel 4\nPhone: +1 (800) 555-0199\nControl Room Marshal: Capt. Davis',
                ),
              ),
              const Divider(height: 1, color: AppColors.border),
              ListTile(
                leading: const Icon(Icons.contact_phone_outlined, color: AppColors.primary),
                title: const Text('Emergency Numbers', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                trailing: const Icon(Icons.chevron_right, color: AppColors.textSecondary),
                onTap: () => _showSupportDialog(
                  context,
                  'Emergency Contacts',
                  'Police: 911 / 112\nFire Department: 911\nMedical Aid Dispatch: +1 (800) 555-0198',
                ),
              ),
              const Divider(height: 1, color: AppColors.border),
              ListTile(
                leading: const Icon(Icons.quiz_outlined, color: AppColors.primary),
                title: const Text('Frequently Asked Questions (FAQs)', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                trailing: const Icon(Icons.chevron_right, color: AppColors.textSecondary),
                onTap: () => _showSupportDialog(
                  context,
                  'FAQs',
                  'Q: How does 2D Digital Twin work?\nA: It aggregates camera density feeds and plots spatial bottlenecks.\n\nQ: How fast does SOS dispatch?\nA: Immediately notifies nearest patrolling unit within 3 seconds.',
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
