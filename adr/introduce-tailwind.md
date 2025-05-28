# ADR 1: Introducing Tailwind CSS

## Context
Currently, our project uses more traditional SCSS pre-processor for styling, which can lead to bloated stylesheets, a lot of
unused styling rules and inconsistent design patterns. By introducing Tailwind CSS (a utility-first CSS framework) we expect to 
increase our UI *development speed* and improve the *maintainability* of our styles.

## Decision
We will install Tailwind CSS as a dependency in our Angular project using `npm install tailwindcss postcss autoprefixer`.
Yet `autoprefixer` package is not strictly required for tailwind to work, it is a good practice to include it for better cross-browser compatibility.
We will then configure Tailwind by adding a `tailwind.config.js` file. The Tailwind configuration will allow us to customize 
the design system, such as colors, spacing, and breakpoints. Last but not least, we will add Tailwind's directives to our main stylesheet (e.g. `styles.scss`):
```scss
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Rationale
Tailwind helps to:
- Increase development speed
- Build custom designs without leaving HTML
- Promote consistency across application
- Reduce the need for writing custom CSS
- Minimize the risk of CSS conflicts

## Status
**Proposed**

## Consequences
**Positive:**
- More maintainable and scalable codebase
- Fast development of UI components
- Consistent design patterns across the application
- Small CSS bundle size due to purging unused styles
- Easier to implement responsive design with utility classes

**Negative:**
- Initial learning curve for developers unfamiliar with Tailwind
- Initial time investment to setup configuration and definition for custom themes (e.g. colors, spacing, screen-sizes)
- Extra time on refactoring / cleaning up the existing SCSS files
- Additional effort on creating reusable components as it is harder to abstract utility classes
