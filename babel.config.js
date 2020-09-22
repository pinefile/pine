const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  presets: [
    '@babel/preset-typescript',
    ['@jitesoft/main', { exclude: isProd ? ['transform-runtime'] : [], mode: 'node', modules: 'auto' }],
  ],
};
