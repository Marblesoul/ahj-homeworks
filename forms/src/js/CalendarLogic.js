import moment from "moment";

export default class CalendarLogic {
  constructor(today = null) {
    this.today = today ? moment(today).startOf("day") : moment().startOf("day");
  }

  getDaysInMonth(year, month) {
    const firstDay = moment({ year, month });
    const daysCount = firstDay.daysInMonth();
    // Monday = 0, Sunday = 6 (ISO weekday - 1)
    const startWeekday = firstDay.isoWeekday(); // 1=Mon, 7=Sun

    const days = [];
    for (let i = 1; i <= daysCount; i++) {
      const date = moment({ year, month, day: i });
      days.push({
        day: i,
        date: date.format("YYYY-MM-DD"),
        isToday: date.isSame(this.today, "day"),
        isPast: date.isBefore(this.today, "day"),
      });
    }

    return { days, startWeekday, year, month, daysCount };
  }

  isValidDeparture(dateStr) {
    return moment(dateStr).isSameOrAfter(this.today, "day");
  }

  isValidReturn(departureDateStr, returnDateStr) {
    return moment(returnDateStr).isSameOrAfter(moment(departureDateStr), "day");
  }

  getNextMonth(year, month) {
    const m = moment({ year, month }).add(1, "month");
    return { year: m.year(), month: m.month() };
  }

  getPrevMonth(year, month) {
    const m = moment({ year, month }).subtract(1, "month");
    return { year: m.year(), month: m.month() };
  }

  getMonthName(month) {
    return moment({ month }).format("MMMM");
  }
}
