import 'package:flutter/material.dart';
import '../../theme/app_colors.dart';

/// Reusable Circular Loader
class CircularLoader extends StatelessWidget {
  final Color? color;
  final double size;

  const CircularLoader({
    super.key,
    this.color,
    this.size = 36.0,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: SizedBox(
        width: size,
        height: size,
        child: CircularProgressIndicator(
          color: color ?? AppColors.primary,
          strokeWidth: 3.0,
        ),
      ),
    );
  }
}

/// Reusable Skeleton Card
class SkeletonCard extends StatelessWidget {
  final double height;
  final double width;

  const SkeletonCard({
    super.key,
    this.height = 100,
    this.width = double.infinity,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: height,
      width: width,
      margin: const EdgeInsets.symmetric(vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.skeleton.withValues(alpha:0.5),
        borderRadius: BorderRadius.circular(12),
      ),
    );
  }
}

/// Reusable Loading Overlay
class LoadingOverlay extends StatelessWidget {
  final bool isLoading;
  final Widget child;

  const LoadingOverlay({
    super.key,
    required this.isLoading,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        child,
        if (isLoading)
          Container(
            color: Colors.black.withValues(alpha:0.3),
            child: const CircularLoader(),
          ),
      ],
    );
  }
}
