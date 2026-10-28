module.exports = {
  preset: '@react-native/jest-preset',
  // Các thư viện này phát hành dạng ESM nên jest cần dịch qua Babel.
  transformIgnorePatterns: ['node_modules/(?!((jest-)?@?react-native.*|@react-navigation)/)'],
};
