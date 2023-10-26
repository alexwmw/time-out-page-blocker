import { createUniqueId, getAsync, set } from "./Utilities";

const convertLegacyData = async function (callback) {
  const uniqueId = () => createUniqueId();
  const local = await chrome.storage.local.get();
  const sync = await getAsync(["options", "providers"]);
  if (Object.keys(local).length) {
    console.log("Converting legacy data...");
    const {
      "allday-checkbox": allDayCheckbox,
      "revisits-checkbox": revisitsCheckbox,
      "revisits-number": revisitsNumber,
      matches,
      seconds,
      "end-time": endTime,
      "start-time": startTime,
      mon,
      tue,
      wed,
      thu,
      fri,
      sat,
      sun,
    } = local;

    const days = [mon, tue, wed, thu, fri, sat, sun];
    sync.options.activeDays.value = sync.options.activeDays.value.map(
      (item, index) => ({
        ...item,
        value: days[index] ?? false,
      }),
    );
    sync.options.activeTimes.value = {
      allDay: {
        ...sync.options.activeTimes.value.allDay,
        value: allDayCheckbox ?? false,
      },
      end: {
        ...sync.options.activeTimes.value.end,
        value: endTime ?? false,
      },
      start: {
        ...sync.options.activeTimes.value.start,
        value: startTime ?? false,
      },
    };
    sync.options.allowRevisits.value = revisitsCheckbox ?? false;
    sync.options.unblockTimeout.value = seconds ?? false;
    sync.options.revisitLimit.value = revisitsNumber ?? false;
    sync.options.scheduleBlocking.value = true;

    const providers = matches.split("\n").map((item) => {
      return {
        hostname: item,
        id: uniqueId(),
        isByPath: true,
        dateAdded: new Date(Date.now()).toLocaleString(),
      };
    });

    set({
      options: { ...sync.options },
      providers: providers,
    });
    callback({
      options: { ...sync.options },
      providers: providers,
    });

    chrome.storage.local.clear();
  } else {
    console.log("No legacy data was found");
  }
};

export default convertLegacyData;
