import os
import logging
from logging.handlers import RotatingFileHandler
from config.settings import settings


def configure_logging() -> logging.Logger:
    """Configure application-wide logging system."""
    settings.setup_directories()
    
    log_level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)
    log_format = logging.Formatter(
        "[%(asctime)s] [%(levelname)s] [%(name)s]: %(message)s"
    )
    
    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)
    root_logger.handlers.clear()

    # Console Handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(log_format)
    console_handler.setLevel(log_level)
    root_logger.addHandler(console_handler)

    # File Handler
    log_file_path = os.path.join(settings.LOGS_DIR, "ai_service.log")
    file_handler = RotatingFileHandler(
        log_file_path,
        maxBytes=10 * 1024 * 1024,
        backupCount=5,
        encoding="utf-8"
    )
    file_handler.setFormatter(log_format)
    file_handler.setLevel(log_level)
    root_logger.addHandler(file_handler)

    logger = logging.getLogger("ai_service")
    return logger
