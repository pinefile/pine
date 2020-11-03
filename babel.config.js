const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  presets: [
    '@babel/preset-typescript',
    ['@babel/preset-env', { targets: { node: 'current' } }],
  ],
};
