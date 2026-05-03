import glob

# Buscar todos los archivos .json en la carpeta actual
archivos = glob.glob("*.json")

# Guardar la lista en un archivo .txt
with open("lista_json.txt", "w") as f:
    for archivo in archivos:
        f.write(archivo + "\n")

print(f"✅ Se guardaron {len(archivos)} archivos en 'lista_json.txt'")