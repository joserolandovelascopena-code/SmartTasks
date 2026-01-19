export function buildExecutionDate(task) {
  if (!task.due_date || !task.due_time) return null;

  return new Date(`${task.due_date}T${task.due_time}:00`);
}
