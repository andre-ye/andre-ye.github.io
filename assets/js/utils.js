/**
 * Shared seeded random utilities (no visual change; used by hourly_ai_image and custom_cursor).
 */

// For numeric seeds (e.g. hour-based): returns a single value in [0, 1).
window.seededRandomFromNumber = function(seed) {
  var x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// For string seeds (e.g. date): returns a function that yields values in [0, 1).
window.seededRandomFromString = function(seedStr) {
  var hash = 0;
  for (var i = 0; i < seedStr.length; i++) {
    hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
    hash = hash & hash;
  }
  var x = Math.abs(hash);
  return function() {
    x = (x * 9301 + 49297) % 233280;
    return x / 233280;
  };
};
