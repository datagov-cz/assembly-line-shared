import { parse } from 'yaml'

import { Components, Config } from './types'

/**
 * Returns the default configuration stored in window.__config__ object
 */
const getConfig = () => (window as any).__config__ as Config

/**
 * Merges local configuration with injected default configuration
 */
const buildEnv = (processEnv: NodeJS.ProcessEnv, windowConfig: Config) => ({
  ...Object.keys(processEnv).reduce<Record<string, string>>((acc, key) => {
    const strippedKey = key.replace('REACT_APP_', '')
    acc[strippedKey] = processEnv[key]!
    return acc
  }, {}),
  ...windowConfig,
})

/**
 * Returns a decoded components configuration
 */
const buildComponents = (windowConfig: Config) => {
  try {
    const base64String = windowConfig.COMPONENTS
    // Use TextDecoder interface to properly decode UTF-8 characters
    const yamlString = new TextDecoder('utf-8').decode(
      Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0))
    )
    return parse(yamlString)
  } catch (error: any) {
    console.error(error)
    throw new Error('Unable to decode COMPONENTS configuration')
  }
}

/**
 * Usage:
 * `type LocalVars = 'MY_KEY' | 'MY_OTHER_KEY'`
 * `const env = new Env<LocalVars>(process.env)`
 * `const myKeyStringValue = env.get('MY_KEY')`
 * `const components = env.getComponents()`
 */
export class Env<LocalVars extends string> {
  private env: Record<string, string> & Config
  private components: Components

  constructor(processEnv: NodeJS.ProcessEnv, windowConfig?: Config) {
    const rawConfig = windowConfig ? windowConfig : getConfig()
    this.env = buildEnv(processEnv, rawConfig)
    console.log(this.env)
    this.components = buildComponents(this.env)
  }

  get(name: LocalVars | keyof Config, defaultValue?: string): string {
    const value = this.env[name] || defaultValue
    if (value !== undefined) {
      return value
    }
    throw new Error(`Missing environment variable: ${name}`)
  }

  getComponents() {
    return this.components
  }
}
