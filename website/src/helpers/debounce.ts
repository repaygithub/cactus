function debounce<Func extends (...args: any[]) => any>(func: Func, wait: number): Func {
  let lastArgs: any, lastThis: any, result: any, timerId: number | undefined
  return function debounced(this: any, ...args: any[]) {
    lastArgs = args
    lastThis = this

    if (timerId === undefined) {
      timerId = setTimeout(function () {
        result = func.apply(lastThis, lastArgs)
        timerId = lastArgs = lastThis = undefined
      }, wait)
    }
    return result
  } as Func
}

export default debounce
