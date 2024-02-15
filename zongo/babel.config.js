module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        alias: {
          src: './src',
          '@assets': './src/assets',
          '@commonComponents': './src/commonComponents',
          '@constants': './src/constants',
          '@navigation': './src/navigation',
          '@redux': './src/redux',
          '@screens': './src/screens',
        },
      },
    ],
  ],
};
