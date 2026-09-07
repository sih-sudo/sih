# ================================================================
# Fare Simulation Engine
# Mimics what the real scraper would produce after collecting
# fare data from airline portals and OTA platforms.
# All figures calibrated to real Indian domestic fare ranges.
# ================================================================

import random
import math
from datetime import datetime, timedelta
from .routes import ROUTES, AIRLINES, SEASONAL, LEAD_TIME_CURVE, FARE_COMPONENTS, NAI_SERIES


def _lead_multiplier(days: int) -> float:
    """Interpolate between known lead-time curve points."""
    keys = sorted(LEAD_TIME_CURVE.keys())
    if days <= keys[0]:
        return LEAD_TIME_CURVE[keys[0]]
    if days >= keys[-1]:
        return LEAD_TIME_CURVE[keys[-1]]
    for i in range(len(keys) - 1):
        lo, hi = keys[i], keys[i + 1]
        if lo <= days <= hi:
            t = (days - lo) / (hi - lo)
            return LEAD_TIME_CURVE[lo] + t * (LEAD_TIME_CURVE[hi] - LEAD_TIME_CURVE[lo])
    return 1.0


def get_fare(route_id: str, airline_code: str, lead_days: int,
             travel_month: int = None, cabin: str = "Economy") -> dict:
    """
    Compute a realistic fare for a given route, airline, and booking window.
    Returns dict with total and component breakdown.
    """
    route = next((r for r in ROUTES if r["id"] == route_id), None)
    airline = next((a for a in AIRLINES if a["code"] == airline_code), None)
    if not route or not airline:
        return None

    month = travel_month or datetime.now().month
    seasonal_factor = SEASONAL.get(month, 1.0)
    lead_factor = _lead_multiplier(lead_days)
    airline_factor = airline["price_factor"]
    cabin_factor = 2.45 if cabin == "Business" else 1.0

    # Small random noise to simulate real OTA variance (±4%)
    noise = 1 + random.uniform(-0.04, 0.04)

    raw_total = (
        route["base_fare_14d"]
        * seasonal_factor
        * lead_factor
        * airline_factor
        * cabin_factor
        * noise
    )

    # Round to nearest 10
    total = round(raw_total / 10) * 10

    # Component breakdown
    components = {
        "base_fare":       round(total * FARE_COMPONENTS["base_fare"]),
        "fuel_surcharge":  round(total * FARE_COMPONENTS["fuel_surcharge"]),
        "airport_levy":    round(total * FARE_COMPONENTS["airport_levy"]),
        "gst":             round(total * FARE_COMPONENTS["gst"]),
        "total":           total,
    }

    return {
        "route":       route_id,
        "from":        route["from"],
        "to":          route["to"],
        "airline":     airline["name"],
        "airline_code": airline_code,
        "type":        airline["type"],
        "cabin":       cabin,
        "lead_days":   lead_days,
        "travel_month": month,
        "fare":        total,
        "components":  components,
        "dist_km":     route["dist_km"],
        "tier":        route["tier"],
    }


def get_all_fares(lead_days: int = 14, travel_month: int = None,
                   cabin: str = "Economy") -> list:
    """Return fares for all routes × all airlines at given lead time."""
    results = []
    month = travel_month or datetime.now().month
    for route in ROUTES:
        for airline in AIRLINES:
            f = get_fare(route["id"], airline["code"], lead_days, month, cabin)
            if f:
                results.append(f)
    return results


def get_route_index(route_id: str, travel_month: int = None) -> dict:
    """
    Compute weighted route index value at 14-day lead time.
    Weight airlines by market share.
    """
    route = next((r for r in ROUTES if r["id"] == route_id), None)
    if not route:
        return None

    month = travel_month or datetime.now().month
    weighted_fare = 0
    total_share = 0
    for airline in AIRLINES:
        f = get_fare(route_id, airline["code"], 14, month)
        if f:
            weighted_fare += f["fare"] * airline["share"]
            total_share += airline["share"]

    avg_fare = weighted_fare / total_share if total_share else 0

    # Base year 2016 average fare for this route (back-calculated from NAI base)
    # We use the current fare / (current NAI / 100) to get base
    current_nai = 142.7
    base_fare_2016 = route["base_fare_14d"] / (current_nai / 100)
    index_value = (avg_fare / base_fare_2016) * 100

    return {
        "route":       route_id,
        "from":        route["from"],
        "to":          route["to"],
        "index":       round(index_value, 1),
        "avg_fare":    round(avg_fare),
        "weight":      route["weight"],
        "tier":        route["tier"],
        "dist_km":     route["dist_km"],
    }


def get_national_index(travel_month: int = None) -> dict:
    """Compute weighted National Airfare Index."""
    month = travel_month or datetime.now().month
    weighted_sum = 0
    total_weight = 0
    for route in ROUTES:
        ri = get_route_index(route["id"], month)
        if ri:
            weighted_sum += ri["index"] * route["weight"]
            total_weight += route["weight"]

    nai = weighted_sum / total_weight if total_weight else 0
    return {
        "value": round(nai, 1),
        "month": month,
        "base_year": 2016,
    }


def get_elasticity_data(route_id: str, travel_month: int = None) -> list:
    """Return lead-time vs index curve for a specific route."""
    month = travel_month or datetime.now().month
    results = []
    lead_days_list = [1, 3, 7, 10, 14, 21, 30, 45, 60, 90, 120]
    route = next((r for r in ROUTES if r["id"] == route_id), None)
    if not route:
        return []

    current_nai = 142.7
    base_fare_2016 = route["base_fare_14d"] / (current_nai / 100)

    for lead in lead_days_list:
        # weighted avg across airlines
        wf, ws = 0, 0
        for airline in AIRLINES:
            f = get_fare(route_id, airline["code"], lead, month)
            if f:
                wf += f["fare"] * airline["share"]
                ws += airline["share"]
        avg_fare = wf / ws if ws else 0
        index_val = (avg_fare / base_fare_2016) * 100
        results.append({
            "lead_days": lead,
            "avg_fare":  round(avg_fare),
            "index":     round(index_val, 1),
        })
    return results


def get_fare_components_by_window(route_id: str, travel_month: int = None) -> list:
    """Return fare component breakdown across booking windows."""
    month = travel_month or datetime.now().month
    results = []
    windows = [1, 7, 14, 30, 60]
    for w in windows:
        # Use IndiGo (dominant carrier) as representative
        f = get_fare(route_id, "6E", w, month)
        if f:
            results.append({
                "window": w,
                "label":  f"{w}d",
                **f["components"],
            })
    return results


def get_nai_monthly_series() -> dict:
    """Return the 12-month NAI series."""
    return NAI_SERIES


def search_flights(origin: str, destination: str, lead_days: int = 14,
                   cabin: str = "Economy", travel_month: int = None) -> list:
    """Search fares for a specific O-D pair across all airlines."""
    month = travel_month or datetime.now().month
    route_id = f"{origin}-{destination}"
    # Check both directions
    fares = []
    for rid in [route_id, f"{destination}-{origin}"]:
        route = next((r for r in ROUTES if r["id"] == rid), None)
        if route:
            for airline in AIRLINES:
                f = get_fare(rid, airline["code"], lead_days, month, cabin)
                if f:
                    fares.append(f)
            break

    if not fares:
        return []

    fares.sort(key=lambda x: x["fare"])
    return fares
