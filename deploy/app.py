"""
================================================================
RAPI — Single-file deployment
SIH 2026 | Problem No. 26056 | MoSPI

Flask serves:
  /              → index.html
  /explorer      → data-explorer.html
  /methodology   → methodology.html
  /static/...    → CSS, JS, assets
  /api/...       → All REST endpoints

Run locally:   python app.py
Deploy to:     Render · Railway · PythonAnywhere · Heroku
================================================================
"""

import os, sys, random
from datetime import datetime
from flask import Flask, render_template, jsonify, request, send_from_directory
from flask_cors import CORS

# Make sure data package is importable
sys.path.insert(0, os.path.dirname(__file__))

from data.scraper_sim import (
    get_national_index, get_nai_monthly_series, get_route_index,
    search_flights, get_elasticity_data, get_fare_components_by_window,
)
from data.routes import ROUTES, AIRLINES, AIRPORTS
from data.scraper_sim import get_fare

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)

PORT = int(os.environ.get('PORT', 5001))

# ════════════════════════════════════════
#  PAGE ROUTES
# ════════════════════════════════════════

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/explorer')
def explorer():
    return render_template('explorer.html')

@app.route('/methodology')
def methodology():
    return render_template('methodology.html')

# ════════════════════════════════════════
#  HELPERS
# ════════════════════════════════════════

def _mom(route_id, month):
    curr = get_route_index(route_id, month)
    prev = get_route_index(route_id, month - 1 if month > 1 else 12)
    if curr and prev and prev['index']:
        return round((curr['index'] - prev['index']) / prev['index'] * 100, 1)
    return 0.0

def _yoy(route_id):
    route = next((r for r in ROUTES if r['id'] == route_id), None)
    if not route: return 0.0
    base = 9.2 if route['tier'] == 1 else 6.8 if route['tier'] == 2 else 4.5
    random.seed(hash(route_id) % 999)
    return round(base + random.uniform(-1.5, 1.5), 1)

def _status(mom):
    if mom > 3:   return 'High'
    if mom > 0.5: return 'Medium'
    return 'Low'

# ════════════════════════════════════════
#  API ENDPOINTS
# ════════════════════════════════════════

@app.route('/api/status')
def api_status():
    return jsonify({
        'status': 'ok',
        'service': 'RAPI',
        'version': '1.0.0',
        'problem': 'SIH26056',
        'timestamp': datetime.now().isoformat(),
    })


@app.route('/api/nai')
def api_nai():
    month = request.args.get('month', datetime.now().month, type=int)
    nai  = get_national_index(month)
    prev = get_national_index(month - 1 if month > 1 else 12)
    mom  = round((nai['value'] - prev['value']) / prev['value'] * 100, 2)
    return jsonify({
        'index':        nai['value'],
        'month':        month,
        'base_year':    2016,
        'mom_change':   mom,
        'yoy_change':   9.7,
        'sources':      {'airlines': 6, 'ota_portals': 4, 'routes': len(ROUTES)},
        'last_updated': datetime.now().strftime('%d-%b-%Y %H:%M IST'),
    })


@app.route('/api/nai/series')
def api_nai_series():
    series = get_nai_monthly_series()
    labels = list(series.keys())
    values = list(series.values())
    sma = [None, None] + [
        round(sum(values[i-2:i+1]) / 3, 1) for i in range(2, len(values))
    ]
    return jsonify({'labels': labels, 'nai': values, 'sma_3m': sma})


@app.route('/api/routes')
def api_routes():
    month = request.args.get('month', datetime.now().month, type=int)
    limit = request.args.get('limit', 52, type=int)
    tier  = request.args.get('tier', None, type=int)
    results = []
    for route in ROUTES[:limit]:
        if tier and route['tier'] != tier:
            continue
        ri  = get_route_index(route['id'], month)
        mom = _mom(route['id'], month)
        yoy = _yoy(route['id'])
        if ri:
            results.append({
                'route':      route['id'],
                'from':       route['from'],
                'from_name':  AIRPORTS[route['from']]['name'],
                'to':         route['to'],
                'to_name':    AIRPORTS[route['to']]['name'],
                'index':      ri['index'],
                'avg_fare':   ri['avg_fare'],
                'mom_change': mom,
                'yoy_change': yoy,
                'status':     _status(mom),
                'weight':     route['weight'],
                'tier':       route['tier'],
                'dist_km':    route['dist_km'],
            })
    results.sort(key=lambda x: x['index'], reverse=True)
    return jsonify({'count': len(results), 'month': month, 'routes': results})


@app.route('/api/airlines')
def api_airlines():
    month = request.args.get('month', datetime.now().month, type=int)
    results = []
    for al in AIRLINES:
        random.seed(hash(al['code'] + str(month)) % 9999)
        results.append({
            'airline':      al['name'],
            'code':         al['code'],
            'type':         al['type'],
            'index':        al['base_index'],
            'mom_change':   round(random.uniform(-1.2, 3.8), 1),
            'yoy_change':   round(random.uniform(5.2, 13.4), 1),
            'market_share': round(al['share'] * 100, 1),
            'source':       'Official Portal + OTA',
        })
    return jsonify({'count': len(results), 'month': month, 'airlines': results})


@app.route('/api/search')
def api_search():
    origin = request.args.get('from', '').upper().strip()
    dest   = request.args.get('to',   '').upper().strip()
    lead   = request.args.get('lead', 14, type=int)
    cabin  = request.args.get('cabin', 'Economy')
    month  = request.args.get('month', datetime.now().month, type=int)

    if not origin or not dest:
        return jsonify({'error': "Both 'from' and 'to' required"}), 400
    if origin not in AIRPORTS or dest not in AIRPORTS:
        return jsonify({'error': f'Unknown airport. Valid: {sorted(AIRPORTS.keys())}'}), 400

    fares = search_flights(origin, dest, lead, cabin, month)
    if not fares:
        return jsonify({'found': 0, 'fares': [],
                        'message': f'No routes for {origin}–{dest}'}), 200

    min_fare = min(f['fare'] for f in fares)
    for f in fares:
        f['rating']   = 'Best Deal' if f['fare'] == min_fare else \
                        'Fair'      if f['fare'] < min_fare * 1.2 else 'High'
        f['fare_str'] = f"₹{f['fare']:,}"

    return jsonify({
        'found':     len(fares),
        'from':      origin,
        'to':        dest,
        'from_name': AIRPORTS[origin]['name'],
        'to_name':   AIRPORTS[dest]['name'],
        'lead_days': lead,
        'cabin':     cabin,
        'fares':     fares,
    })


@app.route('/api/elasticity/<route_id>')
def api_elasticity(route_id):
    month = request.args.get('month', datetime.now().month, type=int)
    data  = get_elasticity_data(route_id.upper(), month)
    if not data:
        return jsonify({'error': f'Route {route_id} not found'}), 404
    return jsonify({'route': route_id.upper(), 'month': month, 'points': data})


@app.route('/api/farecomponents/<route_id>')
def api_fare_components(route_id):
    month = request.args.get('month', datetime.now().month, type=int)
    data  = get_fare_components_by_window(route_id.upper(), month)
    if not data:
        return jsonify({'error': f'Route {route_id} not found'}), 404
    return jsonify({'route': route_id.upper(), 'month': month, 'windows': data})


@app.route('/api/airports')
def api_airports():
    return jsonify({'airports': AIRPORTS})


# ════════════════════════════════════════
#  START
# ════════════════════════════════════════

if __name__ == '__main__':
    print(f"""
╔══════════════════════════════════════════╗
║  RAPI  ·  SIH 2026  ·  Problem 26056    ║
╠══════════════════════════════════════════╣
║  Site  →  http://localhost:{PORT}           ║
║  API   →  http://localhost:{PORT}/api       ║
╚══════════════════════════════════════════╝
""")
    app.run(host='0.0.0.0', port=PORT, debug=False)
