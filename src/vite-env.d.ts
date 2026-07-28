/// <reference types="vite/client" />

// CSS Modules — typed as a generic string-keyed object so TS
// understands `import s from './Foo.module.css'` and `s.className`.
declare module '*.module.css' {
  const classes: Record<string, string>
  export default classes
}
