/**
 * 08 — SEARCHING ALGORITHMS
 * ============================================================
 * อ้างอิง: CLRS Ch.2.3, Ch.9
 *
 * Linear Search : O(n) — ไม่จำเป็นต้อง sorted
 * Binary Search : O(log n) — ต้อง sorted
 * ============================================================
 */

// ─── 1. BINARY SEARCH (Classic) ──────────────────────────────

/**
 * Time: O(log n), Space: O(1)
 */
function binarySearchForSearch(arr: number[], target: number): number {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2); // avoid overflow vs (l+r)/2
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

// ─── 2. BINARY SEARCH VARIANTS ───────────────────────────────

/**
 * Lower Bound — หา index แรกที่ >= target
 * Real-world: find first available slot, price range search
 */
function lowerBound(arr: number[], target: number): number {
  let left = 0, right = arr.length;
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (arr[mid] < target) left = mid + 1;
    else right = mid;
  }
  return left;
}

/**
 * Upper Bound — หา index แรกที่ > target
 * Real-world: count occurrences = upperBound - lowerBound
 */
function upperBound(arr: number[], target: number): number {
  let left = 0, right = arr.length;
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (arr[mid] <= target) left = mid + 1;
    else right = mid;
  }
  return left;
}

/**
 * Search in Rotated Sorted Array
 * Real-world: time-series data with rollover index
 * Time: O(log n)
 */
function searchRotated(nums: number[], target: number): number {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] === target) return mid;
    // ตรวจว่า left half sorted?
    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) right = mid - 1;
      else left = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[right]) left = mid + 1;
      else right = mid - 1;
    }
  }
  return -1;
}

/**
 * Find minimum in rotated sorted array
 * Time: O(log n)
 */
function findMin(nums: number[]): number {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] > nums[right]) left = mid + 1;
    else right = mid;
  }
  return nums[left];
}

/**
 * Binary Search on Answer (Search Space)
 * Real-world: minimize max load, koko eating speed, ship capacity
 * 
 * Example: หา minimum days ที่ใช้อ่านหนังสือ m เล่มต่อวัน
 * ถ้าอ่านได้ capacity เล่ม/วัน
 */
function minEatingSpeed(piles: number[], h: number): number {
  let left = 1, right = Math.max(...piles);
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    const days = piles.reduce((sum, p) => sum + Math.ceil(p / mid), 0);
    if (days <= h) right = mid; // mid อาจจะเร็วเกินไป ลองช้าลง
    else left = mid + 1;
  }
  return left;
}

/**
 * Find Peak Element (Binary Search on unsorted)
 * Time: O(log n)
 */
function findPeakElement(nums: number[]): number {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] > nums[mid + 1]) right = mid;
    else left = mid + 1;
  }
  return left;
}

// ─── 3. QUICK SELECT (k-th smallest) ─────────────────────────

/**
 * Find k-th smallest element
 * Real-world: median finding, percentile calculation
 * Time: O(n) average, O(n²) worst | Space: O(1)
 */
function quickSelect(arr: number[], k: number): number {
  const a = [...arr];
  let left = 0, right = a.length - 1;
  const target = k - 1; // 0-indexed

  while (left <= right) {
    const pivot = partition(a, left, right);
    if (pivot === target) return a[pivot];
    if (pivot < target) left = pivot + 1;
    else right = pivot - 1;
  }
  return -1;
}

function partition(arr: number[], low: number, high: number): number {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) { i++; [arr[i], arr[j]] = [arr[j], arr[i]]; }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

// ─── DEMO ────────────────────────────────────────────────────

function mainSearch(): void {
  const sorted = [1, 3, 5, 7, 9, 11, 13, 15, 17];
  console.log("=== Binary Search ===");
  console.log("Find 7:", binarySearchForSearch(sorted, 7));  // 3
  console.log("Find 6:", binarySearchForSearch(sorted, 6));  // -1

  console.log("\n=== Lower/Upper Bound ===");
  const withDups = [1, 2, 2, 2, 3, 4, 5];
  console.log("lowerBound(2):", lowerBound(withDups, 2)); // 1
  console.log("upperBound(2):", upperBound(withDups, 2)); // 4
  console.log("Count of 2:", upperBound(withDups, 2) - lowerBound(withDups, 2)); // 3

  console.log("\n=== Rotated Search ===");
  console.log("Search 0 in [4,5,6,7,0,1,2]:", searchRotated([4,5,6,7,0,1,2], 0)); // 4
  console.log("Min of [3,4,5,1,2]:", findMin([3,4,5,1,2])); // 1

  console.log("\n=== Binary Search on Answer ===");
  console.log("Min eating speed:", minEatingSpeed([3,6,7,11], 8)); // 4

  console.log("\n=== Quick Select ===");
  console.log("3rd smallest of [3,2,1,5,6,4]:", quickSelect([3,2,1,5,6,4], 3)); // 3
}

main();
