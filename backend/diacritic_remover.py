import re

from pyarabic.araby import strip_tashkeel


class ArabicTextNormalizer:
    _character_map = str.maketrans(
        {
            "أ": "ا",
            "إ": "ا",
            "آ": "ا",
            "ٱ": "ا",
            "ى": "ي",
            "ـ": "",
        }
    )

    def normalize_text(self, text: str, normalize_taa_marbuta: bool = False) -> str:
        normalized_text = strip_tashkeel(text)
        normalized_text = normalized_text.translate(self._character_map)
        if normalize_taa_marbuta:
            normalized_text = normalized_text.replace("ة", "ه")
        normalized_text = re.sub(r"\s+", " ", normalized_text).strip()
        return normalized_text