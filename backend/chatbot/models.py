"""
chatbot/models.py
-----------------
Modelos Pydantic para el endpoint del chatbot.
"""

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    """Cuerpo de la petición al endpoint /chat."""

    session_id: str = Field(
        ...,
        description="Identificador único de sesión del usuario.",
        example="usuario_abc123",
    )
    message: str = Field(
        ...,
        description="Mensaje enviado por el usuario.",
        example="Quiero abrir un restaurante",
    )


class ChatResponse(BaseModel):
    """Respuesta del chatbot."""

    response: str = Field(
        ...,
        description="Respuesta generada por el chatbot usando RAG.",
    )


class SessionClearResponse(BaseModel):
    """Confirmación al eliminar una sesión."""

    message: str
