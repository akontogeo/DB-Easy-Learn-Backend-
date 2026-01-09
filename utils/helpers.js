// Extract specified keys from an object
export function pick(obj = {}, keys = []) {
  return keys.reduce((acc, k) => {
    if (k in obj) acc[k] = obj[k];
    return acc;
  }, {});
}
