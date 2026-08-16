# QurbanFlow Operations

I want to build a production-ready web application called QurbanOps.

QurbanOps is an operational workflow management system for community Qurban events.

The application helps Qurban committees coordinate the operational execution of animal processing from registration until completion.

This application is designed for real-world use during busy operational days where speed, clarity, and reliability are critical.

--------------------------------------------------

TARGET USERS

--------------------------------------------------

The primary users are:

- Super Admin

- Supervisor

- Operational Teams

Users are often working under time pressure.

The interface must help them perform operational tasks quickly with minimal learning.

--------------------------------------------------

THIS APPLICATION IS NOT

--------------------------------------------------

This is NOT:

- an ERP

- an accounting system

- an inventory system

- an analytics dashboard

- a reporting system

- a generic CRUD admin application

- a mobile application

Instead, think of QurbanOps as a modern operational workspace similar to:

- Linear

- GitHub Projects

- Jira

but significantly simpler and optimized for field operations.

--------------------------------------------------

PLATFORM

--------------------------------------------------

Build a responsive Web Application.

Desktop is the primary experience.

Tablet and Mobile are responsive adaptations of the desktop workflow.

The desktop layout is always the source of truth.

Never sacrifice desktop usability to simplify the mobile experience.

--------------------------------------------------

TECHNOLOGY

--------------------------------------------------

Use:

- React

- TypeScript

- Tailwind CSS

- shadcn/ui

Build reusable components.

Use clean architecture.

Use modular folder structures.

Favor composition over duplication.

Build the application as if it will continue to grow into a production SaaS product.

--------------------------------------------------

DESIGN MOOD

--------------------------------------------------

The interface should feel:

- Calm

- Professional

- Reliable

- Focused

- Operational

- Modern

- Premium

- Efficient

Users should immediately feel that this is software they can trust during an important real-world event.

--------------------------------------------------

DESIGN LANGUAGE

--------------------------------------------------

Use a modern Enterprise SaaS design language inspired by:

- Linear

- GitHub

- Vercel

- Notion

Prioritize:

- clean typography

- excellent information hierarchy

- generous whitespace

- subtle borders

- minimal shadows

- reusable components

- accessibility

- responsive layouts

Avoid:

- Brutalism

- Glassmorphism

- Neumorphism

- Heavy gradients

- Decorative illustrations

- Cartoon-style graphics

- Playful interfaces

- Excessive animations

This application is an operational workspace, not a marketing website.

--------------------------------------------------

UX PRINCIPLES

--------------------------------------------------

Always prioritize:

- Fast scanning

- Minimal clicks

- One primary action

- Clear information hierarchy

- Operational efficiency

- Consistency

- Accessibility

Every screen should help users complete operational work as quickly as possible.

Display only information that helps users make the next decision.

Hide unnecessary information.

--------------------------------------------------

APPLICATION STRUCTURE

--------------------------------------------------

The application will eventually contain:

- Operational Board

- Animal Management

- Team Management

- Event Management

- Event Summary

- User & Access Management

- Settings

The Operational Board is the heart of the application.

Every design and engineering decision should prioritize this workflow.

--------------------------------------------------

DEVELOPMENT APPROACH

--------------------------------------------------

Build the application incrementally.

Start with a solid application foundation.

Create reusable layouts and components before implementing feature pages.

Avoid creating page-specific components if reusable components are more appropriate.

Think like a senior frontend engineer building a production-ready SaaS application.

--------------------------------------------------

IMPLEMENTATION PRINCIPLES

--------------------------------------------------

Do not invent business workflows.

Do not invent additional features.

Do not redesign workflows without approval.

When requirements are unclear, ask questions instead of making assumptions.

Always preserve existing architecture and reusable components.

Prefer maintainability over quick solutions.

--------------------------------------------------

COLLABORATION

--------------------------------------------------

Before implementing a major feature:

- briefly explain your architectural approach

- explain your design decisions

- explain why you chose the proposed solution

Wait for approval before continuing to the next major feature.

Treat every approved feature as the new source of truth for the rest of the project.

--------------------------------------------------

GOAL

--------------------------------------------------

Build a production-quality operational web application that could realistically be used by Qurban committees during real operational events.

The application should feel dependable, efficient, and purpose-built for operational workflows rather than administrative tasks.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/479a4c95-76a2-46b1-9400-05f24e6d3c88).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
