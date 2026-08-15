from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional, Union
import cv2
import numpy as np

from config.settings import settings
from utils.logger import logger


@dataclass
class HeatmapMetadata:
    """Metadata container for generated crowd heatmap frames."""
    generated_frames: int
    heatmaps_directory: str
    generated_files: List[str]

    def to_dict(self) -> Dict[str, Any]:
        """Convert heatmap metadata instance to dictionary."""
        return asdict(self)


class HeatmapGenerator:
    """Production-ready Crowd Density Heatmap Engine using OpenCV & NumPy."""

    def __init__(
        self,
        output_base_dir: Optional[Union[str, Path]] = None,
        gaussian_kernel_size: int = 51,
        alpha: float = 0.6,
        beta: float = 0.4
    ) -> None:
        self.gaussian_kernel_size = (
            gaussian_kernel_size if gaussian_kernel_size % 2 == 1 else gaussian_kernel_size + 1
        )
        self.alpha = alpha
        self.beta = beta

        if output_base_dir:
            self.output_base_dir = Path(output_base_dir).resolve()
        else:
            self.output_base_dir = Path(settings.OUTPUTS_DIR).resolve() / "heatmaps"

        # Dynamically compute single person Gaussian blur peak value for consistent density scaling.
        # This prevents single isolated persons from appearing as maximum-red critical hotspots.
        dummy = np.zeros((self.gaussian_kernel_size, self.gaussian_kernel_size), dtype=np.float32)
        dummy[self.gaussian_kernel_size // 2, self.gaussian_kernel_size // 2] = 1.0
        blurred = cv2.GaussianBlur(dummy, (self.gaussian_kernel_size, self.gaussian_kernel_size), 10.0)
        self.single_person_peak = float(np.max(blurred))
        
        # Target single value scaling is handled dynamically in generate_heatmaps_from_tracks
        # using offset + controlled scale.

    def generate_heatmaps_from_tracks(
        self,
        frames_dir: Union[str, Path],
        tracking_result: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generate crowd density heatmaps for each video frame based on tracking bounding box centers.

        Overlays COLORMAP_JET heatmaps on top of the original extracted frames.
        """
        logger.info("Starting heatmap generation...")
        frames_path = Path(frames_dir).resolve()
        if not frames_path.exists() or not frames_path.is_dir():
            logger.error(f"Frames directory not found for heatmap generation: '{frames_path}'")
            raise FileNotFoundError(f"Frames directory does not exist: {frames_path}")

        video_name = frames_path.name
        heatmaps_dir = self.output_base_dir / video_name
        heatmaps_dir.mkdir(parents=True, exist_ok=True)

        tracks = tracking_result.get("tracks", [])
        tracks_by_frame: Dict[str, List[List[int]]] = {}
        for track in tracks:
            frame_name = track.get("frame", "")
            bbox = track.get("bbox", [])
            if frame_name and len(bbox) == 4:
                if frame_name not in tracks_by_frame:
                    tracks_by_frame[frame_name] = []
                tracks_by_frame[frame_name].append(bbox)

        frame_files = sorted(list(frames_path.glob("*.jpg")) + list(frames_path.glob("*.png")))
        if not frame_files:
            logger.warning(f"No image frames found in directory for heatmap: '{frames_path}'")

        generated_files: List[str] = []
        generated_count = 0

        for frame_file in frame_files:
            frame_img = cv2.imread(str(frame_file))
            if frame_img is None:
                logger.warning(f"Failed to read frame image for heatmap generation: '{frame_file.name}'")
                continue

            h, w = frame_img.shape[:2]
            density_map = np.zeros((h, w), dtype=np.float32)

            frame_bboxes = tracks_by_frame.get(frame_file.name, [])

            for bbox in frame_bboxes:
                x1, y1, x2, y2 = bbox
                center_x = max(0, min(w - 1, (x1 + x2) // 2))
                center_y = max(0, min(h - 1, (y1 + y2) // 2))
                density_map[center_y, center_x] += 1.0

            if len(frame_bboxes) > 0:
                density_map = cv2.GaussianBlur(
                    density_map,
                    (self.gaussian_kernel_size, self.gaussian_kernel_size),
                    10.0
                )
                
                # Scale density values relative to a single person peak using a power-law mapping.
                # Smoothly scales from 0.0 to green (110.0) and yellow (160.0), avoiding step-jump artifacts.
                if self.single_person_peak > 0:
                    density_ratio = density_map / self.single_person_peak
                    # 110.0 maps 1 person (ratio 1.0) to GREEN.
                    # 0.8 exponent maps 4 nearby people (ratio around 1.6-1.8) to clearly YELLOW (~160).
                    # Higher density ratios naturally progress to ORANGE and RED.
                    density_map = 110.0 * np.power(density_ratio, 0.8)
                    density_map = np.clip(density_map, 0.0, 255.0)

            density_uint8 = density_map.astype(np.uint8)
            heatmap_color = cv2.applyColorMap(density_uint8, cv2.COLORMAP_JET)

            overlay = cv2.addWeighted(frame_img, self.alpha, heatmap_color, self.beta, 0)

            if frame_file.name.startswith("frame_"):
                heatmap_filename = f"heatmap_{frame_file.name[6:]}"
            else:
                heatmap_filename = f"heatmap_{frame_file.name}"

            output_heatmap_path = heatmaps_dir / heatmap_filename
            cv2.imwrite(str(output_heatmap_path), overlay)

            generated_files.append(heatmap_filename)
            generated_count += 1
            logger.debug(f"Heatmap generated for frame {frame_file.name} -> {heatmap_filename}")

        logger.info(
            f"Heatmap generation completed for '{video_name}': "
            f"{generated_count} heatmaps generated in '{heatmaps_dir}'"
        )

        metadata = HeatmapMetadata(
            generated_frames=generated_count,
            heatmaps_directory=str(heatmaps_dir),
            generated_files=generated_files
        )
        return metadata.to_dict()
