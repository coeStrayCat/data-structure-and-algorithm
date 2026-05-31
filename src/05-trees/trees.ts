/**
 * 05 — TREES
 * ============================================================
 * อ้างอิง: CLRS Ch.12-13, https://visualgo.net/en/bst
 *
 * Binary Search Tree (BST):
 *   Search / Insert / Delete: O(h) — h = height
 *   Balanced: h = O(log n) → operations O(log n)
 *   Worst case (skewed): h = O(n)
 *
 * Heap:
 *   Insert: O(log n), Extract-min/max: O(log n), Peek: O(1)
 * ============================================================
 */

// ─── 1. BINARY SEARCH TREE ───────────────────────────────────

class TreeNode<T> {
  value: T;
  left: TreeNode<T> | null = null;
  right: TreeNode<T> | null = null;
  constructor(value: T) { this.value = value; }
}

class BST {
  root: TreeNode<number> | null = null;

  insert(value: number): void {
    this.root = this._insert(this.root, value);
  }

  private _insert(node: TreeNode<number> | null, value: number): TreeNode<number> {
    if (!node) return new TreeNode(value);
    if (value < node.value) node.left = this._insert(node.left, value);
    else if (value > node.value) node.right = this._insert(node.right, value);
    return node; // duplicate ignored
  }

  search(value: number): boolean {
    let curr = this.root;
    while (curr) {
      if (value === curr.value) return true;
      curr = value < curr.value ? curr.left : curr.right;
    }
    return false;
  }

  delete(value: number): void {
    this.root = this._delete(this.root, value);
  }

  private _delete(node: TreeNode<number> | null, value: number): TreeNode<number> | null {
    if (!node) return null;
    if (value < node.value) node.left = this._delete(node.left, value);
    else if (value > node.value) node.right = this._delete(node.right, value);
    else {
      // Node found
      if (!node.left) return node.right;
      if (!node.right) return node.left;
      // หา in-order successor (min ของ right subtree)
      let successor = node.right;
      while (successor.left) successor = successor.left;
      node.value = successor.value;
      node.right = this._delete(node.right, successor.value);
    }
    return node;
  }

  // ── Traversals ──────────────────────────────────────────
  inOrder(): number[] {
    const result: number[] = [];
    const traverse = (n: TreeNode<number> | null) => {
      if (!n) return;
      traverse(n.left);
      result.push(n.value);
      traverse(n.right);
    };
    traverse(this.root);
    return result; // sorted order!
  }

  preOrder(): number[] {
    const result: number[] = [];
    const traverse = (n: TreeNode<number> | null) => {
      if (!n) return;
      result.push(n.value);
      traverse(n.left);
      traverse(n.right);
    };
    traverse(this.root);
    return result;
  }

  levelOrder(): number[][] {
    if (!this.root) return [];
    const result: number[][] = [];
    const queue: TreeNode<number>[] = [this.root];
    while (queue.length) {
      const level: number[] = [];
      const size = queue.length;
      for (let i = 0; i < size; i++) {
        const node = queue.shift()!;
        level.push(node.value);
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
      }
      result.push(level);
    }
    return result;
  }
}

// ─── 2. CLASSIC TREE PROBLEMS ────────────────────────────────

/**
 * Height of binary tree
 * Time: O(n), Space: O(h)
 */
function treeHeightForTree(node: TreeNode<number> | null): number {
  if (!node) return 0;
  return 1 + Math.max(treeHeightForTree(node.left), treeHeightForTree(node.right));
}

/**
 * Check if BST is valid
 * Time: O(n), Space: O(h)
 */
function isValidBST(
  node: TreeNode<number> | null,
  min = -Infinity,
  max = Infinity
): boolean {
  if (!node) return true;
  if (node.value <= min || node.value >= max) return false;
  return isValidBST(node.left, min, node.value) &&
         isValidBST(node.right, node.value, max);
}

/**
 * Lowest Common Ancestor
 * Real-world: org charts, file system, version control
 * Time: O(n), Space: O(h)
 */
function lowestCommonAncestor(
  root: TreeNode<number> | null,
  p: number,
  q: number
): TreeNode<number> | null {
  if (!root) return null;
  if (root.value === p || root.value === q) return root;
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  if (left && right) return root; // p and q in different subtrees
  return left ?? right;
}

/**
 * Max path sum
 * Time: O(n), Space: O(h)
 */
function maxPathSum(root: TreeNode<number> | null): number {
  let maxSum = -Infinity;
  function dfs(node: TreeNode<number> | null): number {
    if (!node) return 0;
    const left = Math.max(0, dfs(node.left));
    const right = Math.max(0, dfs(node.right));
    maxSum = Math.max(maxSum, node.value + left + right);
    return node.value + Math.max(left, right);
  }
  dfs(root);
  return maxSum;
}

// ─── 3. TRIE ─────────────────────────────────────────────────

/**
 * Trie (Prefix Tree)
 * Real-world: autocomplete, spell checker, IP routing
 * Insert/Search: O(m) — m = word length
 */
class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEnd: boolean = false;
}

class Trie {
  private root = new TrieNode();

  insert(word: string): void {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch)!;
    }
    node.isEnd = true;
  }

  search(word: string): boolean {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) return false;
      node = node.children.get(ch)!;
    }
    return node.isEnd;
  }

  startsWith(prefix: string): boolean {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children.has(ch)) return false;
      node = node.children.get(ch)!;
    }
    return true;
  }

  autocomplete(prefix: string): string[] {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children.has(ch)) return [];
      node = node.children.get(ch)!;
    }
    const results: string[] = [];
    const dfs = (n: TrieNode, curr: string) => {
      if (n.isEnd) results.push(curr);
      for (const [ch, child] of n.children) dfs(child, curr + ch);
    };
    dfs(node, prefix);
    return results;
  }
}

// ─── DEMO ────────────────────────────────────────────────────

function mainTree(): void {
  console.log("=== BST ===");
  const bst = new BST();
  [5, 3, 7, 1, 4, 6, 8].forEach(n => bst.insert(n));
  console.log("In-order (sorted):", bst.inOrder()); // [1,3,4,5,6,7,8]
  console.log("Level-order:", bst.levelOrder());    // [[5],[3,7],[1,4,6,8]]
  console.log("Search 4:", bst.search(4));           // true
  bst.delete(3);
  console.log("After delete 3:", bst.inOrder());     // [1,4,5,6,7,8]

  console.log("\n=== Tree Height ===");
  console.log("Height:", treeHeightForTree(bst.root)); // ~3

  console.log("\n=== Trie ===");
  const trie = new Trie();
  ["apple", "app", "application", "apply", "banana"].forEach(w => trie.insert(w));
  console.log("search('app'):", trie.search("app"));        // true
  console.log("search('ap'):", trie.search("ap"));          // false
  console.log("startsWith('app'):", trie.startsWith("app")); // true
  console.log("autocomplete('app'):", trie.autocomplete("app")); // [app, apple, application, apply]
}

main();
