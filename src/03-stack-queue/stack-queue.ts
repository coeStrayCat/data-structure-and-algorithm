/**
 * 03 — STACK & QUEUE
 * ============================================================
 * อ้างอิง: CLRS Ch.10
 *
 * Stack  = LIFO (Last In, First Out) — เหมือนกองจาน
 * Queue  = FIFO (First In, First Out) — เหมือนคิว
 * Deque  = Double-ended queue — ใส่/เอาออกได้ทั้ง 2 ด้าน
 *
 * All core operations: O(1) amortized
 * ============================================================
 */

// ─── 1. STACK ────────────────────────────────────────────────

class Stack<T> {
  private items: T[] = [];
  push(item: T): void { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
  peek(): T | undefined { return this.items[this.items.length - 1]; }
  isEmpty(): boolean { return this.items.length === 0; }
  size(): number { return this.items.length; }
}

// ─── 2. QUEUE ────────────────────────────────────────────────

// ⚠️ Array shift() เป็น O(n) — production ใช้ linked list หรือ circular buffer แทน
class Queue<T> {
  private items: T[] = [];
  private head: number = 0;

  enqueue(item: T): void { this.items.push(item); }
  dequeue(): T | undefined {
    if (this.isEmpty()) return undefined;
    const item = this.items[this.head++];
    // Compact array เมื่อ head > half
    if (this.head > this.items.length / 2) {
      this.items = this.items.slice(this.head);
      this.head = 0;
    }
    return item;
  }
  front(): T | undefined { return this.items[this.head]; }
  isEmpty(): boolean { return this.head >= this.items.length; }
  size(): number { return this.items.length - this.head; }
}

// ─── 3. DEQUE (Double-Ended Queue) ──────────────────────────

class Deque<T> {
  private items: T[] = [];
  addFront(item: T): void { this.items.unshift(item); }  // O(n) — ใช้ DLL จะเป็น O(1)
  addBack(item: T): void { this.items.push(item); }
  removeFront(): T | undefined { return this.items.shift(); }
  removeBack(): T | undefined { return this.items.pop(); }
  peekFront(): T | undefined { return this.items[0]; }
  peekBack(): T | undefined { return this.items[this.items.length - 1]; }
  isEmpty(): boolean { return this.items.length === 0; }
}

// ─── 4. PRIORITY QUEUE (Min-Heap based) ──────────────────────

/**
 * Min Priority Queue
 * Real-world: Dijkstra shortest path, task scheduling, A* pathfinding
 * enqueue: O(log n), dequeue: O(log n), peek: O(1)
 */
class MinPriorityQueue<T> {
  private heap: [number, T][] = []; // [priority, value]

  enqueue(priority: number, value: T): void {
    this.heap.push([priority, value]);
    this._bubbleUp(this.heap.length - 1);
  }

  dequeue(): T | undefined {
    if (this.heap.length === 0) return undefined;
    const min = this.heap[0][1];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._sinkDown(0);
    }
    return min;
  }

  peek(): T | undefined { return this.heap[0]?.[1]; }
  size(): number { return this.heap.length; }

  private _bubbleUp(i: number): void {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.heap[parent][0] <= this.heap[i][0]) break;
      [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
      i = parent;
    }
  }

  private _sinkDown(i: number): void {
    const n = this.heap.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && this.heap[l][0] < this.heap[smallest][0]) smallest = l;
      if (r < n && this.heap[r][0] < this.heap[smallest][0]) smallest = r;
      if (smallest === i) break;
      [this.heap[smallest], this.heap[i]] = [this.heap[i], this.heap[smallest]];
      i = smallest;
    }
  }
}

// ─── 5. CLASSIC PROBLEMS ─────────────────────────────────────

/**
 * Valid Parentheses — ตรวจ bracket matching
 * Real-world: compiler/linter, JSON validator, HTML parser
 * Time: O(n), Space: O(n)
 */
function isValidParentheses(s: string): boolean {
  const stack = new Stack<string>();
  const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
  for (const ch of s) {
    if ('([{'.includes(ch)) stack.push(ch);
    else {
      if (stack.pop() !== pairs[ch]) return false;
    }
  }
  return stack.isEmpty();
}

/**
 * Monotonic Stack — หา Next Greater Element
 * Real-world: stock span, histogram largest rectangle
 * Time: O(n), Space: O(n)
 */
function nextGreaterElement(nums: number[]): number[] {
  const result = new Array(nums.length).fill(-1);
  const stack: number[] = []; // stack ของ index

  for (let i = 0; i < nums.length; i++) {
    while (stack.length > 0 && nums[stack[stack.length - 1]] < nums[i]) {
      const idx = stack.pop()!;
      result[idx] = nums[i];
    }
    stack.push(i);
  }
  return result;
}

/**
 * Sliding Window Maximum (Monotonic Deque)
 * Real-world: real-time analytics, sensor data processing
 * Time: O(n), Space: O(k)
 */
function slidingWindowMax(nums: number[], k: number): number[] {
  const deque: number[] = []; // index, decreasing order
  const result: number[] = [];

  for (let i = 0; i < nums.length; i++) {
    // ลบ index ที่ออกนอก window
    while (deque.length && deque[0] < i - k + 1) deque.shift();
    // ลบ index ที่ค่าน้อยกว่าปัจจุบัน (ไม่มีประโยชน์)
    while (deque.length && nums[deque[deque.length - 1]] < nums[i]) deque.pop();
    deque.push(i);
    if (i >= k - 1) result.push(nums[deque[0]]);
  }
  return result;
}

/**
 * Implement Queue using 2 Stacks
 * Real-world: interview classic, async message buffering
 * Amortized O(1) per operation
 */
class QueueWithStacks<T> {
  private inbox = new Stack<T>();
  private outbox = new Stack<T>();

  enqueue(item: T): void { this.inbox.push(item); }

  dequeue(): T | undefined {
    if (this.outbox.isEmpty()) {
      // ย้ายทั้งหมดจาก inbox → outbox (reverse order)
      while (!this.inbox.isEmpty()) this.outbox.push(this.inbox.pop()!);
    }
    return this.outbox.pop();
  }
}

// ─── DEMO ────────────────────────────────────────────────────

function mainStack(): void {
  console.log("=== Stack ===");
  const stack = new Stack<number>();
  [1, 2, 3].forEach(n => stack.push(n));
  console.log("Peek:", stack.peek()); // 3
  console.log("Pop:", stack.pop());   // 3

  console.log("\n=== Queue ===");
  const queue = new Queue<string>();
  ["A", "B", "C"].forEach(s => queue.enqueue(s));
  console.log("Front:", queue.front());     // A
  console.log("Dequeue:", queue.dequeue()); // A
  console.log("Front:", queue.front());     // B

  console.log("\n=== Priority Queue ===");
  const pq = new MinPriorityQueue<string>();
  pq.enqueue(3, "low");
  pq.enqueue(1, "high");
  pq.enqueue(2, "medium");
  console.log("Dequeue:", pq.dequeue()); // high (priority 1)
  console.log("Dequeue:", pq.dequeue()); // medium (priority 2)

  console.log("\n=== Valid Parentheses ===");
  console.log("'([{}])':", isValidParentheses("([{}])")); // true
  console.log("'([)]':", isValidParentheses("([)]"));     // false

  console.log("\n=== Next Greater Element ===");
  console.log(nextGreaterElement([2, 1, 2, 4, 3])); // [4,2,4,-1,-1]

  console.log("\n=== Sliding Window Max ===");
  console.log(slidingWindowMax([1, 3, -1, -3, 5, 3, 6, 7], 3)); // [3,3,5,5,6,7]
}

main();
