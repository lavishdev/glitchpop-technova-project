import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../core/theme/app_colors.dart';
import '../providers/sos_provider.dart';

class SOSHoldButton extends StatelessWidget {
  final SOSStatus status;
  final int countdownSeconds;
  final VoidCallback onHoldStart;
  final VoidCallback onHoldRelease;

  const SOSHoldButton({
    super.key,
    required this.status,
    required this.countdownSeconds,
    required this.onHoldStart,
    required this.onHoldRelease,
  });

  @override
  Widget build(BuildContext context) {
    final isHolding = status == SOSStatus.holding;
    final isSending = status == SOSStatus.sending;

    return GestureDetector(
      onTapDown: (_) => onHoldStart(),
      onTapUp: (_) => onHoldRelease(),
      onTapCancel: () => onHoldRelease(),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        width: 190,
        height: 190,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: const LinearGradient(
            colors: [Color(0xFFFF3B30), Color(0xFFC01C12)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          boxShadow: [
            BoxShadow(
              color: AppColors.danger.withValues(alpha: isHolding ? 0.8 : 0.4),
              blurRadius: isHolding ? 30 : 18,
              spreadRadius: isHolding ? 10 : 4,
            ),
          ],
        ),
        child: Center(
          child: isSending
              ? const Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    CircularProgressIndicator(color: Colors.white, strokeWidth: 3),
                    SizedBox(height: 12),
                    Text(
                      'Dispatching...',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                    ),
                  ],
                )
              : Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.sos_rounded, color: Colors.white, size: 44),
                    const SizedBox(height: 4),
                    Text(
                      isHolding ? '$countdownSeconds' : 'HOLD FOR 3S',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: isHolding ? 28 : 14,
                        fontWeight: FontWeight.w800,
                        letterSpacing: isHolding ? 0 : 1,
                      ),
                    ),
                    if (!isHolding) ...[
                      const SizedBox(height: 4),
                      Text(
                        'PRESS & HOLD',
                        style: TextStyle(
                          color: Colors.white.withValues(alpha: 0.8),
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ],
                ),
        ),
      ).animate(target: isHolding ? 1 : 0).scale(begin: const Offset(1, 1), end: const Offset(1.08, 1.08)),
    );
  }
}
