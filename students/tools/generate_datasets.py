"""Rebuild the fictional student case-study datasets deterministically."""

from __future__ import annotations

import csv
import math
import random
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1] / "datasets"
ROOT.mkdir(parents=True, exist_ok=True)
rng = random.Random(20261115)


def write_csv(name: str, columns: list[str], rows: list[dict]) -> None:
    with (ROOT / name).open("w", encoding="utf-8-sig", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=columns)
        writer.writeheader()
        writer.writerows(rows)
    print(f"{name}: {len(rows)} rows")


def weighted_choice(options: list[tuple[int, float]]) -> int:
    value = rng.random()
    cumulative = 0.0
    for outcome, probability in options:
        cumulative += probability
        if value < cumulative:
            return outcome
    return options[-1][0]


# Case 1: exact waiting-time distributions and an observational travel log.
bus = [(0, 0.08), (2, 0.14), (4, 0.22), (6, 0.26), (8, 0.18), (10, 0.12)]
metro = [(0, 0.20), (1, 0.30), (3, 0.30), (5, 0.20)]
pmf_rows = [
    {"stage": stage, "wait_min": wait, "probability": probability}
    for stage, options in (("bus", bus), ("metro", metro))
    for wait, probability in options
]
write_csv("01_wait_distribution.csv", ["stage", "wait_min", "probability"], pmf_rows)

travel_log = []
for i in range(1200):
    rush = 1 if rng.random() < 0.38 else 0
    rain = 1 if rng.random() < 0.24 else 0
    bus_wait = weighted_choice(bus)
    metro_wait = weighted_choice(metro)
    # Rush hour and rain introduce delays after the independent scheduled waits.
    extra = (rng.choice([0, 2, 4, 6]) if rush else 0) + (rng.choice([0, 2, 3]) if rain else 0)
    total = 29 + bus_wait + metro_wait + extra
    travel_log.append({
        "trip_id": f"T{i + 1:04d}",
        "rush_hour": rush,
        "rain": rain,
        "bus_wait_min": bus_wait,
        "metro_wait_min": metro_wait,
        "extra_delay_min": extra,
        "total_time_min": total,
        "late_38min": int(total > 38),
    })
write_csv(
    "01_travel_log.csv",
    ["trip_id", "rush_hour", "rain", "bus_wait_min", "metro_wait_min",
     "extra_delay_min", "total_time_min", "late_38min"],
    travel_log,
)


# Case 2: nested regressions, confounding, scaling, diagnostics and overfitting.
districts = ["Набережная", "Университет", "Старый центр", "Промзона"]
district_shift = {"Набережная": 6.0, "Университет": 3.0, "Старый центр": 1.0, "Промзона": -5.0}
route_rows = []
for i in range(420):
    district = rng.choice(districts)
    district_bias = district_shift[district]
    landmarks = min(8, max(0, round(rng.gauss(3.0 + district_bias / 4, 1.7))))
    wayfinding = min(10, max(1, round(rng.gauss(5.2 + landmarks * 0.42, 1.5), 1)))
    route_length = round(max(1.2, rng.gauss(5.0 + landmarks * 0.35, 1.7)), 1)
    night_cost = round(max(3.5, rng.gauss(9.5 + district_bias * 0.28 + route_length * 0.2, 1.8)), 1)
    noise = rng.gauss(0, 5.0)
    rating = 36 + 3.2 * wayfinding + 2.1 * landmarks - 0.7 * night_cost + district_bias + noise
    if i in {35, 91, 178, 266, 372}:
        rating -= 24  # real but unusual negative experiences, for diagnostics
    rating = round(min(100, max(0, rating)), 1)
    route_rows.append({
        "route_id": f"R{i + 1:04d}",
        "district": district,
        "wayfinding_score": wayfinding,
        "landmarks_n": landmarks,
        "night_cost": "" if i % 29 == 0 else night_cost,
        "route_length_km": route_length,
        "route_rating": rating,
    })
write_csv(
    "02_night_routes.csv",
    ["route_id", "district", "wayfinding_score", "landmarks_n", "night_cost",
     "route_length_km", "route_rating"],
    route_rows,
)


# Case 3: residents, location optimization, votes, revenue and fairness.
areas = {
    "Набережная": (2.5, 3.0, 19.0),
    "Центр": (5.2, 5.5, 24.0),
    "Университет": (7.8, 3.3, 32.0),
}
residents = []
for i in range(720):
    area = rng.choices(list(areas), weights=[0.34, 0.42, 0.24], k=1)[0]
    cx, cy, base_willingness = areas[area]
    x = round(min(10, max(0, rng.gauss(cx, 1.15))), 3)
    y = round(min(10, max(0, rng.gauss(cy, 1.05))), 3)
    willingness = round(max(10.0, rng.gauss(base_willingness, 3.8)), 2)
    residents.append({
        "resident_id": f"P{i + 1:04d}",
        "district": area,
        "x": x,
        "y": y,
        "willingness_A": willingness,
    })
write_csv("03_residents.csv", ["resident_id", "district", "x", "y", "willingness_A"], residents)


# Case 4: city locations, home prices and a travel-time matrix.
city_names = [
    "Старый порт", "Лесной мыс", "Северная бухта", "Каменный сад",
    "Белый берег", "Тихая роща", "Золотой мост", "Речной квартал",
    "Тёплые холмы", "Парк огней", "Лунная площадь", "Новая верфь",
    "Полярный двор", "Янтарное поле", "Вишнёвый берег", "Синий холм",
    "Маячная", "Дальний проспект", "Озерки", "Южный вокзал",
    "Сосновый остров", "Облачная", "Улица мастеров", "Жемчужная",
    "Ледяной мост", "Солнечная", "Театральная", "Шёлковый квартал",
]
city_positions = [(0.0, 0.0)]
for i in range(1, len(city_names)):
    side = -1 if i % 2 else 1
    x = round(side * rng.uniform(1.2, 12.5), 2)
    y = round(rng.uniform(-8.5, 8.5), 2)
    city_positions.append((x, y))


def minutes_between(i: int, j: int) -> int:
    if i == j:
        return 0
    x1, y1 = city_positions[i]
    x2, y2 = city_positions[j]
    distance = math.hypot(x1 - x2, y1 - y2)
    crosses_river = x1 * x2 < 0
    # The capital has an express bridge, so its connections are faster.
    bridge_penalty = 28 if crosses_river and 0 not in (i, j) else 0
    rail_bonus = -15 if {i, j} & {6, 19} else 0
    return max(5, round(6 + 6.5 * distance + bridge_penalty + rail_bonus))


cities = []
for i, name in enumerate(city_names):
    x, y = city_positions[i]
    cities.append({
        "city_id": f"C{i:03d}",
        "city_name": name,
        "x": x,
        "y": y,
        "river_side": "центр" if i == 0 else ("запад" if x < 0 else "восток"),
        "amenity_index": round(7.5 if i == 0 else rng.uniform(2.0, 8.0), 1),
    })
write_csv("04_cities.csv", ["city_id", "city_name", "x", "y", "river_side", "amenity_index"], cities)

homes = []
for i, city in enumerate(cities):
    time_to_center = minutes_between(0, i)
    base_per_sqm = max(48, 305 - 1.35 * time_to_center + 9 * city["amenity_index"])
    for j in range(rng.randint(35, 55)):
        area = round(rng.uniform(25, 118), 1)
        rooms = min(5, max(1, round(area / 26 + rng.gauss(0, 0.45))))
        age = rng.randint(0, 70)
        price = round(area * base_per_sqm * (1 - 0.002 * age) * rng.uniform(0.82, 1.18), 1)
        homes.append({
            "home_id": f"H{i:03d}-{j + 1:03d}",
            "city_id": city["city_id"],
            "area_sqm": area,
            "rooms": rooms,
            "building_age": age,
            "price_thousand": price,
        })
write_csv(
    "04_homes.csv",
    ["home_id", "city_id", "area_sqm", "rooms", "building_age", "price_thousand"],
    homes,
)

times = []
for i, origin in enumerate(cities):
    for j, destination in enumerate(cities):
        times.append({
            "origin_id": origin["city_id"],
            "destination_id": destination["city_id"],
            "travel_min": minutes_between(i, j),
        })
write_csv("04_travel_times.csv", ["origin_id", "destination_id", "travel_min"], times)

# Case 5: positive slopes within both groups, negative slope when pooled.
# A separate seed preserves the first four datasets across rebuilds.
simpson_rng = random.Random(20261116)
simpson_rows = []
for number in range(1, 101):
    group = "A" if number <= 50 else "B"
    if group == "A":
        x = round(simpson_rng.uniform(2.0, 5.0), 2)
        y = round(68 + 1.6 * x + simpson_rng.gauss(0, 1.05), 2)
    else:
        x = round(simpson_rng.uniform(6.0, 10.0), 2)
        y = round(24 + 3.5 * x + simpson_rng.gauss(0, 1.35), 2)
    simpson_rows.append({"id": number, "group": group, "X": x, "Y": y})
write_csv("05_simpson.csv", ["id", "group", "X", "Y"], simpson_rows)

assert abs(sum(row["probability"] for row in pmf_rows if row["stage"] == "bus") - 1) < 1e-9
assert abs(sum(row["probability"] for row in pmf_rows if row["stage"] == "metro") - 1) < 1e-9
assert len({row["route_id"] for row in route_rows}) == len(route_rows)
assert len({row["resident_id"] for row in residents}) == len(residents)
assert len({row["home_id"] for row in homes}) == len(homes)
