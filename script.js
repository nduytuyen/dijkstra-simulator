var nodes = new vis.DataSet([]);
var edges = new vis.DataSet([]);
var container = document.getElementById('mynetwork');

var data = { nodes: nodes, edges: edges };
var options = {
    edges: { font: { size: 16, color: '#f38ba8' }, color: { color: '#6c7086' }, width: 2, arrows: { to: { enabled: false } } },
    nodes: { shape: 'circle', color: { background: '#89b4fa', border: '#b4befe' }, font: { color: '#11111b', size: 20, bold: true } },
    physics: { enabled: true, barnesHut: { springLength: 150 } }
};
var network = new vis.Network(container, data, options);

function clearResults() {
    edges.update(edges.get().map(e => ({ id: e.id, color: { color: '#6c7086' }, width: 2 })));
    nodes.update(nodes.get().map(n => ({ id: n.id, color: { background: '#89b4fa', border: '#b4befe' } })));
    document.getElementById('result').innerHTML = "Kết quả lộ trình...";
    document.getElementById('logContent').innerHTML = "Vui lòng bấm chạy thuật toán...";
}

function toggleDirected() {
    network.setOptions({ edges: { arrows: { to: { enabled: document.getElementById('isDirected').checked } } } });
    clearResults();
}

function updateDropdowns() {
    let selects = ['edgeFrom', 'edgeTo', 'startNode', 'endNode'];
    let all = nodes.get();
    selects.forEach(id => {
        let d = document.getElementById(id);
        let val = d.value; d.innerHTML = '';
        all.forEach(n => d.add(new Option('Nút ' + n.id, n.id)));
        if (all.length > 0) {
            if (id.includes('To') || id.includes('end')) d.value = all[all.length - 1].id;
            else if (val && all.find(n => n.id == val)) d.value = val;
        }
    });
}

function addNode() {
    let ids = nodes.getIds();
    let next = ids.length > 0 ? Math.max(...ids) + 1 : 1;
    nodes.add({ id: next, label: String(next) });
    updateDropdowns(); clearResults();
}

function deleteSelectedNode() {
    let sel = network.getSelectedNodes();
    if (sel.length > 0) { nodes.remove(sel[0]); updateDropdowns(); clearResults(); }
}

function addEdge() {
    let f = document.getElementById('edgeFrom').value, t = document.getElementById('edgeTo').value;
    let w = parseInt(document.getElementById('edgeWeight').value);
    if (!f || !t || f === t || w < 0) return;
    let dir = document.getElementById('isDirected').checked;
    let ex = edges.get({ filter: e => dir ? (e.from == f && e.to == t) : ((e.from == f && e.to == t) || (e.from == t && e.to == f)) });
    if (ex.length > 0) edges.update({ id: ex[0].id, label: String(w) });
    else edges.add({ from: parseInt(f), to: parseInt(t), label: String(w) });
    clearResults(); document.getElementById('edgeWeight').select();
}

function clearGraph() { nodes.clear(); edges.clear(); updateDropdowns(); clearResults(); }

function generateRandomGraph() {
    let n = parseInt(document.getElementById('randomNodeCount').value);
    if (n < 2) return; clearGraph();
    for (let i = 1; i <= n; i++) nodes.add({ id: i, label: String(i) });
    let ids = nodes.getIds();
    for (let i = 0; i < ids.length - 1; i++) edges.add({ from: ids[i], to: ids[i+1], label: String(Math.floor(Math.random() * 10) + 1) });
    for (let i = 0; i < n; i++) {
        let f = ids[Math.floor(Math.random() * n)], t = ids[Math.floor(Math.random() * n)];
        if (f !== t && !edges.get({ filter: e => (e.from == f && e.to == t) || (e.from == t && e.to == f) }).length)
            edges.add({ from: f, to: t, label: String(Math.floor(Math.random() * 15) + 1) });
    }
    updateDropdowns();
}

// Bảng nhãn dạng { d1*, d2, ... }
function formatLabels(dist, permanent) {
    let ids = nodes.getIds().sort((a,b) => a-b);
    let parts = ids.map(id => {
        let val = dist[id] === Infinity ? "∞" : dist[id];
        return permanent.has(id) ? `<b>${val}*</b>` : `${val}`;
    });
    return `{ ${parts.join(', ')} }`;
}

function runDijkstra() {
    clearResults();
    let sNode = parseInt(document.getElementById('startNode').value);
    let tNode = parseInt(document.getElementById('endNode').value);
    if (!sNode || !tNode || sNode === tNode) return;

    nodes.update([{ id: sNode, color: { background: '#a6e3a1' } }, { id: tNode, color: { background: '#f38ba8' } }]);

    let logHTML = `<div class="main-log-title">GIẢI THUẬT TOÁN</div>`;
    
    let dist = {}, prev = {}, unvisited = new Set(), permanent = new Set();
    nodes.get().forEach(n => { dist[n.id] = Infinity; prev[n.id] = null; unvisited.add(n.id); });
    dist[sNode] = 0;
    
    logHTML += `<div class="log-step"><span class="step-title">BƯỚC 0: KHỞI TẠO</span>- Gán <b>nhãn vĩnh viễn là 0</b> cho nút nguồn <span class="highlight-node">${sNode}</span>.<br>- Nhãn tạm thời của các nút còn lại là ∞.<br><span class="math-array">𝒫(0) = ${formatLabels(dist, permanent)}</span></div>`;

    let adj = {}; nodes.get().forEach(n => adj[n.id] = []);
    edges.get().forEach(e => {
        let weight = parseInt(e.label);
        adj[e.from].push({ to: e.to, weight: weight, id: e.id });
        if (!document.getElementById('isDirected').checked) adj[e.to].push({ to: e.from, weight: weight, id: e.id });
    });

    let step = 1;
    while (unvisited.size > 0) {
        let curr = null, minD = Infinity;
        for (let id of unvisited) { if (dist[id] < minD) { minD = dist[id]; curr = id; } }
        if (curr === null) break;

        permanent.add(curr); unvisited.delete(curr);
        
        logHTML += `<div class="log-step"><span class="step-title">BƯỚC ${step}: XÉT NÚT ${curr}</span>- Chọn nút <span class="highlight-node">${curr}</span> có nhãn tạm thời nhỏ nhất (<span class="highlight-val">${minD}</span>).<br>- <b>Chốt nhãn vĩnh viễn cho nút ${curr}.</b>`;

        let updates = "";
        for (let edge of adj[curr]) {
            if (unvisited.has(edge.to)) {
                let alt = dist[curr] + edge.weight;
                if (alt < dist[edge.to]) {
                    updates += `<br> + Cập nhật nút ${edge.to}: ${dist[edge.to] === Infinity ? "∞" : dist[edge.to]} ➔ <span class="highlight-val">${alt}</span>`;
                    dist[edge.to] = alt; prev[edge.to] = { n: curr, id: edge.id, weight: edge.weight };
                }
            }
        }
        logHTML += (updates || "<br> - Không có nhãn nút kề nào được cập nhật.") + `<br><span class="math-array">𝒫(${step}) = ${formatLabels(dist, permanent)}</span></div>`;
        
        if (curr === tNode) break;
        step++;
    }

    if (dist[tNode] === Infinity) {
        document.getElementById('result').innerHTML = "❌ Không tìm thấy đường đi.";
        document.getElementById('logContent').innerHTML = logHTML + `<div class="main-log-title">KẾT LUẬN</div><div class="log-step">Không tìm thấy đường đi từ ${sNode} đến ${tNode}.</div>`;
    } else {
        let traceLog = `<div class="main-log-title">TRUY VẾT LỘ TRÌNH</div>`;
        let pathNodes = [], pathEdges = [], temp = tNode;
        
        traceLog += `<div class="log-step">- Bắt đầu từ nút đích <span class="highlight-node">${tNode}</span> lùi về nút nguồn <span class="highlight-node">${sNode}</span>.<br>- <b>Quy tắc:</b> Tìm nút kề <i>j</i> đã chốt nhãn sao cho: <b>Nhãn(j) + d(j,n) = Nhãn(n)</b>.`;

        while (temp !== null) {
            pathNodes.unshift(temp);
            if (prev[temp]) {
                let j = prev[temp].n;
                traceLog += `<div class="trace-detail">➔ Tại nút <span class="highlight-node">${temp}</span> (L=${dist[temp]}): Nút đứng trước là <span class="highlight-node">${j}</span> vì: <br>&nbsp;&nbsp;&nbsp; Nhãn(${j}) + d(${j},${temp}) = ${dist[j]} + ${prev[temp].weight} = <b>${dist[temp]}</b> (Khớp!).</div>`;
                pathEdges.push(prev[temp].id);
                temp = j;
            } else {
                temp = null;
            }
        }
        traceLog += `</div>`;

        edges.update(pathEdges.map(id => ({ id: id, color: { color: '#f38ba8' }, width: 5 })));
        document.getElementById('result').innerHTML = `➔ ${pathNodes.join(' ➔ ')} (Tổng: ${dist[tNode]})`;
        document.getElementById('logContent').innerHTML = logHTML + traceLog;
    }
}

document.getElementById('edgeWeight').addEventListener('keypress', e => { if (e.key === 'Enter') addEdge(); });