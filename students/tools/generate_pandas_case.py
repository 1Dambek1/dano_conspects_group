"""Create reproducible synthetic survey waves for the pandas case workshop."""

from pathlib import Path
import random

import pandas as pd


OUT = Path(__file__).resolve().parents[1] / "practice" / "data"
OUT.mkdir(parents=True, exist_ok=True)
rng = random.Random(20261124)

districts = pd.DataFrame(
    [
        (1, "Центральный", "центр", 83000),
        (2, "Речной", "север", 51000),
        (3, "Лесной", "север", 47000),
        (4, "Восточный", "восток", 62000),
        (5, "Солнечный", "восток", 39000),
        (6, "Портовый", "юг", 55000),
        (7, "Горный", "юг", 33000),
        (8, "Западный", "запад", 71000),
    ],
    columns=["district_id", "district_name", "zone", "population"],
)
districts.to_csv(OUT / "survey_districts.csv", index=False)

base_district = {i: rng.randint(1, 8) for i in range(1, 151)}
base_mode = {i: rng.choice(["bus", "tram", "metro"]) for i in range(1, 151)}
district_delay = {1: -8, 2: 1, 3: 5, 4: 4, 5: -2, 6: 7, 7: 9, 8: 0, 99: 12}
mode_delay = {"bus": 7, "tram": 0, "metro": -5}


def wave(ids, shift, rename_minutes=False):
    rows = []
    for ident in ids:
        district = base_district[ident]
        if shift and ident % 29 == 0:
            district = 99  # district absent from lookup: merge audit exercise
        mode = base_mode[ident]
        minutes = max(8, round(30 + district_delay[district] + mode_delay[mode] - 3 * shift + rng.gauss(0, 8), 1))
        if ident % 17 == 0:
            minutes = None
        satisfaction = min(5, max(1, round(4.5 - (minutes or 40) / 28 + rng.gauss(0, .55))))
        if ident % 23 == 0:
            satisfaction = None
        rows.append((f"R{ident:04d}", district, mode, minutes, satisfaction))
    columns = ["respondent_id", "district_id", "mode", "travel_minutes" if rename_minutes else "travel_min", "satisfaction"]
    return pd.DataFrame(rows, columns=columns)


september = wave(range(1, 121), 0)
october = wave(range(31, 151), 1, rename_minutes=True)
october = pd.concat([october, october.iloc[[12]]], ignore_index=True)  # exact duplicate to find
september.to_csv(OUT / "survey_september.csv", index=False)
october.to_csv(OUT / "survey_october.csv", index=False)

if __name__ == "__main__":
    print("September", september.shape, "October", october.shape, "districts", districts.shape)
