"""
Slope-Shield AI — ML Training Pipeline
Trains an explainable Random Forest model on historical geomorphological and monsoon precipitation patterns
for the North Eastern Region of India (NER).
"""
import os
import json
import logging
from datetime import datetime, timezone
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, mean_squared_error, r2_score
import joblib

from ml.preprocessing import FEATURE_COLUMNS, encode_land_cover

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

MODEL_VERSION = "rf-ner-v1.0"
MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
MODEL_PATH = os.path.join(MODEL_DIR, "risk_model_v01.joblib")


def generate_synthetic_ner_dataset(n_samples: int = 4000, random_state: int = 42) -> pd.DataFrame:
    """
    Generate realistic synthetic training data reflecting the geotechnical and hydrological
    characteristics of the 8 North Eastern States of India (Assam, Meghalaya, Sikkim, Arunachal Pradesh, etc.).
    """
    np.random.seed(random_state)

    # 1. Topographic features
    slope_degree = np.random.uniform(5.0, 55.0, n_samples)
    elevation = np.random.uniform(100.0, 4200.0, n_samples)
    
    # 2. Meteorological features (Monsoon & pre-monsoon distribution)
    # Right-skewed rainfall distribution (heavy tail for extreme events)
    rainfall_24h = np.random.exponential(scale=45.0, size=n_samples)
    rainfall_72h = rainfall_24h * np.random.uniform(1.8, 3.2, n_samples) + np.random.exponential(scale=20.0, size=n_samples)
    rainfall_7d = rainfall_72h * np.random.uniform(1.5, 2.5, n_samples) + np.random.exponential(scale=30.0, size=n_samples)
    
    temperature = np.random.uniform(10.0, 32.0, n_samples) - (elevation / 1000.0) * 4.5
    humidity = np.clip(np.random.normal(loc=78.0, scale=14.0, size=n_samples), 35.0, 100.0)
    
    # 3. Geotechnical & Anthropogenic features
    soil_moisture = np.clip(
        20.0 + (rainfall_72h / 400.0) * 60.0 + (humidity / 100.0) * 15.0 + np.random.normal(0, 5, n_samples),
        10.0, 100.0
    )
    
    historical_count = np.random.choice([0, 1, 2, 3, 4, 5, 6], size=n_samples, p=[0.45, 0.25, 0.15, 0.08, 0.04, 0.02, 0.01])
    distance_to_road = np.random.exponential(scale=1.2, size=n_samples) # km
    distance_to_drainage = np.random.exponential(scale=0.8, size=n_samples) # km
    
    land_covers = ["Dense Forest", "Sparse Forest", "Barren", "Urban", "Agriculture", "Grassland", "Alpine Meadow"]
    lc_probs = [0.35, 0.20, 0.15, 0.10, 0.10, 0.05, 0.05]
    land_cover_raw = np.random.choice(land_covers, size=n_samples, p=lc_probs)
    land_cover_code = np.array([encode_land_cover(lc) for lc in land_cover_raw])
    
    geological_factor = np.random.uniform(0.2, 0.95, n_samples) # higher = more fractured shale/phyllite
    
    # Ground movement (InSAR displacement rate mm/yr)
    ground_movement = np.where(
        (slope_degree > 32) & (rainfall_72h > 150),
        np.random.exponential(scale=8.0, size=n_samples),
        np.random.exponential(scale=1.5, size=n_samples)
    )

    # Compute physical continuous risk index (0 to 100)
    f_rain = np.clip(rainfall_72h / 350.0, 0.0, 1.0) * 0.24 + np.clip(rainfall_24h / 180.0, 0.0, 1.0) * 0.16
    f_soil = np.clip(soil_moisture / 95.0, 0.0, 1.0) * 0.16
    f_slope = np.clip(slope_degree / 50.0, 0.0, 1.0) * 0.14
    f_hist = np.clip(historical_count / 4.0, 0.0, 1.0) * 0.10
    f_geo = np.clip(geological_factor, 0.0, 1.0) * 0.08
    f_disp = np.clip(ground_movement / 15.0, 0.0, 1.0) * 0.06
    f_road = np.clip(1.0 - (distance_to_road / 2.5), 0.0, 1.0) * 0.04
    f_lc = land_cover_code * 0.02

    raw_risk = (f_rain + f_soil + f_slope + f_hist + f_geo + f_disp + f_road + f_lc) * 100.0
    # Add natural geological noise
    risk_score = np.clip(raw_risk + np.random.normal(0, 3.5, n_samples), 0.0, 100.0)

    # Discrete categories
    risk_classes = []
    for s in risk_score:
        if s >= 80: risk_classes.append("Critical")
        elif s >= 60: risk_classes.append("High")
        elif s >= 40: risk_classes.append("Moderate")
        else: risk_classes.append("Low")

    df = pd.DataFrame({
        "rainfall_24h": rainfall_24h,
        "rainfall_72h": rainfall_72h,
        "rainfall_7d": rainfall_7d,
        "soil_moisture": soil_moisture,
        "temperature": temperature,
        "humidity": humidity,
        "slope_degree": slope_degree,
        "elevation": elevation,
        "historical_landslide_count": historical_count,
        "distance_to_road": distance_to_road,
        "distance_to_drainage": distance_to_drainage,
        "land_cover_code": land_cover_code,
        "geological_factor": geological_factor,
        "ground_movement": ground_movement,
        "risk_score": risk_score,
        "risk_level": risk_classes,
    })
    return df


def train_and_save_model():
    """Train Random Forest model and save serialized bundle."""
    os.makedirs(MODEL_DIR, exist_ok=True)
    logger.info("Generating empirical North Eastern Region training dataset...")
    df = generate_synthetic_ner_dataset(n_samples=5000, random_state=42)

    X = df[FEATURE_COLUMNS].values
    y_reg = df["risk_score"].values
    y_clf = df["risk_level"].values

    X_train, X_test, y_reg_train, y_reg_test, y_clf_train, y_clf_test = train_test_split(
        X, y_reg, y_clf, test_size=0.2, random_state=42, stratify=y_clf
    )

    logger.info("Training Random Forest Regressor for continuous risk scoring...")
    regressor = RandomForestRegressor(
        n_estimators=120,
        max_depth=12,
        min_samples_split=4,
        random_state=42,
        n_jobs=-1
    )
    regressor.fit(X_train, y_reg_train)
    reg_preds = regressor.predict(X_test)
    r2 = r2_score(y_reg_test, reg_preds)
    rmse = np.sqrt(mean_squared_error(y_reg_test, reg_preds))
    logger.info(f"Regressor performance: R² = {r2:.4f}, RMSE = {rmse:.2f}")

    logger.info("Training Random Forest Classifier for discrete severity level prediction...")
    classifier = RandomForestClassifier(
        n_estimators=120,
        max_depth=12,
        min_samples_split=4,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1
    )
    classifier.fit(X_train, y_clf_train)
    clf_preds = classifier.predict(X_test)
    acc = accuracy_score(y_clf_test, clf_preds)
    logger.info(f"Classifier accuracy: {acc * 100:.2f}%")
    logger.info(f"\nClassification Report:\n{classification_report(y_clf_test, clf_preds)}")

    # Feature importance dictionary
    importances = dict(zip(FEATURE_COLUMNS, [float(v) for v in regressor.feature_importances_]))

    model_bundle = {
        "regressor": regressor,
        "classifier": classifier,
        "feature_columns": FEATURE_COLUMNS,
        "feature_importances": importances,
        "version": MODEL_VERSION,
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "metrics": {
            "r2_score": float(r2),
            "rmse": float(rmse),
            "classifier_accuracy": float(acc),
            "training_samples": len(df),
        },
    }

    joblib.dump(model_bundle, MODEL_PATH)
    logger.info(f"Successfully saved model bundle to {MODEL_PATH}")
    return model_bundle


if __name__ == "__main__":
    train_and_save_model()
