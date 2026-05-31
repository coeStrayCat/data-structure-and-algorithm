# 🎯 DSA Quick Reference — สำหรับออกสอบ

## ⏱️ Time Complexity Cheatsheet

### Data Structures
| Structure | Access | Search | Insert | Delete | Notes |
|---|---|---|---|---|---|
| Array | O(1) | O(n) | O(n) | O(n) | O(1) ถ้า push/pop ท้าย |
| Linked List | O(n) | O(n) | O(1) | O(n) | Insert O(1) ถ้ารู้ node |
| Hash Table | O(n/a) | O(1)* | O(1)* | O(1)* | *average |
| BST (balanced) | - | O(log n) | O(log n) | O(log n) | - |
| Heap | - | O(n) | O(log n) | O(log n) | peek O(1) |
| Trie | - | O(m) | O(m) | O(m) | m = word length |

### Algorithms
| Algorithm | Time | Space | Notes |
|---|---|---|---|
| BFS | O(V+E) | O(V) | shortest path unweighted |
| DFS | O(V+E) | O(V) | cycle detection, topo sort |
| Dijkstra | O((V+E) log V) | O(V) | weighted, non-negative |
| Binary Search | O(log n) | O(1) | must be sorted |
| Merge Sort | O(n log n) | O(n) | stable |
| Quick Sort | O(n log n)* | O(log n) | *average |
| Heap Sort | O(n log n) | O(1) | in-place |
| DP (most problems) | O(n²) or O(n*m) | O(n) or O(n*m) | - |

## 🔑 Pattern Recognition — ถามอะไรใช้อะไร

| สถานการณ์ | Pattern/Algorithm |
|---|---|
| หา pair/triplet ที่ผลรวม = X | Two Pointers / Hash Map |
| หา subarray/substring | Sliding Window |
| หา range sum บ่อยๆ | Prefix Sum |
| ต้องการ LIFO | Stack |
| ต้องการ FIFO | Queue |
| Bracket matching | Stack |
| Next greater/smaller | Monotonic Stack |
| Top-K elements | Heap (Priority Queue) |
| K-th largest/smallest | Quick Select / Heap |
| Check if value exists | Hash Set |
| Count frequency | Hash Map |
| Autocomplete / Prefix | Trie |
| Shortest path (unweighted) | BFS |
| Shortest path (weighted) | Dijkstra |
| Cycle detection | DFS / Floyd's (Linked List) |
| Dependency ordering | Topological Sort (Kahn's) |
| Connected components | Union-Find |
| Overlapping subproblems | Dynamic Programming |
| Count ways / Max/Min value | DP |
| Divide problem in half | Binary Search / Merge Sort |

## 📌 Common DP Patterns

| Problem Type | Formula | Example |
|---|---|---|
| Fibonacci-like | dp[i] = dp[i-1] + dp[i-2] | Climbing Stairs |
| Knapsack | dp[i][w] = max(skip, take) | 0/1 Knapsack |
| LCS/LIS | 2D DP table | Edit Distance, LCS |
| Path counting | dp[i][j] = dp[i-1][j] + dp[i][j-1] | Grid paths |
| Interval DP | dp[i][j] = merge subintervals | Matrix chain |

## 🚨 Edge Cases ที่ต้องนึกถึง
- Empty array/string
- Single element
- All same elements / duplicates
- Negative numbers
- Integer overflow (ใช้ BigInt หรือ mod)
- Circular/cyclic input
- Already sorted / reverse sorted

## 🔢 Binary Search Template
```typescript
let left = 0, right = arr.length - 1;
while (left <= right) {               // <= สำหรับ exact match
  const mid = left + Math.floor((right - left) / 2);
  if (condition(mid)) return mid;
  else if (tooSmall(mid)) left = mid + 1;
  else right = mid - 1;
}
// left = insertion point (lowerBound)
```

## 🌲 Tree Traversal Summary
- **In-order** (L → Root → R): ได้ sorted order ใน BST
- **Pre-order** (Root → L → R): serialize tree, copy tree
- **Post-order** (L → R → Root): delete tree, evaluate expression
- **Level-order** (BFS): find minimum depth, connect level nodes
