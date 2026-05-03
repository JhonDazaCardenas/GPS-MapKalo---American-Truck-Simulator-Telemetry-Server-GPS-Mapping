import json
import os

# Rutas de los archivos según tu estructura
path_base = r"C:\Proyecto GPS Mapkalo\static\data"
file_companies = os.path.join(path_base, "usa-companies.json")
file_defs = os.path.join(path_base, "usa-companyDefs.json")
output_file = os.path.join(path_base, "empresas_relacionadas.geojson")

def generar_geojson():
    # 1. Cargar datos
    with open(file_companies, 'r', encoding='utf-8') as f:
        companies = json.load(f)
    with open(file_defs, 'r', encoding='utf-8') as f:
        defs = json.load(f)

    # 2. Crear un diccionario de definiciones para búsqueda rápida
    defs_dict = {item['token']: item['name'] for item in defs}

    # 3. Estructura base del GeoJSON
    geojson = {
        "type": "FeatureCollection",
        "features": []
    }

    for comp in companies:
        token = comp.get("token")
        # Relacionar el nombre desde el archivo de definiciones
        nombre_empresa = defs_dict.get(token, "Empresa Desconocida")

        feature = {
            "type": "Feature",
            "properties": {
                "uid": comp.get("uid"),
                "nombre": nombre_empresa,
                "token": token,
                "ciudad": comp.get("cityToken"),
                "sector": f"{comp.get('sectorX')},{comp.get('sectorY')}"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [comp.get("x"), -comp.get("y")]
            }
        }
        geojson["features"].append(feature)

    # 4. Guardar resultado
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(geojson, f, indent=4, ensure_ascii=False)
    
    print(f"Archivo GeoJSON generado con éxito en: {output_file}")

if __name__ == "__main__":
    generar_geojson()