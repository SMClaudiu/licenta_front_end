declare module '*.module.css' {
    const classes: { readonly [key: string]: string };
    export default classes;
}

declare module '*.module.scss' { // If you also use SCSS modules
    const classes: { readonly [key: string]: string };
    export default classes;
}
