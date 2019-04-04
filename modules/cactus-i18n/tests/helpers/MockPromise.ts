type MaybeFunc = ((params: any) => any) | null

class MockPromise {
  _then: MaybeFunc = null
  _catch: MaybeFunc = null
  _chain: MockPromise | null = null
  _value: any
  _hasThrown: boolean

  constructor(value?: any, hasThrown: boolean = false) {
    this._value = value
    this._hasThrown = hasThrown
  }

  _setValue(value: any) {
    this._value = value
  }

  _call(value: any = this._value, hasThrown: boolean = this._hasThrown) {
    let callback = hasThrown ? this._catch : this._then
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

  then(callback: (params: any) => any): MockPromise {
    this._then = callback
    return (this._chain = new MockPromise())
  }

  catch(callback: (params: any) => any): MockPromise {
    this._catch = callback
    return (this._chain = new MockPromise())
  }

  static resolve(value: any): MockPromise {
    return new MockPromise(value)
  }

  static reject(error: any): MockPromise {
    return new MockPromise(error, true)
  }
}

export default MockPromise
