"""
Slope-Shield AI — Input validation helpers.
"""
import re
from typing import Optional

EMAIL_REGEX = r"^[\w\.-]+@[\w\.-]+\.\w+$"

def is_valid_email(email: str) -> bool:
    """Validate email format."""
    return bool(re.match(EMAIL_REGEX, email))

def sanitize_string(text: Optional[str]) -> str:
    """Trim and remove suspicious null bytes or formatting."""
    if not text:
        return ""
    return text.strip().replace("\x00", "")
