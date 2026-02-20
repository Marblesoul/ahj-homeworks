import storagePdf from "../../files/Storage Standard.pdf";
import streamsPdf from "../../files/Streams Standard.pdf";
import xhrPdf from "../../files/XMLHttpRequest Standard.pdf";

const FILES = [
  { name: "Storage Standard", size: "303 KB", dataUrl: storagePdf, filename: "Storage Standard.pdf" },
  { name: "Streams Standard", size: "1.6 MB", dataUrl: streamsPdf, filename: "Streams Standard.pdf" },
  { name: "XMLHttpRequest Standard", size: "813 KB", dataUrl: xhrPdf, filename: "XMLHttpRequest Standard.pdf" },
];

export default class DownloadManager {
  constructor(container) {
    this.container = container;
    this.totalBytes = 0;
    this.counterEl = null;
  }

  render() {
    this.container.innerHTML = "";

    const table = document.createElement("table");
    table.className = "dm-table";

    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th>Название</th>
        <th>Размер</th>
        <th>Скачать</th>
      </tr>
    `;
    table.append(thead);

    const tbody = document.createElement("tbody");
    for (const file of FILES) {
      const tr = document.createElement("tr");

      const tdName = document.createElement("td");
      tdName.textContent = file.name;

      const tdSize = document.createElement("td");
      tdSize.className = "dm-size";
      tdSize.textContent = file.size;

      const tdBtn = document.createElement("td");
      const btn = document.createElement("button");
      btn.className = "dm-download-btn";
      btn.textContent = "Скачать";
      btn.addEventListener("click", () => this._download(file.dataUrl, file.filename));
      tdBtn.append(btn);

      tr.append(tdName, tdSize, tdBtn);
      tbody.append(tr);
    }
    table.append(tbody);

    const counter = document.createElement("div");
    counter.className = "dm-counter";
    counter.textContent = "Скачано: 0 МБ";
    this.counterEl = counter;

    this.container.append(table, counter);
  }

  _download(dataUrl, filename) {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    a.click();

    const base64 = dataUrl.split(",")[1];
    const padding = (base64.match(/=/g) || []).length;
    const bytes = Math.floor((base64.length * 3) / 4) - padding;
    this.totalBytes += bytes;

    const mb = (this.totalBytes / (1024 * 1024)).toFixed(2);
    this.counterEl.textContent = `Скачано: ${mb} МБ`;
  }
}
