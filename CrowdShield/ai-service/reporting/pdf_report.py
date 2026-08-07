import textwrap
from pathlib import Path
from typing import Any, Dict

from fpdf import FPDF
from utils.logger import logger


class PDFReportGenerator:
    """Generates a structured PDF Incident Report using FPDF2."""

    def __init__(self, output_dir: str = "outputs/reports"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def _add_section(self, pdf: FPDF, title: str, content: str):
        pdf.set_x(pdf.l_margin)
        pdf.set_font("Helvetica", style="B", size=14)
        pdf.set_text_color(0, 51, 102)
        pdf.cell(0, 10, title, new_x="LMARGIN", new_y="NEXT")
        
        pdf.set_x(pdf.l_margin)
        pdf.set_font("Helvetica", size=11)
        pdf.set_text_color(0, 0, 0)
        # Ensure we wrap the text properly using multi_cell
        pdf.multi_cell(0, 8, content, new_x="LMARGIN", new_y="NEXT")
        pdf.ln(5)

    def _add_list_section(self, pdf: FPDF, title: str, items: list):
        pdf.set_x(pdf.l_margin)
        pdf.set_font("Helvetica", style="B", size=14)
        pdf.set_text_color(0, 51, 102)
        pdf.cell(0, 10, title, new_x="LMARGIN", new_y="NEXT")
        
        pdf.set_font("Helvetica", size=11)
        pdf.set_text_color(0, 0, 0)
        
        if not items:
            pdf.set_x(pdf.l_margin)
            pdf.multi_cell(0, 8, "None", new_x="LMARGIN", new_y="NEXT")
            pdf.ln(5)
            return

        for item in items:
            pdf.set_x(pdf.l_margin)
            pdf.multi_cell(0, 8, f"- {item}", new_x="LMARGIN", new_y="NEXT")
        pdf.ln(5)

    def generate_pdf(self, incident_report: Dict[str, Any], upload_info: Dict[str, Any]) -> str:
        """Generate PDF report and return the file path."""
        logger.info("Generating PDF Incident Report...")

        video_name = upload_info.get("filename", "unknown_video")
        pdf_filename = f"{video_name}_report.pdf"
        pdf_path = self.output_dir / pdf_filename

        pdf = FPDF()
        # Enable auto page break to prevent overflowing content
        pdf.set_auto_page_break(auto=True, margin=15)
        pdf.add_page()
        
        # Header
        pdf.set_font("Helvetica", style="B", size=20)
        pdf.set_text_color(200, 0, 0)
        pdf.cell(0, 15, "CrowdShield AI Incident Report", new_x="LMARGIN", new_y="NEXT", align="C")
        pdf.line(10, pdf.get_y(), 200, pdf.get_y())
        pdf.ln(10)

        # Summary
        self._add_section(pdf, "Executive Summary", incident_report.get("summary", "No summary available."))

        # Upload Details
        upload_content = (
            f"Filename: {upload_info.get('filename')}\n"
            f"File Size: {upload_info.get('file_size')} bytes\n"
            f"Content Type: {upload_info.get('content_type')}"
        )
        self._add_section(pdf, "Upload Details", upload_content)

        # Statistics
        stats_content = (
            f"Frames Processed: {incident_report.get('frames_processed', 0)}\n"
            f"Total People Detected: {incident_report.get('people_detected', 0)}\n"
            f"Highest Crowd Density: {incident_report.get('highest_density', 'UNKNOWN')}\n"
            f"Overall Risk Score: {incident_report.get('risk_score', 0.0)}\n"
            f"Overall Risk Level: {incident_report.get('overall_risk', 'UNKNOWN')}"
        )
        self._add_section(pdf, "Processing Statistics", stats_content)

        # Recommendations
        self._add_list_section(pdf, "Recommendations", incident_report.get("recommendations", []))

        # Alerts
        alerts = incident_report.get("alerts", [])
        pdf.set_x(pdf.l_margin)
        pdf.set_font("Helvetica", style="B", size=14)
        pdf.set_text_color(0, 51, 102)
        pdf.cell(0, 10, "Alerts", new_x="LMARGIN", new_y="NEXT")
        
        pdf.set_font("Helvetica", size=11)
        pdf.set_text_color(0, 0, 0)

        if not alerts:
            pdf.set_x(pdf.l_margin)
            pdf.multi_cell(0, 8, "No active alerts.", new_x="LMARGIN", new_y="NEXT")
        else:
            for alert in alerts:
                pdf.set_x(pdf.l_margin)
                pdf.set_font("Helvetica", style="B", size=11)
                pdf.multi_cell(0, 6, f"[{alert.get('severity', 'INFO')}] {alert.get('title', 'Alert')}", new_x="LMARGIN", new_y="NEXT")
                
                pdf.set_x(pdf.l_margin)
                pdf.set_font("Helvetica", size=11)
                alert_body = f"Time: {alert.get('timestamp')}\nMessage: {alert.get('message')}\nRisk Score: {alert.get('risk_score')}"
                pdf.multi_cell(0, 6, alert_body, new_x="LMARGIN", new_y="NEXT")
                pdf.ln(3)

        pdf.output(str(pdf_path))
        logger.info(f"PDF Incident Report generated at '{pdf_path}'")
        
        return str(pdf_path.resolve())
