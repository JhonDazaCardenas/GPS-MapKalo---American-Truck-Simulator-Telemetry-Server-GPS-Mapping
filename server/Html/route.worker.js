// route.worker.js - Web Worker para cálculo de rutas
// Recibe grafo como arrays planos, calcula con Dijkstra + Heap

let nodeKeys = null;
let nodeX = null;
let nodeY = null;
let edgeFrom = null;
let edgeTo = null;
let edgeWeight = null;
let adjStart = null;
let adjCount = null;

class MinHeap {
    constructor() { this.data = []; }
    push(id, cost) {
        this.data.push({ id, cost });
        let i = this.data.length - 1;
        while (i > 0) {
            const p = (i - 1) >> 1;
            if (this.data[p].cost <= this.data[i].cost) break;
            [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
            i = p;
        }
    }
    pop() {
        if (this.data.length === 0) return undefined;
        const top = this.data[0].id;
        const last = this.data.pop();
        if (this.data.length > 0) {
            this.data[0] = last;
            let i = 0;
            while (true) {
                let min = i;
                const l = 2 * i + 1, r = 2 * i + 2;
                if (l < this.data.length && this.data[l].cost < this.data[min].cost) min = l;
                if (r < this.data.length && this.data[r].cost < this.data[min].cost) min = r;
                if (min === i) break;
                [this.data[i], this.data[min]] = [this.data[min], this.data[i]];
                i = min;
            }
        }
        return top;
    }
    size() { return this.data.length; }
}

function solvePath(startKey, endKey) {
    if (!nodeKeys || !nodeX || startKey === endKey) return { path: [], distance: 0 };
    
    const numNodes = nodeKeys.length;
    let startIdx = -1, endIdx = -1;
    for (let i = 0; i < numNodes; i++) {
        if (nodeKeys[i] === startKey) startIdx = i;
        if (nodeKeys[i] === endKey) endIdx = i;
    }
    if (startIdx === -1 || endIdx === -1) return { path: [], distance: 0 };
    
    const dists = new Float64Array(numNodes).fill(Infinity);
    const prev = new Int32Array(numNodes).fill(-1);
    const heap = new MinHeap();
    
    dists[startIdx] = 0;
    heap.push(startIdx, 0);
    
    while (heap.size() > 0) {
        const curr = heap.pop();
        if (curr === undefined) break;
        if (curr === endIdx) break;
        
        const currDist = dists[curr];
        if (currDist === Infinity) continue;
        
        const start = adjStart[curr];
        const count = adjCount[curr];
        for (let i = start; i < start + count; i++) {
            const to = edgeTo[i];
            if (to === -1) continue;
            const alt = currDist + edgeWeight[i];
            if (alt < dists[to]) {
                dists[to] = alt;
                prev[to] = curr;
                heap.push(to, alt);
            }
        }
    }
    
    let path = [];
    let u = endIdx;
    while (prev[u] !== -1 && path.length < 50000) {
        path.unshift([nodeY[u], nodeX[u]]);
        u = prev[u];
    }
    if (path.length > 0) {
        path.unshift([nodeY[startIdx], nodeX[startIdx]]);
    }
    
    const distance = dists[endIdx] < Infinity ? dists[endIdx] : 0;
    return { path, distance };
}

self.onmessage = function(e) {
    const { type, payload } = e.data;
    
    if (type === 'INIT') {
        nodeKeys = payload.keys;
        nodeX = payload.x;
        nodeY = payload.y;
        edgeFrom = payload.edgeFrom;
        edgeTo = payload.edgeTo;
        edgeWeight = payload.edgeWeight;
        adjStart = payload.adjStart;
        adjCount = payload.adjCount;
        self.postMessage({ type: 'READY' });
    }
    
    if (type === 'SOLVE') {
        const result = solvePath(payload.startNode, payload.endNode);
        self.postMessage({ type: 'RESULT', reqId: e.data.reqId, payload: result });
    }
};
