import CalendarLogic from "../CalendarLogic";

let logic;

beforeEach(() => {
  // Fix "today" to 2026-02-16 for deterministic tests
  logic = new CalendarLogic("2026-02-16");
});

describe("getDaysInMonth", () => {
  test("February 2026 has 28 days", () => {
    const { days, daysCount } = logic.getDaysInMonth(2026, 1); // month 0-indexed
    expect(daysCount).toBe(28);
    expect(days.length).toBe(28);
  });

  test("January 2026 has 31 days", () => {
    const { daysCount } = logic.getDaysInMonth(2026, 0);
    expect(daysCount).toBe(31);
  });

  test("February 2024 (leap year) has 29 days", () => {
    const { daysCount } = logic.getDaysInMonth(2024, 1);
    expect(daysCount).toBe(29);
  });

  test("marks today correctly", () => {
    const { days } = logic.getDaysInMonth(2026, 1);
    const today = days.find((d) => d.day === 16);
    expect(today.isToday).toBe(true);
    expect(today.isPast).toBe(false);

    const yesterday = days.find((d) => d.day === 15);
    expect(yesterday.isToday).toBe(false);
    expect(yesterday.isPast).toBe(true);
  });

  test("marks past days correctly", () => {
    const { days } = logic.getDaysInMonth(2026, 1);
    const pastDays = days.filter((d) => d.isPast);
    expect(pastDays.length).toBe(15); // days 1-15 are past
  });

  test("future days are not past", () => {
    const { days } = logic.getDaysInMonth(2026, 1);
    const day17 = days.find((d) => d.day === 17);
    expect(day17.isPast).toBe(false);
    expect(day17.isToday).toBe(false);
  });

  test("days in past months are all past", () => {
    const { days } = logic.getDaysInMonth(2026, 0); // January 2026
    expect(days.every((d) => d.isPast)).toBe(true);
  });
});

describe("isValidDeparture", () => {
  test("today is valid", () => {
    expect(logic.isValidDeparture("2026-02-16")).toBe(true);
  });

  test("tomorrow is valid", () => {
    expect(logic.isValidDeparture("2026-02-17")).toBe(true);
  });

  test("yesterday is invalid", () => {
    expect(logic.isValidDeparture("2026-02-15")).toBe(false);
  });
});

describe("isValidReturn", () => {
  test("same day as departure is valid", () => {
    expect(logic.isValidReturn("2026-02-20", "2026-02-20")).toBe(true);
  });

  test("after departure is valid", () => {
    expect(logic.isValidReturn("2026-02-20", "2026-02-25")).toBe(true);
  });

  test("before departure is invalid", () => {
    expect(logic.isValidReturn("2026-02-20", "2026-02-19")).toBe(false);
  });
});

describe("month navigation", () => {
  test("getNextMonth from December goes to January next year", () => {
    const next = logic.getNextMonth(2026, 11);
    expect(next.year).toBe(2027);
    expect(next.month).toBe(0);
  });

  test("getPrevMonth from January goes to December prev year", () => {
    const prev = logic.getPrevMonth(2026, 0);
    expect(prev.year).toBe(2025);
    expect(prev.month).toBe(11);
  });

  test("getNextMonth within same year", () => {
    const next = logic.getNextMonth(2026, 5);
    expect(next.year).toBe(2026);
    expect(next.month).toBe(6);
  });
});
