/**
 * 01 — ARRAYS
 * ============================================================
 * อ้างอิง: CLRS Ch.2, https://www.bigocheatsheet.com
 *
 * Array = ชุดข้อมูลที่เรียงต่อกันในหน่วยความจำ (contiguous memory)
 * Index เริ่มจาก 0
 *
 * Time Complexity:
 *   Access  : O(1)
 *   Search  : O(n)
 *   Insert  : O(n) — ต้องเลื่อน elements
 *   Delete  : O(n) — ต้องเลื่อน elements
 * Space Complexity: O(n)
 * ============================================================
 */

// ─── 1. BASIC OPERATIONS ────────────────────────────────────

function arrayBasics(): void {
  console.log("=== Array Basics ===");

  const nums: number[] = [3, 1, 4, 1, 5, 9, 2, 6];

  // Access O(1)
  console.log("Index 0:", nums[0]); // 3

  // Search O(n)
  const idx = nums.indexOf(5);
  console.log("Index of 5:", idx); // 4

  // Insert at end O(1) amortized
  nums.push(5);
  // Insert at front O(n) — ต้องเลื่อนทุก element
  nums.unshift(0);

  // Delete
  nums.pop();       // ลบท้าย O(1)
  nums.shift();     // ลบหน้า O(n)
  nums.splice(2, 1); // ลบ index 2 จำนวน 1 ตัว O(n)

  console.log("After operations:", nums);
}

// ─── 2. TWO POINTERS TECHNIQUE ──────────────────────────────

/**
 * ใช้ pointer 2 ตัว เดินหา pair ที่ตรงเงื่อนไข
 * Real-world: หาคู่ที่ผลรวม = target ใน sorted array
 * Time: O(n), Space: O(1)
 */
function twoSumForArray(nums: number[], target: number): [number, number] | null {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return null;
}

/**
 * Reverse array in-place ด้วย two pointers
 * Time: O(n), Space: O(1)
 */
function reverseArray<T>(arr: T[]): T[] {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]]; // swap
    left++;
    right--;
  }
  return arr;
}

// ─── 3. SLIDING WINDOW ──────────────────────────────────────

/**
 * หา subarray ขนาด k ที่มีผลรวมมากที่สุด
 * Real-world: หา moving average ใน stock price
 * Time: O(n), Space: O(1)
 */
function maxSumSubarray(nums: number[], k: number): number {
  if (nums.length < k) return -1;

  // คำนวณ window แรก
  let windowSum = nums.slice(0, k).reduce((a, b) => a + b, 0);
  let maxSum = windowSum;

  // เลื่อน window ไปทีละ 1
  for (let i = k; i < nums.length; i++) {
    windowSum += nums[i] - nums[i - k]; // เพิ่มตัวใหม่ ลบตัวเก่า
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}

/**
 * หา longest substring ที่ไม่มี char ซ้ำ
 * Real-world: ใช้ใน input validation, text processing
 * Time: O(n), Space: O(k) — k = charset size
 */
function longestUniqueSubstring(s: string): number {
  const seen = new Map<string, number>(); // char -> last index
  let maxLen = 0;
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (seen.has(ch) && seen.get(ch)! >= left) {
      left = seen.get(ch)! + 1; // ย้าย left หลัง char ที่ซ้ำ
    }
    seen.set(ch, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}

// ─── 4. PREFIX SUM ──────────────────────────────────────────

/**
 * คำนวณ prefix sum ล่วงหน้า เพื่อ query range sum ใน O(1)
 * Real-world: ใช้ใน database aggregate, image processing
 * Build: O(n), Query: O(1)
 */
class PrefixSum {
  private prefix: number[];

  constructor(nums: number[]) {
    this.prefix = new Array(nums.length + 1).fill(0);
    for (let i = 0; i < nums.length; i++) {
      this.prefix[i + 1] = this.prefix[i] + nums[i];
    }
  }

  // ผลรวม nums[l..r] (inclusive)
  rangeSum(l: number, r: number): number {
    return this.prefix[r + 1] - this.prefix[l];
  }
}

// ─── 5. MATRIX / 2D ARRAY ───────────────────────────────────

/**
 * Rotate matrix 90° clockwise in-place
 * Real-world: image rotation, game board transformation
 * Time: O(n²), Space: O(1)
 */
function rotateMatrix(matrix: number[][]): void {
  const n = matrix.length;
  // Step 1: Transpose (swap [i][j] กับ [j][i])
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }
  // Step 2: Reverse each row
  for (let i = 0; i < n; i++) {
    matrix[i].reverse();
  }
}

// ─── DEMO ────────────────────────────────────────────────────

function mainArray(): void {
  arrayBasics();

  console.log("\n=== Two Sum ===");
  const sorted = [1, 2, 3, 4, 6, 8, 11];
  console.log("Find pair summing to 10:", twoSumForArray(sorted, 10)); // [3,5] → 4+6

  console.log("\n=== Reverse Array ===");
  console.log(reverseArray([1, 2, 3, 4, 5])); // [5,4,3,2,1]

  console.log("\n=== Sliding Window ===");
  console.log("Max sum of 3 consecutive:", maxSumSubarray([2, 1, 5, 1, 3, 2], 3)); // 9
  console.log("Longest unique substring in 'abcabcbb':", longestUniqueSubstring("abcabcbb")); // 3

  console.log("\n=== Prefix Sum ===");
  const ps = new PrefixSum([1, 2, 3, 4, 5]);
  console.log("Sum [1..3]:", ps.rangeSum(1, 3)); // 9 (2+3+4)

  console.log("\n=== Rotate Matrix ===");
  const mat = [[1,2,3],[4,5,6],[7,8,9]];
  rotateMatrix(mat);
  console.log(mat); // [[7,4,1],[8,5,2],[9,6,3]]
}

main();
