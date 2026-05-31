/**
 * 02 — LINKED LIST
 * ============================================================
 * อ้างอิง: CLRS Ch.10, https://visualgo.net/en/list
 *
 * Linked List = โหนดที่แต่ละตัว pointer ไปยังตัวถัดไป
 * ไม่เหมือน Array ไม่ต้องการ contiguous memory
 *
 * Singly Linked List:
 *   Access  : O(n)
 *   Search  : O(n)
 *   Insert (head/tail): O(1)
 *   Insert (middle)   : O(n)
 *   Delete  : O(n)
 * Space: O(n)
 * ============================================================
 */

// ─── 1. NODE & SINGLY LINKED LIST ───────────────────────────

class ListNode<T> {
  value: T;
  next: ListNode<T> | null = null;
  constructor(value: T) {
    this.value = value;
  }
}

class SinglyLinkedList<T> {
  head: ListNode<T> | null = null;
  private size: number = 0;

  // เพิ่มที่ท้าย O(n) — ปรับเป็น O(1) ถ้ามี tail pointer
  append(value: T): void {
    const node = new ListNode(value);
    if (!this.head) { this.head = node; }
    else {
      let curr = this.head;
      while (curr.next) curr = curr.next;
      curr.next = node;
    }
    this.size++;
  }

  // เพิ่มที่หน้า O(1)
  prepend(value: T): void {
    const node = new ListNode(value);
    node.next = this.head;
    this.head = node;
    this.size++;
  }

  // ลบ node ที่มี value ตรงกัน O(n)
  delete(value: T): boolean {
    if (!this.head) return false;
    if (this.head.value === value) {
      this.head = this.head.next;
      this.size--;
      return true;
    }
    let curr = this.head;
    while (curr.next) {
      if (curr.next.value === value) {
        curr.next = curr.next.next;
        this.size--;
        return true;
      }
      curr = curr.next;
    }
    return false;
  }

  toArray(): T[] {
    const result: T[] = [];
    let curr = this.head;
    while (curr) { result.push(curr.value); curr = curr.next; }
    return result;
  }

  getSize(): number { return this.size; }
}

// ─── 2. DOUBLY LINKED LIST ──────────────────────────────────

class DListNode<T> {
  value: T;
  prev: DListNode<T> | null = null;
  next: DListNode<T> | null = null;
  constructor(value: T) { this.value = value; }
}

class DoublyLinkedList<T> {
  head: DListNode<T> | null = null;
  tail: DListNode<T> | null = null;

  // เพิ่มท้าย O(1) — มี tail pointer
  append(value: T): void {
    const node = new DListNode(value);
    if (!this.tail) { this.head = this.tail = node; }
    else {
      node.prev = this.tail;
      this.tail.next = node;
      this.tail = node;
    }
  }

  // ลบ node O(1) ถ้ารู้ reference
  deleteNode(node: DListNode<T>): void {
    if (node.prev) node.prev.next = node.next;
    else this.head = node.next;
    if (node.next) node.next.prev = node.prev;
    else this.tail = node.prev;
  }
}

// ─── 3. CLASSIC ALGORITHMS ──────────────────────────────────

/**
 * Detect cycle (Floyd's Tortoise & Hare)
 * Real-world: detect infinite loop ใน process scheduling
 * Time: O(n), Space: O(1)
 */
function hasCycleForLinked<T>(head: ListNode<T> | null): boolean {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

/**
 * Reverse linked list iteratively
 * Time: O(n), Space: O(1)
 */
function reverseList<T>(head: ListNode<T> | null): ListNode<T> | null {
  let prev: ListNode<T> | null = null;
  let curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}

/**
 * หา middle node (slow-fast pointer)
 * Time: O(n), Space: O(1)
 */
function findMiddle<T>(head: ListNode<T> | null): ListNode<T> | null {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
  }
  return slow;
}

/**
 * Merge two sorted linked lists
 * Real-world: merge sort implementation, database merge
 * Time: O(n+m), Space: O(1)
 */
function mergeSortedLists(
  l1: ListNode<number> | null,
  l2: ListNode<number> | null
): ListNode<number> | null {
  const dummy = new ListNode(0);
  let curr = dummy;
  while (l1 && l2) {
    if (l1.value <= l2.value) { curr.next = l1; l1 = l1.next; }
    else { curr.next = l2; l2 = l2.next; }
    curr = curr.next!;
  }
  curr.next = l1 ?? l2;
  return dummy.next;
}

// ─── 4. LRU CACHE (Real-world use case) ─────────────────────

/**
 * LRU Cache ใช้ Doubly Linked List + HashMap
 * Real-world: browser cache, CPU cache, Redis eviction policy
 * All operations O(1)
 */
class LRUCache {
  private capacity: number;
  private map: Map<number, DListNode<[number, number]>>; // key -> node
  private list: DoublyLinkedList<[number, number]>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.map = new Map();
    this.list = new DoublyLinkedList();
  }

  get(key: number): number {
    const node = this.map.get(key);
    if (!node) return -1;
    // ย้ายไปหน้าสุด (most recently used)
    this.list.deleteNode(node);
    this.list.append(node.value);
    this.map.set(key, this.list.tail!);
    return node.value[1];
  }

  put(key: number, value: number): void {
    if (this.map.has(key)) {
      this.list.deleteNode(this.map.get(key)!);
    } else if (this.map.size >= this.capacity) {
      // evict least recently used (head)
      const lru = this.list.head!;
      this.list.deleteNode(lru);
      this.map.delete(lru.value[0]);
    }
    this.list.append([key, value]);
    this.map.set(key, this.list.tail!);
  }
}

// ─── DEMO ────────────────────────────────────────────────────

function mainLinked(): void {
  console.log("=== Singly Linked List ===");
  const ll = new SinglyLinkedList<number>();
  [1, 2, 3, 4, 5].forEach(n => ll.append(n));
  console.log("List:", ll.toArray()); // [1,2,3,4,5]
  ll.delete(3);
  console.log("After delete 3:", ll.toArray()); // [1,2,4,5]

  console.log("\n=== Reverse ===");
  const head = new ListNode(1);
  head.next = new ListNode(2);
  head.next.next = new ListNode(3);
  const rev = reverseList(head);
  const arr: number[] = [];
  let c = rev;
  while (c) { arr.push(c.value); c = c.next; }
  console.log("Reversed:", arr); // [3,2,1]

  console.log("\n=== LRU Cache ===");
  const cache = new LRUCache(2);
  cache.put(1, 10);
  cache.put(2, 20);
  console.log("get(1):", cache.get(1)); // 10
  cache.put(3, 30); // evict key 2
  console.log("get(2):", cache.get(2)); // -1 (evicted)
  console.log("get(3):", cache.get(3)); // 30
}

main();
