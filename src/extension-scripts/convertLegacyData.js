import { createUniqueId, getAsync, set } from "../modules/Utilities";

const convertLegacyData = async function () {
  const uniqueId = createUniqueId();
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
        value: days[index],
      }),
    );
    sync.options.activeTimes.value = {
      allDay: {
        ...sync.options.activeTimes.value.allDay,
        value: allDayCheckbox,
      },
      end: {
        ...sync.options.activeTimes.value.end,
        value: endTime,
      },
      start: {
        ...sync.options.activeTimes.value.start,
        value: startTime,
      },
    };
    sync.options.allowRevisits.value = revisitsCheckbox;
    sync.options.unblockTimeout.value = seconds;
    sync.options.revisitLimit.value = revisitsNumber;

    const providers = matches.split("\n").map((item) => {
      return {
        hostname: item,
        id: uniqueId,
        type: "Website",
        visibility: "visible",
      };
    });

    set({
      options: { ...sync.options },
      providers: providers,
    });

    chrome.storage.local.clear();
  } else {
    console.log("No legacy data was found");
  }
};

export default convertLegacyData;
