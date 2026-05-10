import json
import logging
import re
from pathlib import Path


class DialectMapper:
    def __init__(self, glossary_path: str | None = None):
        self.logger = logging.getLogger(__name__)
        self.glossary_path = Path(glossary_path) if glossary_path else Path(__file__).with_name("dialect_glossary.json")
        self.glossary = self._load_glossary()
        self.patterns = self._build_patterns()

    def _load_glossary(self) -> dict:
        with self.glossary_path.open("r", encoding="utf-8") as glossary_file:
            return json.load(glossary_file)

    def _build_patterns(self) -> list[dict]:
        entries: list[tuple[str, str, str]] = []
        for section_name, section_items in self.glossary.items():
            for source_term, target_term in section_items.items():
                entries.append((source_term, target_term, section_name))

        entries.sort(key=lambda item: len(item[0]), reverse=True)

        patterns = []
        for source_term, target_term, section_name in entries:
            pattern = re.compile(rf"(?<![\w\u0640]){re.escape(source_term)}(?![\w\u0640])", re.IGNORECASE)
            patterns.append(
                {
                    "source": source_term,
                    "target": target_term,
                    "section": section_name,
                    "pattern": pattern,
                }
            )
        return patterns

    def detect_dialect_terms(self, text: str) -> list[dict]:
        matches: list[dict] = []
        for entry in self.patterns:
            if entry["pattern"].search(text):
                matches.append(
                    {
                        "source": entry["source"],
                        "target": entry["target"],
                        "section": entry["section"],
                    }
                )
        return matches

    def contains_dialect_words(self, text: str) -> bool:
        return bool(self.detect_dialect_terms(text))

    def normalize_text(self, text: str) -> tuple[str, list[dict]]:
        normalized_text = text
        applied_replacements: list[dict] = []

        for entry in self.patterns:
            pattern = entry["pattern"]
            replacements = pattern.findall(normalized_text)
            if not replacements:
                continue

            normalized_text = pattern.sub(entry["target"], normalized_text)
            applied_replacements.append(
                {
                    "source": entry["source"],
                    "target": entry["target"],
                    "section": entry["section"],
                    "count": len(replacements),
                }
            )

        if applied_replacements:
            self.logger.info("Dialect normalization applied: %s", applied_replacements)

        return normalized_text, applied_replacements