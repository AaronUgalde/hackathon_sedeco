"""
chatbot/memory.py
-----------------
Gestión de memoria conversacional por sesión.

Almacena un motor de chat LlamaIndex por cada session_id en memoria RAM.
El motor ya contiene internamente el ChatMemoryBuffer de LlamaIndex,
por lo que guardar el motor ES guardar la memoria.

Para producción: reemplazar el dict por Redis u otro store persistente.
"""

from typing import Dict, Any

# Diccionario en memoria: session_id → chat_engine
# Tipo "Any" porque el engine se importa desde rag_engine para evitar imports circulares
_sessions: Dict[str, Any] = {}


def get_session(session_id: str) -> Any | None:
    """Devuelve el motor de chat de una sesión activa, o None si no existe."""
    return _sessions.get(session_id)


def set_session(session_id: str, engine: Any) -> None:
    """Registra un nuevo motor de chat para la sesión indicada."""
    _sessions[session_id] = engine


def clear_session(session_id: str) -> bool:
    """
    Elimina la sesión del almacén.
    Retorna True si existía, False si no.
    """
    if session_id in _sessions:
        del _sessions[session_id]
        return True
    return False


def active_sessions() -> list[str]:
    """Retorna la lista de session_ids activos (útil para debugging)."""
    return list(_sessions.keys())
