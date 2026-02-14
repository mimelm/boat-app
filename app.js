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