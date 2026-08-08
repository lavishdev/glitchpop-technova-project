import 'package:flutter/material.dart';
import '../../../../core/widgets/cards/app_cards.dart';
import '../../domain/models/officer_profile_model.dart';

class ProfileStatsGrid extends StatelessWidget {
  final OfficerProfileModel profile;

  const ProfileStatsGrid({
    super.key,
    required this.profile,
  });

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final crossAxisCount = constraints.maxWidth > 500 ? 4 : 2;
        return GridView.count(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisCount: crossAxisCount,
          crossAxisSpacing: 10,
          mainAxisSpacing: 10,
          childAspectRatio: 1.6,
          children: [
            MetricCard(
              label: 'Reports Submitted',
              value: '${profile.reportsSubmitted}',
              icon: Icons.assignment_turned_in_outlined,
            ),
            MetricCard(
              label: 'Alerts Received',
              value: '${profile.alertsReceived}',
              icon: Icons.notifications_active_outlined,
            ),
            MetricCard(
              label: 'SOS Requests',
              value: '${profile.sosRequests}',
              icon: Icons.sos_outlined,
            ),
            MetricCard(
              label: 'Days Active',
              value: '${profile.daysActive}',
              icon: Icons.verified_user_outlined,
            ),
          ],
        );
      },
    );
  }
}
