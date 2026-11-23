const PLATFORM_NAME = { baekjoon: "백준", programmers: "프로그래머스", leetcode: "LeetCode" };

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function levelClass(p) {
  if (p.platform === "programmers") return "programmers";
  if (p.platform === "leetcode") return "leetcode";
  const tier = (p.level || "").split(" ")[0].toLowerCase();
  return ["bronze", "silver", "gold", "platinum", "diamond", "ruby"].includes(tier) ? tier : "plain";
}

function levelBadge(p) {
  const label = p.platform === "baekjoon" ? p.level : `${PLATFORM_NAME[p.platform]}${p.platform === "programmers" ? " " + p.level.replace("level ", "Lv.") : ""}`;
  return `<span class="badge ${levelClass(p)}">${esc(label)}</span>`;
}

function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d) ? "" : `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function rowHTML(p) {
  return `<li><a class="row" href="problem.html?id=${encodeURIComponent(p.id)}">
    ${levelBadge(p)}
    <span class="title">${p.pid ? esc(p.pid) + ". " : ""}${esc(p.title)}</span>
    <span class="meta">${esc(p.langs.join(", "))} · ${fmtDate(p.date)}</span>
  </a></li>`;
}

async function loadIndex() {
  const res = await fetch("data/problems.json", { cache: "no-cache" });
  if (!res.ok) throw new Error("problems.json을 불러오지 못했습니다");
  return (await res.json()).problems;
}

// giscus 댓글: GitHub Discussions(Announcements)에 저장. term으로 글마다 별도 스레드.
function mountComments(container, term) {
  const s = document.createElement("script");
  s.src = "https://giscus.app/client.js";
  Object.entries({
    "data-repo": "Amchoking5/Amchoking5.github.io",
    "data-repo-id": "R_kgDOV4QMLg",
    "data-category": "Announcements",
    "data-category-id": "DIC_kwDOV4QMLs4DLxLB",
    "data-mapping": "specific",
    "data-term": term,
    "data-strict": "1",
    "data-reactions-enabled": "1",
    "data-emit-metadata": "0",
    "data-input-position": "top",
    "data-theme": "preferred_color_scheme",
    "data-lang": "ko",
    "data-loading": "lazy",
    "crossorigin": "anonymous",
  }).forEach(([k, v]) => s.setAttribute(k, v));
  s.async = true;
  container.appendChild(s);
}
