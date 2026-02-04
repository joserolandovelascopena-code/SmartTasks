// scheduler.service.js
import { buildExecutionDate } from "../scheduler/scheduler.js";

export const SchedulerService = {
  normalizeDueDateTime(selectedDate, selectedTime) {
    const due_date = selectedDate || null;
    const due_time = selectedTime ? `${selectedTime}:00` : null;
    return { due_date, due_time };
  },

  normalizeDueDate(selectedDate) {
    return selectedDate || null;
  },

  buildExecutionDate(task) {
    return buildExecutionDate(task);
  },
};
