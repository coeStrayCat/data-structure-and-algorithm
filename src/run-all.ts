/**
 * Run all DSA modules in sequence
 * npx ts-node src/run-all.ts
 */

const modules = [
  { name: "01 — Arrays", path: "./01-arrays/arrays" },
  { name: "02 — Linked List", path: "./02-linked-list/linked-list" },
  { name: "03 — Stack & Queue", path: "./03-stack-queue/stack-queue" },
  { name: "04 — Hash Table", path: "./04-hash-table/hash-table" },
  { name: "05 — Trees", path: "./05-trees/trees" },
  { name: "06 — Graphs", path: "./06-graphs/graphs" },
  { name: "07 — Sorting", path: "./07-sorting/sorting" },
  { name: "08 — Searching", path: "./08-searching/searching" },
  { name: "09 — Dynamic Programming", path: "./09-dynamic-programming/dp" },
  { name: "10 — Complexity", path: "./10-complexity/complexity" },
];

console.log("🚀 DSA TypeScript Study Guide\n");
console.log("To run individual modules:");
for (const m of modules) {
  console.log(`  npx ts-node src${m.path.slice(1)}.ts  # ${m.name}`);
}
console.log("\nTo run all: npx ts-node src/run-all.ts");
