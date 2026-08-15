import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../domain/models/venue_zone_model.dart';

class RoutePathPainter extends CustomPainter {
  final Offset startOffset;
  final Offset endOffset;

  RoutePathPainter({
    required this.startOffset,
    required this.endOffset,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppColors.safe
      ..strokeWidth = 3.5
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final path = Path()
      ..moveTo(startOffset.dx, startOffset.dy)
      ..lineTo(endOffset.dx, endOffset.dy);

    canvas.drawPath(path, paint);

    final dotPaint = Paint()
      ..color = AppColors.safe
      ..style = PaintingStyle.fill;
    canvas.drawCircle(endOffset, 6.0, dotPaint);

    final startPaint = Paint()
      ..color = AppColors.primary
      ..style = PaintingStyle.fill;
    canvas.drawCircle(startOffset, 7.0, startPaint);
  }

  @override
  bool shouldRepaint(covariant RoutePathPainter oldDelegate) {
    return oldDelegate.startOffset != startOffset || oldDelegate.endOffset != endOffset;
  }
}

class InteractiveDigitalTwinMap extends StatelessWidget {
  final List<VenueZoneModel> zones;
  final VenueZoneModel? selectedZone;
  final String currentLocationZoneId;
  final ValueChanged<VenueZoneModel> onSelectZone;

  const InteractiveDigitalTwinMap({
    super.key,
    required this.zones,
    required this.selectedZone,
    required this.currentLocationZoneId,
    required this.onSelectZone,
  });

  Color _getRiskColor(String riskLevel) {
    switch (riskLevel.toUpperCase()) {
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

  IconData _getZoneIcon(String iconType, bool isExit) {
    if (isExit) return Icons.exit_to_app_rounded;
    switch (iconType) {
      case 'stage':
        return Icons.event_seat;
      case 'food':
        return Icons.fastfood_outlined;
      case 'medical':
        return Icons.medical_services_outlined;
      case 'vip':
        return Icons.stars_outlined;
      case 'parking':
        return Icons.local_parking_outlined;
      case 'restroom':
        return Icons.wc_outlined;
      default:
        return Icons.location_on_outlined;
    }
  }

  @override
  Widget build(BuildContext context) {
    final currentZone = zones.firstWhere(
      (z) => z.id == currentLocationZoneId,
      orElse: () => zones.first,
    );
    final exitZone = zones.firstWhere(
      (z) => z.id == 'zone_gate4',
      orElse: () => zones.last,
    );

    return LayoutBuilder(
      builder: (context, constraints) {
        final mapWidth = constraints.maxWidth;
        final mapHeight = mapWidth * 0.75;

        final startPos = Offset(currentZone.xPosition * mapWidth, currentZone.yPosition * mapHeight);
        final exitPos = Offset(exitZone.xPosition * mapWidth, exitZone.yPosition * mapHeight);

        return Container(
          width: mapWidth,
          height: mapHeight,
          decoration: BoxDecoration(
            color: const Color(0xFF1E293B),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border, width: 2),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.1),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(14),
            child: Stack(
              children: [
                Positioned.fill(
                  child: CustomPaint(
                    painter: GridPainter(),
                  ),
                ),
                CustomPaint(
                  size: Size(mapWidth, mapHeight),
                  painter: RoutePathPainter(
                    startOffset: startPos,
                    endOffset: exitPos,
                  ),
                ),
                ...zones.map((zone) {
                  final isSelected = selectedZone?.id == zone.id;
                  final isCurrentLoc = zone.id == currentLocationZoneId;
                  final zoneColor = _getRiskColor(zone.riskLevel);
                  final posX = zone.xPosition * mapWidth - 20;
                  final posY = zone.yPosition * mapHeight - 20;

                  return Positioned(
                    left: posX,
                    top: posY,
                    child: GestureDetector(
                      onTap: () => onSelectZone(zone),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        width: isSelected ? 46 : 40,
                        height: isSelected ? 46 : 40,
                        decoration: BoxDecoration(
                          color: zoneColor.withValues(alpha: 0.25),
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: isSelected ? Colors.white : zoneColor,
                            width: isSelected ? 3 : 2,
                          ),
                          boxShadow: isSelected
                              ? [
                                  BoxShadow(
                                    color: zoneColor.withValues(alpha: 0.6),
                                    blurRadius: 12,
                                    spreadRadius: 2,
                                  )
                                ]
                              : [],
                        ),
                        child: Center(
                          child: Icon(
                            isCurrentLoc ? Icons.person_pin_circle : _getZoneIcon(zone.iconType, zone.isExit),
                            color: isSelected ? Colors.white : zoneColor,
                            size: isSelected ? 24 : 20,
                          ),
                        ),
                      ),
                    ),
                  );
                }),
                Positioned(
                  top: 10,
                  left: 12,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.6),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.hub_outlined, color: AppColors.safe, size: 14),
                        SizedBox(width: 6),
                        Text(
                          'VENUE ZONE MAP',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class GridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white.withValues(alpha: 0.05)
      ..strokeWidth = 1.0;

    const step = 30.0;
    for (double x = 0; x < size.width; x += step) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }
    for (double y = 0; y < size.height; y += step) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
