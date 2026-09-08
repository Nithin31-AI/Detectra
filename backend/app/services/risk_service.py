from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class RiskExplanation:
    score: float
    base_value: float
    contributions: dict[str, float]


class RiskScoringService:
    def score(self, features: dict[str, float], model) -> RiskExplanation:
        names = list(features)
        values = [[features[name] for name in names]]
        prediction = float(model.predict_proba(values)[0][1]) if hasattr(model, "predict_proba") else float(model.predict(values)[0])
        try:
            import shap

            explainer = shap.Explainer(model)
            explanation = explainer(values)
            contributions = {name: float(explanation.values[0][index]) for index, name in enumerate(names)}
            base_value = float(explanation.base_values[0])
        except (ImportError, AttributeError, TypeError, ValueError):
            contributions = {name: 0.0 for name in names}
            base_value = prediction
        return RiskExplanation(score=max(0.0, min(1.0, prediction)), base_value=base_value, contributions=contributions)
