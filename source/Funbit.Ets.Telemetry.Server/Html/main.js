// ============================================
// GPS MapKalo by DevZeros S.A.S
// VERSION COMPLETA CON MODO OSCURO Y VOZ LEGIBLE
// ============================================

// --- VARIABLES GLOBALES ---
let map, marker, grafoVial = { nodos: {} };
let layerCarreteras, layerRuta, layerFacilities, layerCompanies, layerFerries;
let rawCompData = null, rawUsaCities = null, rawPois = null;
let rawRoads = [], roadHighwayTokens = new Set();
let followTruck = true;
let facilitiesVisible = false;
let companiesVisible = true;
let lastTurnAnnounced = { index: -1, dist: 0, turnId: null };
let announcedTurns = new Set(); // IDs únicos de giros ya anunciados
let selectedCompany = null;
let selectedCompanyCoords = null;
let isCompanyRouteActive = false;
let isManualRouteActive = false;
let truckCurrentPos = [0, 0];
let truckCurrentSpeed = 0;
let currentRouteLine = null;
let routeWorker = null;
window.fuelAnimInterval = null;
window.fuelAnimDisplay = 0;

// --- INDICE ESPACIAL Y COOLDOWNS DE ANUNCIOS ---
let spatialIndex = { gas: null, service: null, signs: null, viewpoints: null, cities: null, tolls: null };
let announcementCooldowns = { city: 0, fuel: 0, damage: 0, sign: 0, viewpoint: 0, toll: 0 };
let announcedEntities = { cities: new Set(), signs: new Set(), viewpoints: new Set(), tolls: new Set() };
const COOLDOWN_SECONDS = { city: 30, fuel: 60, damage: 120, sign: 15, viewpoint: 60, toll: 90 };
const PROXIMITY_GAME_UNITS = { city: 400, fuel: 130, damage: 130, sign: 26, viewpoint: 200, toll: 130 };
// 1 km = ~258 game units; 100m = ~26, 500m = ~130, 200m = ~52

// --- RENDER ICONO COMBUSTIBLE ---
function renderFuelIcon(element, pct, engineOn) {
    const color = pct <= 15 ? "#ff4444" : (pct <= 50 ? "#ffaa00" : "#00C851");
    const fillHeight = 14 * (pct / 100);
    const fillY = 16 - fillHeight;
    const indicatorOpacity = engineOn ? 1 : 0.3;
    
    element.innerHTML = `<svg width="42" height="42" viewBox="0 0 24 24">
        <rect x="3" y="3" width="10" height="14" rx="1.5" fill="#2a2a2a" stroke="#444" stroke-width="1.2"/>
        <rect x="4.5" y="${fillY}" width="7" height="${fillHeight}" fill="${color}"/>
        <rect x="3" y="3" width="10" height="14" rx="1.5" fill="none" stroke="#666" stroke-width="1.2"/>
        <circle cx="16" cy="6" r="2.5" fill="#333" stroke="#666" stroke-width="0.8"/>
        <circle cx="16" cy="6" r="1.5" fill="${color}" opacity="${indicatorOpacity}"/>
        <path d="M13 7 Q15 6, 17 5" stroke="#555" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <path d="M13 9 Q15 10, 17 11" stroke="#555" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <rect x="5" y="18" width="6" height="2" rx="0.5" fill="#444" stroke="#555" stroke-width="0.8"/>
    </svg>`;
}

// --- VARIABLES PARA VOZ ---
let voiceSynth = window.speechSynthesis || null;;
let currentRoute = null;
let destinationReached = false;
let destinationCleanupDone = false;
let voiceEnabled = false;
let voiceActivated = false;
let hasStartedJob = false;
let lastAnnouncedKm = Infinity;
let lastJobId = null;
let lastMilestoneKm = 0;
let lastSpeedWarnTime = 0;
let drivingStartTime = 0;
let lastRestReminder = 0;
let lastRoadType = null;
let lastRoadAnnounced = '';

// --- VARIABLES MODO OSCURO ---
let manualDarkMode = null;

// --- FUNCIONES DE VOZ MEJORADAS CON VISUALIZACIÓN CLARA ---
function speak(text, priority = false) {
    if (!voiceEnabled || !voiceActivated) return;
    try {
        console.log('🔊 Hablando:', text);
        
        // Mostrar indicador visual en el mapa
        const indicator = document.getElementById('voice-indicator');
        if (indicator) {
            indicator.classList.add('speaking');
            indicator.style.opacity = '1';
            indicator.style.borderColor = '#8B5CF6';
            const dot = indicator.querySelector('.voice-dot');
            if (dot) dot.style.background = '#00f2ff';
            const span = indicator.querySelector('span');
            if (span) {
                span.innerHTML = '🔊 ' + (text.length > 40 ? text.substring(0, 40) + '...' : text);
            }
        }
        
        // Mostrar notificación visual
        showVoiceNotification(text);
        
        // ENVIAR MENSAJE A LA APP CORDOVA (para voz nativa)
        if (window.parent && window.parent !== window) {
            try {
                window.parent.postMessage({
                    type: 'speak',
                    text: text
                }, '*');
                console.log('📤 Mensaje enviado a la app Cordova');
            } catch(e) {
                console.log('Error enviando mensaje:', e);
            }
        }
        
        // También usar Web Speech local (fallback)
        if (voiceSynth) {
            if (priority) voiceSynth.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'es-ES';
            utterance.rate = 0.9;
            utterance.pitch = 1.1;
            
            utterance.onend = () => {
                if (indicator) indicator.classList.remove('speaking');
            };
            
            utterance.onerror = (e) => {
                console.error('❌ Error voz:', e);
                if (indicator) indicator.classList.remove('speaking');
            };
            
            voiceSynth.speak(utterance);
        }
        
        // Limpiar indicador después de 3 segundos si no se limpió antes
        setTimeout(() => {
            if (indicator) indicator.classList.remove('speaking');
        }, 3000);
        
    } catch (error) {
        console.error('Error al hablar:', error);
        const indicator = document.getElementById('voice-indicator');
        if (indicator) indicator.classList.remove('speaking');
    }
}

function showVoiceNotification(text) {
    const existingNotif = document.querySelector('.voice-notification');
    if (existingNotif) existingNotif.remove();
    
    const notif = document.createElement('div');
    notif.className = 'voice-notification';
    notif.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 20px; color: #8B5CF6;">🎤</span>
            <span style="flex: 1; font-size: 14px; font-weight: 500; color: #FFFFFF;">${text}</span>
            <span style="font-size: 12px; color: #8B5CF6;">🔊</span>
        </div>
    `;
    document.body.appendChild(notif);
    
    notif.style.animation = 'slideUp 0.3s ease';
    
    setTimeout(() => {
        if (notif) {
            notif.style.opacity = '0';
            notif.style.transform = 'translateY(-10px)';
            notif.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                if (notif) notif.remove();
            }, 300);
        }
    }, 3500);
}

function activateVoice() {
    voiceActivated = true;
    const indicator = document.getElementById('voice-indicator');
    if (indicator) indicator.classList.add('active');
    setTimeout(() => speak("Bienvenido a MapKalo. Asistente de navegación listo."), 100);
}

function toggleVoice() {
    voiceEnabled = !voiceEnabled;
    const btn = document.getElementById('toggle-voice');
    const indicator = document.getElementById('voice-indicator');
    const dot = indicator ? indicator.querySelector('.voice-dot') : null;
    const label = indicator ? indicator.querySelector('span') : null;
    if (btn) {
        btn.innerHTML = voiceEnabled ? "🔊" : "🔇";
        btn.style.opacity = voiceEnabled ? "1" : "0.5";
    }
    if (indicator) {
        indicator.classList.toggle('active', voiceEnabled);
        indicator.style.opacity = voiceEnabled ? "1" : "0.5";
        indicator.style.borderColor = voiceEnabled ? "#8B5CF6" : "#555";
    }
    if (dot) dot.style.background = voiceEnabled ? "#8B5CF6" : "#555";
    if (label) label.innerText = voiceEnabled ? "Asistente de voz activo" : "Asistente de voz inactivo";
    if (voiceEnabled && voiceActivated) speak("Sonido activado.");
}

// --- FUNCIONES DE DISTANCIA ---
function calculateDistance(point1, point2) {
    const dx = point1[0] - point2[0];
    const dy = point1[1] - point2[1];
    return Math.sqrt(dx * dx + dy * dy) * 0.003875;
}

function gameDistKm(x1, y1, x2, y2) {
    return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2)) * 0.003875;
}

// --- INDICE ESPACIAL PARA CONSULTAS RAPIDAS ---
function buildSpatialIndex(items, xKey = 'x', yKey = 'y', binSize = 1000) {
    const grid = {};
    items.forEach(item => {
        const bx = Math.floor(item[xKey] / binSize);
        const by = Math.floor(item[yKey] / binSize);
        const key = `${bx},${by}`;
        if (!grid[key]) grid[key] = [];
        grid[key].push(item);
    });
    return { grid, binSize };
}

function queryNearby(index, x, y, maxDist) {
    if (!index) return [];
    const binSize = index.binSize;
    const bx = Math.floor(x / binSize);
    const by = Math.floor(y / binSize);
    const results = [];
    const maxDistSq = maxDist * maxDist;
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            const key = `${bx+dx},${by+dy}`;
            const bin = index.grid[key];
            if (bin) results.push(...bin);
        }
    }
    return results.filter(item => {
        const dx = (item.x || 0) - x;
        const dy = (item.y || 0) - y;
        return dx*dx + dy*dy <= maxDistSq;
    });
}

function queryNearbyObj(items, x, y, xKey, yKey, maxDist) {
    const maxDistSq = maxDist * maxDist;
    return items.filter(item => {
        const dx = (item[xKey] || 0) - x;
        const dy = (item[yKey] || 0) - y;
        return dx*dx + dy*dy <= maxDistSq;
    });
}

// --- CONTROL DE CAPA DE EMPRESAS POR ZOOM ---
function updateCompaniesLayer() {
    if (companiesVisible && map && map.getZoom() >= -3) {
        if (!map.hasLayer(layerCompanies)) layerCompanies.addTo(map);
    } else {
        if (map && map.hasLayer(layerCompanies)) map.removeLayer(layerCompanies);
    }
}

// --- ACTUALIZAR ETA ---
function updateETA() {
    const etaRealElement = document.getElementById('ui-eta-real');
    if (!etaRealElement || !currentRoute || currentRoute.distancia_km <= 0) return;
    
    // Usar velocidad actual del camión, si es < 1 km/h usar 80 km/h
    let currentSpeed = truckCurrentSpeed >= 1 ? truckCurrentSpeed : 80;
    
    const distanceKm = currentRoute.distancia_km;
    const timeHours = (distanceKm / currentSpeed) / 3.6;
    const totalMinutes = Math.round(timeHours * 60);
    
    // Calcular hora real de llegada
    const now = new Date();
    now.setMinutes(now.getMinutes() + totalMinutes);
    const arrivalHour = now.getHours();
    const arrivalMinute = now.getMinutes();
    const ampm = arrivalHour >= 12 ? 'PM' : 'AM';
    const hour12 = arrivalHour % 12 || 12;
    const minuteStr = arrivalMinute.toString().padStart(2, '0');
    
    etaRealElement.innerText = `${hour12}:${minuteStr} ${ampm}`;
    etaRealElement.style.setProperty('color', '#4CAF50', 'important');
}

function updateRouteUI() {
    if (currentRoute && currentRoute.distancia_km !== undefined && currentRoute.distancia_km > 0) {
        const distElement = document.getElementById('ui-dist');
        if (distElement) {
            const distValue = currentRoute.distancia_km;
            if (distValue < 1) {
                distElement.innerText = `${Math.round(distValue * 1000)} m`;
            } else {
                distElement.innerText = `${distValue.toFixed(1)} km`;
            }
        }
        
        const sourceElement = document.getElementById('ui-source');
        const destElement = document.getElementById('ui-dest');
        
        if (sourceElement && currentRoute.origen) {
            if (currentRoute.origenEmpresa) {
                sourceElement.innerHTML = `<span class="route-city">${currentRoute.origen}</span><span class="route-company">${currentRoute.origenEmpresa}</span>`;
            } else {
                sourceElement.innerHTML = `<span class="route-city">${currentRoute.origen}</span>`;
            }
        }
        
        if (destElement && currentRoute.destino) {
            if (currentRoute.destinoEmpresa) {
                destElement.innerHTML = `<span class="route-city">${currentRoute.destino}</span><span class="route-company">${currentRoute.destinoEmpresa}</span>`;
            } else {
                destElement.innerHTML = `<span class="route-city">${currentRoute.destino}</span>`;
            }
        }
        
        // Calcular TIEMPO REAL basado en velocidad actual del camión
        // Si está parado o < 1 km/h, usar 80 km/h como referencia
        let currentSpeed = truckCurrentSpeed >= 1 ? truckCurrentSpeed : 80;
        
        const distanceKm = currentRoute.distancia_km;
    const timeHours = (distanceKm / currentSpeed) / 3.6;
        const totalMinutes = Math.round(timeHours * 60);
        const realHours = Math.floor(totalMinutes / 60);
        const realMins = totalMinutes % 60;
        
        // Actualizar TIEMPO REAL
        const timeElement = document.getElementById('ui-game-time');
        if (timeElement) {
            if (realHours > 0) {
                timeElement.innerText = `${realHours}h ${realMins}m`;
            } else {
                timeElement.innerText = `${realMins} min`;
            }
        }
        
        // Actualizar LLEGADA (ETA)
        const etaRealElement = document.getElementById('ui-eta-real');
        if (etaRealElement) {
            const now = new Date();
            now.setMinutes(now.getMinutes() + totalMinutes);
            const arrivalHour = now.getHours();
            const arrivalMinute = now.getMinutes();
            const ampm = arrivalHour >= 12 ? 'PM' : 'AM';
            const hour12 = arrivalHour % 12 || 12;
            const minuteStr = arrivalMinute.toString().padStart(2, '0');
            
            etaRealElement.innerText = `${hour12}:${minuteStr} ${ampm}`;
            etaRealElement.style.color = '#4CAF50';
        }
        
        console.log('📊 UI actualizada - Distancia ruta:', currentRoute.distancia_km.toFixed(2), 'km');
    }
}

// --- RUTA DINÁMICA ---
async function calculateDynamicRoute(currentPos, destinationCity, destinationCompany, sourceCity = null, sourceCompany = null, headingDeg = null) {
    if (!rawUsaCities || !rawCompData || !currentPos || !destinationCity) {
        return null;
    }
    
    const cityFeature = rawUsaCities.features.find(f => f.properties.name === destinationCity);
    if (!cityFeature) return null;
    
    let destCoords;
    if (destinationCompany) {
        const companyFeature = rawCompData.features.find(f => 
            f.properties.ciudad === cityFeature.properties.token && 
            f.properties.nombre === destinationCompany
        );
        if (companyFeature) {
            destCoords = companyFeature.geometry.coordinates;
        } else {
            destCoords = cityFeature.geometry.coordinates;
        }
    } else {
        destCoords = cityFeature.geometry.coordinates;
    }
    
    const startNode = findNearestNode(currentPos);
    const endNode = findNearestNode(destCoords);
    
    if (!startNode || !endNode) return null;
    
    const { path, distance } = await solvePathAsync(startNode, endNode);
    
    if (path.length === 0) return null;
    
    const distanciaKm = distance * 0.003875;
    
    console.log('🛣️ RUTA CALCULADA - Distancia:', distanciaKm.toFixed(2), 'km');
    
    return {
        rutaOriginal: path,
        ruta: path,
        distancia_km: distanciaKm,
        distancia_restante: distanciaKm,
        destino: destinationCity,
        destinoEmpresa: destinationCompany || null,
        origen: sourceCity || "Mi ubicación",
        origenEmpresa: sourceCompany || null
    };
}

function findNearestNode(coords, maxDistance = 400) {
    if (Object.keys(grafoVial.nodos).length === 0) return null;
    
    let candidates = [];
    for (let id in grafoVial.nodos) {
        let n = grafoVial.nodos[id];
        let d = Math.sqrt(Math.pow(n.x - coords[0], 2) + Math.pow(n.y - coords[1], 2));
        const adjCount = n.adj ? n.adj.length : 0;
        if (adjCount >= 2 && d < 800) {
            candidates.push({ id, dist: d, adj: adjCount });
        }
    }
    
    if (candidates.length === 0) {
        for (let id in grafoVial.nodos) {
            let n = grafoVial.nodos[id];
            let d = Math.sqrt(Math.pow(n.x - coords[0], 2) + Math.pow(n.y - coords[1], 2));
            const adjCount = n.adj ? n.adj.length : 0;
            if (adjCount >= 1 && d < 2000) {
                candidates.push({ id, dist: d, adj: adjCount });
            }
        }
    }
    
    if (candidates.length === 0) {
        // Último recurso: nodo más cercano con ≥1 conexión, sin límite de distancia
        let bestId = null, bestDist = Infinity;
        for (let id in grafoVial.nodos) {
            let n = grafoVial.nodos[id];
            let d = Math.sqrt(Math.pow(n.x - coords[0], 2) + Math.pow(n.y - coords[1], 2));
            if (n.adj && n.adj.length >= 1 && d < bestDist) {
                bestDist = d;
                bestId = id;
            }
        }
        if (bestId) {
            console.log(`Nodo lejano encontrado a ${bestDist.toFixed(0)} unidades`);
            return bestId;
        }
    }
    
    if (candidates.length === 0) {
        return null;
    }
    
    candidates.sort((a, b) => a.dist - b.dist);
    const best = candidates[0];
    return best.id;
}

// --- MIN HEAP (para A*) ---
class MinHeap {
    constructor(capacity = 10000) {
        this.data = [];
        this.capacity = capacity;
    }
    push(id, cost) {
        this.data.push({ id, cost });
        let i = this.data.length - 1;
        while (i > 0) {
            const p = (i - 1) >> 1;
            if (this.data[p].cost <= this.data[i].cost) break;
            [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
            i = p;
        }
    }
    pop() {
        if (this.data.length === 0) return undefined;
        const top = this.data[0].id;
        const last = this.data.pop();
        if (this.data.length > 0) {
            this.data[0] = last;
            let i = 0;
            while (true) {
                let min = i;
                const l = 2 * i + 1, r = 2 * i + 2;
                if (l < this.data.length && this.data[l].cost < this.data[min].cost) min = l;
                if (r < this.data.length && this.data[r].cost < this.data[min].cost) min = r;
                if (min === i) break;
                [this.data[i], this.data[min]] = [this.data[min], this.data[i]];
                i = min;
            }
        }
        return top;
    }
    size() { return this.data.length; }
    clear() { this.data = []; }
}

// --- DOUGLAS-PEUCKER (simplificación de ruta) ---
function simplifyPath(points, epsilon = 0.00003) {
    if (points.length <= 2) return points;
    const sqEpsilon = epsilon * epsilon;
    
    function getSqDist(p, a, b) {
        let x = a[0], y = a[1], dx = b[0] - x, dy = b[1] - y;
        if (dx !== 0 || dy !== 0) {
            const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
            const ct = Math.max(0, Math.min(1, t));
            x += dx * ct;
            y += dy * ct;
        }
        dx = p[0] - x;
        dy = p[1] - y;
        return dx * dx + dy * dy;
    }
    
    function recurse(pts, start, end, result) {
        let maxSqDist = sqEpsilon;
        let index = -1;
        for (let i = start + 1; i < end; i++) {
            const d = getSqDist(pts[i], pts[start], pts[end]);
            if (d > maxSqDist) { index = i; maxSqDist = d; }
        }
        if (index !== -1) {
            recurse(pts, start, index, result);
            result.push(pts[index]);
            recurse(pts, index, end, result);
        }
    }
    
    const result = [points[0]];
    recurse(points, 0, points.length - 1, result);
    result.push(points[points.length - 1]);
    return result;
}

// Laplacian smoothing: 0.25 * prev + 0.5 * curr + 0.25 * next
function smoothPath(points, iterations = 2) {
    if (points.length < 3) return points;
    let current = points;
    for (let it = 0; it < iterations; it++) {
        const smoothed = [current[0]];
        for (let i = 1; i < current.length - 1; i++) {
            const p = current[i-1], c = current[i], n = current[i+1];
            smoothed.push([p[0]*0.25+c[0]*0.5+n[0]*0.25, p[1]*0.25+c[1]*0.5+n[1]*0.25]);
        }
        smoothed.push(current[current.length-1]);
        current = smoothed;
    }
    return current;
}

function solvePath(startNode, endNode, truckHeading = null, startType = 'road') {
    if (!startNode || !endNode || startNode === endNode) {
        return { path: [], distance: 0 };
    }
    
    const nodos = grafoVial.nodos;
    if (!nodos[startNode] || !nodos[endNode]) return { path: [], distance: 0 };
    
    const endX = nodos[endNode].x, endY = nodos[endNode].y;
    
    // Heurística A*: distancia euclidiana al destino, peso 0.3 (seguro)
    function h(id) {
        const n = nodos[id];
        if (!n) return 0;
        const dx = n.x - endX, dy = n.y - endY;
        return Math.sqrt(dx*dx + dy*dy) * 0.3;
    }
    
    const dists = {};
    const prev = {};
    const heap = new MinHeap();
    
    for (let id in nodos) dists[id] = Infinity;
    dists[startNode] = 0;
    heap.push(startNode, h(startNode));
    
    while (heap.size() > 0) {
        const curr = heap.pop();
        if (curr === undefined) break;
        if (curr === endNode) break;
        
        const currNode = nodos[curr];
        if (!currNode || !currNode.adj) continue;
        
        const currDist = dists[curr];
        if (currDist === undefined) continue;
        
        for (let e of currNode.adj) {
            let alt = currDist + e.weight;
            if (alt < dists[e.to]) {
                dists[e.to] = alt;
                prev[e.to] = curr;
                heap.push(e.to, alt + h(e.to));
            }
        }
    }
    
    let path = [];
    let u = endNode;
    while (prev[u]) {
        if (!nodos[u]) break;
        path.unshift([nodos[u].y, nodos[u].x]);
        u = prev[u];
    }
    if (path.length > 0 && nodos[startNode]) {
        path.unshift([nodos[startNode].y, nodos[startNode].x]);
    }
    
    if (path.length > 5) {
        path = simplifyPath(path, 0.00001);
        path = smoothPath(path, 2);
    }
    
    const distance = dists[endNode] < Infinity ? dists[endNode] : 0;
    return { path, distance };
}

// Versión async con Web Worker
let solvePathReqId = 0;
function solvePathAsync(startNode, endNode, truckHeading = null, startType = 'road') {
    return new Promise((resolve) => {
        if (!routeWorker) {
            resolve(solvePath(startNode, endNode, truckHeading, startType));
            return;
        }
        const reqId = ++solvePathReqId;
        const handler = (e) => {
            if (e.data.type === 'RESULT' && e.data.reqId === reqId) {
                routeWorker.removeEventListener('message', handler);
                resolve(e.data.payload);
            }
        };
        routeWorker.addEventListener('message', handler);
        routeWorker.postMessage({
            type: 'SOLVE',
            reqId,
            payload: { startNode, endNode, heading: truckHeading, startType }
        });
    });
}

// --- CONSTRUIR GRAFO ---
function buildGraph(data) {
    grafoVial = { nodos: {} };
    if (!data || !data.features) return;
    
    data.features.forEach((f) => {
        if (!f.geometry) return;
        
        let coordsList = [];
        if (f.geometry.type === 'LineString') {
            coordsList = [f.geometry.coordinates];
        } else if (f.geometry.type === 'MultiLineString') {
            coordsList = f.geometry.coordinates;
        } else return;
        
        coordsList.forEach(coords => {
            for (let i = 0; i < coords.length - 1; i++) {
                const u = coords[i][0].toFixed(2) + "," + coords[i][1].toFixed(2);
                const v = coords[i+1][0].toFixed(2) + "," + coords[i+1][1].toFixed(2);
                
                if (!grafoVial.nodos[u]) {
                    grafoVial.nodos[u] = { x: coords[i][0], y: coords[i][1], adj: [] };
                }
                if (!grafoVial.nodos[v]) {
                    grafoVial.nodos[v] = { x: coords[i+1][0], y: coords[i+1][1], adj: [] };
                }
                
                const d = Math.sqrt(Math.pow(coords[i][0]-coords[i+1][0], 2) + Math.pow(coords[i][1]-coords[i+1][1], 2));
                grafoVial.nodos[u].adj.push({ to: v, weight: d });
                grafoVial.nodos[v].adj.push({ to: u, weight: d });
            }
        });
    });
    
    console.log('Grafo construido - Nodos:', Object.keys(grafoVial.nodos).length);
    
    // Agregar conexiones de ferry al grafo
    if (typeof rawFerries !== 'undefined' && rawFerries.length > 0) {
        let ferryEdges = 0;
        rawFerries.forEach(port => {
            const portNode = findNearestNode([port.x, port.y], 2000);
            if (!portNode) return;
            (port.connections || []).forEach(conn => {
                const destNode = findNearestNode([conn.x, conn.y], 2000);
                if (!destNode || portNode === destNode) return;
                const dist = conn.distance || Math.sqrt(Math.pow(port.x - conn.x, 2) + Math.pow(port.y - conn.y, 2));
                grafoVial.nodos[portNode].adj.push({ to: destNode, weight: dist, isFerry: true });
                ferryEdges++;
            });
        });
        if (ferryEdges > 0) console.log('Ferries agregados:', ferryEdges, 'conexiones');
    }
}

// --- ANUNCIOS DE PROXIMIDAD (POIs) ---
function checkProximityAnnouncements(truck, gameX, gameY) {
    if (!voiceEnabled || !voiceActivated) return;
    const now = Date.now() / 1000;
    
    // 1. CIUDADES - Bienvenida al entrar (<500m)
    if (now - announcementCooldowns.city > COOLDOWN_SECONDS.city && spatialIndex.cities) {
        const nearbyCities = queryNearby(spatialIndex.cities, gameX, gameY, PROXIMITY_GAME_UNITS.city);
        if (nearbyCities.length > 0) {
            const city = nearbyCities[0];
            const distKm = gameDistKm(gameX, gameY, city.x, city.y);
            const cityName = city.properties?.name || city.name || 'esta ciudad';
            if (!announcedEntities.cities.has(cityName)) {
                const distM = Math.round(distKm * 1000);
                if (distM < 200) {
                    speak(`Bienvenido a ${cityName}. Respeta los límites de velocidad y disfruta tu recorrido.`, false);
                } else {
                    speak(`Estás entrando a ${cityName} en ${distM} metros. Conduce con precaución.`, false);
                }
                announcedEntities.cities.add(cityName);
                announcementCooldowns.city = now;
            }
        }
    }
    
    // 2. COMBUSTIBLE BAJO + GASOLINERA CERCA (<500m)
    const fuelPct = (truck.fuel / truck.fuelCapacity) * 100;
    if (fuelPct <= 15 && now - announcementCooldowns.fuel > COOLDOWN_SECONDS.fuel && spatialIndex.gas) {
        const nearbyGas = queryNearby(spatialIndex.gas, gameX, gameY, PROXIMITY_GAME_UNITS.fuel);
        if (nearbyGas.length > 0) {
            const nearest = nearbyGas.reduce((a, b) => {
                const dA = gameDistKm(gameX, gameY, a.x, a.y);
                const dB = gameDistKm(gameX, gameY, b.x, b.y);
                return dA < dB ? a : b;
            });
            const distM = Math.round(gameDistKm(gameX, gameY, nearest.x, nearest.y) * 1000);
            if (distM < 500) {
                speak(`Combustible crítico: ${Math.round(fuelPct)}% restante. Gasolinera a ${distM} metros. No la pases.`, true);
                announcementCooldowns.fuel = now;
            }
        } else if (fuelPct <= 10 && now - announcementCooldowns.fuel > COOLDOWN_SECONDS.fuel * 2) {
            speak(`Reserva de combustible baja: ${Math.round(fuelPct)}%. Busca una gasolinera pronto.`, false);
            announcementCooldowns.fuel = now;
        }
    }
    
    // 3. DAÑO DEL CAMIÓN (>45%) + TALLER CERCA (<500m)
    const wearValues = [truck.wearEngine, truck.wearTransmission, truck.wearCabin, truck.wearChassis, truck.wearWheels].filter(v => v !== undefined);
    const avgWear = wearValues.length > 0 ? wearValues.reduce((a, b) => a + b, 0) / wearValues.length : 0;
    if (avgWear > 0.45 && now - announcementCooldowns.damage > COOLDOWN_SECONDS.damage && spatialIndex.service) {
        const nearbyService = queryNearby(spatialIndex.service, gameX, gameY, PROXIMITY_GAME_UNITS.damage);
        if (nearbyService.length > 0) {
            const nearest = nearbyService.reduce((a, b) => {
                const dA = gameDistKm(gameX, gameY, a.x, a.y);
                const dB = gameDistKm(gameX, gameY, b.x, b.y);
                return dA < dB ? a : b;
            });
            const distM = Math.round(gameDistKm(gameX, gameY, nearest.x, nearest.y) * 1000);
            if (distM < 500) {
                speak(`Daño del camión: ${Math.round(avgWear*100)}%. Taller a ${distM} metros. ¿Reparamos ahora?`, true);
                announcementCooldowns.damage = now;
            }
        } else if (avgWear > 0.6 && now - announcementCooldowns.damage > COOLDOWN_SECONDS.damage * 2) {
            speak(`Daño superior al ${Math.round(avgWear*100)}%. Busca un taller urgentemente.`, true);
            announcementCooldowns.damage = now;
        }
    }
    
    // 4. SEÑALES DE TRÁNSITO (<100m)
    if (now - announcementCooldowns.sign > COOLDOWN_SECONDS.sign && spatialIndex.signs) {
        const nearbySigns = queryNearby(spatialIndex.signs, gameX, gameY, PROXIMITY_GAME_UNITS.sign);
        if (nearbySigns.length > 0) {
            const sign = nearbySigns[0];
            const text = (sign.textItems && sign.textItems.filter(t => t.trim()).join(' ')) || '';
            const uid = sign.uid || '';
            if (!announcedEntities.signs.has(uid) && text) {
                // Filtrar solo señales con texto relevante
                const upperText = text.toUpperCase();
                if (upperText.includes('STOP') || upperText.includes('ALTO') || upperText.includes('DETEN')) {
                    speak(`Señal de alto a 100 metros. Detención obligatoria.`, false);
                } else if (upperText.includes('YIELD') || upperText.includes('CEDA')) {
                    speak(`Señal de ceda el paso a 100 metros.`, false);
                } else if (upperText.includes('VELOCIDAD') || upperText.includes('SPEED') || upperText.includes('LIMIT') || upperText.includes('KM/H') || upperText.includes('MPH')) {
                    const speedMatch = text.match(/\d{2,3}/);
                    const speed = speedMatch ? speedMatch[0] : '';
                    if (speed) speak(`Límite de velocidad ${speed} km/h. Reduce gradualmente.`, false);
                } else if (upperText.includes('CURVA') || upperText.includes('CURVE')) {
                    speak(`Señal de curva a 80 metros. Precaución con el remolque.`, false);
                } else if (upperText.includes('BIENVENID') || upperText.includes('WELCOME') || upperText.includes('ENTRADA')) {
                    const cityPart = text.replace(/ENTRADA A |BIENVENIDOS|WELCOME TO |BIENVENIDO A /gi, '').trim();
                    if (cityPart && !announcedEntities.cities.has(cityPart)) {
                        speak(`Entrando a ${cityPart}. Respeta los límites de velocidad.`, false);
                        announcedEntities.cities.add(cityPart);
                    }
                }
                announcedEntities.signs.add(uid);
                announcementCooldowns.sign = now;
            }
        }
    }
    
    // 5. MIRADORES TURÍSTICOS (<800m)
    if (now - announcementCooldowns.viewpoint > COOLDOWN_SECONDS.viewpoint && spatialIndex.viewpoints) {
        const nearbyVP = queryNearby(spatialIndex.viewpoints, gameX, gameY, PROXIMITY_GAME_UNITS.viewpoint);
        if (nearbyVP.length > 0) {
            const vp = nearbyVP[0];
            const distM = Math.round(gameDistKm(gameX, gameY, vp.x, vp.y) * 1000);
            if (!announcedEntities.viewpoints.has(vp.x.toFixed(0))) {
                speak(`Mirador turístico a ${distM} metros. Zona segura para estacionar y descansar.`, false);
                announcedEntities.viewpoints.add(vp.x.toFixed(0));
                announcementCooldowns.viewpoint = now;
            }
        }
    }
    
    // 6. PEAJES (<500m)
    if (now - announcementCooldowns.toll > COOLDOWN_SECONDS.toll && spatialIndex.tolls) {
        const nearbyTolls = queryNearby(spatialIndex.tolls, gameX, gameY, PROXIMITY_GAME_UNITS.toll);
        if (nearbyTolls.length > 0) {
            const toll = nearbyTolls[0];
            const tollKey = `${toll.x.toFixed(0)},${toll.y.toFixed(0)}`;
            if (!announcedEntities.tolls.has(tollKey)) {
                const distM = Math.round(gameDistKm(gameX, gameY, toll.x, toll.y) * 1000);
                if (distM < 500) {
                    speak(`Peaje a ${distM} metros. Ten el dinero listo y reduce la velocidad.`, true);
                    announcedEntities.tolls.add(tollKey);
                    announcementCooldowns.toll = now;
                }
            }
        }
    }
}
function checkNavigationAnnouncements(truckPos) {
    if (!currentRoute || !currentRoute.rutaOriginal || currentRoute.rutaOriginal.length === 0) return;
    if (!voiceEnabled || !voiceActivated) return;
    
    const routePoints = currentRoute.rutaOriginal;
    const totalPoints = routePoints.length;
    
    let closestIndex = 0;
    let minDistance = Infinity;
    for (let i = 0; i < totalPoints; i++) {
        const dist = calculateDistance(truckPos, routePoints[i]);
        if (dist < minDistance) {
            minDistance = dist;
            closestIndex = i;
        }
    }
    
    let remainingDistance = 0;
    for (let i = closestIndex; i < totalPoints - 1; i++) {
        remainingDistance += calculateDistance(routePoints[i], routePoints[i + 1]);
    }
    
    // Actualizar distancia restante en UI
    if (currentRoute) {
        currentRoute.distancia_km = remainingDistance;
        const distElement = document.getElementById('ui-dist');
        if (distElement) {
            if (remainingDistance < 1) {
                distElement.innerText = `${Math.round(remainingDistance * 1000)} m`;
            } else {
                distElement.innerText = `${remainingDistance.toFixed(1)} km`;
            }
        }
    }
    
    // Anuncio de destino próximo (solo una vez por rango de metros)
    if (remainingDistance <= 1 && remainingDistance > 0 && !destinationReached) {
        const metros = Math.round(remainingDistance * 1000);
        const announceKey = Math.floor(metros / 100) * 100; // Redondear a centena
        if (lastAnnouncedKm !== announceKey) {
            if (metros <= 1000 && metros > 500) speak(`Atención, estás a ${metros} metros de tu destino.`, true);
            else if (metros <= 500 && metros > 200) speak(`Precaución, destino a ${metros} metros.`, true);
            else if (metros <= 200 && metros > 50) speak(`Destino a ${metros} metros, prepárate.`, true);
            lastAnnouncedKm = announceKey;
        }
    }
    
    if (remainingDistance <= 0.05 && !destinationReached) {
        speak("Has llegado a tu destino. Buen viaje.", true);
        destinationReached = true;
        isManualRouteActive = false;
        // Resetear variables para próxima ruta (solo una vez)
        if (!window.destinationCleanupDone) {
            window.destinationCleanupDone = true;
            setTimeout(() => {
                lastAnnouncedKm = -1;
                lastTurnAnnounced = { index: -1, dist: 0, turnId: null };
                lastMilestoneKm = 999;
                announcedTurns.clear(); // Limpiar giros anunciados
                window.destinationCleanupDone = false;
            }, 2000);
        }
    }
    
    // Detectar giros SOLO en intersecciones (cambios de vía)
    const LOOKAHEAD = 30;
    const searchEnd = Math.min(closestIndex + LOOKAHEAD, totalPoints - 1);
    
    for (let i = closestIndex + 1; i < searchEnd - 1; i++) {
        const p1 = routePoints[i];
        
        // Verificar si este punto es un nodo de intersección en el grafo
        const nodeKey = `${p1[1].toFixed(2)},${p1[0].toFixed(2)}`;
        const node = grafoVial.nodos[nodeKey];
        if (!node || node.adj.length <= 2) continue; // No es intersección, ignorar
        
        const p0 = routePoints[i - 1];
        const p2 = routePoints[i + 1];
        
        // Calcular ángulo entre segmentos en la intersección
        const dirIn = Math.atan2(p1[0] - p0[0], p1[1] - p0[1]);
        const dirOut = Math.atan2(p2[0] - p1[0], p2[1] - p1[1]);
        let angleDeg = (dirOut - dirIn) * 180 / Math.PI;
        if (angleDeg > 180) angleDeg -= 360;
        if (angleDeg < -180) angleDeg += 360;
        const absAngle = Math.abs(angleDeg);
        
        if (absAngle < 8) continue; // Casi recto, ignorar
        
        // Calcular distancia a la intersección
        let distToTurn = 0;
        for (let j = closestIndex; j < i; j++) {
            distToTurn += calculateDistance(routePoints[j], routePoints[j + 1]);
        }
        
        // Evitar anuncios duplicados - crear ID único basado en coordenadas de la intersección
        const turnId = `${Math.round(p1[1])},${Math.round(p1[0])}`; // Coordenadas redondeadas (más estables)
        
        // Verificar si este giro ya fue anunciado
        if (announcedTurns.has(turnId)) {
            console.log('🔇 Giro ya anunciado:', turnId);
            continue;
        }
        
        let msg = null;
        let priority = false;
        
        // angleDeg > 0 = izquierda, angleDeg < 0 = derecha (coordenadas de mapa)
        if (absAngle > 45) {
            if (distToTurn < 0.15) {
                const dir = angleDeg > 0 ? "izquierda" : "derecha";
                msg = `Intersección. Gira a la ${dir}.`;
                priority = true;
            } else if (distToTurn < 0.5) {
                const m = Math.round(distToTurn * 1000);
                const dir = angleDeg > 0 ? "izquierda" : "derecha";
                msg = `En ${m} metros, intersección. Gira a la ${dir}.`;
            }
        } else if (absAngle > 20) {
            if (distToTurn < 0.1) {
                const dir = angleDeg > 0 ? "izquierda" : "derecha";
                msg = `Gira a la ${dir} en la intersección.`;
            } else if (distToTurn < 0.4) {
                const m = Math.round(distToTurn * 1000);
                const dir = angleDeg > 0 ? "izquierda" : "derecha";
                msg = `En ${m} metros, gira a la ${dir}.`;
            }
        }
        
        if (msg) {
            console.log('🔊 Anunciando giro:', turnId, '| Distancia:', Math.round(distToTurn * 1000) + 'm', '| Mensaje:', msg);
            console.log('📍 announcedTurns.size:', announcedTurns.size, '->', announcedTurns.size + 1);
            speak(msg, priority);
            announcedTurns.add(turnId); // Marcar este giro como anunciado
            lastTurnAnnounced = { index: i, dist: Math.round(distToTurn * 1000), turnId: turnId };
            return;
        }
    }
    
    // ANUNCIOS ADICIONALES DE NAVEGACIÓN
    // Hitos de distancia cada 50, 20, 10, 5 km (solo una vez)
    const distKm = remainingDistance;
    const milestones = [50, 20, 10, 5, 2];
    for (const m of milestones) {
        // Solo anunciar si estamos en el rango exacto (m a m+3 km) y no se ha anunciado antes
        if (distKm > m && lastMilestoneKm > m && distKm < m + 3) {
            const h = Math.floor(distKm / 75);
            const min = Math.round((distKm / 75 - h) * 60);
            if (h > 0) {
                speak(`Quedan ${Math.round(distKm)} kilómetros para tu destino, aproximadamente ${h} horas y ${min} minutos.`, false);
            } else {
                speak(`Quedan ${Math.round(distKm)} kilómetros para tu destino, aproximadamente ${min} minutos.`, false);
            }
            lastMilestoneKm = m;
            break;
        }
    }
}

// --- ACTUALIZACIÓN GPS ---
let gpsUpdating = false;
async function updateGPS() {
    if (gpsUpdating) return;
    gpsUpdating = true;
    try {
        const res = await fetch('/api/ets2/telemetry');
        if (!res.ok) return;
        const data = await res.json();
        if (!data.truck) return;
        const truck = data.truck;
        window.lastTruck = truck;
        const job = data.job || {};
        const nav = data.navigation || {};
        const trailer = data.trailer || {};
        
        // Debug dirección (solo 3 veces)
        if (window.debugDirCount === undefined) window.debugDirCount = 0;
        if (window.debugDirCount < 3) {
            console.log(`📍 heading ETS2: ${(truck.placement.heading * 180).toFixed(1)}° | head.x: ${(truck.head?.x * 180).toFixed(1)}°`);
            window.debugDirCount++;
        }
        
        const elSpeed = document.getElementById('ui-speed');
        truckCurrentSpeed = Math.abs(truck.speed);
        if (elSpeed) elSpeed.innerText = Math.round(truckCurrentSpeed);
        
        // Letrero de velocidad máxima
        const speedLimit = nav.speedLimit || 0;
        const signEl = document.getElementById('speed-limit-sign');
        const limitEl = document.getElementById('ui-speed-limit');
        if (signEl && limitEl) {
            if (speedLimit > 0) {
                signEl.style.display = 'flex';
                limitEl.innerText = speedLimit;
                // Rojo si excede el límite
                if (truckCurrentSpeed > speedLimit + 2) {
                    elSpeed.style.setProperty('color', '#ff3333', 'important');
                } else {
                    elSpeed.style.setProperty('color', '', 'important');
                }
            } else {
                signEl.style.display = 'none';
                elSpeed.style.setProperty('color', '', 'important');
            }
        }
        
        const elFuel = document.getElementById('ui-fuel-percent');
        const fuelPct = (truck.fuel / truck.fuelCapacity) * 100;
        if (elFuel) elFuel.innerText = Math.round(fuelPct) + "%";
        
        // Animación de combustible con pasos de 5%
        const fuelIcon = document.getElementById('fuel-r');
        if (fuelIcon) {
            // Redondear a múltiplo de 5%
            let displayFuelPct = Math.round(fuelPct / 5) * 5;
            
            // Si el motor está apagado, animar bajada gradual
            if (!truck.engineOn) {
                if (!window.fuelAnimInterval && displayFuelPct > 0) {
                    window.fuelAnimInterval = setInterval(() => {
                        const el = document.getElementById('fuel-r');
                        if (el && window.fuelAnimDisplay > 0) {
                            window.fuelAnimDisplay = Math.max(0, window.fuelAnimDisplay - 5);
                            renderFuelIcon(el, window.fuelAnimDisplay, false);
                            if (window.fuelAnimDisplay <= 0) {
                                clearInterval(window.fuelAnimInterval);
                                window.fuelAnimInterval = null;
                            }
                        }
                    }, 100);
                }
            } else {
                // Motor encendido: mostrar nivel actual
                if (window.fuelAnimInterval) {
                    clearInterval(window.fuelAnimInterval);
                    window.fuelAnimInterval = null;
                }
                window.fuelAnimDisplay = displayFuelPct;
                renderFuelIcon(fuelIcon, displayFuelPct, true);
            }
        }
        
        const cargoElement = document.getElementById('ui-cargo');
        if (cargoElement && trailer) {
            const name = trailer.attached && trailer.name ? trailer.name : 'Sin Carga';
            const mass = trailer.mass || 0;
            const tons = (mass / 1000).toFixed(1);
            cargoElement.innerText = mass > 0 ? `${name} (${tons}t)` : name;
        }
        
        // Extraer coordenadas del camión (MOVIDO AQUÍ para que esté disponible antes)
        const { x, z, heading } = truck.placement;
        const truckPos = [-z, x];
        truckCurrentPos = truckPos;
        if (marker) marker.setLatLng(truckPos);
        
        // Actualizar color del marcador según motor
        const dot = document.getElementById('truck-dot');
        const circle = document.querySelector('#arrow-container > div:first-child');
        if (dot && circle && truck.engineOn !== undefined) {
            const color = truck.engineOn ? '#00ff41' : '#ff3333';
            const glow = truck.engineOn ? '#00ff41' : '#ff3333';
            dot.style.background = color;
            dot.style.boxShadow = `0 0 8px ${glow}, 0 0 16px ${glow}`;
            circle.style.borderColor = color;
            circle.style.boxShadow = `0 0 12px ${glow}, 0 0 24px ${glow}`;
        }
        
        if (!job.destinationCity) {
            hasStartedJob = false;
            lastJobId = null;
        }
        
        if (job.destinationCity && !isCompanyRouteActive && !isManualRouteActive) {
            const graphPos = [x, -z];
            const newRoute = await calculateDynamicRoute(graphPos, job.destinationCity, job.destinationCompany, job.sourceCity, job.sourceCompany);
            if (newRoute && newRoute.distancia_km > 0) {
                const routeChanged = !currentRoute || 
                    currentRoute.destino !== newRoute.destino || 
                    Math.abs((currentRoute.distancia_km || 0) - newRoute.distancia_km) > 10;
                
                if (routeChanged) {
                    currentRoute = newRoute;
                    destinationReached = false;
                    lastAnnouncedKm = Infinity;
                    lastTurnAnnounced = { index: -1, dist: 0, turnId: null };
                    lastMilestoneKm = 0;
                    // NO limpiar announcedTurns aquí - solo al llegar al destino
                    drivingStartTime = Date.now() / 1000;
                    updateRouteUI();
                }
            }
        }
        
        if (currentRoute && currentRoute.rutaOriginal) {
            checkNavigationAnnouncements(truckPos);
        }
        
        // Verificar proximidad a POIs y anuncios
        checkProximityAnnouncements(truck, x, z);
        
        // Actualizar ETA periódicamente basado en velocidad actual
        if (currentRoute && currentRoute.distancia_km > 0) {
            updateETA();
        }
        
        const headingDegrees = heading * 180;
        const arrowContainer = document.querySelector('#arrow-container');
        
        // Rotar flecha del camión según su heading
        if (arrowContainer) {
            arrowContainer.style.transform = `rotate(${headingDegrees - 45}deg)`;
        }
        
        // Seguir al camión si está activado
        if (followTruck && map) {
            map.panTo(truckPos, { animate: true, duration: 0.3, easeLinearity: 0.25 });
            const mapDiv = document.getElementById('map');
            if (mapDiv) {
                mapDiv.style.transformOrigin = '50% 50%';
                mapDiv.style.transform = 'rotate(-180deg)';
            }
            document.body.classList.add('map-rotated');
        } else {
            const mapDiv = document.getElementById('map');
            if (mapDiv) mapDiv.style.transform = '';
            document.body.classList.remove('map-rotated');
        }
        if (layerRuta) layerRuta.clearLayers();
        
        // Dibujar ruta activa (trabajo del juego o ruta manual)
        if (currentRoute && currentRoute.rutaOriginal && currentRoute.rutaOriginal.length > 0) {
            // Encontrar punto más cercano al truck (ahora que startNode es correcto)
            let nearestIndex = 0;
            let minDist = Infinity;
            currentRoute.rutaOriginal.forEach((node, idx) => {
                const nx = Array.isArray(node) ? node[1] : node.x;
                const ny = Array.isArray(node) ? node[0] : node.y;
                const d = Math.sqrt(Math.pow(nx - truckPos[1], 2) + Math.pow(ny - truckPos[0], 2));
                if (d < minDist) { minDist = d; nearestIndex = idx; }
            });
            
            const remainingPath = currentRoute.rutaOriginal.slice(nearestIndex);
            
            if (remainingPath && remainingPath.length > 0) {
                // Actualizar distancia restante
                let realDistance = 0;
                for (let i = 1; i < remainingPath.length; i++) {
                    const pPrev = remainingPath[i-1];
                    const pCurr = remainingPath[i];
                    const px = Array.isArray(pPrev) ? pPrev[1] : pPrev.x;
                    const py = Array.isArray(pPrev) ? pPrev[0] : pPrev.y;
                    const cx = Array.isArray(pCurr) ? pCurr[1] : pCurr.x;
                    const cy = Array.isArray(pCurr) ? pCurr[0] : pCurr.y;
                    const dx = cx - px;
                    const dy = cy - py;
                    realDistance += Math.sqrt(dx*dx + dy*dy);
                }
                currentRoute.distancia_km = realDistance * 0.003875;
                updateRouteUI();
                
                // Dibujar ruta
                const zoom = map ? map.getZoom() : -3;
                // Factor cap: no crece más allá del zoom donde desaparecen las empresas (-3)
                const factor = Math.max(2, Math.min((0 - zoom) / 4 * 2, 2));
                
                // Color amarillo/naranja para rutas manuales, morado para trabajo del juego
                const isJobRoute = job.destinationCity && !isCompanyRouteActive;
                const outerColor = isJobRoute ? '#8B5CF6' : '#FFD700';
                const innerColor = isJobRoute ? '#8B5CF6' : '#FFA500';
                const centerColor = '#FFFFFF';
                
                L.polyline([truckPos, ...remainingPath], { color: outerColor, weight: 16 * factor, opacity: 0.25 }).addTo(layerRuta);
                L.polyline([truckPos, ...remainingPath], { color: innerColor, weight: 10 * factor, opacity: isJobRoute ? 1 : 0.9 }).addTo(layerRuta);
                L.polyline([truckPos, ...remainingPath], { color: centerColor, weight: 3 * factor, opacity: 0.6 }).addTo(layerRuta);
            }
        }
        
        if (nav.estimatedTime && !currentRoute) {
            // Solo mostrar tiempo del juego si NO hay ruta activa
            try {
                const timePart = nav.estimatedTime.split('T')[1];
                if (timePart) {
                    const [h, m] = timePart.replace('Z', '').split(':');
                    const gameMinutes = parseInt(h) * 60 + parseInt(m);
                    const realMinutes = Math.round(gameMinutes / 15);
                    const realHours = Math.floor(realMinutes / 60);
                    const realMins = realMinutes % 60;
                    
                    const timeElement = document.getElementById('ui-game-time');
                    if (timeElement) {
                        if (realHours > 0) {
                            timeElement.innerText = `${realHours}h ${realMins}m`;
                        } else {
                            timeElement.innerText = `${realMins} min`;
                        }
                    }
                }
            } catch(e) {}
        }
        
    } catch (e) {
        console.error("Error GPS:", e);
    } finally {
        gpsUpdating = false;
    }
}

/*
// --- MODO OSCURO ---
function applyDarkMode(enable) {
    if (enable) {
        document.body.classList.add('dark-mode');
        const btn = document.getElementById('toggle-darkmode');
        if (btn) {
            btn.innerHTML = '☀️';
            btn.classList.add('dark-active');
            btn.title = 'Modo claro';
        }
        console.log('🌙 Modo oscuro activado');
    } else {
        document.body.classList.remove('dark-mode');
        const btn = document.getElementById('toggle-darkmode');
        if (btn) {
            btn.innerHTML = '🌙';
            btn.classList.remove('dark-active');
            btn.title = 'Modo oscuro';
        }
        console.log('☀️ Modo claro activado');
    }
}

function toggleDarkMode() {
    // Verificar si existe la función del nuevo sistema en mapa.html
    if (typeof window.toggleDarkModeManual === 'function') {
        window.toggleDarkModeManual();
    } else if (typeof window.toggleDarkMode === 'function' && window.toggleDarkMode !== toggleDarkMode) {
        // Evitar recursión
        window.toggleDarkMode();
    } else {
        // Fallback al método original
        const isDark = document.body.classList.contains('dark-mode');
        if (isDark) {
            manualDarkMode = false;
            applyDarkMode(false);
        } else {
            manualDarkMode = true;
            applyDarkMode(true);
        }
    }
}

function checkAutoDarkMode() {
    if (manualDarkMode !== null) return;
    
    const now = new Date();
    const hours = now.getHours();
    const isDarkMode = hours >= 18 || hours < 6;
    
    if (isDarkMode) {
        if (!document.body.classList.contains('dark-mode')) {
            document.body.classList.add('dark-mode');
            const btn = document.getElementById('toggle-darkmode');
            if (btn) {
                btn.innerHTML = '☀️';
                btn.classList.add('dark-active');
            }
            console.log('🌙 Modo oscuro automático - Hora:', hours + ':00');
        }
    } else {
        if (document.body.classList.contains('dark-mode')) {
            document.body.classList.remove('dark-mode');
            const btn = document.getElementById('toggle-darkmode');
            if (btn) {
                btn.innerHTML = '🌙';
                btn.classList.remove('dark-active');
            }
            console.log('☀️ Modo claro automático - Hora:', hours + ':00');
        }
    }
}

function resetToAutoDarkMode() {
    // Usar el nuevo método del mapa.html si existe
    if (typeof window.resetearModoAutomatico === 'function') {
        window.resetearModoAutomatico();
    } else {
        manualDarkMode = null;
        checkAutoDarkMode();
        console.log('🔄 Modo restablecido a automático');
    }
}
*/

// --- FUNCIONES UI ---
function updateLoadingProgress(percent) {
    const progressBar = document.getElementById('loading-progress-bar');
    if (progressBar) progressBar.style.width = percent + '%';
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
        setTimeout(() => overlay.style.display = 'none', 500);
    }
}

// --- FUNCIONES GLOBALES ---
window.toggleFollow = function() {
    followTruck = !followTruck;
    updateFollowButton();
};

function updateFollowButton() {
    const btn = document.getElementById('toggle-follow');
    if (btn) {
        btn.innerHTML = followTruck ? "🧭 Siguiendo vehículo" : "🧭 Modo libre";
        btn.style.background = followTruck ? "linear-gradient(135deg, #38B6FF, #2a8fcc)" : "linear-gradient(135deg, #555, #444)";
    }
}

window.togglePanel = function() {
    const panel = document.getElementById('main-panel');
    const btn = document.getElementById('min-max-btn');
    const extra = document.getElementById('extra-content');
    if (panel) {
        panel.classList.toggle('minimized-panel');
        if (panel.classList.contains('minimized-panel')) {
            if (btn) btn.innerHTML = "+";
            if (extra) extra.style.display = 'none';
        } else {
            if (btn) btn.innerHTML = "−";
            if (extra) extra.style.display = 'block';
        }
    }
};



window.deactivateCompanyRoute = function() {
    selectedCompany = null;
    selectedCompanyCoords = null;
    isCompanyRouteActive = false;
    isManualRouteActive = false;
    currentRoute = null;
    if (layerRuta) layerRuta.clearLayers();
    const btn = document.getElementById('toggle-company-route');
    const panel = document.getElementById('companies-panel');
    if (btn) btn.style.display = 'none';
    if (panel) panel.style.display = 'none';
    speak("Ruta cancelada.", false);
};

// --- INICIALIZACIÓN ---
(async () => {
    console.log('🚀 Iniciando MapKalo...');
    updateLoadingProgress(10);
   // checkAutoDarkMode(); //
    
    map = L.map('map', { 
        crs: L.CRS.Simple, 
        zoomControl: false, 
        minZoom: -7, 
        maxZoom: 0,
        rotate: false,
    }).setView([0, 0], -3);
    
    // Debug: verificar si el mapa se inicializó
    console.log('Map initialized, container:', document.getElementById('map'));
    
    updateLoadingProgress(20);
    
    layerCarreteras = L.layerGroup().addTo(map);
    layerRuta = L.layerGroup().addTo(map);
    layerFerries = L.layerGroup().addTo(map);
    
    const arrowIcon = L.divIcon({
        className: 'truck-marker',
        html: '<div id="arrow-container" style="position:relative;width:48px;height:48px;"><div style="position:absolute;top:0;left:0;width:48px;height:48px;border-radius:50%;border:4px solid #38B6FF;box-shadow:0 0 18px #38B6FF,0 0 36px rgba(56,182,255,0.4);box-sizing:border-box;"></div><div id="truck-dot" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:16px;height:16px;border-radius:50%;background:#38B6FF;box-shadow:0 0 12px #38B6FF,0 0 24px rgba(56,182,255,0.6);"></div></div>',
        iconSize: [56, 56],
        iconAnchor: [28, 28]
    });
    marker = L.marker([0, 0], { icon: arrowIcon, zIndexOffset: 1000 }).addTo(map);
    
    // Iniciar Web Worker para cálculo de rutas en segundo plano
    try {
        routeWorker = new Worker('route.worker.js');
        routeWorker.onerror = (err) => {
            console.error('Error en Worker:', err.message);
            routeWorker = null;
        };
        console.log('Worker de rutas creado');
    } catch (e) {
        console.error('Worker no disponible:', e.message);
        routeWorker = null;
    }
    
    updateLoadingProgress(30);
    
    try {
        const mRes = await fetch('/data/mapa_completo.geojson');
        const mJson = await mRes.json();
        updateLoadingProgress(50);
        
        const eRes = await fetch('/data/empresas_relacionadas.geojson');
        rawCompData = eRes.ok ? await eRes.json() : { features: [] };
        updateLoadingProgress(70);
        
        const uRes = await fetch('/data/usa-cities.geojson');
        rawUsaCities = uRes.ok ? await uRes.json() : { features: [] };
        updateLoadingProgress(85);
        
        buildGraph(mJson);
        
        // Enviar grafo al Worker como arrays (más rápido que structured clone)
        if (routeWorker) {
            const nodos = grafoVial.nodos;
            const keys = Object.keys(nodos);
            const n = keys.length;
            const x = new Float64Array(n);
            const y = new Float64Array(n);
            let totalEdges = 0;
            const idToIdx = {};
            keys.forEach((k, i) => { x[i] = nodos[k].x; y[i] = nodos[k].y; idToIdx[k] = i; totalEdges += nodos[k].adj.length; });
            
            const ef = new Int32Array(totalEdges);
            const et = new Int32Array(totalEdges);
            const ew = new Float64Array(totalEdges);
            const aStart = new Int32Array(n);
            const aCount = new Int32Array(n);
            let ei = 0;
            keys.forEach((k, i) => {
                aStart[i] = ei;
                aCount[i] = nodos[k].adj.length;
                nodos[k].adj.forEach(e => {
                    ef[ei] = i;
                    et[ei] = idToIdx[e.to] !== undefined ? idToIdx[e.to] : -1;
                    ew[ei] = e.weight;
                    ei++;
                });
            });
            
            routeWorker.postMessage({
                type: 'INIT',
                payload: { keys, x, y, edgeFrom: ef, edgeTo: et, edgeWeight: ew, adjStart: aStart, adjCount: aCount }
            });
            console.log('Worker: grafo enviado (' + n + ' nodos, ' + totalEdges + ' aristas)');
        }
        
        updateLoadingProgress(95);
        
        const styleCarreteras = () => ({ color: '#5a6c7d', weight: 1.5, opacity: 0.8 });
        const blockedFids = new Set([37615,37616,37623,37624,40129,40130,40131,40132,37627,37628,37635,37636,37619,37620,37643,37644]);
        L.geoJSON(mJson, { 
            style: styleCarreteras,
            filter: feature => !blockedFids.has(feature.properties.fid)
        }).addTo(layerCarreteras);
        
        const layerCiudades = L.layerGroup().addTo(map);
        L.geoJSON(rawUsaCities, {
            pointToLayer: (feature, latlng) => {
                const punto = L.circleMarker(latlng, { 
                    radius: 6, 
                    fillColor: "#38B6FF", 
                    color: "#fff", 
                    weight: 2, 
                    fillOpacity: 0.9
                });
                const textoIcon = L.divIcon({
                    className: 'etiqueta-mapa',
                    html: `<div class="etiqueta-inner" style="color:#fff;text-shadow:0 0 4px #000,0 0 8px #000;font-weight:700;font-size:12px;"><span>${feature.properties.name}</span></div>`,
                    iconSize: [100, 24],
                    iconAnchor: [50, 28]
                });
                const etiqueta = L.marker(latlng, { icon: textoIcon, interactive: false });
                return L.featureGroup([punto, etiqueta]);
            }
        }).addTo(layerCiudades);
        
        // Cargar POIs (gasolineras, talleres, estacionamientos)
        layerFacilities = L.layerGroup();
        try {
            const poisRes = await fetch('/data/usa-pois.json');
            rawPois = poisRes.ok ? await poisRes.json() : [];
            
            const ferryRes = await fetch('/data/usa-ferries.json');
            const rawFerries = ferryRes.ok ? await ferryRes.json() : [];
            
            const facilities = rawPois.filter(p => 
                p.type === 'facility' && 
                ['gas_ico', 'service_ico', 'parking_ico', 'garage_large_ico'].includes(p.icon)
            );
            
            const iconStyles = {
                'gas_ico': { icon: '/icons/gas_ico.png', size: [20, 20], label: 'Gasolinera' },
                'service_ico': { icon: '/icons/service_ico.png', size: [20, 20], label: 'Taller' },
                'parking_ico': { icon: '/icons/parking_ico.png', size: [20, 20], label: 'Estacionamiento' },
                'garage_large_ico': { icon: '/icons/garage_large_ico.png', size: [22, 22], label: 'Taller grande' }
            };
            
            facilities.forEach(f => {
                const style = iconStyles[f.icon];
                if (!style) return;
                const latlng = L.latLng(-f.y, f.x);
                const icon = L.divIcon({
                    html: `<img src="${style.icon}" class="poi-icon" style="width:${style.size[0]}px;height:${style.size[1]}px;display:block;">`,
                    iconSize: style.size,
                    iconAnchor: [style.size[0] / 2, style.size[1] / 2],
                    className: ''
                });
                const marker = L.marker(latlng, { icon: icon, interactive: true });
                marker.addTo(layerFacilities);
            });
            
            console.log(`⛽ POIs cargados: ${facilities.length} instalaciones`);
            
            // Cargar empresas con sus iconos (65% = 83x21)
            layerCompanies = L.layerGroup();
            const companyPois = rawPois.filter(p => p.type === 'company' && p.label);
            companyPois.forEach(c => {
                const latlng = L.latLng(-c.y, c.x);
                const iconUrl = `/icons/${c.icon}.png`;
                const icon = L.divIcon({
                    html: `<img src="${iconUrl}" class="poi-icon" style="width:83px;height:21px;display:block;" onerror="this.style.display='none'">`,
                    iconSize: [83, 21],
                    iconAnchor: [41, 10],
                    className: ''
                });
                const marker = L.marker(latlng, { icon: icon, interactive: false });
                marker.addTo(layerCompanies);
            });
            console.log(`🏢 Empresas cargadas: ${companyPois.length}`);
        } catch(e) {
            console.error('Error cargando POIs:', e);
        }
        
        // Cargar ferries (puertos y rutas marítimas)
        try {
            const ferriesRes = await fetch('/data/usa-ferries.json');
            const ferriesData = ferriesRes.ok ? await ferriesRes.json() : [];
            
            const ferryIcon = L.divIcon({
                html: '<img src="/icons/port_overlay.png" class="poi-icon" style="width:24px;height:24px;display:block;">',
                iconSize: [24, 24],
                iconAnchor: [12, 12],
                className: ''
            });
            
            const processedConnections = new Set();
            
            ferriesData.forEach(port => {
                const portLatlng = L.latLng(-port.y, port.x);
                
                const marker = L.marker(portLatlng, { icon: ferryIcon, interactive: true });
                marker.addTo(layerFerries);
                
                port.connections.forEach(conn => {
                    const connKey = [port.token, conn.token].sort().join('-');
                    if (processedConnections.has(connKey)) return;
                    processedConnections.add(connKey);
                    
                    const destLatlng = L.latLng(-conn.y, conn.x);
                    
                    let linePoints = [portLatlng, destLatlng];
                    if (conn.intermediatePoints && conn.intermediatePoints.length > 0) {
                        const midPoints = conn.intermediatePoints.map(p => L.latLng(-p.y, p.x));
                        linePoints = [portLatlng, ...midPoints, destLatlng];
                    }
                    
                    const routeLine = L.polyline(linePoints, {
                        color: '#00E5FF',
                        weight: 3,
                        opacity: 0.5,
                        dashArray: '10, 8',
                        className: 'ferry-line'
                    });
                    routeLine.addTo(layerFerries);
                });
            });
            
            console.log(`🚢 Ferries cargados: ${ferriesData.length} puertos`);
        } catch(e) {
            console.error('Error cargando ferries:', e);
        }
        
        // Cargar peajes (toll booths)
        let tollLocations = [];
        try {
            const tollTokens = new Set(['ok_1g00b','ok_1g00c','ok_1g00d','ok_3a00k','ok_2l009','ok_3a00i','reskin_3a007','reskin_1300k','la_0t005','ok_1000d']);
            const modelsRes = await fetch('/data/usa-models.json');
            const modelsData = modelsRes.ok ? await modelsRes.json() : [];
            tollLocations = modelsData.filter(m => tollTokens.has(m.token));
            
            const tollIcon = L.divIcon({
                html: '<img src="/icons/toll_ico.png" class="poi-icon" style="width:22px;height:22px;display:block;">',
                iconSize: [22, 22],
                iconAnchor: [11, 11],
                className: ''
            });
            
            tollLocations.forEach(t => {
                const latlng = L.latLng(-t.y, t.x);
                const marker = L.marker(latlng, { icon: tollIcon, interactive: true });
                marker.addTo(layerFacilities);
            });
            
            console.log(`🚧 Peajes cargados: ${tollLocations.length}`);
        } catch(e) {
            console.error('Error cargando peajes:', e);
        }
        
        // Construir índices espaciales para anuncios de proximidad
        if (rawPois) {
            const gasPois = rawPois.filter(p => p.type === 'facility' && p.icon === 'gas_ico');
            spatialIndex.gas = buildSpatialIndex(gasPois);
            
            const servicePois = rawPois.filter(p => p.type === 'facility' && ['service_ico', 'garage_large_ico'].includes(p.icon));
            spatialIndex.service = buildSpatialIndex(servicePois);
            
            const viewpointPois = rawPois.filter(p => p.type === 'viewpoint');
            spatialIndex.viewpoints = buildSpatialIndex(viewpointPois);
        }
        
        if (tollLocations.length > 0) {
            spatialIndex.tolls = buildSpatialIndex(tollLocations);
        }
        
        if (rawUsaCities && rawUsaCities.features) {
            const citiesList = rawUsaCities.features.map(f => {
                return {
                    x: f.geometry.coordinates[0],
                    y: -f.geometry.coordinates[1], // GeoJSON y está negado, convertir a coordenadas de juego
                    name: f.properties.name
                };
            });
            spatialIndex.cities = buildSpatialIndex(citiesList);
        }
        
        // Cargar señales para anuncios
        try {
            const signsRes = await fetch('/data/usa-signs.json');
            const signsData = signsRes.ok ? await signsRes.json() : [];
            const textSigns = signsData.filter(s => s.textItems && s.textItems.some(t => t.trim()));
            spatialIndex.signs = buildSpatialIndex(textSigns);
            console.log(`🚦 Señales con texto indexadas: ${textSigns.length}`);
        } catch(e) {
            console.error('Error cargando señales:', e);
        }
        
        // Cargar datos de carreteras para anuncios de giro
        try {
            const roadRes = await fetch('/data/usa-roads.json');
            rawRoads = roadRes.ok ? await roadRes.json() : [];
            
            const looksRes = await fetch('/data/usa-roadLooks.json');
            const looksData = looksRes.ok ? await looksRes.json() : [];
            for (const l of looksData) {
                const lanes = (l.lanesLeft || []).join(' ') + ' ' + (l.lanesRight || []).join(' ');
                const name = (l.name || '').toLowerCase();
                if (lanes.includes('highway') || lanes.includes('freeway') || lanes.includes('expressway') 
                    || name.includes('highway') || name.includes('freeway') || name.includes('expressway')) {
                    roadHighwayTokens.add(l.token);
                }
            }
            console.log(`🛣️ Carreteras cargadas: ${rawRoads.length} segmentos, ${roadHighwayTokens.size} tipos autopista`);
        } catch(e) {
            console.error('Error cargando carreteras:', e);
        }
        
        updateLoadingProgress(100);
        
        // Empresas visibles por defecto (respetando zoom)
        updateCompaniesLayer();
        
        setInterval(updateGPS, 500);
        setTimeout(hideLoadingOverlay, 1000);
        console.log('MapKalo inicializado');
        
        // Iniciar dashboard minimizado en móvil
        if (window.innerWidth <= 768) {
            const extra = document.getElementById('extra-content');
            const btn = document.getElementById('min-max-btn');
            if (extra) extra.style.display = 'none';
            if (btn) btn.innerHTML = '+';
        }
        
    } catch (error) {
        console.error('❌ Error cargando datos:', error);
        setTimeout(hideLoadingOverlay, 1500);
    }

    // Eventos UI
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const container = document.getElementById('search-container');
            if (container) {
                const isVisible = container.style.display === 'block';
                container.style.display = isVisible ? 'none' : 'block';
                if (!isVisible) {
                    const input = document.getElementById('search-input');
                    if (input) input.focus();
                } else {
                    updateFollowButton();
                }
            }
        });
    }
    
    // Cerrar search-container al hacer click fuera
    document.addEventListener('click', (e) => {
        const container = document.getElementById('search-container');
        const searchBtn = document.getElementById('search-btn');
        if (container && container.style.display === 'block' && 
            !container.contains(e.target) && !searchBtn.contains(e.target)) {
            container.style.display = 'none';
            updateFollowButton();
        }
    });
    
    const closeCompanies = document.getElementById('close-companies');
    if (closeCompanies) {
        closeCompanies.addEventListener('click', () => {
            document.getElementById('companies-panel').style.display = 'none';
            updateFollowButton();
        });
    }
    
    const toggleVoiceBtn = document.getElementById('toggle-voice');
    if (toggleVoiceBtn) {
        toggleVoiceBtn.addEventListener('click', () => {
            if (!voiceActivated) voiceActivated = true;
            toggleVoice();
        });
    }
    
    const togglePoisBtn = document.getElementById('toggle-pois');
    if (togglePoisBtn) {
        togglePoisBtn.addEventListener('click', () => {
            facilitiesVisible = !facilitiesVisible;
            if (facilitiesVisible) {
                layerFacilities.addTo(map);
                togglePoisBtn.style.setProperty('background', 'linear-gradient(135deg, #FF8C00, #FFD700)', 'important');
                togglePoisBtn.style.setProperty('color', '#000', 'important');
                togglePoisBtn.style.setProperty('border-color', '#FFD700', 'important');
            } else {
                if (map && map.hasLayer && map.hasLayer(layerFacilities)) map.removeLayer(layerFacilities);
                togglePoisBtn.style.setProperty('background', '', 'important');
                togglePoisBtn.style.setProperty('color', '', 'important');
                togglePoisBtn.style.setProperty('border-color', '', 'important');
            }
        });
    }
    
    const toggleCompaniesBtn = document.getElementById('toggle-companies');
    if (toggleCompaniesBtn) {
        toggleCompaniesBtn.addEventListener('click', () => {
            companiesVisible = !companiesVisible;
            updateCompaniesLayer();
            if (companiesVisible) {
                toggleCompaniesBtn.style.setProperty('background', 'linear-gradient(135deg, #FF8C00, #FFD700)', 'important');
                toggleCompaniesBtn.style.setProperty('color', '#000', 'important');
                toggleCompaniesBtn.style.setProperty('border-color', '#FFD700', 'important');
            } else {
                toggleCompaniesBtn.style.setProperty('background', '', 'important');
                toggleCompaniesBtn.style.setProperty('color', '', 'important');
                toggleCompaniesBtn.style.setProperty('border-color', '', 'important');
            }
        });
        toggleCompaniesBtn.style.setProperty('background', 'linear-gradient(135deg, #FF8C00, #FFD700)', 'important');
        toggleCompaniesBtn.style.setProperty('color', '#000', 'important');
        toggleCompaniesBtn.style.setProperty('border-color', '#FFD700', 'important');
    }
    
    // Pantalla completa
    let wakeLock = null;
    const fsBtn = document.getElementById('toggle-fullscreen');
    if (fsBtn) {
        fsBtn.addEventListener('click', async () => {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen().catch(() => {});
                try { wakeLock = await navigator.wakeLock.request('screen'); } catch(e) {}
                fsBtn.innerHTML = '⛶';
            } else {
                await document.exitFullscreen();
                if (wakeLock) { wakeLock.release(); wakeLock = null; }
                fsBtn.innerHTML = '⛶';
            }
        });
    }
    
    map.on('zoomend', updateCompaniesLayer);
    
    // Click en el mapa para seleccionar ciudad
    map.on('click', async (e) => {
        if (!rawUsaCities) return;
        const clickLat = e.latlng.lat;
        const clickLng = e.latlng.lng;
        
        // Buscar ciudad más cercana
        let nearestCity = null;
        let nearestDist = 300;
        rawUsaCities.features.forEach(city => {
            const coords = city.geometry.coordinates;
            const d = Math.sqrt(Math.pow(coords[0] - clickLng, 2) + Math.pow(coords[1] - clickLat, 2));
            if (d < nearestDist) { nearestDist = d; nearestCity = city; }
        });
        
        if (!nearestCity) return;
        const destCoords = nearestCity.geometry.coordinates;
        const destName = nearestCity.properties.name;
        
        const endNode = findNearestNode(destCoords);
        if (!endNode) {
            speak(`No se puede establecer ruta a ${destName}.`, true);
            return;
        }
        
        followTruck = false;
        updateFollowButton();
        
        selectedCompany = null;
        selectedCompanyCoords = destCoords;
        isCompanyRouteActive = true;
        isManualRouteActive = true;
        destinationReached = false;
        lastAnnouncedKm = Infinity;
        lastTurnAnnounced = { index: -1, dist: 0, turnId: null };
        lastMilestoneKm = 0;
        
        let startNode = null;
        if (truckCurrentPos && truckCurrentPos.length === 2) {
            startNode = findNearestNode([truckCurrentPos[1], truckCurrentPos[0]]);
        }
        if (!startNode && marker) {
            startNode = findNearestNode([marker.getLatLng().lng, marker.getLatLng().lat]);
        }
        
        if (startNode && endNode) {
            const { path, distance } = await solvePathAsync(startNode, endNode);
            if (path && path.length > 0) {
                currentRoute = {
                    rutaOriginal: path, ruta: path,
                    distancia_km: distance * 0.003875,
                    distancia_restante: distance * 0.003875,
                    origen: 'Mi ubicación', origenEmpresa: null,
                    destino: destName, destinoEmpresa: null
                };
        updateRouteUI();
    }
}
            
        const routeBtn = document.getElementById('toggle-company-route');
        if (routeBtn) routeBtn.style.display = 'block';
        if (document.getElementById('ui-dest')) {
            document.getElementById('ui-dest').innerHTML = `<span class="route-city">${destName}</span>`;
        }
        
        speak(`Ruta a ${destName} establecida.`, true);
    });
    
    /*
    const darkModeBtn = document.getElementById('toggle-darkmode');
    if (darkModeBtn) {
        // No agregar eventos duplicados si ya están en mapa.html
        // Los eventos ya se manejan en mapa.html, solo sincronizar
        darkModeBtn.onclick = null; // Limpiar para evitar conflictos
        darkModeBtn.ondblclick = null;
    }
    */

        const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const citiesList = document.getElementById('cities-list');
            if (!citiesList) return;
            citiesList.innerHTML = '';
            if (!rawUsaCities || query.length === 0) return;
            const filtered = rawUsaCities.features.filter(f => f.properties.name.toLowerCase().includes(query)).slice(0, 10);
            filtered.forEach(city => {
                const div = document.createElement('div');
                div.className = 'city-item';
                div.textContent = city.properties.name;
                div.addEventListener('click', () => {
                    if (searchInput) searchInput.value = city.properties.name;
                    if (followTruck) { followTruck = false; updateFollowButton(); }
                    const cityCoords = city.geometry.coordinates;
                    if (map && cityCoords) { map.setView([cityCoords[1], cityCoords[0]], -1, { animate: true }); }
                    const relatedCompanies = rawCompData.features.filter(f => f.properties.ciudad === city.properties.token);
                    const panel = document.getElementById('companies-panel');
                    const companiesList = document.getElementById('companies-list');
                    const title = document.getElementById('companies-title');
                    if (title) title.textContent = `Empresas en ${city.properties.name}`;
                    if (companiesList) {
                        companiesList.innerHTML = '';
                        const cityButton = document.createElement('button');
                        cityButton.className = 'company-item';
                        cityButton.style.background = 'linear-gradient(135deg, #38B6FF, #2a8fcc)';
                        cityButton.style.marginBottom = '15px';
                        cityButton.innerHTML = `<span class="company-name">📍 ${city.properties.name}</span><span class="company-city">Seleccionar como destino</span>`;
                        cityButton.addEventListener('click', async (e) => {
                            e.stopPropagation();
                            const endNode = findNearestNode(cityCoords);
                            if (!endNode) { speak(`No se puede establecer ruta a ${city.properties.name}.`, true); return; }
                            selectedCompany = null; selectedCompanyCoords = cityCoords;
                            isCompanyRouteActive = true; isManualRouteActive = true;
                            destinationReached = false;
                            lastAnnouncedKm = Infinity;
                            lastTurnAnnounced = { index: -1, dist: 0, turnId: null };
                            lastMilestoneKm = 0;
                            let startNode = null;
                            if (truckCurrentPos && truckCurrentPos.length === 2) {
                                startNode = findNearestNode([truckCurrentPos[1], truckCurrentPos[0]]);
                            }
                            if (!startNode && marker) {
                                const markerPos = marker.getLatLng();
                                startNode = findNearestNode([markerPos.lng, markerPos.lat]);
                            }
                            if (startNode && endNode) {
                                const { path, distance } = await solvePathAsync(startNode, endNode);
                                if (path && path.length > 0) {
                                    currentRoute = { rutaOriginal: path, ruta: path, distancia_km: distance * 0.003875, distancia_restante: distance * 0.003875, origen: 'Mi ubicación', origenEmpresa: null, destino: city.properties.name, destinoEmpresa: null };
                                    console.log('Ruta manual a ciudad:', city.properties.name, currentRoute.distancia_km.toFixed(1), 'km');
                                }
                            }
                            if (!currentRoute) {
                                speak(`No se pudo calcular ruta a ${city.properties.name}.`, true);
                                isManualRouteActive = false;
                                isCompanyRouteActive = false;
                            }
                            updateRouteUI();
                            const routeBtn = document.getElementById('toggle-company-route');
                            if (routeBtn) routeBtn.style.display = 'block';
                            if (document.getElementById('ui-dest')) document.getElementById('ui-dest').innerHTML = `<span class="route-city">${city.properties.name}</span>`;
                            if (panel) panel.style.display = 'none';
                            if (document.getElementById('search-container')) document.getElementById('search-container').style.display = 'none';
                            speak(`Ruta a ${city.properties.name} establecida.`, true);
                        });
                        companiesList.appendChild(cityButton);
                        if (relatedCompanies.length === 0) {
                            companiesList.insertAdjacentHTML('beforeend', '<div style="color: #888; padding: 20px; text-align: center;">No hay empresas</div>');
                        } else {
                            relatedCompanies.forEach(company => {
                                const button = document.createElement('button');
                                button.className = 'company-item';
                                button.innerHTML = `<span class="company-name">${company.properties.nombre}</span><span class="company-city">${company.properties.ciudad}</span>`;
                                button.addEventListener('click', async (e) => {
                                    e.stopPropagation();
                                    const companyCoords = company.geometry.coordinates;
                                    const endNode = findNearestNode(companyCoords);
                                    if (!endNode) { speak(`No se puede establecer ruta a ${company.properties.nombre}.`, true); return; }
                                    selectedCompany = company; selectedCompanyCoords = companyCoords;
                                    isCompanyRouteActive = true; isManualRouteActive = true;
                                    destinationReached = false;
                                    lastAnnouncedKm = Infinity;
                                    lastTurnAnnounced = { index: -1, dist: 0, turnId: null };
                                    lastMilestoneKm = 0;
                                    let startNode = null;
                                    if (truckCurrentPos && truckCurrentPos.length === 2) {
                                        startNode = findNearestNode([truckCurrentPos[1], truckCurrentPos[0]]);
                                    }
                                    if (!startNode && marker) {
                                        const markerPos = marker.getLatLng();
                                        startNode = findNearestNode([markerPos.lng, markerPos.lat]);
                                    }
                                    if (startNode && endNode) {
                                const { path, distance } = await solvePathAsync(startNode, endNode);
                                        if (path && path.length > 0) {
                                            currentRoute = { rutaOriginal: path, ruta: path, distancia_km: distance * 0.003875, distancia_restante: distance * 0.003875, origen: 'Mi ubicación', origenEmpresa: null, destino: city.properties.name, destinoEmpresa: company.properties.nombre };
                                            console.log('✅ Ruta manual a empresa:', company.properties.nombre, currentRoute.distancia_km.toFixed(1), 'km');
                                        }
                                    }
                                    if (!currentRoute) {
                                        speak(`No se pudo calcular ruta a ${company.properties.nombre}.`, true);
                                        isManualRouteActive = false;
                                        isCompanyRouteActive = false;
                                    }
                                    updateRouteUI();
                                    if (document.getElementById('toggle-company-route')) document.getElementById('toggle-company-route').style.display = 'block';
                                    if (document.getElementById('ui-dest')) document.getElementById('ui-dest').innerHTML = `<span class="route-city">${city.properties.name}</span><span class="route-company">${company.properties.nombre}</span>`;
                                    if (panel) panel.style.display = 'none';
                                    if (document.getElementById('search-container')) document.getElementById('search-container').style.display = 'none';
                                    speak(`Ruta a ${company.properties.nombre} establecida.`, true);
                                });
                                companiesList.appendChild(button);
                            });
                        }
                    }
                    if (panel) panel.style.display = 'block';
                    document.querySelectorAll('.city-item').forEach(el => el.classList.remove('selected'));
                    div.classList.add('selected');
                });
                citiesList.appendChild(div);
            });
        });
    }
    
    // setInterval(checkAutoDarkMode, 3600000); //
    
    // ==========================================
    // EXPONER FUNCIONES PARA COMUNICACIÓN CON MAPA.HTML
    // ==========================================
    
    // Función que será llamada desde mapa.html
    window.syncDarkModeFromMain = function(isDark) {
        if (isDark) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        // Actualizar variables internas
        manualDarkMode = isDark;
    };
    
    // Sincronizar estado actual con mapa.html
    const currentDarkMode = document.body.classList.contains('dark-mode');
    if (currentDarkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }

})();

