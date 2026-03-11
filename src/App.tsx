import { useState } from "react";
import "./App.css";

function App() {
  const [month, setMonth] = useState(2); // Marzo → índice 2
  const [year, setYear] = useState(2026);

  // Fecha mínima permitida: la fecha actual del sistema
  const today = new Date();
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const [occupiedDays] = useState([6, 13, 20]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);

  const monthNames = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const changeMonth = (direction: number) => {
    let newMonth = month + direction;
    let newYear = year;

    if (newMonth < 0) { newMonth = 11; newYear -= 1; }
    else if (newMonth > 11) { newMonth = 0; newYear += 1; }

    setMonth(newMonth);
    setYear(newYear);
    setSelectedDay(null);
    setSelectedHour(null);
  };

  const daysArray: { day: number; type: "prev" | "current" | "next" }[] = [];
  for (let i = startDay - 1; i >= 0; i--) {
    daysArray.push({ day: prevMonthDays - i, type: "prev" });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push({ day: i, type: "current" });
  }
  let nextDay = 1;
  while (daysArray.length % 7 !== 0) {
    daysArray.push({ day: nextDay, type: "next" });
    nextDay++;
  }

  const formatHour = (h: number) => {
    const suffix = h < 12 ? "a.m." : "p.m.";
    const display = h <= 12 ? h : h - 12;
    return `${display}:00 ${suffix}`;
  };

  const getHoursForDay = (dayOfWeek: number) => {
    let hours: string[] = [];
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      for (let h = 8; h < 20; h++) hours.push(`${formatHour(h)} - ${formatHour(h + 1)}`);
    } else {
      for (let h = 10; h < 22; h++) hours.push(`${formatHour(h)} - ${formatHour(h + 1)}`);
    }
    return hours;
  };

  const getRandomOccupiedHours = (hoursArray: string[]) => {
    const occupied: string[] = [];
    hoursArray.forEach(hour => { if (Math.random() < 0.3) occupied.push(hour); });
    return occupied;
  };

  const dayOfWeek = selectedDay ? new Date(year, month, selectedDay).getDay() : null;
  const hoursArray = dayOfWeek !== null ? getHoursForDay(dayOfWeek) : [];
  const selectedDateKey = selectedDay !== null
    ? `${year}-${String(month + 1).padStart(2,"0")}-${String(selectedDay).padStart(2,"0")}`
    : null;
  const occupiedHours = selectedDateKey && hoursArray.length > 0 ? getRandomOccupiedHours(hoursArray) : [];

  // Validación de mes/año
  const isPastMonth = year < today.getFullYear() || (year === today.getFullYear() && month < today.getMonth());
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  return (
    <div className="container">
      <img src="/A1.png" alt="Logo del restaurante" className="logo" />

      <div className="date-section">
        <span className="date-text">Seleccione la fecha</span>
        <img src="/L1.png" alt="Icono calendario" className="icon L1" />
      </div>

      <div className="calendar-container">
        <div className="calendar-header">
          <button className="arrow left" onClick={() => changeMonth(-1)}>‹</button>
          <span className="month">{monthNames[month]} {year}</span>
          <button className="arrow right" onClick={() => changeMonth(1)}>›</button>
        </div>

        <div className="calendar-weekdays">
          <span>DO</span><span>LU</span><span>MA</span><span>MI</span>
          <span>JU</span><span>VI</span><span>SA</span>
        </div>

        <div className="calendar-grid">
          {daysArray.map((d, i) => {
            const currentDate = new Date(year, month, d.day);
            let stateClass = "";

            if (d.type !== "current") {
              stateClass = "occupied";
            } else if (isPastMonth) {
              stateClass = "past"; // todo el mes anterior
            } else if (isCurrentMonth && currentDate < minDate) {
              stateClass = "past"; // días anteriores dentro del mes actual
            } else if (occupiedDays.includes(d.day)) {
              stateClass = "occupied";
            } else if (selectedDay === d.day) {
              stateClass = "selected";
            } else {
              stateClass = "available";
            }

            return (
              <button
                key={i}
                className={`day ${stateClass}`}
                onClick={() =>
                  d.type === "current" &&
                  !isPastMonth &&
                  currentDate >= minDate &&
                  setSelectedDay(d.day)
                }
              >
                {d.day}
              </button>
            );
          })}
        </div>
      </div>

      <div className="time-section">
        <span className="time-text">Seleccione la hora</span>
        <img src="/L2.png" alt="Icono reloj" className="icon L2" />
      </div>

      <div className="time-grid">
        {hoursArray.map((hour, i) => {
          const isAvailable = !occupiedHours.includes(hour);
          const isSelected = selectedHour === hour;
          let stateClass = "";

          if (isSelected) stateClass = "selected";
          else if (isAvailable) stateClass = "available";
          else stateClass = "unavailable";

          return (
            <div key={i} className="time-slot">
              <button
                className={`hour ${stateClass}`}
                onClick={() => isAvailable && setSelectedHour(hour)}
              >
                -
              </button>
              <span className={`hour-text ${isAvailable ? "available-text" : "unavailable-text"}`}>
                {hour}
              </span>
            </div>
          );
        })}
      </div>

      <div className="selected-date" id="selected-date">
        {selectedDay && selectedHour
          ? `${selectedDay} de ${monthNames[month]} ${year}, de ${selectedHour}`
          : selectedDay
            ? `${selectedDay} de ${monthNames[month]} ${year}`
            : ""}
      </div>

      <div className="button-section">
        <button className="button back" onClick={() => alert("Volviendo atrás...")}>
          Volver atrás
        </button>
        <button
          className="button continue"
          onClick={() => {
            if (selectedDay && selectedHour) {
              alert(`Continuando con la reserva: ${selectedDay} de ${monthNames[month]} ${year}, ${selectedHour}`);
            } else {
              alert("Por favor selecciona una fecha y una hora antes de continuar.");
            }
          }}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

export default App;
