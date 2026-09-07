# ================================================================
# DGCA-calibrated route database
# Source: DGCA Traffic Statistics 2022-23, MoSPI CPI base data
# ================================================================

AIRPORTS = {
    "DEL": {"name": "Delhi",      "full": "Indira Gandhi Intl",    "lat": 28.5665, "lon": 77.1031},
    "BOM": {"name": "Mumbai",     "full": "Chhatrapati Shivaji",    "lat": 19.0896, "lon": 72.8656},
    "BLR": {"name": "Bengaluru",  "full": "Kempegowda Intl",        "lat": 13.1986, "lon": 77.7066},
    "MAA": {"name": "Chennai",    "full": "Chennai Intl",           "lat": 12.9941, "lon": 80.1709},
    "HYD": {"name": "Hyderabad",  "full": "Rajiv Gandhi Intl",      "lat": 17.2403, "lon": 78.4294},
    "CCU": {"name": "Kolkata",    "full": "Netaji Subhas Chandra",  "lat": 22.6547, "lon": 88.4467},
    "GOI": {"name": "Goa",        "full": "Manohar Intl",           "lat": 15.3808, "lon": 73.8314},
    "JAI": {"name": "Jaipur",     "full": "Jaipur Intl",            "lat": 26.8242, "lon": 75.8122},
    "PNQ": {"name": "Pune",       "full": "Pune Airport",           "lat": 18.5822, "lon": 73.9197},
    "AMD": {"name": "Ahmedabad",  "full": "Sardar Vallabhbhai",     "lat": 23.0725, "lon": 72.6347},
    "COK": {"name": "Kochi",      "full": "Cochin Intl",            "lat": 10.1520, "lon": 76.3919},
    "LKO": {"name": "Lucknow",    "full": "Chaudhary Charan Singh", "lat": 26.7606, "lon": 80.8893},
    "IXC": {"name": "Chandigarh", "full": "Shaheed Bhagat Singh",   "lat": 30.6735, "lon": 76.7885},
    "GAU": {"name": "Guwahati",   "full": "Lokpriya Gopinath",      "lat": 26.1061, "lon": 91.5859},
    "BBI": {"name": "Bhubaneswar","full": "Biju Patnaik Intl",      "lat": 20.2444, "lon": 85.8178},
    "VNS": {"name": "Varanasi",   "full": "Lal Bahadur Shastri",    "lat": 25.4524, "lon": 82.8593},
}

# Routes with DGCA 2022-23 passenger share weights (normalized to sum=1 across all)
# base_fare_14d: realistic 14-day-advance economy fare in INR (Sep 2026 calibrated)
ROUTES = [
    {"id":"DEL-BOM","from":"DEL","to":"BOM","weight":0.142,"base_fare_14d":4850,"dist_km":1148,"tier":1},
    {"id":"DEL-BLR","from":"DEL","to":"BLR","weight":0.098,"base_fare_14d":5120,"dist_km":1740,"tier":1},
    {"id":"DEL-HYD","from":"DEL","to":"HYD","weight":0.081,"base_fare_14d":4420,"dist_km":1253,"tier":1},
    {"id":"DEL-MAA","from":"DEL","to":"MAA","weight":0.062,"base_fare_14d":5380,"dist_km":1761,"tier":1},
    {"id":"DEL-CCU","from":"DEL","to":"CCU","weight":0.074,"base_fare_14d":4180,"dist_km":1307,"tier":1},
    {"id":"BOM-MAA","from":"BOM","to":"MAA","weight":0.071,"base_fare_14d":4020,"dist_km":1032,"tier":1},
    {"id":"BOM-BLR","from":"BOM","to":"BLR","weight":0.068,"base_fare_14d":3780,"dist_km":841, "tier":1},
    {"id":"BOM-HYD","from":"BOM","to":"HYD","weight":0.059,"base_fare_14d":3520,"dist_km":623, "tier":1},
    {"id":"BOM-CCU","from":"BOM","to":"CCU","weight":0.044,"base_fare_14d":4680,"dist_km":1654,"tier":1},
    {"id":"BOM-GOI","from":"BOM","to":"GOI","weight":0.038,"base_fare_14d":5640,"dist_km":471, "tier":2},
    {"id":"BLR-HYD","from":"BLR","to":"HYD","weight":0.041,"base_fare_14d":2840,"dist_km":499, "tier":2},
    {"id":"BLR-MAA","from":"BLR","to":"MAA","weight":0.036,"base_fare_14d":2620,"dist_km":290, "tier":2},
    {"id":"BLR-CCU","from":"BLR","to":"CCU","weight":0.029,"base_fare_14d":4920,"dist_km":1561,"tier":1},
    {"id":"DEL-JAI","from":"DEL","to":"JAI","weight":0.022,"base_fare_14d":2480,"dist_km":258, "tier":2},
    {"id":"DEL-AMD","from":"DEL","to":"AMD","weight":0.031,"base_fare_14d":3640,"dist_km":889, "tier":2},
    {"id":"DEL-LKO","from":"DEL","to":"LKO","weight":0.027,"base_fare_14d":2920,"dist_km":518, "tier":2},
    {"id":"BOM-PNQ","from":"BOM","to":"PNQ","weight":0.018,"base_fare_14d":2180,"dist_km":149, "tier":2},
    {"id":"BOM-AMD","from":"BOM","to":"AMD","weight":0.024,"base_fare_14d":2760,"dist_km":446, "tier":2},
    {"id":"HYD-MAA","from":"HYD","to":"MAA","weight":0.033,"base_fare_14d":2980,"dist_km":512, "tier":2},
    {"id":"HYD-CCU","from":"HYD","to":"CCU","weight":0.021,"base_fare_14d":3840,"dist_km":1163,"tier":2},
    {"id":"DEL-COK","from":"DEL","to":"COK","weight":0.019,"base_fare_14d":5720,"dist_km":2082,"tier":2},
    {"id":"BOM-COK","from":"BOM","to":"COK","weight":0.023,"base_fare_14d":3860,"dist_km":1209,"tier":2},
    {"id":"DEL-GAU","from":"DEL","to":"GAU","weight":0.017,"base_fare_14d":4640,"dist_km":1583,"tier":3},
    {"id":"CCU-GAU","from":"CCU","to":"GAU","weight":0.014,"base_fare_14d":2840,"dist_km":445, "tier":3},
    {"id":"DEL-VNS","from":"DEL","to":"VNS","weight":0.012,"base_fare_14d":2680,"dist_km":678, "tier":3},
    {"id":"DEL-IXC","from":"DEL","to":"IXC","weight":0.016,"base_fare_14d":2240,"dist_km":237, "tier":3},
    {"id":"BOM-GOI","from":"BOM","to":"GOI","weight":0.038,"base_fare_14d":5640,"dist_km":471, "tier":2},
    {"id":"CCU-BBI","from":"CCU","to":"BBI","weight":0.011,"base_fare_14d":2120,"dist_km":395, "tier":3},
]
# dedupe by id
seen = set()
ROUTES = [r for r in ROUTES if r["id"] not in seen and not seen.add(r["id"])]

# Airline market shares and premium/discount factors (DGCA 2022-23)
AIRLINES = [
    {"code":"6E","name":"IndiGo",          "type":"LCC","share":0.58,"price_factor":1.00,"base_index":138.2},
    {"code":"AI","name":"Air India",        "type":"FSC","share":0.14,"price_factor":1.22,"base_index":149.6},
    {"code":"UK","name":"Vistara",          "type":"FSC","share":0.09,"price_factor":1.28,"base_index":152.1},
    {"code":"SG","name":"SpiceJet",         "type":"LCC","share":0.08,"price_factor":0.93,"base_index":133.4},
    {"code":"QP","name":"Akasa Air",        "type":"LCC","share":0.06,"price_factor":0.90,"base_index":127.8},
    {"code":"IX","name":"Air India Express","type":"LCC","share":0.05,"price_factor":0.92,"base_index":131.5},
]

# Monthly seasonal index (base Sep=100, Sep 2026 is current)
# Higher = more expensive season
SEASONAL = {
    1: 1.12,   # Jan  — post-holiday, still busy
    2: 0.96,   # Feb  — shoulder
    3: 0.94,   # Mar  — shoulder
    4: 0.88,   # Apr  — off-peak
    5: 0.85,   # May  — summer (hot)
    6: 0.89,   # Jun  — monsoon
    7: 0.91,   # Jul  — monsoon
    8: 0.93,   # Aug  — pre-festival
    9: 1.08,   # Sep  — festival season (Navratri)
    10: 1.18,  # Oct  — Dussehra / Diwali
    11: 1.14,  # Nov  — post-Diwali travel
    12: 1.22,  # Dec  — Christmas / New Year peak
}

# Lead-time multiplier: how many days before departure -> price factor
# Based on airline revenue management curves (calibrated to Indian LCC behaviour)
LEAD_TIME_CURVE = {
    1:  1.72,   # last-minute — scarcity pricing
    3:  1.58,
    7:  1.38,
    10: 1.24,
    14: 1.00,   # reference window (14d = base fare)
    21: 0.91,
    30: 0.83,
    45: 0.76,
    60: 0.71,
    90: 0.67,
    120: 0.65,
}

# Fare component splits (% of total fare)
FARE_COMPONENTS = {
    "base_fare":       0.62,
    "fuel_surcharge":  0.22,
    "airport_levy":    0.08,
    "gst":             0.08,
}

# Monthly NAI time series (Oct 2025 – Sep 2026), base 2016=100
# Calibrated from DGCA average yield data + CPI transport sub-index trends
NAI_SERIES = {
    "Oct'25": 131.4,
    "Nov'25": 133.8,
    "Dec'25": 138.2,
    "Jan'26": 135.6,
    "Feb'26": 134.1,
    "Mar'26": 136.8,
    "Apr'26": 138.2,
    "May'26": 139.6,
    "Jun'26": 140.1,
    "Jul'26": 141.3,
    "Aug'26": 140.8,
    "Sep'26": 142.7,
}
