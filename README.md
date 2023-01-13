# Svelte ComboBox Component

## Before Use
As a web component, its CSS will be encapsulated inside the shadow root. [It means the user won’t have access to the style to override it in their application](https://stackoverflow.com/questions/67310042/pass-global-styles-down-to-svelte-custom-element-components). If you would like to modify the css inside the component, you could edit the components in `src/lib`. Then, run the `yarn build` to get your customized-style components in the `dist`.

## Development Mode
```javascript
/*  src/main.ts */
/*  For Development */
import App from './App.svelte'

const app = new App({
    target: document.getElementById('app'),
})

export default app
```
## Production Mode
```javascript
export * from './lib/{component_file_name}.svelte'
```

## Author
- [Andy Lien](https://github.com/andy922200)
