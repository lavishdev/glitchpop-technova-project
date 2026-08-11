import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../domain/models/emergency_contact_model.dart';

class EmergencyContactsList extends StatelessWidget {
  final List<EmergencyContactModel> contacts;

  const EmergencyContactsList({
    super.key,
    required this.contacts,
  });

  void _showMockCallDialog(BuildContext context, EmergencyContactModel contact) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.surface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: [
            const Icon(Icons.phone_in_talk_outlined, color: AppColors.primary),
            const SizedBox(width: 8),
            Expanded(child: Text(contact.title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold))),
          ],
        ),
        content: Text(
          'Simulated Call to ${contact.phone}\n\nThis is a hackathon prototype demonstration. Emergency lines are simulated.',
          style: const TextStyle(color: AppColors.textSecondary),
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
        Text(
          'Emergency Contacts',
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
                color: AppColors.text,
              ),
        ),
        const SizedBox(height: 10),
        ...contacts.map((contact) {
          return Card(
            elevation: 1,
            margin: const EdgeInsets.only(bottom: 8.0),
            color: AppColors.surface,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
              side: const BorderSide(color: AppColors.border),
            ),
            child: ListTile(
              leading: Container(
                padding: const EdgeInsets.all(8),
                decoration: const BoxDecoration(
                  color: AppColors.background,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.phone_forwarded, color: AppColors.primary, size: 20),
              ),
              title: Text(contact.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              subtitle: Text(contact.subtitle, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
              trailing: IconButton(
                icon: const Icon(Icons.call, color: AppColors.safe),
                onPressed: () => _showMockCallDialog(context, contact),
              ),
            ),
          );
        }),
      ],
    );
  }
}
