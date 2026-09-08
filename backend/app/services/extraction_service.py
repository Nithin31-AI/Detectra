from dataclasses import dataclass
from io import BytesIO


@dataclass(frozen=True, slots=True)
class ExtractedEntity:
    text: str
    label: str
    start: int
    end: int


class ReportExtractionService:
    def extract_pdf_text(self, content: bytes) -> str:
        import pdfplumber

        with pdfplumber.open(BytesIO(content)) as pdf:
            return "\n".join(page.extract_text() or "" for page in pdf.pages)

    def extract_entities(self, text: str, model_name: str = "en_core_web_sm") -> list[ExtractedEntity]:
        import spacy

        nlp = spacy.load(model_name)
        return [ExtractedEntity(entity.text, entity.label_, entity.start_char, entity.end_char) for entity in nlp(text).ents]

    def normalize_entities(self, entities: list[ExtractedEntity]) -> dict[str, list[str]]:
        aliases = {"PERSON": "person", "PHONE": "phone", "IP": "ip", "WALLET": "wallet", "GPE": "location", "ORG": "organization"}
        result: dict[str, list[str]] = {}
        for entity in entities:
            result.setdefault(aliases.get(entity.label, entity.label.lower()), []).append(entity.text)
        return result
