import json
import os

def analizar_json(ruta_archivo):
    if not os.path.exists(ruta_archivo):
        print(f"❌ Error: No se encuentra el archivo en {ruta_archivo}")
        return

    print(f"🔍 Analizando: {ruta_archivo}...")
    
    try:
        with open(ruta_archivo, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # Verificar si es una lista o un diccionario
        tipo_dato = type(data)
        print(f"✅ Tipo de estructura raíz: {tipo_dato.__name__}")

        if isinstance(data, list):
            print(f"📊 Cantidad de elementos: {len(data)}")
            if len(data) > 0:
                primer_elemento = data[0]
                print("\n🔑 Llaves encontradas en el primer elemento:")
                print(list(primer_elemento.keys()))
                print("\n📝 Ejemplo del primer elemento:")
                print(json.dumps(primer_elemento, indent=4))
        
        elif isinstance(data, dict):
            print("\n🔑 Llaves principales del diccionario:")
            print(list(data.keys()))
            # Intentar mostrar una muestra de la primera llave que sea una lista
            for llave, valor in data.items():
                if isinstance(valor, list) and len(valor) > 0:
                    print(f"\n📂 La llave '{llave}' contiene una lista. Ejemplo del primer item:")
                    print(json.dumps(valor[0], indent=4))
                    break

    except Exception as e:
        print(f"💥 Error al leer el JSON: {e}")

if __name__ == "__main__":
    # Ajusta la ruta si es necesario
    analizar_json('./data/usa-graph.json')