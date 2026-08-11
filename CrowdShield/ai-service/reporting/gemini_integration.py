import json
from typing import Any, Dict

from google import genai
from google.genai import types
from config.settings import settings
from utils.logger import logger


class GeminiAnalyzer:
    """Generates AI insights using Google Gemini API based on pipeline results."""

    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        if self.api_key:
            self.client = genai.Client(api_key=self.api_key)
            self.model_id = 'gemini-3.6-flash'
        else:
            self.client = None

    def _get_default_response(self) -> Dict[str, Any]:
        return {
            "incident_summary": "Gemini API integration is disabled or failed.",
            "ai_recommendations": ["No AI recommendations available."],
            "multilingual_announcements": {
                "en": "No announcement available.",
                "hi": "कोई घोषणा उपलब्ध नहीं है।"
            }
        }

    def analyze(self, incident_report: Dict[str, Any]) -> Dict[str, Any]:
        """Send incident report data to Gemini and return structured insights."""
        if not self.client:
            logger.warning("Gemini API key is not set. Skipping AI analysis.")
            return self._get_default_response()

        logger.info("Generating Gemini AI analysis...")

        prompt = (
            "You are an AI assistant for a crowd management system called CrowdShield. "
            "Based on the following incident report data, generate three things:\n"
            "1. 'incident_summary': A concise summary of the event.\n"
            "2. 'ai_recommendations': A list of actionable crowd control recommendations.\n"
            "3. 'multilingual_announcements': Public announcements in English ('en') and Hindi ('hi').\n\n"
            "Respond ONLY with a valid JSON object matching this schema:\n"
            "{\n"
            "  \"incident_summary\": \"...\",\n"
            "  \"ai_recommendations\": [\"...\"],\n"
            "  \"multilingual_announcements\": {\"en\": \"...\", \"hi\": \"...\"}\n"
            "}\n\n"
            f"Incident Report Data:\n{json.dumps(incident_report, indent=2)}"
        )

        try:
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
            
            result_text = response.text
            if not result_text:
                raise ValueError("Empty response from Gemini")
                
            parsed = json.loads(result_text)
            
            # Ensure the structure is correct
            return {
                "incident_summary": parsed.get("incident_summary", "Summary unavailable."),
                "ai_recommendations": parsed.get("ai_recommendations", ["No recommendations."]),
                "multilingual_announcements": parsed.get("multilingual_announcements", {
                    "en": "No announcement available.",
                    "hi": "कोई घोषणा उपलब्ध नहीं है।"
                })
            }
            
        except Exception as exc:
            logger.error(f"Gemini API analysis failed: {exc}", exc_info=True)
            return self._get_default_response()
