const CSV_URL = "https://docs.google.com/spreadsheets/d/1S1lFSofHdBF9zh1PkgJBFnoIjrKp3KWsw218mdYqsTQ/export?format=csv";
const GAS_URL = "https://script.google.com/macros/s/AKfycbyxeiO-Agv70G28dxpNFO5JvEwPhs0506Csq8SWHTuXKxJr1PixEI8_I5PcI7xtr8sy/exec";
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=1400&q=80";
const MAX_GROUP_COUNT = 20;
const $ = (id) => document.getElementById(id);
const clickCounts = {};
let schools = [];
let currentSchool = null;

const els = {
  keyword: $("filterKeyword"),
  list: $("schoolList"),
  count: $("resultCount"),
  empty: $("emptyState"),
  emptyTitle: $("emptyTitle"),
  emptyText: $("emptyText"),
  toast: $("toast"),
  modal: $("modal"),
  modalImage: $("modalImage"),
  modalBadges: $("modalBadges"),
  modalName: $("modalName"),
  modalMeta: $("modalMeta"),
  modalClickCount: $("modalClickCount"),
  modalDescription: $("modalDescription"),
  modalNearestStation: $("modalNearestStation"),
  modalAddress: $("modalAddress"),
  classImage: $("modalClassImage"),
  classImageFallback: $("modalClassImageFallback"),
  studyList: $("modalStudyList"),
  contestTable: $("modalContestTable"),
  notice: $("modalNotice"),
  official: $("officialButton")
};

const filters = {
  area: $("filterArea"),
  method: $("filterMethod"),
  age: $("filterAge"),
  studyCountry: $("filterStudyCountry"),
  studySchool: $("filterStudySchool"),
  contestYear: $("filterContestYear"),
  contestName: $("filterContestName")
};

const filterSources = {
  area: (s) => [s.area],
  method: (s) => [s.method],
  age: (s) => s.ages,
  studyCountry: (s) => s.studyRows.map((x) => x.country),
  studySchool: (s) => s.studyRows.map((x) => x.school),
  contestYear: (s) => s.contestRows.map((x) => x.year),
  contestName: (s) => s.contestRows.map((x) => x.name)
};

const normalizeKey = (v) => String(v || "")
  .trim()
  .replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
  .replace(/　/g, " ")
  .replace(/\s+/g, "");

const escapeHTML = (v) => String(v ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const uniq = (values) => [...new Set(values.filter((v) => String(v || "").trim() && v !== "-"))]
  .sort((a, b) => String(a).localeCompare(String(b), "ja"));

const badge = (text, cls) =>
  `<span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${cls}">${escapeHTML(text)}</span>`;

function parseCSV(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const n = text[i + 1];
    if (c === '"' && quoted && n === '"') {
      value += '"';
      i++;
    } else if (c === '"') {
      quoted = !quoted;
    } else if (c === "," && !quoted) {
      row.push(value.trim());
      value = "";
    } else if ((c === "\n" || c === "\r") && !quoted) {
      if (c === "\r" && n === "\n") i++;
      row.push(value.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      value = "";
    } else {
      value += c;
    }
  }

  row.push(value.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

function getField(row, keys) {
  for (const key of keys) {
    const value = row[normalizeKey(key)];
    if (value !== undefined && String(value).trim()) return String(value).trim();
  }
  return "";
}

function collectRows(row, config) {
  const rows = [];
  for (let i = 1; i <= MAX_GROUP_COUNT; i++) {
    const item = Object.fromEntries(
      Object.entries(config.fields).map(([prop, names]) => [prop, getField(row, names(i))])
    );
    if (Object.values(item).some(Boolean) && !(config.skip && config.skip(item))) rows.push(config.map(item));
  }
  return rows.length ? rows : config.fallback || [];
}

function rowsToSchools(csvRows) {
  if (csvRows.length < 2) return [];
  const headers = csvRows[0].map(normalizeKey);

  return csvRows.slice(1).map((cells, index) => {
    const row = Object.fromEntries(headers.map((h, i) => [h, cells[i] || ""]));
    const name = getField(row, ["教室名", "名前", "name", "schoolName"]);
    return {
      id: getField(row, ["ID", "id"]) || `school_${index + 1}`,
      name,
      area: getField(row, ["地域", "area", "prefecture"]),
      method: getField(row, ["メソッド", "method"]),
      nearestStation: getField(row, ["最寄り駅", "最寄駅", "最寄駅名", "駅", "nearestStation", "station"]),
      ages: getField(row, ["対象年齢", "年齢", "ages", "age"]).split(/\s+/).filter(Boolean),
      premium: ["true", "1", "yes", "あり", "有料", "プレミアム", "premium", "おすすめ"].includes(
        getField(row, ["プレミアム", "おすすめ", "premium", "plan"]).toLowerCase()
      ),
      image: getField(row, ["画像URL", "画像", "image", "imageUrl", "image_url"]),
      description: getField(row, ["説明文", "説明", "description"]),
      address: getField(row, ["住所", "address"]),
      affiliateUrl: getField(row, ["公式サイトURL", "公式サイト", "affiliateUrl", "officialUrl", "url"]),
      classImage: getField(row, ["クラス画像URL", "料金表画像URL", "スケジュール画像URL", "スケジュール画像", "classImageUrl", "classImage"]),
      studyRows: collectRows(row, {
        fields: {
          country: (i) => [`留学${i}国名`, `留学${i}国`, `留学国${i}`, `study${i}Country`],
          school: (i) => [`留学${i}学校名`, `留学${i}学校`, `留学先${i}学校名`, `留学先学校名${i}`, `study${i}School`]
        },
        skip: (x) => x.country === "なし" || x.school === "なし",
        map: (x) => ({ country: x.country || "-", school: x.school || "-" })
      }),
      contestRows: collectRows(row, {
        fields: {
          year: (i) => [`コンクール${i}入賞年`, `コンクール${i}年`, `入賞年${i}`, `contest${i}Year`],
          count: (i) => [`コンクール${i}件数`, `入賞${i}件数`, `件数${i}`, `contest${i}Count`],
          name: (i) => [`コンクール${i}名`, `コンクール名${i}`, `contest${i}Name`]
        },
        skip: (x) => x.name === "なし",
        map: (x) => ({ year: x.year || "-", count: x.count || "-", name: x.name || "-" })
      })
    };
  }).filter((s) => s.name);
}

function setOptions(select, values) {
  const current = select.value;
  select.innerHTML = '<option value="">すべて</option>';
  uniq(values).forEach((value) => select.append(new Option(value, value)));
  if ([...select.options].some((o) => o.value === current)) select.value = current;
}

function buildFilters() {
  Object.entries(filters).forEach(([key, select]) => setOptions(select, schools.flatMap(filterSources[key])));
}

function filteredSchools() {
  const keyword = els.keyword.value.trim().toLowerCase();
  return schools
    .filter((s) => !keyword || [
      s.name, s.description, s.address, s.nearestStation, s.area, s.method,
      s.ages.join(" "),
      s.studyRows.map((x) => `${x.country} ${x.school}`).join(" "),
      s.contestRows.map((x) => `${x.year} ${x.count} ${x.name}`).join(" ")
    ].join(" ").toLowerCase().includes(keyword))
    .filter((s) => Object.entries(filters).every(([key, select]) => !select.value || filterSources[key](s).includes(select.value)))
    .sort((a, b) => Number(b.premium) - Number(a.premium));
}

function renderSchools() {
  $("initialSeoText")?.remove();
  const results = filteredSchools();
  els.list.innerHTML = "";
  els.count.textContent = `${results.length}件の教室が見つかりました`;
  els.emptyTitle.textContent = "条件に合う教室が見つかりませんでした。";
  els.emptyText.textContent = "絞り込み条件を変更して再検索してください。";
  els.empty.classList.toggle("hidden", results.length !== 0);

  results.forEach((s) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "group overflow-hidden rounded-lg border border-pink-100 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-roseLine hover:shadow-md";
    card.onclick = () => openModal(s.id);
    card.innerHTML = `
      <div class="relative">
        <img src="${escapeHTML(s.image || FALLBACK_IMAGE)}" alt="${escapeHTML(s.name)}" class="h-48 w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
        ${s.premium ? `<div class="absolute left-3 top-3">${badge("おすすめ", "bg-roseMain text-white shadow")}</div>` : ""}
      </div>
      <div class="p-4">
        <div class="flex flex-wrap gap-2">
          ${badge(s.area || "地域未設定", "bg-roseSoft text-roseDeep")}
          ${badge(s.method || "メソッド未設定", "bg-white text-slate-700 border border-pink-100")}
        </div>
        <h2 class="mt-3 text-lg font-semibold text-slate-900">${escapeHTML(s.name)}</h2>
        <p class="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">${escapeHTML(s.description || "")}</p>
        <div class="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
          <span class="rounded-md bg-slate-50 px-2 py-1">対象: ${escapeHTML(s.ages.join(" / ") || "未設定")}</span>
          ${s.nearestStation ? `<span class="rounded-md bg-slate-50 px-2 py-1">最寄り駅: ${escapeHTML(s.nearestStation)}</span>` : ""}
          <span class="rounded-md bg-slate-50 px-2 py-1">留学実績: ${s.studyRows.length}件</span>
          <span class="rounded-md bg-slate-50 px-2 py-1">コンクール: ${s.contestRows.length}件</span>
        </div>
      </div>`;
    els.list.append(card);
  });
}

function renderStudy(items) {
  els.studyList.innerHTML = items.length ? "" : '<li class="rounded-md bg-slate-50 px-4 py-3 text-slate-500">留学実績は未設定です。</li>';
  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "flex flex-col gap-1 rounded-md border border-pink-100 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between";
    li.innerHTML = `<span class="font-medium text-slate-800">${escapeHTML(item.country)}</span><span class="text-slate-600">${escapeHTML(item.school)}</span>`;
    els.studyList.append(li);
  });
}

function renderTable(tbody, rows, cells, emptyText) {
  tbody.innerHTML = "";
  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="${cells.length}" class="px-4 py-3 text-center text-slate-500">${emptyText}</td></tr>`;
    return;
  }
  rows.forEach((row, i) => {
    const tr = document.createElement("tr");
    tr.className = i % 2 ? "bg-roseSoft/40" : "bg-white";
    cells.forEach(({ key, cls }) => {
      const td = document.createElement("td");
      td.className = cls;
      td.textContent = row[key] || "-";
      tr.append(td);
    });
    tbody.append(tr);
  });
}

function openModal(id) {
  const s = schools.find((x) => x.id === id);
  if (!s) return;

  currentSchool = s;
  els.modalImage.src = s.image || FALLBACK_IMAGE;
  els.modalImage.alt = s.name;
  els.modalName.textContent = s.name;
  els.modalMeta.textContent = `${s.area || "地域未設定"} / ${s.method || "メソッド未設定"} / 対象: ${s.ages.join("・") || "未設定"}`;
  els.modalClickCount.textContent = clickCounts[s.id] || 0;
  els.modalDescription.textContent = s.description || "";
  els.modalNearestStation.textContent = s.nearestStation || "未設定";
  els.modalAddress.textContent = s.address || "未設定";
  els.notice.textContent = "";
  els.modalBadges.innerHTML = `
    ${s.premium ? badge("おすすめ", "bg-roseMain text-white") : ""}
    ${badge(`留学実績 ${s.studyRows.length}件`, "bg-roseSoft text-roseDeep")}
    ${badge(`コンクール実績 ${s.contestRows.length}件`, "bg-roseSoft text-roseDeep")}
  `;

  if (s.classImage) {
    els.classImage.src = s.classImage;
    els.classImage.classList.remove("hidden");
    els.classImageFallback.classList.add("hidden");
  } else {
    els.classImage.src = "";
    els.classImage.classList.add("hidden");
    els.classImageFallback.classList.remove("hidden");
  }

  renderStudy(s.studyRows);
  renderTable(els.contestTable, s.contestRows, [
    { key: "year", cls: "px-4 py-3 font-medium text-slate-800" },
    { key: "count", cls: "px-4 py-3 text-slate-600" },
    { key: "name", cls: "px-4 py-3 text-slate-600" }
  ], "コンクール実績は未設定です。");

  els.official.disabled = false;
  els.official.textContent = "公式サイトを見る";
  els.modal.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
}

function closeModal() {
  els.modal.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
  currentSchool = null;
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.remove("hidden");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => els.toast.classList.add("hidden"), 3200);
}

function sendClickLog(school) {
  if (!GAS_URL || !school) return false;

  const payload = {
    id: school.id,
    name: school.name,
    url: school.affiliateUrl || "",
    timestamp: new Date().toLocaleString("ja-JP"),
    pageUrl: location.href,
    userAgent: navigator.userAgent
  };
  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "text/plain;charset=UTF-8" });
    if (navigator.sendBeacon(GAS_URL, blob)) return true;
  }

  fetch(GAS_URL, {
    method: "POST",
    mode: "no-cors",
    keepalive: true,
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body
  }).catch(console.error);
  return true;
}

function handleOfficialClick() {
  if (!currentSchool) return;

  const now = Date.now();
  const key = `affiliate_click_${currentSchool.id}`;
  const duplicated = now - Number(localStorage.getItem(key) || 0) < 60 * 60 * 1000;
  els.official.disabled = true;
  els.official.textContent = "確認中...";

  if (duplicated) {
    const msg = "重複クリックを検知したためカウントをスキップしました。";
    els.notice.textContent = msg;
    showToast(msg);
  } else {
    localStorage.setItem(key, String(now));
    clickCounts[currentSchool.id] = (clickCounts[currentSchool.id] || 0) + 1;
    els.modalClickCount.textContent = clickCounts[currentSchool.id];
    els.notice.textContent = "公式サイトへ移動します。";
    showToast("公式サイトへ移動します。");
    sendClickLog(currentSchool);
  }

  if (currentSchool.affiliateUrl) window.open(currentSchool.affiliateUrl, "_blank", "noopener,noreferrer");
  setTimeout(() => {
    els.official.disabled = false;
    els.official.textContent = "公式サイトを見る";
  }, 3000);
}

async function loadSchools() {
  schools = window.FALLBACK_SCHOOLS || [];
  if (schools.length) {
    buildFilters();
    renderSchools();
  } else {
    els.count.textContent = "教室データを読み込んでいます...";
    els.empty.classList.add("hidden");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);

  try {
    const response = await fetch(CSV_URL, { signal: controller.signal });
    if (!response.ok) throw new Error("CSVを取得できませんでした。");
    const csvSchools = rowsToSchools(parseCSV(await response.text()));
    if (!csvSchools.length) throw new Error("CSVに教室データがありません。");
    schools = csvSchools;
    buildFilters();
    renderSchools();
  } catch (error) {
    if (!schools.length) {
      schools = window.FALLBACK_SCHOOLS || [];
      buildFilters();
      renderSchools();
    }
    console.warn("CSV取得に失敗したため、表示済みの保険データを維持します。", error);
  } finally {
    clearTimeout(timeout);
  }
}

els.keyword.addEventListener("input", renderSchools);
Object.values(filters).forEach((select) => select.addEventListener("change", renderSchools));
$("resetButton").addEventListener("click", () => {
  els.keyword.value = "";
  Object.values(filters).forEach((select) => select.value = "");
  renderSchools();
});
$("closeModal").addEventListener("click", closeModal);
$("modalBackdrop").addEventListener("click", closeModal);
els.official.addEventListener("click", handleOfficialClick);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !els.modal.classList.contains("hidden")) closeModal();
});

loadSchools();
