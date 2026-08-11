import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../domain/models/officer_profile_model.dart';

class SettingsSection extends StatelessWidget {
  final OfficerProfileModel profile;
  final ValueChanged<bool> onToggleNotifications;
  final ValueChanged<String> onChangeLanguage;

  const SettingsSection({
    super.key,
    required this.profile,
    required this.onToggleNotifications,
    required this.onChangeLanguage,
  });

  void _showComingSoonDialog(BuildContext context, String title) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.surface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: [
            const Icon(Icons.info_outline, color: AppColors.primary),
            const SizedBox(width: 8),
            Text(title),
          ],
        ),
        content: Text(
          '$title settings feature is simulated for the hackathon MVP demo.',
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

  void _showLanguageDialog(BuildContext context) {
    final languages = ['English (US)', 'Spanish (ES)', 'French (FR)', 'Hindi (IN)'];
    showDialog(
      context: context,
      builder: (ctx) => SimpleDialog(
        title: const Text('Select App Language'),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        children: languages.map((lang) {
          return SimpleDialogOption(
            onPressed: () {
              Navigator.pop(ctx);
              onChangeLanguage(lang);
            },
            child: Row(
              children: [
                Icon(
                  profile.language == lang ? Icons.radio_button_checked : Icons.radio_button_off,
                  color: profile.language == lang ? AppColors.primary : AppColors.textSecondary,
                  size: 20,
                ),
                const SizedBox(width: 12),
                Text(lang, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'App Settings',
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
              SwitchListTile(
                secondary: const Icon(Icons.notifications_none_outlined, color: AppColors.primary),
                title: const Text('Push Notifications', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                subtitle: const Text('Receive high priority safety alerts', style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                value: profile.notificationsEnabled,
                activeTrackColor: AppColors.primary,
                onChanged: onToggleNotifications,
              ),
              const Divider(height: 1, color: AppColors.border),
              ListTile(
                leading: const Icon(Icons.language_outlined, color: AppColors.primary),
                title: const Text('Language', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                trailing: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(profile.language, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                    const Icon(Icons.chevron_right, color: AppColors.textSecondary),
                  ],
                ),
                onTap: () => _showLanguageDialog(context),
              ),
              const Divider(height: 1, color: AppColors.border),
              ListTile(
                leading: const Icon(Icons.palette_outlined, color: AppColors.primary),
                title: const Text('Theme', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                trailing: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text('Light Theme', style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                    Icon(Icons.chevron_right, color: AppColors.textSecondary),
                  ],
                ),
                onTap: () => _showComingSoonDialog(context, 'Dark Mode / Theme Switcher'),
              ),
              const Divider(height: 1, color: AppColors.border),
              ListTile(
                leading: const Icon(Icons.privacy_tip_outlined, color: AppColors.primary),
                title: const Text('Privacy Policy', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                trailing: const Icon(Icons.chevron_right, color: AppColors.textSecondary),
                onTap: () => _showComingSoonDialog(context, 'Privacy Policy'),
              ),
              const Divider(height: 1, color: AppColors.border),
              ListTile(
                leading: const Icon(Icons.gavel_outlined, color: AppColors.primary),
                title: const Text('Terms & Conditions', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                trailing: const Icon(Icons.chevron_right, color: AppColors.textSecondary),
                onTap: () => _showComingSoonDialog(context, 'Terms & Conditions'),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
