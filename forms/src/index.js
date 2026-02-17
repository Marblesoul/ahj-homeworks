import "./css/style.css";
import "./css/popover.css";
import "./css/list-editor.css";
import "./css/trip-calendar.css";
import PopoverWidget from "./js/PopoverWidget";
import ListEditorWidget from "./js/ListEditorWidget";
import TripCalendarWidget from "./js/TripCalendarWidget";

const popoverSection = document.getElementById("popover-section");
const listEditorSection = document.getElementById("list-editor-section");
const tripCalendarSection = document.getElementById("trip-calendar-section");

new PopoverWidget(popoverSection).init();
new ListEditorWidget(listEditorSection).init();
new TripCalendarWidget(tripCalendarSection).init();
