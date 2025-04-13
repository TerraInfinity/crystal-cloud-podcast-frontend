// app/utils/consoleGroupLogger.ts

// Store for grouped log messages
const logGroups: { [groupName: string]: string[] } = {};
let timeout: NodeJS.Timeout | null = null;

export const logGroupedMessage = (
  groupName: string,
  message: string,
  color: string = 'yellow',
  isWarning: boolean = true
) => {
  // Skip in production
  if (!import.meta.env.DEV) return;

  // Initialize group if it doesn't exist
  if (!logGroups[groupName]) {
    logGroups[groupName] = [];
  }
  // Add message to the group
  logGroups[groupName].push(message);

  // Debounce logging to batch all messages
  if (!timeout) {
    timeout = setTimeout(() => {
      // Log each group
      Object.keys(logGroups).forEach((group) => {
        if (logGroups[group].length > 0) {
          console.groupCollapsed(`%c${group} (${logGroups[group].length} messages)`, `color: ${color};`);
          logGroups[group].forEach((msg) => {
            if (isWarning) {
              console.warn(msg);
            } else {
              console.info(msg);
            }
          });
          console.groupEnd();
        }
      });
      // Clear all groups after logging
      Object.keys(logGroups).forEach((group) => {
        logGroups[group] = [];
      });
      timeout = null;
    }, 1000); // Wait 1s to batch messages
  }
};