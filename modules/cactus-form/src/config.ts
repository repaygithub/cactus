import { ConfigurableComponent, RenderFunc } from './types'

export const makeConfigurableComponent = <P>(
  fn: RenderFunc<P>,
  defaults: Partial<P>
): ConfigurableComponent<P> => {
  const component = fn as ConfigurableComponent<P>
  component.defaultProps = defaults
  component.withDefaults = (newDefaults: Partial<P>) => {
    const clone: ConfigurableComponent<P> = component.bind(null) as any
    Object.assign(clone, component)
    const combinedDefaults = { ...defaults, ...newDefaults }
    return makeConfigurableComponent<P>(clone, combinedDefaults)
  }
  component.configureDefaults = (newDefaults: Partial<P>) => {
    const prevDefaults = { ...component.defaultProps }
    component.defaultProps = { ...defaults, ...newDefaults }
    return prevDefaults
  }
  component.initialDefaults = () => defaults
  return component
}
