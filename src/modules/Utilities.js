/** Helper function */
export const replaceObjectInArray = (array, newObject, matchKey = "id") => {
  const itemIndex = array.findIndex(
    (object) => object[matchKey] === newObject[matchKey],
  );
  if (itemIndex > -1) {
    array[itemIndex] = newObject;
    return [...array];
  } else {
    throw new ReferenceError("No match not found in array.");
  }
};

export const sanitize = (str) => {
  str = str?.split("&")[0];
  if (str?.slice(-1) === "/") {
    return str?.slice(0, -1);
  }
  return str;
};

export const getBlockPredicates = (options, mockDate = null) => {
  const isScheduled = options.scheduleBlocking.value;
  const date = mockDate ?? new Date();
  let day = date.getDay();
  day = day === 0 ? 6 : day - 1; // Monday should be the 0 index instead of Sunday

  const blockingDays = options.activeDays.value.map((day) => day.value);
  const isBlockingDay = blockingDays[day];

  const hour = date.getHours();
  const minute = date.getMinutes();
  const { allDay, start, end } = options.activeTimes.value;

  // Convert start and end times into minutes for easier comparison
  const [startHour, startMinute] = start.value.split(":").map(Number);
  const [endHour, endMinute] = end.value.split(":").map(Number);

  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;
  const currentTotalMinutes = hour * 60 + minute;

  let isBlockingTime;

  // If the time range spans midnight, split the check into two parts
  if (startTotalMinutes < endTotalMinutes) {
    // Normal range (start < end)
    isBlockingTime =
      allDay.value ||
      (currentTotalMinutes >= startTotalMinutes &&
        currentTotalMinutes < endTotalMinutes);
  } else {
    // Time range spans midnight
    isBlockingTime =
      allDay.value ||
      currentTotalMinutes >= startTotalMinutes ||
      currentTotalMinutes < endTotalMinutes;
  }

  return { isScheduled, isBlockingDay, isBlockingTime };
};

export const createUniqueId = () => "id" + Math.random().toString(16).slice(2);

export const set = (obj, callback) => {
  chrome.storage.sync.set(obj, callback);
};
export const setAsync = async (obj) => chrome.storage.sync.set(obj);

export const get = (keys, callback) => chrome.storage.sync.get(keys, callback);

export const getAsync = async (keys) => chrome.storage.sync.get(keys);
