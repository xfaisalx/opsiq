import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "backend"))

from dialect_mapper import DialectMapper
from diacritic_remover import ArabicTextNormalizer
from language_processor import LanguageProcessor


class DialectMapperTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.mapper = DialectMapper()

    def test_colloquial_question_word_normalized(self):
        normalized, replacements = self.mapper.normalize_text("وش إجراءات السلامة؟")
        self.assertEqual(normalized, "ماذا إجراءات السلامة؟")
        self.assertEqual(replacements[0]["source"], "وش")

    def test_location_query_normalized(self):
        normalized, _ = self.mapper.normalize_text("وين البير")
        self.assertEqual(normalized, "أين البئر")

    def test_workplace_colloquial_normalized(self):
        normalized, _ = self.mapper.normalize_text("الحين الشفت جاهز")
        self.assertEqual(normalized, "الآن المناوبة مستعد")

    def test_technical_term_normalized(self):
        normalized, _ = self.mapper.normalize_text("افحص سيفتي فالف عند راس البير")
        self.assertEqual(normalized, "افحص صمام أمان عند رأس البئر")

    def test_lockout_tagout_normalized(self):
        normalized, _ = self.mapper.normalize_text("طبق لوتو قبل الصيانة")
        self.assertEqual(normalized, "طبق العزل ووضع بطاقة تحذير قبل الصيانة")

    def test_boundary_awareness_prevents_partial_replacement(self):
        normalized, replacements = self.mapper.normalize_text("موجود الضغط طبيعي")
        self.assertEqual(normalized, "موجود الضغط طبيعي")
        self.assertEqual(replacements, [])

    def test_contains_dialect_words_true(self):
        self.assertTrue(self.mapper.contains_dialect_words("وشلون وضع البير؟"))

    def test_contains_dialect_words_false(self):
        self.assertFalse(self.mapper.contains_dialect_words("ما هو ضغط البئر؟"))


class ArabicTextNormalizerTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.normalizer = ArabicTextNormalizer()

    def test_diacritics_removed(self):
        self.assertEqual(self.normalizer.normalize_text("إجْراءَاتُ السَّلامَةِ"), "اجراءات السلامة")

    def test_alef_variants_normalized(self):
        self.assertEqual(self.normalizer.normalize_text("آبار وإجراءات وأمن"), "ابار واجراءات وامن")

    def test_alef_maqsura_normalized(self):
        self.assertEqual(self.normalizer.normalize_text("مستوى"), "مستوي")

    def test_tatweel_removed(self):
        self.assertEqual(self.normalizer.normalize_text("الســلامة"), "السلامة")

    def test_optional_taa_marbuta_normalization(self):
        self.assertEqual(self.normalizer.normalize_text("سلامة", normalize_taa_marbuta=True), "سلامه")


class LanguageProcessorTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.processor = LanguageProcessor()

    def test_arabic_query_processed(self):
        result = self.processor.process_query("وين البير")
        self.assertEqual(result["detected_language"], "ar")
        self.assertTrue(result["dialect_found"])
        self.assertEqual(result["processed_query"], "اين البئر")

    def test_english_query_passes_through(self):
        result = self.processor.process_query("What is the maximum pressure for a wellhead?")
        self.assertEqual(result["detected_language"], "en")
        self.assertFalse(result["dialect_found"])
        self.assertEqual(result["processed_query"], "What is the maximum pressure for a wellhead?")

    def test_mixed_query_processed_without_breaking_english(self):
        result = self.processor.process_query("وين pressure gauge في البير")
        self.assertEqual(result["detected_language"], "mixed")
        self.assertEqual(result["processed_query"], "اين pressure gauge في البئر")

    def test_short_arabic_query_detected(self):
        result = self.processor.process_query("وين؟")
        self.assertEqual(result["detected_language"], "ar")
        self.assertEqual(result["processed_query"], "اين؟")

    def test_short_english_query_detected(self):
        result = self.processor.process_query("ESD")
        self.assertEqual(result["detected_language"], "en")
        self.assertEqual(result["processed_query"], "ESD")

    def test_phrase_normalization_metadata_recorded(self):
        result = self.processor.process_query("طبق اغلاق طوارئ الحين")
        self.assertTrue(result["dialect_found"])
        self.assertEqual(result["processed_query"], "طبق ايقاف طارئ الان")
        self.assertGreaterEqual(len(result["normalized_terms"]), 2)

    def test_technical_arabic_variation_processed(self):
        result = self.processor.process_query("صمام الامان في راس البير")
        self.assertEqual(result["processed_query"], "صمام الامان في راس البئر")

    def test_no_arabic_symbols_keeps_query_unchanged(self):
        result = self.processor.process_query("Lockout tagout procedure for compressor")
        self.assertEqual(result["processed_query"], "Lockout tagout procedure for compressor")


if __name__ == "__main__":
    unittest.main(verbosity=2)