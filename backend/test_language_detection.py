from langdetect import detect, DetectorFactory

#Make result consistent
DetectorFactory.seed = 0

test_inputs = [
    "what is the maximum pressure for a wellhead?",
    "ما هي الحد الأقصى للضغط لرأس البئر?",
    "وين البير؟",
    "What are the emergency shutdown procedures for a well control incident?",
    "ما هي إجراءات الطوارئ عند حدوث انفجار في البئر؟"
]
