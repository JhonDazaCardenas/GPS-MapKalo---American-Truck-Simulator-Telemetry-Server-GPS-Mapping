import json
import networkx as nx
import math
import matplotlib.pyplot as plt
import os

# --- CONFIGURACIÓN DE RUTAS ---
BASE_DIR = r'C:\Proyecto GPS Mapkalo\static\data'
PATH_MAPA = os.path.join(BASE_DIR, 'mapa_completo.geojson') 
PATH_CIUDADES = os.path.join(BASE_DIR, 'usa-cities.geojson')
ARCHIVO_SALIDA = os.path.join(BASE_DIR, 'ruta_resultado.json')

# --- PARÁMETROS DE SOLDADURA ---
# Si sigue sin conectar, aumenta TOLERANCIA a 15.0 o 20.0
TOLERANCIA_CONEXION = 5 

def cargar_coordenadas_ciudad(nombre_ciudad):
    try:
        with open(PATH_CIUDADES, 'r', encoding='utf-8') as f:
            data = json.load(f)
            for feature in data['features']:
                props = feature['properties']
                if props.get('name') == nombre_ciudad or props.get('token') == nombre_ciudad.lower():
                    return list(feature['geometry']['coordinates'])
    except Exception as e:
        print(f"❌ Error al leer ciudades: {e}")
    return None

def generar_ruta_gps(ciudad_origen, ciudad_destino, waypoints=[]):
    print(f"🚀 Mapkalo Engine: Buscando trayecto {ciudad_origen} -> {' -> '.join(waypoints)} -> {ciudad_destino}")

    # Obtener coordenadas
    pos_inicio = cargar_coordenadas_ciudad(ciudad_origen)
    pos_fin = cargar_coordenadas_ciudad(ciudad_destino)
    waypoints_coords = [cargar_coordenadas_ciudad(wp) for wp in waypoints]

    if not pos_inicio or not pos_fin or any(not wp for wp in waypoints_coords):
        print(f"❌ Error: No se encontraron coordenadas para algunas ciudades.")
        return

    # Construir Grafo
    G = nx.Graph()
    
    def snap(p):
        return (round(p[0] / TOLERANCIA_CONEXION) * TOLERANCIA_CONEXION, 
                round(p[1] / TOLERANCIA_CONEXION) * TOLERANCIA_CONEXION)

    print(f"--- Procesando y soldando red vial (Tolerancia: {TOLERANCIA_CONEXION})...")
    with open(PATH_MAPA, 'r', encoding='utf-8') as f:
        mapa_data = json.load(f)

    for feature in mapa_data['features']:
        geom_type = feature['geometry']['type']
        coords_list = []
        
        if geom_type == 'LineString':
            coords_list = [feature['geometry']['coordinates']]
        elif geom_type == 'MultiLineString':
            coords_list = feature['geometry']['coordinates']
        else:
            continue  # Saltar otros tipos de geometría
            
        for coords in coords_list:
            for i in range(len(coords) - 1):
                u, v = snap(tuple(coords[i])), snap(tuple(coords[i+1]))
                if u != v:
                    d = math.sqrt((u[0]-v[0])**2 + (u[1]-v[1])**2)
                    G.add_edge(u, v, weight=d)

    nodos_viales = list(G.nodes)
    
    # Puntos de la ruta: inicio, waypoints, fin
    route_points = [pos_inicio] + waypoints_coords + [pos_fin]
    snapped_points = [min(nodos_viales, key=lambda n: math.sqrt((n[0]-p[0])**2 + (n[1]-p[1])**2)) for p in route_points]
    
    # Verificar conexiones
    for i in range(len(snapped_points) - 1):
        if not nx.has_path(G, snapped_points[i], snapped_points[i+1]):
            print(f"⚠️ No hay camino entre {route_points[i]} y {route_points[i+1]}. Intentando puente...")
            # Lógica de puente similar
            componentes = list(nx.connected_components(G))
            isla_a = next(c for c in componentes if snapped_points[i] in c)
            isla_b = next(c for c in componentes if snapped_points[i+1] in c)
            
            min_d = float('inf')
            mejor_puente = None
            for p1 in list(isla_a)[::5]:
                for p2 in list(isla_b)[::5]:
                    d = math.sqrt((p1[0]-p2[0])**2 + (p1[1]-p2[1])**2)
                    if d < min_d:
                        min_d = d
                        mejor_puente = (p1, p2)
            
            if mejor_puente:
                G.add_edge(mejor_puente[0], mejor_puente[1], weight=min_d)
                print(f"🔗 Puente creado entre segmentos.")

    # Calcular ruta completa
    full_path = []
    total_dist = 0
    for i in range(len(snapped_points) - 1):
        camino = nx.astar_path(G, source=snapped_points[i], target=snapped_points[i+1], heuristic=lambda n1, n2: math.sqrt((n1[0]-n2[0])**2 + (n1[1]-n2[1])**2), weight='weight')
        dist_segment = sum(G[u][v]['weight'] for u, v in zip(camino[:-1], camino[1:]))
        total_dist += dist_segment
        if i == 0:
            full_path = camino
        else:
            full_path.extend(camino[1:])  # Evitar duplicar el punto de conexión

    dist_km = total_dist * 0.003875

    print(f"✅ ¡Ruta calculada con waypoints! Distancia unidades: {round(total_dist, 2)}, Distancia km: {round(dist_km, 2)}")

    # Guardar resultado
    resultado = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": {"type": "LineString", "coordinates": [list(c) for c in full_path]},
            "properties": {
                "origen": ciudad_origen, 
                "destino": ciudad_destino,
                "waypoints": waypoints,
                "distancia_unidades": round(total_dist, 2),
                "distancia_km": round(dist_km, 2)
            }
        }]
    }
    with open(ARCHIVO_SALIDA, 'w', encoding='utf-8') as f:
        json.dump(resultado, f, indent=2)

    # Visualización
    plt.figure(figsize=(12, 8))
    for u, v in G.edges():
        plt.plot([u[0], v[0]], [u[1], v[1]], color='#d3d3d3', linewidth=0.5)
    
    cx, cy = zip(*full_path)
    plt.plot(cx, cy, color='red', linewidth=3, label='Ruta GPS Mapkalo')
    plt.scatter(*pos_inicio, color='green', s=100, label=ciudad_origen, zorder=5)
    plt.scatter(*pos_fin, color='blue', s=100, label=ciudad_destino, zorder=5)
    for wp, coord in zip(waypoints, waypoints_coords):
        plt.scatter(*coord, color='orange', s=80, label=wp, zorder=5)
    
    plt.title(f"Navegación: {ciudad_origen} -> {' -> '.join(waypoints)} -> {ciudad_destino}")
    plt.legend()
    plt.axis('equal')
    plt.show()

# --- EJECUCIÓN ---
generar_ruta_gps("Manizales", "Chinchina", [])