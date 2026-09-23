module.exports = {
    roots: ["<rootDir>"],
    testMatch: ["**/__tests__/**/*.ts", "**/__tests__/**/*.tsx"],
    testPathIgnorePatterns: ["/node_modules/", "/dist/"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    moduleNameMapping: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "^@ui/(.*)$": "<rootDir>/ui/$1",
        "^@server/(.*)$": "<rootDir>/server/$1"
    },
    transform: {
        "^.+\\\\\\\\.tsx?\\\\$": "ts-jest"
    },
    collectCoverageFrom: [
        "src/**/*.ts",
        "src/**/*.tsx",
        "!src/**/*.d.ts",
        "!src/**/*.spec.ts",
        "!src/**/*.test.ts"
    ],
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov", "html"],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    testEnvironment: "node",
    maxWorkers: "4",
    watchPlugins: [
        "jest-watch-typeahead/filename",
        "jest-watch-typeahead/text"
    ]
};
