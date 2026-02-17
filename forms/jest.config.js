module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  testPathIgnorePatterns: ["/node_modules/", "/e2e/", "e2e\\.test\\.js$"],
};
