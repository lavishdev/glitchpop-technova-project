import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/empty/empty_components.dart';
import '../../../../core/widgets/loading/loading_components.dart';
import '../../../../core/widgets/navigation/navigation_components.dart';
import '../providers/map_provider.dart';
import '../widgets/interactive_digital_twin_map.dart';
import '../widgets/map_legend.dart';
import '../widgets/safe_route_card.dart';
import '../widgets/zone_details_card.dart';

class MapPage extends ConsumerWidget {
  const MapPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final mapState = ref.watch(mapProvider);
    final notifier = ref.read(mapProvider.notifier);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: CustomAppBar(
        title: mapState.venueMap?.venueName ?? 'Live Emergency Map',
        centerTitle: true,
      ),
      body: mapState.isLoading
          ? const CircularLoader()
          : mapState.errorMessage != null
              ? GenericEmptyState(
                  title: 'Failed to load map',
                  description: mapState.errorMessage!,
                  icon: Icons.map_outlined,
                  action: ElevatedButton.icon(
                    onPressed: () => notifier.loadMapData(),
                    icon: const Icon(Icons.refresh),
                    label: const Text('Retry'),
                  ),
                )
              : RefreshIndicator(
                  onRefresh: () => notifier.loadMapData(),
                  child: SingleChildScrollView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        InteractiveDigitalTwinMap(
                          zones: mapState.venueMap!.zones,
                          selectedZone: mapState.selectedZone,
                          currentLocationZoneId: mapState.venueMap!.currentLocationZoneId,
                          onSelectZone: (zone) => notifier.selectZone(zone),
                        ).animate().fadeIn(duration: 400.ms),
                        const SizedBox(height: 12),
                        const MapLegend().animate().fadeIn(duration: 400.ms, delay: 100.ms),
                        const SizedBox(height: 16),
                        if (mapState.selectedZone != null) ...[
                          const SectionHeader(title: 'Zone Overview'),
                          const SizedBox(height: 8),
                          ZoneDetailsCard(zone: mapState.selectedZone!)
                              .animate()
                              .fadeIn(duration: 300.ms)
                              .scale(begin: const Offset(0.98, 0.98), end: const Offset(1, 1)),
                          const SizedBox(height: 16),
                        ],
                        const SectionHeader(title: 'Evacuation Guidance'),
                        const SizedBox(height: 8),
                        SafeRouteCard(route: mapState.venueMap!.safeRoute)
                            .animate()
                            .fadeIn(duration: 400.ms, delay: 200.ms),
                        const SizedBox(height: 16),
                      ],
                    ),
                  ),
                ),
    );
  }
}
