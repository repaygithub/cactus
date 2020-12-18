import { FluentVariable } from '@fluent/bundle'
import PropTypes from 'prop-types'
import React, {
  ComponentProps,
  JSXElementConstructor,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react'

import BaseI18nController from './BaseI18nController'
import { I18nContext, useI18nResource, useI18nText } from './hooks'
import { I18nContextType } from './types'

interface I18nProviderProps {
  controller: BaseI18nController
  lang?: string
  section?: string
}

const flopFlip = (x: boolean) => !x

const I18nProvider: React.FC<I18nProviderProps> = ({ section = 'global', ...props }) => {
  const controller = props.controller
  if (!(controller instanceof BaseI18nController)) {
    throw Error('I18nProvider must be given a controller which extends BaseI18nController')
  }
  if (typeof props.lang === 'string') {
    controller.setLang(props.lang)
  }
  const lang = controller.lang
  const [flipFlop, toggle] = useState(false)
  const i18nContext: I18nContextType = { controller, lang, section }
  const { current: stable } = React.useRef({ flipFlop, i18nContext })
  if (
    flipFlop !== stable.flipFlop ||
    controller !== stable.i18nContext.controller ||
    lang !== stable.i18nContext.lang
  ) {
    stable.flipFlop = flipFlop
    stable.i18nContext = i18nContext
  }
  useEffect(() => {
    if (controller instanceof BaseI18nController) {
      const triggerUpdate = () => toggle(flopFlip)
      controller.addListener(triggerUpdate)
      return (): void => controller.removeListener(triggerUpdate)
    }
  }, [controller])
  useEffect(() => {
    if (section) {
      controller._load({ section, lang })
    }
  }, [controller, section, lang])
  return <I18nContext.Provider value={stable.i18nContext}>{props.children}</I18nContext.Provider>
}

I18nProvider.propTypes = {
  // TS doesn't like providing an abstract class below
  // @ts-ignore
  controller: PropTypes.instanceOf(BaseI18nController),
  lang: PropTypes.string,
}

interface DependencyLoadType {
  section: string
  [key: string]: any
}

interface I18nSectionProps {
  name: string
  lang?: string
  dependencies?: (string | DependencyLoadType)[]
  [key: string]: any
}

function hasLoadedAll(
  controller: BaseI18nController,
  section: string,
  lang?: string,
  dependencies?: (string | DependencyLoadType)[]
): boolean {
  if (!controller.hasLoaded(section, lang)) {
    return false
  }
  if (!Array.isArray(dependencies) || dependencies.length === 0) {
    return true
  }
  return dependencies.every((dep): boolean => {
    if (typeof dep === 'string') {
      return controller.hasLoaded(dep, lang)
    }
    return controller.hasLoaded(dep.section, lang)
  })
}

const I18nSection: React.FC<I18nSectionProps> = ({
  name,
  lang: propsLang,
  dependencies,
  children,
  ...extraProps
}): ReactElement | null => {
  const context = useContext(I18nContext)
  const sectionContext = context === null ? null : { ...context }
  if (sectionContext !== null) {
    sectionContext.section = name
    if (propsLang) {
      sectionContext.lang = propsLang
    }
  }
  useEffect((): void => {
    if (sectionContext !== null) {
      const { lang: contextLang, section: contextSection, controller } = sectionContext
      controller._load({ lang: contextLang, section: contextSection }, extraProps)
      if (Array.isArray(dependencies)) {
        dependencies.forEach((dep): void => {
          if (!dep) return
          let depSection: string
          let depExtra: { [key: string]: any } | undefined
          if (typeof dep === 'string') {
            depSection = dep
          } else {
            ;({ section: depSection, ...depExtra } = dep)
          }
          controller._load({ lang: contextLang, section: depSection }, depExtra)
        })
      }
    }
  })
  // wait to render until section is loaded
  if (
    sectionContext !== null &&
    !hasLoadedAll(sectionContext.controller, name, propsLang, dependencies)
  ) {
    return null
  }
  return (
    <I18nContext.Provider value={sectionContext}>
      <React.Fragment>{children}</React.Fragment>
    </I18nContext.Provider>
  )
}

I18nSection.propTypes = {
  name: PropTypes.string.isRequired,
  lang: PropTypes.string,
}

interface I18nTextProps {
  get: string
  args?: Record<string, FluentVariable>
  section?: string
}

const I18nText: React.FC<I18nTextProps> = (props): ReactElement => {
  const text = useI18nText(props.get, props.args, props.section)
  return <React.Fragment>{text || props.children || props.get}</React.Fragment>
}

I18nText.propTypes = {
  get: PropTypes.string.isRequired,
  args: PropTypes.object as PropTypes.Validator<Record<string, FluentVariable>>,
  section: PropTypes.string,
}

type TagNameOrReactComp = keyof JSX.IntrinsicElements | JSXElementConstructor<any>

type I18nElementProps<Elem extends TagNameOrReactComp> = {
  as: Elem
} & Partial<ComponentProps<Elem>> &
  I18nTextProps

const I18nElement = function <Elem extends TagNameOrReactComp>(
  props: I18nElementProps<Elem>
): ReactElement {
  const { get, args = {}, section, as, ...rest } = props
  const { text, attrs } = useI18nResource(get, args, section)
  const elemProps = { ...rest, ...attrs }
  return React.createElement(as, elemProps, text || get)
}

I18nElement.propTypes = {
  get: PropTypes.string.isRequired,
  args: PropTypes.object,
  section: PropTypes.string,
  as: PropTypes.node,
}

interface I18nResourceProps extends I18nTextProps {
  render?: (message: string, attributes?: { [k: string]: any } | null) => React.ReactNode
  children?: (message: string, attributes?: { [k: string]: any } | null) => React.ReactNode
}

const I18nResource: React.FC<I18nResourceProps> = (props): ReactElement => {
  const { text, attrs } = useI18nResource(props.get, props.args, props.section)
  let renderer = null
  if (typeof props.children === 'function') {
    renderer = props.children
  } else if (typeof props.render === 'function') {
    renderer = props.render
  }

  return (
    <React.Fragment>{renderer !== null ? renderer(text || props.get, attrs) : null}</React.Fragment>
  )
}

I18nResource.propTypes = {
  get: PropTypes.string.isRequired,
  args: PropTypes.object as PropTypes.Validator<Record<string, FluentVariable>>,
  section: PropTypes.string,
  render: PropTypes.func,
  children: PropTypes.func,
}

interface I18nFormattedProps extends I18nTextProps {
  formatter: (message: string) => React.ReactNode
}

const I18nFormatted: React.FC<I18nFormattedProps> = (props): ReactElement => {
  const text = useI18nText(props.get, props.args, props.section)
  return <React.Fragment>{text !== null ? props.formatter(text) : props.get}</React.Fragment>
}

I18nFormatted.propTypes = {
  get: PropTypes.string.isRequired,
  args: PropTypes.object as PropTypes.Validator<Record<string, FluentVariable>>,
  section: PropTypes.string,
  formatter: PropTypes.func.isRequired,
}

export { I18nProvider, I18nSection, I18nElement, I18nFormatted, I18nResource, I18nText }
