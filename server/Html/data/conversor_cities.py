import json
import os

# Configuración de rutas
input_path = './data/usa-cities.json'
output_path = './data/usa-cities.geojson'

# Factor de escala solicitado: dividir entre 100,000
# FACTOR_ESCALA = 100000.0

def convert_to_geojson():
    if not os.path.exists(input_path):
        print(f"Error: No se encontró el archivo de origen en {input_path}")
        return

    try:
        with open(input_path, 'r', encoding='utf-8') as f:
            cities_data = json.load(f)

        geojson = {
            "type": "FeatureCollection",
            "features": []
        }

        contador = 0
        for city in cities_data:
            try:
                # Extraemos x e y, y aplicamos la división de escala
                # Se asume que el JSON original tiene las llaves 'x' e 'y'
                val_x = float(city.get('x', 0))
                val_y = -float(city.get('y', 0))

                feature = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [val_x, val_y]
                    },
                    "properties": {
                        "name": city.get('name', 'Ciudad Desconocida'),
                        "token": city.get('token', ''),
                        "population": city.get('population', 0),
                        "countryToken": city.get('countryToken', '')
                    }
                }
                geojson["features"].append(feature)
                contador += 1
            except (ValueError, TypeError):
                # Si los datos no son numéricos, saltamos la entrada
                continue

        with open(output_path, 'w', encoding='utf-8') as f:
            # indent=4 para que sea legible, ensure_ascii=False para tildes
            json.dump(geojson, f, indent=4, ensure_ascii=False)
        
        print(f"--- Proceso Finalizado ---")
        print(f"Ciudades procesadas: {contador}")
        print(f"Escala aplicada: Coordenadas")
        print(f"Archivo guardado en: {output_path}")

    except Exception as e:
        print(f"Error crítico durante la conversión: {e}")

if __name__ == "__main__":
    convert_to_geojson()