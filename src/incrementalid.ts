let lastId = 0;

export function next(prefix = "id") {
  lastId++;
  return `${prefix}${lastId}`;
}
