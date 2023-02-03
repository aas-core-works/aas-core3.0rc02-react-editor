// Adapted from: https://gist.github.com/nmsdvid/8807205
export function debounce<FuncT extends (...args: unknown[]) => unknown>(
  func: FuncT,
  wait: number,
  immediate?: boolean
) {
  let timeout: number | null = null;
  let context: unknown | null = null;

  const debounced = function (this: unknown, ...args: unknown[]) {
    if (timeout === null) {
      throw new Error("Unexpected timeout null");
    }

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    context = this;

    clearTimeout(timeout);

    timeout = setTimeout(function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);

    if (immediate && !timeout) func.apply(context, args);
  };

  debounced.cancel = function () {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = null;
    context = null;
  };

  return debounced;
}
