declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      class?: any
      style?: any
    }
  }

  interface Window {
    zanejs: any | undefined
  }
}

export {}
