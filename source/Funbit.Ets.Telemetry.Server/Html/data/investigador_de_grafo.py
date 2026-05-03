import json
import os

def investigar_grafo(ruta):
    if not os.path.exists(ruta):
        print(f"❌ No se encuentra el archivo en: {ruta}")
        return

    try:
        with open(ruta, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print(f"✅ Archivo cargado. Total de elementos: {len(data)}")
        print(f"✅ Tipo de la raíz: {type(data).__name__}")
        
        # Tomamos el primer elemento para ver qué es
        muestra = data[0]
        print(f"✅ Tipo del primer elemento: {type(muestra).__name__}")
        
        print("\n--- CONTENIDO DEL PRIMER ELEMENTO ---")
        print(muestra) 
        print("-------------------------------------")

        if isinstance(muestra, dict):
            print("\n🔑 Es un DICCIONARIO. Sus llaves son:")
            print(list(muestra.keys()))
        elif isinstance(muestra, list):
            print(f"\n📏 Es una LISTA con {len(muestra)} sub-elementos.")
            if len(muestra) > 0:
                print(f"Ejemplo del primer sub-elemento: {muestra[0]} (Tipo: {type(muestra[0]).__name__})")

    except Exception as e:
        print(f"💥 Error al investigar: {e}")

if __name__ == "__main__":
    investigar_grafo('./data/usa-graph.json')