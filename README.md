# 📚 Data Structures & Algorithms — TypeScript Study Guide

> คู่มือติวสอบ DSA ด้วย TypeScript พร้อมตัวอย่าง code, ทฤษฎี และการใช้งานจริง

## 📖 แหล่งอ้างอิงที่เชื่อถือได้

| แหล่ง | URL | หมายเหตุ |
|---|---|---|
| CLRS (Introduction to Algorithms) | MIT Press | มาตรฐาน academic ระดับโลก |
| MDN Web Docs | https://developer.mozilla.org | JavaScript built-in structures |
| TypeScript Handbook | https://www.typescriptlang.org/docs/ | TypeScript official docs |
| Big-O Cheatsheet | https://www.bigocheatsheet.com | Time/Space complexity reference |
| Visualgo | https://visualgo.net | Visualize algorithms |
| LeetCode Explore | https://leetcode.com/explore/ | Practice problems |

## 🗂️ เนื้อหาทั้งหมด

```
src/
├── 01-arrays/          → Array, Two Pointers, Sliding Window
├── 02-linked-list/     → Singly, Doubly, Circular
├── 03-stack-queue/     → Stack, Queue, Deque, Priority Queue
├── 04-hash-table/      → HashMap, HashSet
├── 05-trees/           → BST, AVL, Heap, Trie
├── 06-graphs/          → BFS, DFS, Dijkstra, Topological Sort
├── 07-sorting/         → Bubble, Merge, Quick, Heap Sort
├── 08-searching/       → Binary Search variants
├── 09-dynamic-programming/ → Memoization, Tabulation
└── 10-complexity/      → Big-O analysis guide
```

## 🚀 วิธีรัน

```bash
npm install
npx ts-node src/01-arrays/arrays.ts
```

## ⏱️ Big-O Summary

| Complexity | ชื่อ | ตัวอย่าง |
|---|---|---|
| O(1) | Constant | Array access by index |
| O(log n) | Logarithmic | Binary search |
| O(n) | Linear | Linear search |
| O(n log n) | Linearithmic | Merge sort |
| O(n²) | Quadratic | Bubble sort |
| O(2ⁿ) | Exponential | Fibonacci (naive) |
