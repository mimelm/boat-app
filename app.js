// ===============================
// ① 出走表取得（racelist）
// ===============================

const res = await fetch(url);
// 出走表ページを取得
async function fetchRaceList(jcd, date) {
  const proxy = "https://boat-app.vfb03106.workers.dev/?url=";

  // 本来アクセスしたい URL
  const targetUrl = `https://www.boatrace.jp/owpc/pc/race/racelist?jcd=${jcd}&hd=${date}`;

  // プロキシ経由でアクセスするためにエンコード
  const url = proxy + encodeURIComponent(targetUrl);

  const response = await fetch(url);
  const html = await response.text();

  return html;
}
}

// 出走表をパース（枠番＋選手名）
function parseRaceList(doc) {
  const rows = doc.querySelectorAll(".table1 tbody tr");
  const result = [];

  rows.forEach((row, index) => {
    const nameEl = row.querySelector(".is-fs12, .is-fs14");
    if (nameEl) {
      result.push({
        waku: index + 1,
        name: nameEl.textContent.trim()
      });
    }
  });

  return result;
}

// ボタン押下で出走表を取得
document.getElementById("getRaceList").addEventListener("click", async () => {
  const jcd = document.getElementById("jcd").value;
  const date = document.getElementById("date").value;

  console.log("取得開始");

  const html = await fetchRaceList(jcd, date);

  console.log("取得完了");
  console.log(html); // HTML がちゃんと取れているか確認
});


// ===============================
// ② 直前情報取得（beforeinfo）
// ===============================

document.getElementById("getBeforeInfo").addEventListener("click", async () => {
  const jcd = document.getElementById("jcd").value;
  const rno = document.getElementById("rno").value;
  const date = document.getElementById("date").value.replace(/-/g, "");

  const data = await fetchBeforeInfo(jcd, rno, date);
  document.getElementById("result").innerText = JSON.stringify(data, null, 2);
});

async function fetchBeforeInfo(jcd, rno, date) {
  const url = `https://www.boatrace.jp/owpc/pc/race/beforeinfo?jcd=${jcd}&rno=${rno}&hd=${date}`;
  const res = await fetch(url);
  const html = await res.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const tenjiTimes = [...doc.querySelectorAll(".table1 .is-time")].map(el =>
    el.textContent.trim()
  );

  const stTimes = [...doc.querySelectorAll(".table1 .is-st")].map(el =>
    el.textContent.trim()
  );

  return { tenjiTimes, stTimes };
}