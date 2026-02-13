# Accordion - Modern Interactive Note-Taking

A React-based accordion component reimagined as a dynamic note-taking tool. Inspired by Notion, it features a clean UI, mixed content types, and smooth animations.

![App Screenshot](file:///Users/mayankjha/.gemini/antigravity/brain/7f1f5dc4-407f-4387-8efa-90197bccac81/final_result_1771014726873.png)

## Features

### 1. Mixed Content Types

- **Questions**: Standard collapsible accordion items for Q&A.
- **Diagrams**: Mermaid.js diagram support with live rendering.
- **Markdown**: Rich text notes with full Markdown support.

### 2. Notion-Style UX

- **Clean Interface**: Minimalist design with no clutter.
- **Distraction-Free**: Markdown and Diagram blocks are borderless and transparent.
- **Smart Editing**: Click to edit, click outside to save. New items auto-focus.

### 3. Quick Actions

- **Floating Action Button (FAB)**: Animated speed dial for verifying content.
- **Global Shortcuts**:
  - `1` → Add Question
  - `2` → Add Diagram
  - `3` → Add Markdown Note
- **Settings**: Toggle shortcuts on/off from the header.

### 4. Advanced Rendering

- **LaTeX Math**: Built-in support for block equations (`$$...$$`) and inline math, with auto-detection for `align` environments.
- **Mermaid Diagrams**: Auto-renders flowcharts, sequence diagrams, and more.

### 5. Theming

- **Dark Mode**: Fully responsive dark mode with high-contrast text.
- **Aesthetics**: "Soft" UI with rounded corners (pill-shaped buttons) and smooth framer-motion animations.

## Tech Stack

- **Framework**: React + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Rendering**: react-markdown, remark-math, rehype-katex, mermaid

## getting Started

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Run development server: `npm run dev`
