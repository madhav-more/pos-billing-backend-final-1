module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // 👉 .env loader
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
        },
      ],

      // 👉 Path alias for @   (useful for Icons, screens, components)
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./",
            "@components": "./components",
            "@screens": "./Main/AllPages",
            "@icons": "./Icons",
            "@assets": "./assets",
          },
          extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
        },
      ],
    ],
  };
};
