//eventsCalendar.js
document.querySelector(".GoHome").addEventListener("click", () => {
  window.location.href = "../../index.html";
});

document.addEventListener("click", (e) => {
  const daysContainer = document.querySelector(".days");
  const day_Detalles = document.querySelector(".day-tasks-detalles-dia");
  const container_dayDetalles = document.querySelector(
    ".lista-tareas-interfaz-calendar",
  );

  if (!day_Detalles || !container_dayDetalles || !daysContainer) return;

  if (
    !daysContainer.contains(e.target) &&
    !container_dayDetalles.contains(e.target)
  ) {
    day_Detalles.textContent = "";
  }
});
