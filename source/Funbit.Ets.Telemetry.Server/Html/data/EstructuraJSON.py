import json
import os

ruta_actual = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(ruta_actual, 'usa-graph.json'), 'r', encoding='utf-8') as f:
    graph = json.load(f)
with open(os.path.join(ruta_actual, 'usa-roads.json'), 'r', encoding='utf-8') as f:
    roads = json.load(f)

print("--- DIAGNÓSTICO DE DATOS ---")
print(f"Estructura de graph: {list(graph[0].keys())}")
print(f"Ejemplo de nodeId de graph: {graph[0].get('nodeId')}")

print(f"\nEstructura de una CARRETERA: {list(roads[0].keys())}")
# Esto nos dirá cómo se llaman los campos que guardan los UIDs de los nodos
print("----------------------------")