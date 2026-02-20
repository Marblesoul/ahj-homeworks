import "./css/main.css";
import "./css/trello.css";
import "./css/image-manager.css";
import "./css/download-manager.css";
import TrelloBoard from "./js/TrelloBoard.js";
import DragManager from "./js/DragManager.js";
import ImageManager from "./js/ImageManager.js";
import DownloadManager from "./js/DownloadManager.js";

// Tab navigation
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const tab = btn.dataset.tab;

    tabBtns.forEach((b) => b.classList.remove("active"));
    tabContents.forEach((c) => c.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(`tab-${tab}`).classList.add("active");
  });
});

// Trello
const trelloContainer = document.getElementById("tab-trello");
const board = new TrelloBoard(trelloContainer);
const dragManager = new DragManager(board);
board.render();
dragManager.attach(trelloContainer);

// Image Manager
const imageManager = new ImageManager(document.getElementById("tab-image-manager"));
imageManager.render();

// Download Manager
const downloadManager = new DownloadManager(document.getElementById("tab-download-manager"));
downloadManager.render();
