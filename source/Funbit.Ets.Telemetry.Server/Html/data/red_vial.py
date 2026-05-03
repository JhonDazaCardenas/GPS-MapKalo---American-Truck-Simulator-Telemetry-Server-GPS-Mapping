import json
import os

# 1. Configuración de rutas según tu estructura local
RUTA_BASE = r'C:\Proyecto GPS Mapkalo\static\data'
FILE_NODES = os.path.join(RUTA_BASE, 'usa-nodes.json')
FILE_GRAPH = os.path.join(RUTA_BASE, 'usa-graph.json')
ARCHIVO_SALIDA = os.path.join(RUTA_BASE, 'mapa_completo.geojson')

def generar_geojson():
    # Diccionario para mapear UID -> [Longitud, Latitud]
    registro_coordenadas = {}
    features = []

    print("--- Iniciando conversión a GeoJSON ---")

    # 2. Paso 1: Cargar coordenadas desde usa-nodes.json
    if not os.path.exists(FILE_NODES):
        print(f"❌ Error: No se encontró el archivo {FILE_NODES}")
        return

    print(f"Leyendo coordenadas de {FILE_NODES}...")
    with open(FILE_NODES, 'r', encoding='utf-8') as f:
        try:
            nodos_data = json.load(f)
            for nodo in nodos_data:
                uid = nodo.get('uid')
                # En el motor de ATS/ETS2:
                # x -> Suele ser el eje horizontal (Longitud)
                # y -> Suele ser el eje vertical (Latitud) o altura. 
                # Si el mapa sale "plano" o raro, prueba intercambiar y por z.
                x = nodo.get('x')
                y = -nodo.get('y')
                
                if uid and x is not None and y is not None:
                    registro_coordenadas[str(uid)] = [x, y]
            print(f"✅ Se cargaron {len(registro_coordenadas)} nodos con coordenadas.")
        except Exception as e:
            print(f"❌ Error al procesar nodos: {e}")
            return

    # 3. Paso 2: Crear conexiones usando usa-graph.json
    if not os.path.exists(FILE_GRAPH):
        print(f"❌ Error: No se encontró el archivo {FILE_GRAPH}")
        return

    print(f"Procesando conexiones de {FILE_GRAPH}...")
    with open(FILE_GRAPH, 'r', encoding='utf-8') as f:
        try:
            grafo_data = json.load(f)
            for entrada in grafo_data:
                # Estructura del grafo: ["UID_ORIGEN", {"forward": [...], "backward": [...]}]
                if isinstance(entrada, list) and len(entrada) >= 2:
                    uid_origen = str(entrada[0])
                    datos_conexion = entrada[1]
                    
                    # Solo procesamos si tenemos la coordenada del origen
                    if uid_origen not in registro_coordenadas:
                        continue
                    
                    punto_a = registro_coordenadas[uid_origen]
                    
                    # Procesar conexiones 'forward' para evitar duplicados (ida y vuelta)
                    conexiones = datos_conexion.get('forward', [])
                    for conn in conexiones:
                        uid_destino = str(conn.get('nodeId'))
                        
                        if uid_destino in registro_coordenadas:
                            punto_b = registro_coordenadas[uid_destino]
                            
                            # Crear el objeto LineString para el GeoJSON
                            feature = {
                                "type": "Feature",
                                "properties": {
                                    "origin_uid": uid_origen,
                                    "target_uid": uid_destino,
                                    "distance": conn.get("distance", 0)
                                },
                                "geometry": {
                                    "type": "LineString",
                                    "coordinates": [punto_a, punto_b]
                                }
                            }
                            features.append(feature)
            print(f"✅ Se crearon {len(features)} tramos de carretera.")
        except Exception as e:
            print(f"❌ Error al procesar el grafo: {e}")
            return

    # 4. Guardar el resultado final
    if features:
        geojson_final = {
            "type": "FeatureCollection",
            "features": features
        }
        
        with open(ARCHIVO_SALIDA, 'w', encoding='utf-8') as f:
            json.dump(geojson_final, f)
            
        print("\n--- ¡ÉXITO TOTAL! ---")
        print(f"📍 Archivo GeoJSON generado: {ARCHIVO_SALIDA}")
        print("Puedes cargarlo en Leaflet, QGIS o Mapbox.")
    else:
        print("❌ No se pudieron generar conexiones. Verifica que los UIDs coincidan.")

if __name__ == "__main__":
    generar_geojson()