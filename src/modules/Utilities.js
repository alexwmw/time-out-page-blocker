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

export const getBlockPredicates = (options) => {
  const isScheduled = options.scheduleBlocking.value;
  const date = new Date();

  const day = (date.getDay() - 1) % 7;
  const blockingDays = options.activeDays.value.map((day) => day.value);
  const isBlockingDay = blockingDays[day];

  const [hour, minute] = date.toLocaleTimeString().split(":");
  const { allDay, start, end } = options.activeTimes.value;
  const [startHour, startMinute] = start.value.split(":");
  const [endHour, endMinute] = end.value.split(":");
  const isBlockingTime =
    allDay.value ||
    (startHour < hour && hour < endHour) ||
    (startHour === hour && startMinute < minute) ||
    (hour === endHour && minute < endMinute);

  return { isScheduled, isBlockingDay, isBlockingTime };
};

export const createUniqueId = () => "id" + Math.random().toString(16).slice(2);

export const set = (obj, callback) => {
  chrome.storage.sync.set(obj, callback && callback());
};

export const get = (keys, callback) => chrome.storage.sync.get(keys, callback);

export const getAsync = async (keys) => chrome.storage.sync.get(keys);
