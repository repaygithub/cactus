type MaybeFunc = ((params: any) => any) | null

class MockPromise {
  _then: MaybeFunc = null
  _catch: MaybeFunc = null
  _chain: MockPromise | null = null
  _value: any

  constructor(value?: any) {
    this._value = value
  }

  _setValue(value: any) {
    this._value = value
  }

  _call(value?: any, hasThrown?: boolean) {
    let callback = hasThrown ? this._catch : this._then
    value = value || this._value
    let threwAgain = false
    let nextValue: any
    try {
      nextValue = callback !== null && callback(value)
    } catch (e) {
      threwAgain = true
      nextValue = e
    }

    if (this._chain !== null) {
      this._chain._call(nextValue, threwAgain)
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
}

export default MockPromise
