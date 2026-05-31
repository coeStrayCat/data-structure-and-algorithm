/**
 * 09 — DYNAMIC PROGRAMMING
 * ============================================================
 * อ้างอิง: CLRS Ch.15, https://leetcode.com/explore/learn/card/dynamic-programming/
 *
 * DP = แก้ปัญหาใหญ่โดยใช้คำตอบของปัญหาย่อย
 * สองเงื่อนไขที่ต้องมี:
 *   1. Optimal Substructure — คำตอบของ subproblem ใช้ได้กับ problem ใหญ่
 *   2. Overlapping Subproblems — subproblem ซ้ำกัน
 *
 * วิธีทำ:
 *   Top-Down (Memoization) = recursive + cache
 *   Bottom-Up (Tabulation) = iterative, ไม่มี call stack overhead
 * ============================================================
 */

// ─── 1. FIBONACCI — ตัวอย่างพื้นฐาน ─────────────────────────

// Naive recursive: O(2ⁿ) — ช้ามาก
function fibNaiveDynamic(n: number): number {
  if (n <= 1) return n;
  return fibNaiveDynamic(n - 1) + fibNaiveDynamic(n - 2);
}

// Memoization (Top-Down): O(n) Time, O(n) Space
function fibMemo(n: number, memo = new Map<number, number>()): number {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n)!;
  const result = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  memo.set(n, result);
  return result;
}

// Tabulation (Bottom-Up): O(n) Time, O(1) Space
function fibDP(n: number): number {
  if (n <= 1) return n;
  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++) [prev, curr] = [curr, prev + curr];
  return curr;
}

// ─── 2. CLIMBING STAIRS ──────────────────────────────────────

/**
 * ขึ้นบันได n ขั้น ก้าวได้ 1 หรือ 2 ขั้น — มีกี่วิธี?
 * ≡ Fibonacci! dp[i] = dp[i-1] + dp[i-2]
 * Real-world: counting paths, coin change patterns
 */
function climbStairs(n: number): number {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) [a, b] = [b, a + b];
  return b;
}

// ─── 3. COIN CHANGE ──────────────────────────────────────────

/**
 * หำ minimum coins ที่ใช้ทอน amount
 * Real-world: vending machine, currency exchange, resource allocation
 * Time: O(amount * coins), Space: O(amount)
 */
function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const coin of coins) {
      if (coin <= a) dp[a] = Math.min(dp[a], dp[a - coin] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

// ─── 4. LONGEST COMMON SUBSEQUENCE ───────────────────────────

/**
 * LCS — หา subsequence ยาวสุดที่ปรากฏใน text1 และ text2
 * Real-world: diff tool (git diff), DNA matching, plagiarism detection
 * Time: O(m*n), Space: O(m*n)
 */
function longestCommonSubsequence(text1: string, text2: string): number {
  const m = text1.length, n = text2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}

// ─── 5. 0/1 KNAPSACK ─────────────────────────────────────────

/**
 * เลือกของใส่กระเป๋า capacity W ให้ได้ value มากสุด
 * Real-world: resource allocation, portfolio optimization, task selection
 * Time: O(n*W), Space: O(n*W) — ปรับเป็น O(W) ได้
 */
function knapsack(weights: number[], values: number[], W: number): number {
  const n = weights.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= W; w++) {
      dp[i][w] = dp[i - 1][w]; // ไม่เอาของชิ้น i
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - weights[i - 1]] + values[i - 1]);
      }
    }
  }
  return dp[n][W];
}

// ─── 6. LONGEST INCREASING SUBSEQUENCE ───────────────────────

/**
 * LIS — หา subsequence ที่เรียงน้อย-มาก ยาวสุด
 * Real-world: stock trading (max non-decreasing periods), poker hand analysis
 * Time: O(n log n) with patience sorting, O(n²) naive
 */
function lengthOfLIS(nums: number[]): number {
  const tails: number[] = []; // tails[i] = smallest tail of all IS with length i+1

  for (const num of nums) {
    let left = 0, right = tails.length;
    while (left < right) { // binary search
      const mid = left + Math.floor((right - left) / 2);
      if (tails[mid] < num) left = mid + 1;
      else right = mid;
    }
    tails[left] = num;
  }
  return tails.length;
}

// ─── 7. EDIT DISTANCE ────────────────────────────────────────

/**
 * Levenshtein distance — minimum operations to transform word1 → word2
 * Operations: insert, delete, replace
 * Real-world: spell checker, DNA sequence alignment, fuzzy search
 * Time: O(m*n), Space: O(m*n)
 */
function editDistance(word1: string, word2: string): number {
  const m = word1.length, n = word2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

// ─── 8. HOUSE ROBBER ─────────────────────────────────────────

/**
 * ขโมยบ้านไม่ติดกัน ได้เงินมากสุด
 * Real-world: max non-adjacent sum, scheduling problem
 * Time: O(n), Space: O(1)
 */
function rob(nums: number[]): number {
  let prev = 0, curr = 0;
  for (const n of nums) [prev, curr] = [curr, Math.max(curr, prev + n)];
  return curr;
}

// ─── DEMO ────────────────────────────────────────────────────

function mainDynamic(): void {
  console.log("=== Fibonacci ===");
  console.log("fib(10) naive:", fibNaiveDynamic(10));  // 55
  console.log("fib(10) memo:", fibMemo(10));    // 55
  console.log("fib(50) dp:", fibDP(50));        // 12586269025

  console.log("\n=== Climb Stairs ===");
  console.log("climbStairs(5):", climbStairs(5)); // 8

  console.log("\n=== Coin Change ===");
  console.log("coins=[1,5,6,9], amount=11:", coinChange([1,5,6,9], 11)); // 2 (5+6)

  console.log("\n=== LCS ===");
  console.log("LCS('abcde','ace'):", longestCommonSubsequence("abcde", "ace")); // 3

  console.log("\n=== Knapsack ===");
  console.log(knapsack([1,3,4,5],[1,4,5,7], 7)); // 9

  console.log("\n=== LIS ===");
  console.log("LIS of [10,9,2,5,3,7,101,18]:", lengthOfLIS([10,9,2,5,3,7,101,18])); // 4

  console.log("\n=== Edit Distance ===");
  console.log("'horse' -> 'ros':", editDistance("horse", "ros")); // 3

  console.log("\n=== House Robber ===");
  console.log("rob([2,7,9,3,1]):", rob([2,7,9,3,1])); // 12
}

main();
