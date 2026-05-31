/**
 * 06 — GRAPHS
 * ============================================================
 * อ้างอิง: CLRS Ch.22-24, https://visualgo.net/en/graphds
 *
 * Graph = V (vertices) + E (edges)
 * Representations:
 *   Adjacency List  : O(V+E) space — เหมาะกับ sparse graph
 *   Adjacency Matrix: O(V²) space  — เหมาะกับ dense graph
 *
 * BFS: O(V+E) — shortest path (unweighted)
 * DFS: O(V+E) — cycle detection, topological sort, components
 * Dijkstra: O((V+E) log V) — shortest path (weighted, non-negative)
 * ============================================================
 */

type Graph = Map<string, string[]>;
type WeightedGraph = Map<string, [string, number][]>;

// ─── 1. GRAPH REPRESENTATION ─────────────────────────────────

function buildGraph(edges: [string, string][], directed = false): Graph {
  const g: Graph = new Map();
  for (const [u, v] of edges) {
    if (!g.has(u)) g.set(u, []);
    if (!g.has(v)) g.set(v, []);
    g.get(u)!.push(v);
    if (!directed) g.get(v)!.push(u);
  }
  return g;
}

// ─── 2. BFS — Breadth-First Search ───────────────────────────

/**
 * BFS: ค้นหาแบบกว้าง (level by level)
 * Real-world: social network degrees, web crawler, GPS routing
 * Time: O(V+E), Space: O(V)
 */
function bfs(graph: Graph, start: string): string[] {
  const visited = new Set<string>();
  const queue: string[] = [start];
  const order: string[] = [];
  visited.add(start);

  while (queue.length) {
    const node = queue.shift()!;
    order.push(node);
    for (const neighbor of graph.get(node) ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return order;
}

/**
 * BFS Shortest Path (unweighted)
 * Returns distance from start to every reachable node
 */
function bfsShortestPath(graph: Graph, start: string): Map<string, number> {
  const dist = new Map<string, number>([[start, 0]]);
  const queue = [start];

  while (queue.length) {
    const node = queue.shift()!;
    for (const neighbor of graph.get(node) ?? []) {
      if (!dist.has(neighbor)) {
        dist.set(neighbor, dist.get(node)! + 1);
        queue.push(neighbor);
      }
    }
  }
  return dist;
}

// ─── 3. DFS — Depth-First Search ─────────────────────────────

/**
 * DFS iterative
 * Real-world: maze solving, puzzle solving, dependency resolution
 * Time: O(V+E), Space: O(V)
 */
function dfs(graph: Graph, start: string): string[] {
  const visited = new Set<string>();
  const stack = [start];
  const order: string[] = [];

  while (stack.length) {
    const node = stack.pop()!;
    if (visited.has(node)) continue;
    visited.add(node);
    order.push(node);
    for (const neighbor of graph.get(node) ?? []) {
      if (!visited.has(neighbor)) stack.push(neighbor);
    }
  }
  return order;
}

/**
 * Detect cycle in undirected graph
 */
function hasCycle(graph: Graph): boolean {
  const visited = new Set<string>();

  function dfsCheck(node: string, parent: string | null): boolean {
    visited.add(node);
    for (const neighbor of graph.get(node) ?? []) {
      if (!visited.has(neighbor)) {
        if (dfsCheck(neighbor, node)) return true;
      } else if (neighbor !== parent) return true; // back edge = cycle
    }
    return false;
  }

  for (const node of graph.keys()) {
    if (!visited.has(node) && dfsCheck(node, null)) return true;
  }
  return false;
}

// ─── 4. TOPOLOGICAL SORT ─────────────────────────────────────

/**
 * Kahn's Algorithm (BFS-based)
 * Real-world: build systems (make, webpack), task scheduling, course prerequisites
 * Time: O(V+E), Space: O(V)
 */
function topologicalSort(graph: Graph): string[] | null {
  const inDegree = new Map<string, number>();
  for (const node of graph.keys()) inDegree.set(node, 0);
  for (const [, neighbors] of graph) {
    for (const n of neighbors) inDegree.set(n, (inDegree.get(n) ?? 0) + 1);
  }

  const queue = [...inDegree.entries()].filter(([, d]) => d === 0).map(([n]) => n);
  const result: string[] = [];

  while (queue.length) {
    const node = queue.shift()!;
    result.push(node);
    for (const neighbor of graph.get(node) ?? []) {
      const newDeg = inDegree.get(neighbor)! - 1;
      inDegree.set(neighbor, newDeg);
      if (newDeg === 0) queue.push(neighbor);
    }
  }
  return result.length === graph.size ? result : null; // null = has cycle
}

// ─── 5. DIJKSTRA'S ALGORITHM ─────────────────────────────────

/**
 * Dijkstra shortest path (weighted, non-negative edges)
 * Real-world: GPS navigation, network routing (OSPF), game pathfinding
 * Time: O((V+E) log V) with min-heap
 */
function dijkstra(graph: WeightedGraph, start: string): Map<string, number> {
  const dist = new Map<string, number>();
  for (const node of graph.keys()) dist.set(node, Infinity);
  dist.set(start, 0);

  // Min-heap: [distance, node]
  const heap: [number, string][] = [[0, start]];

  while (heap.length) {
    heap.sort((a, b) => a[0] - b[0]); // ใน production ใช้ proper min-heap
    const [d, node] = heap.shift()!;
    if (d > dist.get(node)!) continue; // stale entry

    for (const [neighbor, weight] of graph.get(node) ?? []) {
      const newDist = d + weight;
      if (newDist < dist.get(neighbor)!) {
        dist.set(neighbor, newDist);
        heap.push([newDist, neighbor]);
      }
    }
  }
  return dist;
}

// ─── 6. CONNECTED COMPONENTS ─────────────────────────────────

/**
 * Count connected components (Union-Find / DSU)
 * Real-world: social network clusters, image segmentation, network topology
 * Time: O(V * α(V)) ≈ O(V) amortized
 */
class UnionFind {
  private parent: number[];
  private rank: number[];
  public components: number;

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
    this.components = n;
  }

  find(x: number): number {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]); // path compression
    return this.parent[x];
  }

  union(x: number, y: number): boolean {
    const px = this.find(x), py = this.find(y);
    if (px === py) return false;
    if (this.rank[px] < this.rank[py]) this.parent[px] = py;
    else if (this.rank[px] > this.rank[py]) this.parent[py] = px;
    else { this.parent[py] = px; this.rank[px]++; }
    this.components--;
    return true;
  }

  connected(x: number, y: number): boolean {
    return this.find(x) === this.find(y);
  }
}

// ─── DEMO ────────────────────────────────────────────────────

function mainGraphs(): void {
  const edges: [string, string][] = [
    ["A","B"],["A","C"],["B","D"],["C","D"],["D","E"]
  ];
  const g = buildGraph(edges);

  console.log("=== BFS ===");
  console.log(bfs(g, "A")); // A B C D E

  console.log("\n=== DFS ===");
  console.log(dfs(g, "A")); // A C D E B (stack order)

  console.log("\n=== BFS Shortest Path from A ===");
  const dists = bfsShortestPath(g, "A");
  console.log([...dists.entries()]); // A:0, B:1, C:1, D:2, E:3

  console.log("\n=== Topological Sort ===");
  const dagEdges: [string, string][] = [
    ["course1","course3"],["course2","course3"],["course3","course4"]
  ];
  const dag = buildGraph(dagEdges, true);
  dag.set("course1", dag.get("course1") ?? []);
  dag.set("course2", dag.get("course2") ?? []);
  console.log("Build order:", topologicalSort(dag));

  console.log("\n=== Dijkstra ===");
  const wg: WeightedGraph = new Map([
    ["A", [["B", 4], ["C", 2]]],
    ["B", [["D", 3], ["C", 1]]],
    ["C", [["B", 1], ["D", 5]]],
    ["D", []]
  ]);
  const shortest = dijkstra(wg, "A");
  console.log([...shortest.entries()]); // A:0, B:3, C:2, D:6

  console.log("\n=== Union-Find ===");
  const uf = new UnionFind(5);
  uf.union(0, 1); uf.union(2, 3);
  console.log("Components:", uf.components);      // 3
  console.log("0 and 1 connected:", uf.connected(0, 1)); // true
  console.log("0 and 2 connected:", uf.connected(0, 2)); // false
}

main();
