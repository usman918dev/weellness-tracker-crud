// This service handles setting up browser notifications for daily reminders

const REMINDER_TYPES = {
  WATER: 'water',
  SLEEP: 'sleep',
  EXERCISE: 'exercise',
  MOOD: 'mood',
};

const DEFAULT_REMINDER_TIMES = {
  [REMINDER_TYPES.WATER]: ['09:00', '12:00', '15:00', '18:00'],
  [REMINDER_TYPES.SLEEP]: ['22:00'],
  [REMINDER_TYPES.EXERCISE]: ['08:00'],
  [REMINDER_TYPES.MOOD]: ['20:00'],
};

export function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return;
  }
  
  return Notification.requestPermission();
}

export function scheduleReminders(types = Object.values(REMINDER_TYPES)) {
  if (Notification.permission !== 'granted') {
    console.log('Notification permission not granted');
    return;
  }

  // Clear any existing reminders
  clearReminders();

  types.forEach(type => {
    const times = DEFAULT_REMINDER_TIMES[type];
    times.forEach(time => {
      const [hours, minutes] = time.split(':').map(Number);
      scheduleReminder(type, hours, minutes);
    });
  });
}

function scheduleReminder(type, hours, minutes) {
  const now = new Date();
  const scheduledTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes
  );

  // If the time has passed today, schedule for tomorrow
  if (scheduledTime < now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const timeUntilReminder = scheduledTime.getTime() - now.getTime();

  const timerId = setTimeout(() => {
    showNotification(type);
    // Reschedule the reminder for the next day
    scheduleReminder(type, hours, minutes);
  }, timeUntilReminder);

  // Store the timer ID so we can clear it later if needed
  window.wellnessReminders = window.wellnessReminders || {};
  window.wellnessReminders[`${type}-${hours}:${minutes}`] = timerId;
}

function showNotification(type) {
  const messages = {
    [REMINDER_TYPES.WATER]: 'Time to drink some water! 💧',
    [REMINDER_TYPES.SLEEP]: 'Time to prepare for bed! 😴',
    [REMINDER_TYPES.EXERCISE]: 'Time for some exercise! 💪',
    [REMINDER_TYPES.MOOD]: 'How are you feeling today? 😊',
  };

  const options = {
    body: messages[type],
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: `wellness-${type}`,
    renotify: true,
  };

  new Notification('Wellness Tracker Reminder', options);
}

export function clearReminders() {
  if (window.wellnessReminders) {
    Object.values(window.wellnessReminders).forEach(timerId => {
      clearTimeout(timerId);
    });
    window.wellnessReminders = {};
  }
}

export const REMINDER_TYPES_ARRAY = Object.values(REMINDER_TYPES);
export { REMINDER_TYPES };
