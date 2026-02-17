import moment from "moment";
import CalendarLogic from "./CalendarLogic";

export default class TripCalendarWidget {
  constructor(container) {
    this.container = container;
    this.logic = new CalendarLogic();
    this.departureDate = null;
    this.returnDate = null;
    this.roundTrip = true;
    this.activeField = null; // "departure" | "return"
    this.viewYear = moment().year();
    this.viewMonth = moment().month();
    this.calendarEl = null;
  }

  init() {
    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <h2>Trip Calendar</h2>
      <div class="trip-controls">
        <label>
          <input type="checkbox" data-id="round-trip-checkbox" ${this.roundTrip ? "checked" : ""}>
          Туда-обратно
        </label>
      </div>
      <div class="trip-fields">
        <div class="trip-field" data-id="departure-field">
          <label>Туда</label>
          <input type="text" data-id="departure-input" readonly placeholder="Выберите дату"
            value="${this.departureDate || ""}">
        </div>
        <div class="trip-field ${this.roundTrip ? "" : "hidden"}" data-id="return-field">
          <label>Обратно</label>
          <input type="text" data-id="return-input" readonly placeholder="Выберите дату"
            value="${this.returnDate || ""}">
        </div>
      </div>
    `;
  }

  bindEvents() {
    this.container.querySelector('[data-id="round-trip-checkbox"]').addEventListener("change", (e) => {
      this.roundTrip = e.target.checked;
      const returnField = this.container.querySelector('[data-id="return-field"]');
      returnField.classList.toggle("hidden", !this.roundTrip);
      if (!this.roundTrip) {
        this.returnDate = null;
        this.container.querySelector('[data-id="return-input"]').value = "";
      }
    });

    this.container.querySelector('[data-id="departure-input"]').addEventListener("click", () => {
      this.activeField = "departure";
      this.viewYear = moment().year();
      this.viewMonth = moment().month();
      this.showCalendar("departure");
    });

    this.container.querySelector('[data-id="return-input"]').addEventListener("click", () => {
      this.activeField = "return";
      if (this.departureDate) {
        const dep = moment(this.departureDate);
        this.viewYear = dep.year();
        this.viewMonth = dep.month();
      } else {
        this.viewYear = moment().year();
        this.viewMonth = moment().month();
      }
      this.showCalendar("return");
    });

    document.addEventListener("click", (e) => {
      if (this.calendarEl && !this.calendarEl.contains(e.target) &&
          !e.target.matches('[data-id="departure-input"]') &&
          !e.target.matches('[data-id="return-input"]')) {
        this.closeCalendar();
      }
    });
  }

  showCalendar(field) {
    this.closeCalendar();

    const fieldEl = this.container.querySelector(`[data-id="${field}-field"]`);
    this.calendarEl = document.createElement("div");
    this.calendarEl.classList.add("calendar");
    this.calendarEl.setAttribute("data-id", "calendar");

    this.renderCalendarContent();
    fieldEl.appendChild(this.calendarEl);
  }

  renderCalendarContent() {
    const { days, startWeekday } = this.logic.getDaysInMonth(this.viewYear, this.viewMonth);
    const monthName = this.logic.getMonthName(this.viewMonth);

    const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

    // Empty cells before first day (startWeekday: 1=Mon..7=Sun)
    const emptyCells = Array(startWeekday - 1)
      .fill('<div class="calendar-day empty"></div>')
      .join("");

    const dayCells = days
      .map((d) => {
        const classes = ["calendar-day"];
        let isDisabled = false;

        if (d.isToday) classes.push("today");
        if (d.isPast) {
          classes.push("disabled");
          isDisabled = true;
        }

        // For return field, disable dates before departure
        if (this.activeField === "return" && this.departureDate) {
          if (moment(d.date).isBefore(moment(this.departureDate), "day")) {
            classes.push("disabled");
            isDisabled = true;
          }
        }

        // Mark selected
        if (this.activeField === "departure" && d.date === this.departureDate) {
          classes.push("selected");
        }
        if (this.activeField === "return" && d.date === this.returnDate) {
          classes.push("selected");
        }

        return `<div class="${classes.join(" ")}" data-date="${d.date}" ${isDisabled ? "" : 'data-selectable="true"'}>${d.day}</div>`;
      })
      .join("");

    this.calendarEl.innerHTML = `
      <div class="calendar-header">
        <button data-id="prev-month">&lt;</button>
        <span class="calendar-title" data-id="calendar-title">${monthName} ${this.viewYear}</span>
        <button data-id="next-month">&gt;</button>
      </div>
      <div class="calendar-weekdays">
        ${weekdays.map((w) => `<div>${w}</div>`).join("")}
      </div>
      <div class="calendar-days">
        ${emptyCells}
        ${dayCells}
      </div>
    `;

    this.calendarEl.querySelector('[data-id="prev-month"]').addEventListener("click", (e) => {
      e.stopPropagation();
      const prev = this.logic.getPrevMonth(this.viewYear, this.viewMonth);
      this.viewYear = prev.year;
      this.viewMonth = prev.month;
      this.renderCalendarContent();
    });

    this.calendarEl.querySelector('[data-id="next-month"]').addEventListener("click", (e) => {
      e.stopPropagation();
      const next = this.logic.getNextMonth(this.viewYear, this.viewMonth);
      this.viewYear = next.year;
      this.viewMonth = next.month;
      this.renderCalendarContent();
    });

    this.calendarEl.querySelectorAll('[data-selectable="true"]').forEach((dayEl) => {
      dayEl.addEventListener("click", (e) => {
        e.stopPropagation();
        const date = dayEl.dataset.date;
        this.selectDate(date);
      });
    });
  }

  selectDate(date) {
    if (this.activeField === "departure") {
      this.departureDate = date;
      this.container.querySelector('[data-id="departure-input"]').value = date;

      // If return date is before new departure, reset it
      if (this.returnDate && moment(this.returnDate).isBefore(moment(date), "day")) {
        this.returnDate = null;
        this.container.querySelector('[data-id="return-input"]').value = "";
      }
    } else if (this.activeField === "return") {
      this.returnDate = date;
      this.container.querySelector('[data-id="return-input"]').value = date;
    }

    this.closeCalendar();
  }

  closeCalendar() {
    if (this.calendarEl) {
      this.calendarEl.remove();
      this.calendarEl = null;
    }
  }
}
