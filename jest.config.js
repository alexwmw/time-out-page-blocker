module.exports = {
  testEnvironment: "jsdom", // Use "jsdom" if testing frontend code
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest", // Handle both .js and .jsx files
  },
};
