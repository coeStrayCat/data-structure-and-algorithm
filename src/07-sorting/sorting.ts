/**
 * 07 — SORTING ALGORITHMS
 * ============================================================
 * อ้างอิง: CLRS Ch.2, Ch.6, Ch.7, Ch.8
 *
 * | Algorithm   | Best     | Average  | Worst    | Space  | Stable |
 * |-------------|----------|----------|----------|--------|--------|
 * | Bubble      | O(n)     | O(n²)    | O(n²)    | O(1)   | ✅     |
 * | Selection   | O(n²)    | O(n²)    | O(n²)    | O(1)   | ❌     |
 * | Insertion   | O(n)     | O(n²)    | O(n²)    | O(1)   | ✅     |
 * | Merge       | O(n logn)| O(n logn)| O(n logn)| O(n)   | ✅     |
 * | Quick       | O(n logn)| O(n logn)| O(n²)    | O(logn)| ❌     |
 * | Heap        | O(n logn)| O(n logn)| O(n logn)| O(1)   | ❌     |
 * | Counting    | O(n+k)   | O(n+k)   | O(n+k)   | O(k)   | ✅     |
 * ============================================================
 */

// ─── 1. BUBBLE SORT ──────────────────────────────────────────
// ง่ายที่สุด แต่ช้าที่สุด — ใช้สอนเท่านั้น
function bubbleSort(arr: number[]): number[] {
  const a = [...arr];
  for (let i = 0; i < a.length; i++) {
    let swapped = false;
    for (let j = 0; j < a.length - i - 1; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
      }
    }
    if (!swapped) break; // already sorted → O(n) best case
  }
  return a;
}

// ─── 2. INSERTION SORT ───────────────────────────────────────
// เหมาะกับ small/nearly-sorted arrays, online sorting
function insertionSort(arr: number[]): number[] {
  const a = [...arr];
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
  }
  return a;
}

// ─── 3. MERGE SORT ───────────────────────────────────────────
/**
 * Divide & Conquer — guaranteed O(n log n)
 * Real-world: external sorting (files), Java's Arrays.sort (objects), stable sort
 * Time: O(n log n), Space: O(n)
 */
function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
}

// ─── 4. QUICK SORT ───────────────────────────────────────────
/**
 * Fastest in practice (cache-friendly, in-place)
 * Real-world: C++ std::sort, V8 Array.sort (numbers)
 * Time: O(n log n) avg, O(n²) worst | Space: O(log n)
 */
function quickSort(arr: number[], low = 0, high = arr.length - 1): number[] {
  const a = low === 0 ? [...arr] : arr;
  if (low < high) {
    const pi = partitionSorting(a, low, high);
    quickSort(a, low, pi - 1);
    quickSort(a, pi + 1, high);
  }
  return a;
}

function partitionSorting(arr: number[], low: number, high: number): number {
  // Median-of-3 pivot (reduces worst-case probability)
  const mid = Math.floor((low + high) / 2);
  if (arr[mid] < arr[low]) [arr[mid], arr[low]] = [arr[low], arr[mid]];
  if (arr[high] < arr[low]) [arr[high], arr[low]] = [arr[low], arr[high]];
  if (arr[mid] < arr[high]) [arr[mid], arr[high]] = [arr[high], arr[mid]];
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

// ─── 5. HEAP SORT ────────────────────────────────────────────
/**
 * Uses max-heap, guaranteed O(n log n), in-place
 * Real-world: priority queues, order statistics
 * Time: O(n log n), Space: O(1)
 */
function heapSort(arr: number[]): number[] {
  const a = [...arr];
  const n = a.length;

  // Build max-heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(a, n, i);

  // Extract max one by one
  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    heapify(a, i, 0);
  }
  return a;
}

function heapify(arr: number[], n: number, i: number): void {
  let largest = i;
  const l = 2 * i + 1, r = 2 * i + 2;
  if (l < n && arr[l] > arr[largest]) largest = l;
  if (r < n && arr[r] > arr[largest]) largest = r;
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}

// ─── 6. COUNTING SORT ────────────────────────────────────────
/**
 * Non-comparison sort — faster than O(n log n) when k is small
 * Real-world: sort grades, sort by age, radix sort subroutine
 * Time: O(n+k), Space: O(k) — k = value range
 */
function countingSort(arr: number[]): number[] {
  if (arr.length === 0) return [];
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const count = new Array(max - min + 1).fill(0);
  for (const n of arr) count[n - min]++;
  // Cumulative count (stable)
  for (let i = 1; i < count.length; i++) count[i] += count[i - 1];
  const result = new Array(arr.length);
  for (let i = arr.length - 1; i >= 0; i--) {
    result[--count[arr[i] - min]] = arr[i];
  }
  return result;
}

// ─── 7. WHEN TO USE WHICH? ───────────────────────────────────
/*
  n < 20          → Insertion Sort (low overhead)
  Stable needed   → Merge Sort
  In-place needed → Quick Sort or Heap Sort
  Integers, small range → Counting Sort
  General purpose → Quick Sort (fastest in practice)
  Already sorted  → Insertion Sort O(n)
  Nearly sorted   → Tim Sort (Python/Java default)
*/

// ─── DEMO ────────────────────────────────────────────────────

function mainSorting(): void {
  const input = [64, 34, 25, 12, 22, 11, 90];
  console.log("Input:", input);
  console.log("Bubble  :", bubbleSort(input));
  console.log("Insertion:", insertionSort(input));
  console.log("Merge   :", mergeSort(input));
  console.log("Quick   :", quickSort(input));
  console.log("Heap    :", heapSort(input));
  console.log("Counting:", countingSort(input));

  // Performance comparison
  console.log("\n=== Performance Test (n=10,000) ===");
  const big = Array.from({ length: 10000 }, () => Math.floor(Math.random() * 10000));

  let t = performance.now();
  mergeSort([...big]);
  console.log(`Merge Sort: ${(performance.now() - t).toFixed(2)}ms`);

  t = performance.now();
  quickSort([...big]);
  console.log(`Quick Sort: ${(performance.now() - t).toFixed(2)}ms`);

  t = performance.now();
  [...big].sort((a, b) => a - b);
  console.log(`Built-in sort: ${(performance.now() - t).toFixed(2)}ms`);
}

main();
