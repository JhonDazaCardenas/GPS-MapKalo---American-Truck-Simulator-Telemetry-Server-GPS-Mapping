import json

def generar_red_logica():
    # Cargamos el grafo original y los nodos
    with open('./data/usa-graph.json', 'r') as f:
        graph_data = json.load(f)
    
    with open('./data/usa-nodes.json', 'r') as f:
        nodes_data = json.load(f)

    # Creamos un diccionario de nodos para búsqueda rápida
    # Formato: { "id_del_nodo": [x, y] }
    nodos = {str(n['id']): [n['x'], n['y']] for n in nodes_data}

    red_vial = []

    # Recorremos las conexiones del grafo
    for edge in graph_data:
        nodo_a = str(edge['source'])
        nodo_b = str(edge['target'])
        
        if nodo_a in nodos and nodo_b in nodos:
            red_vial.append({
                "from": nodo_a,
                "to": nodo_b,
                "coords": [nodos[nodo_a], nodos[nodo_b]],
                "dist": edge.get('length', 0)
            })

    # Guardamos una versión simplificada para JS
    with open('./data/red_navegable.json', 'w') as f:
        json.dump({"nodos": nodos, "conexiones": red_vial}, f)

    print("Red de navegación generada con éxito.")

if __name__ == "__main__":
    generar_red_logica()