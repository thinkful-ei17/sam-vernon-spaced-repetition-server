module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'hello',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '7d',
  PORT: process.env.PORT || 8080,
  // DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost/thinkful-backend',
  DATABASE_URL: 'mongodb://test:test@ds133776.mlab.com:33776/satutor',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'mongodb://localhost/thinkful-backend-test'
};
