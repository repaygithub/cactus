type MaybeFunc = ((params: any) => any) | null

class MockPromise {
  private _then: MaybeFunc = null
  private _catch: MaybeFunc = null
  private _chain: MockPromise | null = null
  private _value: any
  private _hasThrown: boolean

  public constructor(value?: unknown, hasThrown = false) {
    this._value = value
    this._hasThrown = hasThrown
  }

  public _call(value: any = this._value, hasThrown: boolean = this._hasThrown): void {
    const callback = hasThrown ? this._catch : this._then
    let keepThrowing = false
    let nextValue: any
    if (callback !== null) {
      try {
        nextValue = callback(value)
      } catch (e) {
        keepThrowing = true
        nextValue = e
      }
    } else if (hasThrown) {
      keepThrowing = true
      nextValue = value
    }

    if (this._chain !== null) {
      this._chain._call(nextValue, keepThrowing)
    } else if (keepThrowing) {
      console.error('[unhandledMockPromiseRejection]: ', nextValue)
    }
  }

  public then(callback: (params: any) => any): MockPromise {
    this._then = callback
    this._chain = new MockPromise()
    return this._chain
  }

  public catch(callback: (params: any) => any): MockPromise {
    this._catch = callback
    this._chain = new MockPromise()
    return this._chain
  }

  public static resolve(value: unknown): MockPromise {
    return new MockPromise(value)
  }

  public static reject(error: unknown): MockPromise {
    return new MockPromise(error, true)
  }
}

export default MockPromise
