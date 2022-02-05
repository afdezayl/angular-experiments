const { getJestProjects } = require('@nrwl/jest');

module.exports = {
  projects: [
    ...getJestProjects(),
    '<rootDir>/apps/cache',
    '<rootDir>/apps/api',
    '<rootDir>/libs/http-cache',
  ],
};
