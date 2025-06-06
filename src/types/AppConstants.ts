export const REMINDER_STATUS = {
  PENDING: "pending" as const,
  IN_PROGRESS: "in-progress" as const,
  COMPLETED: "completed" as const,
};

export const REMINDER_STATUS_TEXT = {
  [REMINDER_STATUS.PENDING]: "Pendiente",
  [REMINDER_STATUS.IN_PROGRESS]: "En proceso",
  [REMINDER_STATUS.COMPLETED]: "Completado",
};

export const APP_ROUTES = {
  HOME: "/",
  REMINDERS: "/reminders",
  ACCESS: "/access",
  SIGNUP: "/signup",
};

export const LOCAL_STORAGE_KEYS = {
  REMINDERS: "anaReminders",
  USER_ID: "currentUserId",
  USER_EMAIL: "currentUserEmail",
};