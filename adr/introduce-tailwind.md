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

### Migration Plan
Taking into consideration the size of our applications which is relatively small (only 2 scss files) by the moment of writing this cdr,
we will make a migration using big bang approach that can be completed under "Tailwind Introduction" epic with the following tasks:

1. Install and set up Tailwind config (3 points, up to 2 days);
2. Adjust Tailwind to accept our custom project theme (colors, breakpoints, spacing etc). Work with designer. (3 points, up to 2 days);
3. Introduce Angular Material override file to bring it to our custom project theme. Work with designer. (3 points, up to 2 days);
4. Refactor existing styles to use Tailwind utility classes (2 points, up to 1 day);

Keep in mind that Tailwind CSS should be used on modules/components level. It does not relate to the global styles which define
high-level styling (normalizing, typography, overrides of Angular Material, etc.).


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
