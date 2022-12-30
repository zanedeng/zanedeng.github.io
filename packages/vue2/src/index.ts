const withInstall = (Vue: any) => {
  // Vue.component((Select as any).extendOptions.name, Select)
}

if (typeof window !== 'undefined' && window.Vue) {
  withInstall(window.Vue)
}

export default {
  install: withInstall,
}
