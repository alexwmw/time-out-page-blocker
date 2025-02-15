import { getBlockPredicates } from "./Utilities";

// Sample mock data for options to pass into the function
const mockOptions_0900_1700 = {
  scheduleBlocking: { value: true },
  activeDays: {
    value: [
      { value: true },
      { value: false },
      { value: false },
      { value: true },
      { value: false },
      { value: true },
      { value: false },
    ],
  }, // Mock days (Mon-Sun)
  activeTimes: {
    value: {
      allDay: { value: false },
      start: { value: "09:00" },
      end: { value: "17:00" },
    },
  },
};
const mockOptions_1700_0900 = {
  scheduleBlocking: { value: true },
  activeDays: {
    value: [
      { value: true },
      { value: false },
      { value: false },
      { value: true },
      { value: false },
      { value: true },
      { value: false },
    ],
  }, // Mock days (Mon-Sun)
  activeTimes: {
    value: {
      allDay: { value: false },
      start: { value: "17:00" },
      end: { value: "09:00" },
    },
  },
};

describe("getBlockPredicates", () => {
  it("should return the correct predicates for isScheduled", () => {
    // Get the result from the function
    const result = getBlockPredicates(mockOptions_0900_1700);

    // Check if isScheduled is correct
    expect(result.isScheduled).toBe(true);
  });

  it("should return the correct predicates for isScheduled (false)", () => {
    // Get the result from the function
    const result = getBlockPredicates({
      ...mockOptions_0900_1700,
      scheduleBlocking: { value: false },
    });

    // Check if isScheduled is correct
    expect(result.isScheduled).toBe(false);
  });

  it("should return the correct predicates for a scheduled days", () => {
    // You can mock the current time to fall within the active range (e.g., 10:00 AM)
    const monday = new Date("2025-02-17T10:00:00");
    const tuesday = new Date("2025-02-18T10:00:00");
    const wednesday = new Date("2025-02-19T10:00:00");
    const thursday = new Date("2025-02-20T10:00:00");
    const friday = new Date("2025-02-21T10:00:00");
    const saturday = new Date("2025-02-22T10:00:00");
    const sunday = new Date("2025-02-16T10:00:00");

    let result;

    result = getBlockPredicates(mockOptions_0900_1700, monday);
    expect(result.isBlockingDay).toBe(true);

    result = getBlockPredicates(mockOptions_0900_1700, tuesday);
    expect(result.isBlockingDay).toBe(false);

    result = getBlockPredicates(mockOptions_0900_1700, wednesday);
    expect(result.isBlockingDay).toBe(false);

    result = getBlockPredicates(mockOptions_0900_1700, thursday);
    expect(result.isBlockingDay).toBe(true);

    result = getBlockPredicates(mockOptions_0900_1700, friday);
    expect(result.isBlockingDay).toBe(false);

    result = getBlockPredicates(mockOptions_0900_1700, saturday);
    expect(result.isBlockingDay).toBe(true);

    result = getBlockPredicates(mockOptions_0900_1700, sunday);
    expect(result.isBlockingDay).toBe(false);
  });

  it("should return the correct predicates for a scheduled day within active time range", () => {
    //  mock the current time to fall within the active range (e.g., 10:00 AM)
    const currentTime = new Date("2025-02-15T10:00:00"); // Saturday 10am
    const result = getBlockPredicates(mockOptions_0900_1700, currentTime);

    //  mock the current time to fall within the active range (e.g., 18:00 PM)
    const currentTime2 = new Date("2025-02-15T18:00:00"); // Saturday 6pm
    const result2 = getBlockPredicates(mockOptions_1700_0900, currentTime2);

    // Check if isBlockingTime is true (assuming current time is within active range)
    expect(result.isBlockingTime).toBe(true);
    expect(result2.isBlockingTime).toBe(true);
  });

  it("should return correct predicates for a non-blocking time", () => {
    // Mock time to be outside the active time range (e.g., 18:00 PM)
    const currentTime = new Date("2025-02-15T18:00:00"); // Set time outside of the 9-5 range
    const result = getBlockPredicates(mockOptions_0900_1700, currentTime);

    const currentTime2 = new Date("2025-02-15T10:00:00"); // Set time outside of the 5-9 range
    const result2 = getBlockPredicates(mockOptions_1700_0900, currentTime2);

    const currentTime3 = new Date("2025-02-15T08:00:00"); // Set time outside of the 9-5 range
    const result3 = getBlockPredicates(mockOptions_0900_1700, currentTime3);

    const currentTime4 = new Date("2025-02-15T16:59:00"); // Set time outside of the 5-9 range
    const result4 = getBlockPredicates(mockOptions_1700_0900, currentTime4);

    // Check if isBlockingTime is false
    expect(result.isBlockingTime).toBe(false); // Mock time to be outside the active time range (e.g., 18:00 PM)
    expect(result2.isBlockingTime).toBe(false);
    expect(result3.isBlockingTime).toBe(false);
    expect(result4.isBlockingTime).toBe(false);
  });

  it("should return true for a time within the active time range", () => {
    // Mock time within the active range (e.g., 10:00 AM)
    const currentTime = new Date("2025-02-15T16:59:00"); // Saturday, 10:00 AM
    const result = getBlockPredicates(mockOptions_0900_1700, currentTime);

    expect(result.isScheduled).toBe(true);
    expect(result.isBlockingTime).toBe(true); // Should be within the active time range (9 AM to 5 PM)
  });

  it("should return true for the exact start time", () => {
    // Mock time at the start time (e.g., exactly 9:00 AM)
    const currentTime = new Date("2025-02-15T09:00:00"); // Saturday, 9:00 AM
    const result = getBlockPredicates(mockOptions_0900_1700, currentTime);

    console.log(result);

    expect(result.isScheduled).toBe(true);
    expect(result.isBlockingTime).toBe(true); // Should be considered within the active time range
  });

  it("should return false for the exact end time", () => {
    // Mock time exactly at the end time (e.g., 5:00 PM)
    const currentTime = new Date("2025-02-15T17:00:00"); // Saturday, 5:00 PM
    const result = getBlockPredicates(mockOptions_0900_1700, currentTime);

    expect(result.isScheduled).toBe(true);
    expect(result.isBlockingTime).toBe(false); // Should be outside the active time range

    const currentTime2 = new Date("2025-02-15T09:00:00"); // Saturday, 9:00 AM
    const result2 = getBlockPredicates(mockOptions_1700_0900, currentTime2);

    expect(result.isScheduled).toBe(true);
    expect(result.isBlockingTime).toBe(false); // Should be outside the active time range
    expect(result2.isBlockingTime).toBe(false); // Should be outside the active time range
  });

  it("should return false for a time before the active time range", () => {
    // Mock time before the start time (e.g., 8:00 AM)
    const currentTime = new Date("2025-02-15T08:00:00"); // Saturday, 8:00 AM
    const result = getBlockPredicates(mockOptions_0900_1700, currentTime);

    expect(result.isScheduled).toBe(true);
    expect(result.isBlockingTime).toBe(false); // Should be outside the active time range
  });

  it("should return true for a time at noon within active time range", () => {
    // Mock time at 12:00 PM (Noon)
    const currentTime = new Date("2025-02-15T12:00:00"); // Saturday, 12:00 PM
    const result = getBlockPredicates(mockOptions_0900_1700, currentTime);

    expect(result.isScheduled).toBe(true);
    expect(result.isBlockingTime).toBe(true); // Should be within the active time range
  });

  it("should return false for midnight outside active time range", () => {
    // Mock time at midnight (e.g., 12:00 AM)
    const currentTime = new Date("2025-02-15T00:00:00"); // Saturday, 12:00 AM
    const result = getBlockPredicates(mockOptions_0900_1700, currentTime);

    expect(result.isBlockingTime).toBe(false); // Should be outside the active time range
  });
});
