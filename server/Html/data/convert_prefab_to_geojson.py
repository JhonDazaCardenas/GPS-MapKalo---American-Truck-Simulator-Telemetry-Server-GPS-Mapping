import json
import os

def convert_prefab_to_geojson(input_file_path, output_file_path):
    """
    Convierte un archivo de prefab de ATS/ETS2 a un FeatureCollection de GeoJSON.
    Versión mejorada con ordenamiento de polígonos y más metadatos.
    """
    try:
        with open(input_file_path, 'r', encoding='utf-8') as f:
            prefabs = json.load(f)
        print(f"Archivo cargado exitosamente: {len(prefabs)} prefabs encontrados")
    except FileNotFoundError:
        print(f"ERROR: No se encontró el archivo en {input_file_path}")
        return
    except json.JSONDecodeError:
        print(f"ERROR: El archivo no es un JSON válido")
        return

    geojson_features = []

    for idx, prefab in enumerate(prefabs):
        token = prefab.get("token", f"prefab_{idx}")
        path = prefab.get("path", "ruta_desconocida")
        map_points = prefab.get("mapPoints", [])
        
        # Agrupar por tipo para mejor organización
        polygon_points = [p for p in map_points if p.get("type") == "polygon"]
        road_points = [p for p in map_points if p.get("type") == "road"]

        # --- 1. Procesar Puntos de Carretera (tipo 'road') ---
        for point in road_points:
            properties = {
                "prefab_token": token,
                "prefab_path": path,
                "element_type": "road",
                "z_coordinate": point.get("z", 0),
                "lanes_left": point.get("lanesLeft"),
                "lanes_right": point.get("lanesRight"),
                "road_offset": point.get("offset"),
                "nav_flags": point.get("navFlags", {}),
                "neighbors": point.get("neighbors", [])
            }
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [point.get("x", 0), point.get("y", 0)]
                },
                "properties": properties
            }
            geojson_features.append(feature)

        # --- 2. Procesar Polígonos (tipo 'polygon') ---
        # Agrupar por color para formar polígonos separados
        polygons_by_color = {}
        for point in polygon_points:
            color = point.get("color")
            if color not in polygons_by_color:
                polygons_by_color[color] = []
            polygons_by_color[color].append(point)

        for color, points in polygons_by_color.items():
            if len(points) < 3:
                continue  # Necesitamos al menos 3 puntos para un polígono

            # Intentar ordenar los vértices del polígono usando los neighbors
            ordered_points = order_polygon_vertices(points, map_points)
            
            if ordered_points and len(ordered_points) >= 3:
                properties = {
                    "prefab_token": token,
                    "prefab_path": path,
                    "element_type": "polygon",
                    "color_group": color,
                    "road_over": points[0].get("roadOver", False),
                    "vertex_count": len(ordered_points),
                    "original_indices": [map_points.index(p) for p in ordered_points]
                }
                # Extraer coordenadas (x, y) en orden
                coordinates = [[p["x"], p["y"]] for p in ordered_points]
                # Cerrar el polígono añadiendo el primer punto al final
                coordinates.append(coordinates[0])
                
                feature = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [coordinates]
                    },
                    "properties": properties
                }
                geojson_features.append(feature)

        # --- 3. Extraer Spawn Points como features adicionales ---
        spawn_points = prefab.get("spawnPoints", [])
        if spawn_points:
            spawn_coords = []
            for sp in spawn_points:
                spawn_coords.append([sp.get("x", 0), sp.get("y", 0)])
            
            # Añadir como MultiPoint
            properties = {
                "prefab_token": token,
                "prefab_path": path,
                "element_type": "spawn_points",
                "spawn_count": len(spawn_points),
                "spawn_types": [sp.get("type") for sp in spawn_points]
            }
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "MultiPoint",
                    "coordinates": spawn_coords
                },
                "properties": properties
            }
            geojson_features.append(feature)

        # --- 4. Extraer Trigger Points ---
        trigger_points = prefab.get("triggerPoints", [])
        if trigger_points:
            trigger_coords = []
            trigger_actions = []
            for tp in trigger_points:
                trigger_coords.append([tp.get("x", 0), tp.get("y", 0)])
                trigger_actions.append(tp.get("action", "unknown"))
            
            properties = {
                "prefab_token": token,
                "prefab_path": path,
                "element_type": "trigger_points",
                "trigger_count": len(trigger_points),
                "actions": trigger_actions
            }
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "MultiPoint",
                    "coordinates": trigger_coords
                },
                "properties": properties
            }
            geojson_features.append(feature)

    # --- 5. Construir el FeatureCollection final ---
    feature_collection = {
        "type": "FeatureCollection",
        "features": geojson_features,
        "metadata": {
            "generator": "Ets2PrefabToGeoJSON",
            "description": "Conversión de prefabs ATS/ETS2 a GeoJSON - NO georreferenciado",
            "coordinate_system": "local_game_coordinates",
            "total_prefabs": len(prefabs),
            "total_features": len(geojson_features)
        }
    }

    # --- 6. Guardar el resultado ---
    os.makedirs(os.path.dirname(output_file_path), exist_ok=True)
    with open(output_file_path, 'w', encoding='utf-8') as f:
        json.dump(feature_collection, f, indent=2)

    print(f"GeoJSON generado exitosamente en: {output_file_path}")
    print(f"Total de features: {len(geojson_features)}")

def order_polygon_vertices(points, all_map_points):
    """
    Intenta ordenar los vértices del polígono usando la información de neighbors.
    """
    if not points:
        return []
    
    # Crear un índice de los puntos por su posición en mapPoints
    point_index = {i: p for i, p in enumerate(all_map_points)}
    
    # Crear un mapeo de índice -> punto para los puntos del polígono
    polygon_indices = {}
    for p in points:
        try:
            idx = all_map_points.index(p)
            polygon_indices[idx] = p
        except ValueError:
            pass
    
    if len(polygon_indices) < 3:
        # Si no podemos indexar, devolver los puntos en orden original
        return points
    
    # Intentar seguir los neighbors para ordenar
    ordered = []
    visited = set()
    
    try:
        current_idx = next(iter(polygon_indices.keys()))
        while current_idx in polygon_indices and current_idx not in visited:
            visited.add(current_idx)
            ordered.append(polygon_indices[current_idx])
            
            # Encontrar el siguiente punto a través de neighbors
            current_point = polygon_indices[current_idx]
            neighbors = current_point.get("neighbors", [])
            next_found = False
            for neighbor_idx in neighbors:
                if neighbor_idx in polygon_indices and neighbor_idx not in visited:
                    current_idx = neighbor_idx
                    next_found = True
                    break
            
            if not next_found:
                # Si no hay más neighbors no visitados, añadir los que faltan
                for idx in polygon_indices:
                    if idx not in visited:
                        ordered.append(polygon_indices[idx])
                        visited.add(idx)
                break
    except Exception as e:
        # Si hay error en el ordenamiento, devolver orden original
        return points
    
    return ordered if len(ordered) >= 3 else points

# --- Ruta específica de tu proyecto ---
ruta_archivo_entrada = r"C:\Proyecto GPS Mapkalo\ets2-telemetry-server-master\source\Funbit.Ets.Telemetry.Server\Html\data\usa-prefabDescriptions.json"
ruta_archivo_salida = r"C:\Proyecto GPS Mapkalo\ets2-telemetry-server-master\source\Funbit.Ets.Telemetry.Server\Html\data\prefabs.geojson"

# Ejecutar la conversión
convert_prefab_to_geojson(ruta_archivo_entrada, ruta_archivo_salida)