"""Check the released CSVs for the four student cases."""

import csv
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "datasets"


def read(name):
    with (DATA / name).open(encoding="utf-8-sig", newline="") as file:
        return list(csv.DictReader(file))


pmf = read("01_wait_distribution.csv")
for stage in ("bus", "metro"):
    rows = [row for row in pmf if row["stage"] == stage]
    assert len(rows) >= 4
    assert abs(sum(float(row["probability"]) for row in rows) - 1) < 1e-10
    assert len({row["wait_min"] for row in rows}) == len(rows)

trips = read("01_travel_log.csv")
assert len(trips) == 1200
assert len({row["trip_id"] for row in trips}) == len(trips)
for row in trips:
    expected = 29 + sum(int(row[key]) for key in ("bus_wait_min", "metro_wait_min", "extra_delay_min"))
    assert int(row["total_time_min"]) == expected
    assert int(row["late_38min"]) == (expected > 38)
assert set(row["rush_hour"] for row in trips) == {"0", "1"}
assert set(row["rain"] for row in trips) == {"0", "1"}

routes = read("02_night_routes.csv")
assert len(routes) == 420
assert len({row["route_id"] for row in routes}) == len(routes)
assert 5 <= sum(not row["night_cost"] for row in routes) <= 20
assert len({row["district"] for row in routes}) == 4
assert all(0 <= float(row["route_rating"]) <= 100 for row in routes)

residents = read("03_residents.csv")
assert len(residents) == 720
assert len({row["resident_id"] for row in residents}) == len(residents)
assert len({row["district"] for row in residents}) == 3
assert all(0 <= float(row[axis]) <= 10 for row in residents for axis in ("x", "y"))

cities = read("04_cities.csv")
homes = read("04_homes.csv")
times = read("04_travel_times.csv")
city_ids = {row["city_id"] for row in cities}
assert len(cities) == 28 and len(city_ids) == 28
assert len(homes) >= 1000
assert len({row["home_id"] for row in homes}) == len(homes)
assert all(row["city_id"] in city_ids and float(row["price_thousand"]) > 0 for row in homes)
assert len(times) == len(cities) ** 2
lookup = {(row["origin_id"], row["destination_id"]): int(row["travel_min"]) for row in times}
assert len(lookup) == len(times)
assert all(lookup[(a, b)] == lookup[(b, a)] for a, b in lookup)
assert all(lookup[(city, city)] == 0 for city in city_ids)
assert Counter(row["city_id"] for row in homes).keys() == city_ids

for filename in ("case-01.md", "case-02.md", "case-03.md", "case-04.md"):
    assert (ROOT / "assignments" / filename).is_file()

print("PASS: four cases, seven CSVs, assignment files, keys and numeric invariants")
