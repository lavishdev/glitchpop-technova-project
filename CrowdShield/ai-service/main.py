from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config.settings import settings
from utils.logger import logger
from api.routes import router as api_router


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Lifespan event handler managing startup and shutdown tasks."""
    logger.info("Initializing CrowdShield AI Service...")
    settings.setup_directories()
    logger.info(f"Service initialized: {settings.SERVICE_NAME} v{settings.VERSION}")
    logger.info(f"Operational mode: DEBUG={settings.DEBUG}")

    yield

    logger.info("Shutting down CrowdShield AI Service...")
    logger.info("CrowdShield AI Service shutdown complete.")


app = FastAPI(
    title=settings.SERVICE_NAME,
    version=settings.VERSION,
    debug=settings.DEBUG,
    lifespan=lifespan
)

# CORS Middleware Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catch-all global exception handler for unexpected runtime errors."""
    logger.error(f"Unhandled exception on path {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred."}
    )


# Register API Routers
app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
