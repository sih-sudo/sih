/* ================================================================
   RAPI — Main JS  (API-driven, no hardcoded data)
   SIH 2026 | Problem No. 26056 | MoSPI
   ================================================================ */
'use strict';

/* ── Font size ── */
const BASE_FONT = 15; let curFont = BASE_FONT;
function changeFontSize(d) {
  if (d===1&&curFont<20) curFont++; else if (d===-1&&curFont>12) curFont--; else if (d===0) curFont=BASE_FONT;
  document.documentElement.style.fontSize = curFont+'px';
}

/* ── Nav ── */
function toggleNav() { document.getElementById('nav-list').classList.toggle('open'); }

/* ══════════════════════════════
   TRANSLATIONS
   ══════════════════════════════ */
const I18N = {
  en: {
    'txt-gov-name':'Government of India | Ministry of Statistics & Programme Implementation',
    'txt-site-title':'Real-Time Airfare Price Index',
    'txt-site-subtitle':'Ministry of Statistics & Programme Implementation · Govt of India',
    'txt-site-tag':'CPI Augmentation · SIH 2026 · Problem No. 26056',
    'nav-home':'Home','nav-explorer':'Data Explorer','nav-methodology':'Methodology',
    'nav-search':'Fare Search','nav-charts':'Analytics','nav-about':'About','nav-contact':'Contact',
    'kpi-nai-label':'National Airfare Index','kpi-airlines-label':'Airlines',
    'kpi-ota-label':'OTA Portals','kpi-routes-label':'Route Pairs','kpi-cpi-label':'CPI Weight',
    'search-heading':'Search Live Fares','search-sub':'Real-time fare data across airlines and booking windows',
    'lbl-from':'From','lbl-to':'To','lbl-date':'Date','lbl-class':'Class','lbl-window':'Booking Window',
    'btn-search':'Search',
    'chart-nai-title':'National Airfare Index — Monthly Trend',
    'chart-routes-title':'Top Routes','chart-airline-title':'Airline Index',
    'chart-elasticity-title':'Lead Time Elasticity','chart-elasticity-sub':'Fare index vs days before departure',
    'chart-farecomp-title':'Fare Components','chart-farecomp-sub':'Base · Fuel · Airport · GST by booking window',
    'tbl-route-heading':'Route-wise Airfare Index','tbl-airline-heading':'Airline-wise Airfare Index',
    'info-obj-title':'Objective','info-min-title':'Sponsoring Ministry',
    'info-data-title':'Data Collection','info-index-title':'Index Construction',
    'info-obj-body':'Develop a real-time Airfare Price Index for India by automated web scraping of airline and OTA portals to augment the existing Consumer Price Index (CPI) with an Air Transport sub-component.',
    'info-min-body':'MoSPI — Ministry of Statistics & Programme Implementation, Government of India. This index will directly feed into the CPI calculation framework managed by MoSPI.',
    'info-data-body':'Automated scrapers collect fare data from 6 domestic airlines and 4 OTA platforms (MakeMyTrip, Cleartrip, Ixigo, EaseMyTrip) on a 24-hour cycle covering 52 route pairs across India.',
    'info-index-body':'Laspeyres-type formula, base year 2016=100. Fares normalized by cabin, booking window and seasonality. Routes weighted by DGCA annual passenger traffic data.',
    'footer-about-heading':'About the Portal','footer-links-heading':'Quick Links',
    'footer-related-heading':'Related Portals','footer-contact-heading':'Contact',
    'footer-about-body':'Real-Time Airfare Price Index developed under Smart India Hackathon 2026 (SIH26056) in collaboration with MoSPI.',
    'footer-address1':'Ministry of Statistics & PI','footer-address2':'Sardar Patel Bhawan, Sansad Marg',
    'footer-address3':'New Delhi – 110001','footer-email':'📧 airindex@mospi.gov.in','footer-phone':'📞 011-23074696',
    'footer-copyright':'© 2026 MoSPI, Government of India. All Rights Reserved.',
    'footer-terms':'Terms','footer-privacy':'Privacy','footer-disclaimer':'Disclaimer',
    'ql-home':'Home','ql-explorer':'Data Explorer','ql-methodology':'Methodology','ql-api':'API Access','ql-opendata':'Open Data',
    'rp-mospi':'MoSPI Official','rp-sih':'Smart India Hackathon','rp-digitalindia':'Digital India','rp-ogd':'Open Govt Data',
  },
  hi: {
    'txt-gov-name':'भारत सरकार | सांख्यिकी एवं कार्यक्रम कार्यान्वयन मंत्रालय',
    'txt-site-title':'रियल-टाइम हवाई किराया मूल्य सूचकांक',
    'txt-site-subtitle':'सांख्यिकी एवं कार्यक्रम कार्यान्वयन मंत्रालय · भारत सरकार',
    'txt-site-tag':'CPI संवर्धन · SIH 2026 · समस्या संख्या 26056',
    'nav-home':'होम','nav-explorer':'डेटा एक्सप्लोरर','nav-methodology':'पद्धति',
    'nav-search':'किराया खोज','nav-charts':'विश्लेषण','nav-about':'हमारे बारे में','nav-contact':'संपर्क',
    'kpi-nai-label':'राष्ट्रीय हवाई किराया सूचकांक','kpi-airlines-label':'एयरलाइनें',
    'kpi-ota-label':'OTA पोर्टल','kpi-routes-label':'मार्ग युग्म','kpi-cpi-label':'CPI भार',
    'search-heading':'लाइव किराया खोजें','search-sub':'एयरलाइनों और बुकिंग विंडो में रियल-टाइम किराए',
    'lbl-from':'प्रस्थान','lbl-to':'गंतव्य','lbl-date':'तिथि','lbl-class':'श्रेणी','lbl-window':'बुकिंग विंडो',
    'btn-search':'खोजें',
    'chart-nai-title':'राष्ट्रीय हवाई किराया सूचकांक — मासिक प्रवृत्ति',
    'chart-routes-title':'शीर्ष मार्ग','chart-airline-title':'एयरलाइन सूचकांक',
    'chart-elasticity-title':'लीड टाइम इलास्टिसिटी','chart-elasticity-sub':'प्रस्थान से पहले दिनों के साथ सूचकांक',
    'chart-farecomp-title':'किराया घटक','chart-farecomp-sub':'आधार · ईंधन · हवाई अड्डा · GST',
    'tbl-route-heading':'मार्ग-वार हवाई किराया सूचकांक','tbl-airline-heading':'एयरलाइन-वार सूचकांक',
    'info-obj-title':'उद्देश्य','info-min-title':'प्रायोजक मंत्रालय',
    'info-data-title':'डेटा संग्रह','info-index-title':'सूचकांक निर्माण',
    'info-obj-body':'एयरलाइन और OTA पोर्टलों की स्वचालित वेब स्क्रैपिंग द्वारा भारत के लिए रियल-टाइम हवाई किराया मूल्य सूचकांक विकसित करना।',
    'info-min-body':'MoSPI — सांख्यिकी एवं कार्यक्रम कार्यान्वयन मंत्रालय, भारत सरकार।',
    'info-data-body':'स्वचालित स्क्रैपर्स 6 एयरलाइनों और 4 OTA प्लेटफॉर्मों से 52 मार्गों पर प्रतिदिन डेटा एकत्र करते हैं।',
    'info-index-body':'लास्पेयर्स सूत्र, आधार वर्ष 2016=100। DGCA यातायात डेटा द्वारा भारित।',
    'footer-about-heading':'पोर्टल के बारे में','footer-links-heading':'त्वरित लिंक',
    'footer-related-heading':'संबंधित पोर्टल','footer-contact-heading':'संपर्क',
    'footer-about-body':'यह पोर्टल SIH 2026 (SIH26056) के तहत MoSPI के सहयोग से विकसित रियल-टाइम हवाई किराया सूचकांक प्रकाशित करता है।',
    'footer-address1':'सांख्यिकी एवं कार्यक्रम कार्यान्वयन मंत्रालय',
    'footer-address2':'सरदार पटेल भवन, संसद मार्ग','footer-address3':'नई दिल्ली – 110001',
    'footer-email':'📧 airindex@mospi.gov.in','footer-phone':'📞 011-23074696',
    'footer-copyright':'© 2026 MoSPI, भारत सरकार। सर्वाधिकार सुरक्षित।',
    'footer-terms':'नियम','footer-privacy':'गोपनीयता','footer-disclaimer':'अस्वीकरण',
    'ql-home':'होम','ql-explorer':'डेटा एक्सप्लोरर','ql-methodology':'पद्धति','ql-api':'API एक्सेस','ql-opendata':'ओपन डेटा',
    'rp-mospi':'MoSPI आधिकारिक','rp-sih':'स्मार्ट इंडिया हैकाथॉन','rp-digitalindia':'डिजिटल इंडिया','rp-ogd':'ओपन गवर्नमेंट डेटा',
  }
};

function switchLang(lang) {
  document.querySelectorAll('.lang-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('lang-'+lang).classList.add('active');
  document.documentElement.lang = lang==='hi'?'hi':'en';
  const d = I18N[lang];
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k=el.getAttribute('data-i18n');
    if (d[k]!==undefined) el.textContent=d[k];
  });
}

/* ══════════════════════════════
   CHART GLOBALS
   ══════════════════════════════ */
Chart.defaults.font.family = "'Inter','Noto Sans Devanagari',sans-serif";
Chart.defaults.color = '#6b7280';

let naiChart, routeChart, airlineChart, elasticityChart, fareCompChart;
let naiSeries = null;  // cache
let currentRange = '3m';
let showSMA = false;

/* ── NAI Trend ── */
async function loadNAIChart() {
  naiSeries = await fetchNAISeries();
  buildNAIChart(currentRange);
}

function buildNAIChart(range) {
  currentRange = range;
  if (!naiSeries) return;

  const all_labels = naiSeries.labels;
  const all_nai    = naiSeries.nai;
  const all_sma    = naiSeries.sma_3m;
  const n = range==='3m'?3 : range==='6m'?6 : 12;
  const labels = all_labels.slice(-n);
  const data   = all_nai.slice(-n);
  const sma    = all_sma.slice(-n);

  const ctx = document.getElementById('naiChart');
  if (!ctx) return;
  if (naiChart) naiChart.destroy();

  const datasets = [{
    label: 'NAI',
    data,
    borderColor: '#1d4ed8',
    backgroundColor: 'rgba(29,78,216,0.07)',
    borderWidth: 2,
    pointRadius: 4,
    pointHoverRadius: 6,
    fill: true,
    tension: 0.38,
  }];

  if (showSMA) {
    datasets.push({
      label: '3-Month SMA',
      data: sma,
      borderColor: '#f97316',
      borderWidth: 2,
      borderDash: [5,3],
      pointRadius: 0,
      fill: false,
      tension: 0.38,
      spanGaps: true,
    });
  }

  naiChart = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      plugins: {
        legend: { display: showSMA, position:'top', labels:{boxWidth:12,font:{size:11}} },
        tooltip: {
          backgroundColor:'#1e293b', titleColor:'#f8fafc', bodyColor:'#cbd5e1', padding:10,
          callbacks:{ label: c=>`  ${c.dataset.label}: ${c.parsed.y!==null?c.parsed.y.toFixed(1):'–'}` }
        }
      },
      scales: {
        y:{ beginAtZero:false, grid:{color:'rgba(0,0,0,0.05)'}, ticks:{callback:v=>v.toFixed(0)} },
        x:{ grid:{display:false} }
      }
    }
  });
}

function setRange(r, btn) {
  document.querySelectorAll('.cctrl:not(.sma)').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  buildNAIChart(r);
}
function toggleSMA(btn) {
  showSMA = !showSMA;
  btn.classList.toggle('active', showSMA);
  buildNAIChart(currentRange);
}

/* ── Route Bar Chart ── */
async function loadRouteChart() {
  const d = await fetchRoutes(6);
  const ctx = document.getElementById('routeChart');
  if (!ctx || !d || !d.routes.length) return;
  if (routeChart) routeChart.destroy();

  const top = d.routes.slice(0,6);
  routeChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: top.map(r=>r.route),
      datasets:[{
        label:'Index',
        data: top.map(r=>r.index),
        backgroundColor:['#1d4ed8','#0891b2','#059669','#7c3aed','#dc2626','#d97706'],
        borderRadius: 4,
        borderSkipped: false,
      }]
    },
    options: {
      indexAxis:'y', responsive:true,
      plugins:{ legend:{display:false},
        tooltip:{ backgroundColor:'#1e293b', titleColor:'#f8fafc', bodyColor:'#cbd5e1', padding:10,
          callbacks:{ label:c=>` Index: ${c.parsed.x.toFixed(1)} · Avg: ₹${top[c.dataIndex]?.avg_fare?.toLocaleString('en-IN')}` }
        }
      },
      scales:{ x:{beginAtZero:false,min:115,grid:{color:'rgba(0,0,0,0.05)'}}, y:{grid:{display:false}} }
    }
  });
}

/* ── Airline Doughnut ── */
async function loadAirlineChart() {
  const d = await fetchAirlines();
  const ctx = document.getElementById('airlineChart');
  if (!ctx || !d || !d.airlines.length) return;
  if (airlineChart) airlineChart.destroy();

  airlineChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: d.airlines.map(a=>a.airline),
      datasets:[{
        data: d.airlines.map(a=>a.index),
        backgroundColor:['#3b82f6','#ef4444','#f97316','#1d4ed8','#10b981','#8b5cf6'],
        borderWidth:2, borderColor:'#ffffff', hoverOffset:6,
      }]
    },
    options: {
      responsive:true,
      plugins:{
        legend:{ position:'bottom', labels:{boxWidth:11,font:{size:11},padding:8} },
        tooltip:{ backgroundColor:'#1e293b', titleColor:'#f8fafc', bodyColor:'#cbd5e1', padding:10,
          callbacks:{ label:c=>` ${c.label}: ${c.parsed.toFixed(1)}` }
        }
      }
    }
  });
}

/* ── Elasticity Chart ── */
async function loadElasticityChart() {
  const routeId = document.getElementById('elasticity-route')?.value || 'DEL-BOM';
  const d = await fetchElasticity(routeId);
  const ctx = document.getElementById('elasticityChart');
  if (!ctx) return;
  if (elasticityChart) elasticityChart.destroy();

  const pts = d ? d.points : [];
  elasticityChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: pts.map(p=>p.lead_days+'d'),
      datasets:[{
        label: routeId+' Index',
        data: pts.map(p=>p.index),
        borderColor:'#1d4ed8',
        backgroundColor:'rgba(29,78,216,0.06)',
        borderWidth:2.5, pointRadius:5, pointHoverRadius:7,
        fill:true, tension:0.35,
      }]
    },
    options: {
      responsive:true,
      plugins:{
        legend:{display:false},
        tooltip:{
          backgroundColor:'#1e293b', titleColor:'#f8fafc', bodyColor:'#cbd5e1', padding:10,
          callbacks:{
            title: items=>`Lead: ${items[0].label}`,
            label: c=>[` Index: ${c.parsed.y.toFixed(1)}`,` Avg Fare: ₹${pts[c.dataIndex]?.avg_fare?.toLocaleString('en-IN')}`]
          }
        }
      },
      scales:{
        x:{ title:{display:true,text:'Days before departure',font:{size:11}}, grid:{display:false} },
        y:{ title:{display:true,text:'Index Value',font:{size:11}}, beginAtZero:false, min:110, grid:{color:'rgba(0,0,0,0.05)'} }
      }
    }
  });
}

/* ── Fare Components Chart ── */
async function loadFareComponentChart() {
  const routeId = document.getElementById('farecomp-route')?.value || 'DEL-BOM';
  const d = await fetchFareComponents(routeId);
  const ctx = document.getElementById('fareCompChart');
  if (!ctx) return;
  if (fareCompChart) fareCompChart.destroy();

  const wins = d ? d.windows : [];
  fareCompChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: wins.map(w=>w.label),
      datasets:[
        { label:'Base Fare',      data:wins.map(w=>w.base_fare),      backgroundColor:'#1d4ed8', stack:'s', borderRadius:{topLeft:0,topRight:0} },
        { label:'Fuel Surcharge', data:wins.map(w=>w.fuel_surcharge),  backgroundColor:'#f97316', stack:'s' },
        { label:'Airport Levy',   data:wins.map(w=>w.airport_levy),    backgroundColor:'#059669', stack:'s' },
        { label:'GST',            data:wins.map(w=>w.gst),             backgroundColor:'#7c3aed', stack:'s', borderRadius:{topLeft:4,topRight:4} },
      ]
    },
    options: {
      responsive:true,
      plugins:{
        legend:{ position:'bottom', labels:{boxWidth:11,font:{size:11},padding:8} },
        tooltip:{
          mode:'index', backgroundColor:'#1e293b', titleColor:'#f8fafc', bodyColor:'#cbd5e1', padding:10,
          callbacks:{
            title:items=>`Window: ${items[0].label}`,
            label:c=>` ${c.dataset.label}: ₹${c.parsed.y.toLocaleString('en-IN')}`,
            footer:items=>`  Total: ₹${items.reduce((s,i)=>s+i.parsed.y,0).toLocaleString('en-IN')}`
          }
        }
      },
      scales:{
        x:{ stacked:true, grid:{display:false}, title:{display:true,text:'Booking window',font:{size:11}} },
        y:{ stacked:true, grid:{color:'rgba(0,0,0,0.05)'}, ticks:{callback:v=>'₹'+v.toLocaleString('en-IN')} }
      }
    }
  });
}

/* ── Route Table ── */
let routeData = [];
async function loadRouteTable() {
  const d = await fetchRoutes(52);
  if (!d || !d.routes.length) return;
  routeData = d.routes;
  renderRouteTable(routeData);
}

function renderRouteTable(rows) {
  const tb = document.getElementById('route-tbody');
  if (!tb) return;
  tb.innerHTML = rows.map(r => {
    const momCls = r.mom_change > 0 ? 'up' : r.mom_change < 0 ? 'dn' : '';
    const momSign = r.mom_change > 0 ? '▲' : r.mom_change < 0 ? '▼' : '—';
    const yoyCls  = r.yoy_change > 0 ? 'up' : 'dn';
    const statusCls = r.status==='High'?'badge-h': r.status==='Medium'?'badge-m':'badge-l';
    return `<tr>
      <td><strong>${r.route}</strong></td>
      <td>${r.from_name||r.from}</td>
      <td>${r.to_name||r.to}</td>
      <td><strong>${r.index.toFixed(1)}</strong></td>
      <td>₹${r.avg_fare.toLocaleString('en-IN')}</td>
      <td class="${momCls}">${momSign} ${Math.abs(r.mom_change)}%</td>
      <td class="${yoyCls}">▲ ${r.yoy_change}%</td>
      <td>T${r.tier}</td>
      <td><span class="badge ${statusCls}">${r.status}</span></td>
    </tr>`;
  }).join('');
}

function filterRouteTable() {
  const q = document.getElementById('route-search').value.toLowerCase();
  const filtered = q ? routeData.filter(r =>
    r.route.toLowerCase().includes(q) ||
    (r.from_name||'').toLowerCase().includes(q) ||
    (r.to_name||'').toLowerCase().includes(q)
  ) : routeData;
  renderRouteTable(filtered);
}

let sortDir = {};
function sortRouteTable(col) {
  const keys = ['route','from_name','to_name','index','avg_fare','mom_change','yoy_change','tier'];
  const key = keys[col];
  sortDir[key] = !sortDir[key];
  const sorted = [...routeData].sort((a,b) => {
    const av=a[key], bv=b[key];
    if (typeof av==='number') return sortDir[key] ? bv-av : av-bv;
    return sortDir[key] ? String(bv).localeCompare(String(av)) : String(av).localeCompare(String(bv));
  });
  renderRouteTable(sorted);
}

function exportCSV() {
  const headers = ['Route','From','To','Index','Avg Fare','MoM%','YoY%','Tier','Status'];
  const rows = routeData.map(r => [
    r.route, r.from_name||r.from, r.to_name||r.to,
    r.index, r.avg_fare, r.mom_change, r.yoy_change, r.tier, r.status
  ]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'RAPI_Routes_Sep2026.csv';
  a.click();
}

/* ── Airline Table ── */
async function loadAirlineTable() {
  const d = await fetchAirlines();
  if (!d || !d.airlines.length) return;
  const tb = document.getElementById('airline-tbody');
  if (!tb) return;
  tb.innerHTML = d.airlines.map(a => {
    const mc = a.mom_change>0?'up':'dn';
    const ms = a.mom_change>0?'▲':'▼';
    return `<tr>
      <td><strong>${a.airline}</strong></td>
      <td><span class="type-tag ${a.type==='LCC'?'lcc':'fsc'}">${a.type}</span></td>
      <td>${a.market_share}%</td>
      <td>${a.index.toFixed(1)}</td>
      <td class="${mc}">${ms} ${Math.abs(a.mom_change)}%</td>
      <td class="up">▲ ${a.yoy_change}%</td>
      <td>Official + OTA</td>
    </tr>`;
  }).join('');
}

/* ── Hero KPIs ── */
async function loadHeroStats() {
  const d = await fetchNAI();
  if (!d) return;
  const el = document.getElementById('kpi-nai');
  if (el) el.textContent = d.index.toFixed(1);
  const mom = document.getElementById('hero-mom');
  if (mom) {
    const sign = d.mom_change >= 0 ? '▲' : '▼';
    mom.textContent = `${sign} ${Math.abs(d.mom_change)}% MoM`;
    mom.className = `hb ${d.mom_change >= 0 ? 'green' : 'red'}`;
  }
  const lu = document.getElementById('last-update');
  if (lu && d.last_updated) lu.textContent = d.last_updated;
}

/* ── Live Search ── */
async function doSearch() {
  const from   = document.getElementById('s-from').value.trim().toUpperCase();
  const to     = document.getElementById('s-to').value.trim().toUpperCase();
  const cabin  = document.getElementById('s-class').value;
  const lead   = parseInt(document.getElementById('s-window').value, 10);
  const outDiv = document.getElementById('search-out');
  const tbody  = document.getElementById('search-tbody');
  const empty  = document.getElementById('search-empty');
  const countEl= document.getElementById('search-count');
  const routeLbl=document.getElementById('search-route-label');

  if (!from || !to) { alert('Please enter both origin and destination codes.'); return; }

  if (outDiv) outDiv.classList.remove('hidden');
  if (tbody)  tbody.innerHTML = '<tr><td colspan="7" class="loading-row">Fetching fares…</td></tr>';
  if (empty)  empty.classList.add('hidden');

  const d = await fetchSearch(from, to, lead, cabin);

  if (routeLbl) routeLbl.textContent = `${d?.from_name||from} → ${d?.to_name||to}`;

  if (!d || !d.fares || d.fares.length === 0) {
    if (tbody)  tbody.innerHTML = '';
    if (empty)  empty.classList.remove('hidden');
    if (countEl) countEl.textContent = '0 results';
    return;
  }

  if (countEl) countEl.textContent = `${d.fares.length} result${d.fares.length>1?'s':''}`;

  const min = Math.min(...d.fares.map(f=>f.fare));
  tbody.innerHTML = d.fares.map((f,i) => {
    const ratingCls = f.fare===min ? 'badge-l' : f.fare < min*1.2 ? 'badge-m' : 'badge-h';
    const ratingTxt = f.fare===min ? '✓ Best' : f.rating || '—';
    return `<tr style="animation-delay:${i*40}ms" class="row-in">
      <td><strong>${f.airline}</strong></td>
      <td><span class="type-tag ${f.type==='LCC'?'lcc':'fsc'}">${f.type}</span></td>
      <td>${f.cabin}</td>
      <td>${f.lead_days}d</td>
      <td><strong>₹${f.fare.toLocaleString('en-IN')}</strong></td>
      <td>${f.components ? (f.fare/(f.components.total||f.fare)*100).toFixed(0)+'%' : '—'}</td>
      <td><span class="badge ${ratingCls}">${ratingTxt}</span></td>
    </tr>`;
  }).join('');
}

function clearSearch() {
  ['s-from','s-to'].forEach(id=>{const e=document.getElementById(id);if(e)e.value='';});
  document.getElementById('s-class').value='Economy';
  document.getElementById('s-window').value='14';
  const out=document.getElementById('search-out');
  if(out) out.classList.add('hidden');
}

/* ══════════════════════════════
   INIT — load everything on DOM ready
   ══════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
  switchLang('en');

  // load all sections concurrently
  await Promise.all([
    loadHeroStats(),
    loadNAIChart(),
    loadRouteChart(),
    loadAirlineChart(),
    loadElasticityChart(),
    loadFareComponentChart(),
    loadRouteTable(),
    loadAirlineTable(),
  ]);
});
