import isValid from "./luhn";
import detectSystem from "./cardSystem";

const cardSystems = ["visa", "mastercard", "amex", "discover", "jcb", "diners", "mir"];

const cardLabels = {
  visa: "VISA",
  mastercard: "MasterCard",
  amex: "AMEX",
  discover: "Discover",
  jcb: "JCB",
  diners: "Diners",
  mir: "МИР",
};

export default class Widget {
  constructor(container) {
    this.container = container;
  }

  init() {
    this.container.innerHTML = `
      <div class="card-validator">
        <div class="card-icons">
          ${cardSystems.map((s) => `<div class="card-icon" data-system="${s}">${cardLabels[s]}</div>`).join("")}
        </div>
        <div class="card-form">
          <input class="card-input" type="text" placeholder="Enter card number" data-id="card-input" maxlength="23">
          <button class="card-btn" data-id="validate-btn">Click to Validate</button>
        </div>
        <div class="card-result" data-id="result"></div>
      </div>
    `;

    this.input = this.container.querySelector('[data-id="card-input"]');
    this.btn = this.container.querySelector('[data-id="validate-btn"]');
    this.result = this.container.querySelector('[data-id="result"]');
    this.icons = this.container.querySelectorAll(".card-icon");

    this.input.addEventListener("input", () => this.onInput());
    this.btn.addEventListener("click", () => this.onValidate());
  }

  onInput() {
    const value = this.input.value;
    const system = detectSystem(value);

    this.icons.forEach((icon) => {
      icon.classList.toggle("active", icon.dataset.system === system);
    });

    this.result.textContent = "";
    this.result.className = "card-result";
  }

  onValidate() {
    const value = this.input.value.trim();

    if (!value) {
      this.result.textContent = "Please enter a card number";
      this.result.className = "card-result invalid";
      return;
    }

    if (isValid(value)) {
      this.result.textContent = "Card number is valid";
      this.result.className = "card-result valid";
    } else {
      this.result.textContent = "Card number is invalid";
      this.result.className = "card-result invalid";
    }
  }
}
