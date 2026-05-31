/**
 * 04 — HASH TABLE
 * ============================================================
 * อ้างอิง: CLRS Ch.11, MDN Map/Set docs
 *
 * Hash Table = key → hash function → index ใน array
 * Collision handling: chaining (linked list) หรือ open addressing
 *
 * Average case:
 *   Search / Insert / Delete : O(1)
 * Worst case (all collisions):
 *   O(n) — ใน practice แทบไม่เกิด
 * Space: O(n)
 * ============================================================
 */

// ─── 1. HASH TABLE FROM SCRATCH ──────────────────────────────

class HashTable<K, V> {
  private buckets: Array<Array<[K, V]>>;
  private capacity: number;
  private count: number = 0;
  private readonly LOAD_FACTOR = 0.75;

  constructor(capacity = 16) {
    this.capacity = capacity;
    this.buckets = Array.from({ length: capacity }, () => []);
  }

  private hash(key: K): number {
    const str = String(key);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) % this.capacity;
    }
    return hash;
  }

  set(key: K, value: V): void {
    if (this.count / this.capacity >= this.LOAD_FACTOR) this._resize();
    const idx = this.hash(key);
    const bucket = this.buckets[idx];
    const pair = bucket.find(([k]) => k === key);
    if (pair) pair[1] = value;
    else { bucket.push([key, value]); this.count++; }
  }

  get(key: K): V | undefined {
    const bucket = this.buckets[this.hash(key)];
    return bucket.find(([k]) => k === key)?.[1];
  }

  delete(key: K): boolean {
    const idx = this.hash(key);
    const bucket = this.buckets[idx];
    const i = bucket.findIndex(([k]) => k === key);
    if (i === -1) return false;
    bucket.splice(i, 1);
    this.count--;
    return true;
  }

  private _resize(): void {
    const old = this.buckets;
    this.capacity *= 2;
    this.buckets = Array.from({ length: this.capacity }, () => []);
    this.count = 0;
    for (const bucket of old)
      for (const [k, v] of bucket)
        this.set(k, v);
  }
}

// ─── 2. USING BUILT-IN MAP & SET ─────────────────────────────

function builtInDemo(): void {
  console.log("=== Built-in Map ===");
  const map = new Map<string, number>();
  map.set("apple", 3);
  map.set("banana", 5);
  map.set("apple", 10); // update
  console.log("apple:", map.get("apple"));   // 10
  console.log("has cherry:", map.has("cherry")); // false
  console.log("size:", map.size);            // 2

  // Iteration — Map maintains insertion order
  for (const [key, val] of map) {
    console.log(`${key}: ${val}`);
  }

  console.log("\n=== Built-in Set ===");
  const set = new Set<number>([1, 2, 3, 2, 1]);
  console.log("Set:", [...set]); // [1,2,3] — no duplicates
  set.add(4);
  set.delete(2);
  console.log("Has 2:", set.has(2)); // false
}

// ─── 3. CLASSIC PROBLEMS ─────────────────────────────────────

/**
 * Two Sum — หา indices ที่ผลรวม = target
 * Real-world: recommendation systems, financial transactions
 * Time: O(n), Space: O(n)
 */
function twoSum(nums: number[], target: number): [number, number] | null {
  const seen = new Map<number, number>(); // value -> index
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) return [seen.get(complement)!, i];
    seen.set(nums[i], i);
  }
  return null;
}

/**
 * Group Anagrams
 * Real-world: search engine, spell checker, word games
 * Time: O(n * k log k) — k = avg word length, Space: O(n*k)
 */
function groupAnagrams(words: string[]): string[][] {
  const map = new Map<string, string[]>();
  for (const word of words) {
    const key = word.split("").sort().join(""); // sorted chars = signature
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(word);
  }
  return [...map.values()];
}

/**
 * Longest Consecutive Sequence
 * Real-world: data de-duplication, time series analysis
 * Time: O(n), Space: O(n)
 */
function longestConsecutive(nums: number[]): number {
  const set = new Set(nums);
  let maxLen = 0;
  for (const num of set) {
    // เริ่มนับเฉพาะตอนที่ num เป็น start ของ sequence
    if (!set.has(num - 1)) {
      let curr = num;
      let len = 1;
      while (set.has(curr + 1)) { curr++; len++; }
      maxLen = Math.max(maxLen, len);
    }
  }
  return maxLen;
}

/**
 * Subarray Sum Equals K (Prefix Sum + HashMap)
 * Real-world: log analysis, telemetry windowing
 * Time: O(n), Space: O(n)
 */
function subarraySum(nums: number[], k: number): number {
  const prefixCount = new Map<number, number>([[0, 1]]);
  let sum = 0, count = 0;
  for (const n of nums) {
    sum += n;
    count += prefixCount.get(sum - k) ?? 0;
    prefixCount.set(sum, (prefixCount.get(sum) ?? 0) + 1);
  }
  return count;
}

/**
 * Word Frequency Counter
 * Real-world: analytics dashboard, NLP preprocessing
 */
function wordFrequency(text: string): Map<string, number> {
  const freq = new Map<string, number>();
  for (const word of text.toLowerCase().split(/\s+/)) {
    freq.set(word, (freq.get(word) ?? 0) + 1);
  }
  return freq;
}

// ─── DEMO ────────────────────────────────────────────────────

function mainHash(): void {
  console.log("=== Custom Hash Table ===");
  const ht = new HashTable<string, number>();
  ht.set("x", 10);
  ht.set("y", 20);
  console.log("x:", ht.get("x")); // 10
  ht.delete("x");
  console.log("x after delete:", ht.get("x")); // undefined

  builtInDemo();

  console.log("\n=== Two Sum ===");
  console.log(twoSum([2, 7, 11, 15], 9)); // [0,1]

  console.log("\n=== Group Anagrams ===");
  console.log(groupAnagrams(["eat","tea","tan","ate","nat","bat"]));
  // [["eat","tea","ate"],["tan","nat"],["bat"]]

  console.log("\n=== Longest Consecutive ===");
  console.log(longestConsecutive([100,4,200,1,3,2])); // 4 (1,2,3,4)

  console.log("\n=== Subarray Sum = k ===");
  console.log(subarraySum([1,1,1], 2)); // 2

  console.log("\n=== Word Frequency ===");
  const freq = wordFrequency("the quick brown fox jumps over the lazy fox");
  console.log([...freq.entries()].sort((a,b) => b[1]-a[1]));
}

main();
