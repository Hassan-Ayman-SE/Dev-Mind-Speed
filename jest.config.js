module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // Instruct Jest to look inside the /tests/ folder for test files ending in .test.ts
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
};
