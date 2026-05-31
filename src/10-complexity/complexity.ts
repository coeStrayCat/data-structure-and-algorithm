/**
 * 10 — COMPLEXITY ANALYSIS (Big-O)
 * ============================================================
 * อ้างอิง: CLRS Ch.3, https://www.bigocheatsheet.com
 *
 * Big-O = upper bound ของ time/space ที่อัลกอริทึมใช้
 * วัดจาก worst case โดย drop constants และ lower-order terms
 * ============================================================
 */

// ─── 1. TIME COMPLEXITY EXAMPLES ─────────────────────────────

// O(1) — Constant
function getFirst(arr: number[]): number {
  return arr[0]; // ไม่ขึ้นกับขนาด input
}

// O(log n) — Logarithmic (n ลดทีละครึ่ง)
function binarySearch(arr: number[], target: number): number {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] === target) return mid;
    arr[mid] < target ? lo = mid + 1 : hi = mid - 1;
  }
  return -1;
}

// O(n) — Linear
function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0); // traverse ทุก element
}

// O(n log n) — Linearithmic
function mergeSortDemo(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  const mid = arr.length >> 1;
  const l = mergeSortDemo(arr.slice(0, mid));
  const r = mergeSortDemo(arr.slice(mid));
  const result: number[] = [];
  let i = 0, j = 0;
  while (i < l.length && j < r.length)
    result.push(l[i] <= r[j] ? l[i++] : r[j++]);
  return [...result, ...l.slice(i), ...r.slice(j)];
}

// O(n²) — Quadratic
function bubbleSortDemo(arr: number[]): number[] {
  const a = [...arr];
  for (let i = 0; i < a.length; i++)
    for (let j = 0; j < a.length - i - 1; j++)
      if (a[j] > a[j+1]) [a[j], a[j+1]] = [a[j+1], a[j]];
  return a;
}

// O(2ⁿ) — Exponential (avoid!)
function fibNaive(n: number): number {
  if (n <= 1) return n;
  return fibNaive(n-1) + fibNaive(n-2); // 2 branches per call
}

// ─── 2. SPACE COMPLEXITY ─────────────────────────────────────

// O(1) Space — ใช้แค่ variables
function reverseInPlace(arr: number[]): void {
  let l = 0, r = arr.length - 1;
  while (l < r) { [arr[l], arr[r]] = [arr[r], arr[l]]; l++; r--; }
}

// O(n) Space — สร้าง array ใหม่
function reverseNew(arr: number[]): number[] {
  return [...arr].reverse(); // O(n) extra space
}

// O(h) Space — recursion depth = tree height
function treeHeight(node: { left?: object; right?: object } | null): number {
  if (!node) return 0;
  return 1 + Math.max(
    treeHeight((node as any).left ?? null),
    treeHeight((node as any).right ?? null)
  );
}

// ─── 3. HOW TO CALCULATE ─────────────────────────────────────
/*
  Rules:
  1. Drop constants:    O(2n) → O(n)
  2. Drop lower terms:  O(n² + n) → O(n²)
  3. Nested loops:      O(n) * O(n) = O(n²)
  4. Sequential:        O(n) + O(n²) = O(n²) (dominant)
  5. Different inputs:  O(a + b) ≠ O(n)

  Tricks to spot:
  - Divide by 2 each step         → O(log n)
  - One loop inside another       → O(n²)
  - Recursion with 2 branches     → O(2ⁿ) if no memoization
  - Sorting                       → at least O(n log n) for comparison-based
*/

// ─── 4. AMORTIZED ANALYSIS ───────────────────────────────────
/*
  Dynamic Array (e.g. JavaScript Array.push):
  - Most pushes: O(1)
  - Occasionally doubling: O(n)
  - Amortized: O(1) per push

  Why? If array doubles at size n:
  Total work = n + n/2 + n/4 + ... = 2n = O(n) for n pushes
  → O(1) amortized
*/

// ─── 5. DATA STRUCTURE COMPLEXITY SUMMARY ────────────────────

const complexityTable = {
  "Array": {
    access: "O(1)", search: "O(n)", insert_end: "O(1)*",
    insert_mid: "O(n)", delete: "O(n)"
  },
  "Linked List": {
    access: "O(n)", search: "O(n)", insert_front: "O(1)",
    insert_end: "O(1) w/tail", delete: "O(n)"
  },
  "Hash Table": {
    search: "O(1) avg", insert: "O(1) avg", delete: "O(1) avg",
    worst: "O(n)"
  },
  "BST (balanced)": {
    search: "O(log n)", insert: "O(log n)", delete: "O(log n)"
  },
  "Heap": {
    peek: "O(1)", insert: "O(log n)", extract: "O(log n)",
    build: "O(n)"
  },
  "Stack/Queue": {
    push_pop: "O(1)", enqueue_dequeue: "O(1)", peek: "O(1)"
  }
};

// ─── 6. INTERVIEW TIPS ───────────────────────────────────────
/*
  ✅ ก่อนเขียน code พูดถึง:
     - Brute force approach และ complexity ก่อน
     - Optimal approach + trade-offs
     - Edge cases: empty input, single element, duplicates

  ✅ During coding:
     - ประกาศ type อย่างชัดเจน (TypeScript advantage)
     - comment อธิบาย non-obvious logic
     - ทดสอบด้วย example ง่ายๆ ก่อน

  ✅ After coding:
     - วิเคราะห์ Time และ Space complexity
     - ระบุ trade-offs (e.g., เร็วขึ้นแต่ใช้ memory มากขึ้น)
     - บอก follow-up improvements ได้

  Common mistakes:
  ❌ off-by-one error ใน binary search (ใช้ left + (right-left)/2)
  ❌ ลืม handle null/undefined
  ❌ modify array ขณะ iterate
  ❌ integer overflow (ใช้ BigInt ถ้าจำเป็น)
*/

function main(): void {
  console.log("=== Complexity Examples ===");

  const arr = Array.from({ length: 1000 }, (_, i) => i);

  // สังเกต: O(1) vs O(log n) vs O(n)
  console.time("O(1) getFirst");
  for (let i = 0; i < 1_000_000; i++) getFirst(arr);
  console.timeEnd("O(1) getFirst");

  console.time("O(log n) binarySearch");
  for (let i = 0; i < 1_000_000; i++) binarySearch(arr, 999);
  console.timeEnd("O(log n) binarySearch");
  console.time("O(n) sum");
  for (let i = 0; i < 1_000_000; i++) sum(arr);
  console.timeEnd("O(n) sum");

  console.log("\n=== Complexity Table ===");
  console.table(complexityTable);
}

main();
