export default class ImageManager {
  constructor(container) {
    this.container = container;
  }

  render() {
    this.container.innerHTML = "";

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";

    const dropzone = document.createElement("div");
    dropzone.className = "dropzone";
    dropzone.innerHTML = `<span>Перетащите изображения сюда<br>или кликните для выбора файла</span>`;

    const grid = document.createElement("div");
    grid.className = "preview-grid";

    this.container.append(fileInput, dropzone, grid);

    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.classList.add("active");
    });

    dropzone.addEventListener("dragleave", () => {
      dropzone.classList.remove("active");
    });

    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.classList.remove("active");
      for (const file of e.dataTransfer.files) {
        if (file.type.startsWith("image/")) {
          this._addPreview(file, grid);
        }
      }
    });

    dropzone.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", () => {
      for (const file of fileInput.files) {
        this._addPreview(file, grid);
      }
      fileInput.value = "";
    });
  }

  _addPreview(file, grid) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const item = document.createElement("div");
      item.className = "preview-item";

      const img = document.createElement("img");
      img.src = e.target.result;
      img.alt = file.name;

      const removeBtn = document.createElement("button");
      removeBtn.className = "preview-remove";
      removeBtn.textContent = "✕";
      removeBtn.addEventListener("click", () => item.remove());

      item.append(img, removeBtn);
      grid.append(item);
    };
    reader.readAsDataURL(file);
  }
}
