module.exports = function override(config, env) {
  // Disable source-map-loader for @mediapipe packages
  config.module.rules = config.module.rules.map(rule => {
    if (rule.enforce === 'pre' && rule.loader && rule.loader.includes('source-map-loader')) {
      rule.exclude = /node_modules\/@mediapipe/;
    }
    return rule;
  });
  
  return config;
};
