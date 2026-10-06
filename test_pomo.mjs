// test_pomo.mjs — 番茄钟统计/建议纯函数 Node 断言。
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import assert from "node:assert";

const here = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(here, "index.html"), "utf-8");
const m = html.match(/\/\/ ===== 纯函数：统计与复盘[\s\S]*?\/\/ ===== POMO_LOGIC_END =====/);
assert.ok(m, "未找到番茄钟纯函数标记");
const f = new Function(`${m[0]}\nreturn { computeStats, advise };`)();

// 空
assert.strictEqual(f.advise(f.computeStats([])), "先开始第一个番茄钟吧。");

// 统计
const recs = [
  {minutes:25, completed:true},
  {minutes:25, completed:true},
  {minutes:25, completed:false},
  {minutes:25, completed:true},
];
const s = f.computeStats(recs);
assert.strictEqual(s.total, 4);
assert.strictEqual(s.done, 3);
assert.strictEqual(s.totalMin, 75);

// 完成率 0.75 -> 鼓励语
const a = f.advise(s);
assert.ok(a.includes("继续保持") || a.includes("不错"));

// 完成率 <0.5
const low = f.computeStats([{completed:true},{completed:false},{completed:false}]);
assert.ok(f.advise(low).includes("完成率偏低"));

// >=8
const many = {total:10, done:9, totalMin:0, rate:0.9};
assert.ok(f.advise(many).includes("很棒"));

console.log("OK: pomodoro-coach 全部用例通过");