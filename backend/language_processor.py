import logging
import re

from langdetect import DetectorFactory, LangDetectException, detect

try:
    from dialect_mapper import DialectMapper
    from diacritic_remover import ArabicTextNormalizer
except ModuleNotFoundError:
    from .dialect_mapper import DialectMapper
    from .diacritic_remover import ArabicTextNormalizer

DetectorFactory.seed = 0


class LanguageProcessor:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.dialect_mapper = DialectMapper()
        self.arabic_normalizer = ArabicTextNormalizer()

    def _has_arabic(self, text: str) -> bool:
        return bool(re.search(r"[\u0600-\u06FF]", text))

    def _has_latin(self, text: str) -> bool:
        return bool(re.search(r"[A-Za-z]", text))

    def detect_language(self, text: str) -> str:
        stripped_text = text.strip()
        if not stripped_text:
            return "unknown"

        has_arabic = self._has_arabic(stripped_text)
        has_latin = self._has_latin(stripped_text)

        if has_arabic and has_latin:
            return "mixed"
        if has_arabic and not has_latin:
            return "ar"
        if has_latin and not has_arabic and len(stripped_text) < 4:
            return "en"

        try:
            detected_language = detect(stripped_text)
        except LangDetectException:
            if has_arabic:
                return "ar"
            if has_latin:
                return "en"
            return "unknown"

        if detected_language.startswith("ar"):
            return "ar"
        if detected_language.startswith("en"):
            return "en"
        if has_arabic and has_latin:
            return "mixed"
        return detected_language

    def process_query(self, text: str) -> dict:
        detected_language = self.detect_language(text)
        has_arabic = self._has_arabic(text)
        should_normalize_arabic = detected_language in {"ar", "mixed"} or has_arabic

        dialect_found = False
        normalized_terms: list[dict] = []
        dialect_normalized_text = text
        processed_query = text

        if should_normalize_arabic:
            dialect_found = self.dialect_mapper.contains_dialect_words(text)
            dialect_normalized_text, normalized_terms = self.dialect_mapper.normalize_text(text)
            processed_query = self.arabic_normalizer.normalize_text(dialect_normalized_text)

        metadata = {
            "detected_language": detected_language,
            "contains_arabic": has_arabic,
            "contains_latin": self._has_latin(text),
            "dialect_found": dialect_found,
            "normalized_terms": normalized_terms,
            "original_query": text,
            "dialect_normalized_query": dialect_normalized_text,
            "processed_query": processed_query,
        }

        self.logger.info("Language processing metadata: %s", metadata)
        return metadata