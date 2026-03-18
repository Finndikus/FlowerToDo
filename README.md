# Flower To-Do 🌸

Flower To-Do is a powerful, minimalist task management application designed for organized minds. It offers a clean, aesthetic interface with advanced features like infinite nesting and automatic database syncing.

<img width="1478" height="840" alt="image" src="https://github.com/user-attachments/assets/6b8f8132-02f1-445b-8398-61b49aa80dca" />


## Core Functionality

- **🌸 Aesthetic Design**: A premium, "Glass Cockpit" inspired UI with smooth transitions and a focus on visual excellence.
- **📂 Infinite Task Nesting**: Break down complex goals into manageable sub-tasks without any depth limits.
- **🔄 Auto-Sync & Debounced Save**: Your changes are automatically saved to a local JSON database. The application use a debounced mechanism to ensure performance while maintaining data integrity.
- **🏆 Score Tracking**: gamify your productivity with an integrated score system that rewards task completion.
- **✨ Rich Text Support**: Add detailed descriptions to your tasks using a clean, Tiptap-powered editor.
- **🎯 Drag & Drop**: Easily reorganize your workflow with intuitive drag-and-drop support for tasks and sub-tasks.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Fluxtruth/FlowerToDo.git
   cd FlowerToDo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

To start the development server:

```bash
npm run dev
```

To run the development server in your local network (e.g., for testing on mobile devices), use:

```bash
npx next dev -H 192.168.188.100 -p 3000
```

Open [http://localhost:3000](http://localhost:3000) or `http://192.168.188.100:3000` with your browser to see the result.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **Styling**: Tailwind CSS & Vanilla CSS
- **Components**: Radix UI & Shadcn/UI
- **Editor**: [Tiptap](https://tiptap.dev/)
- **Drag & Drop**: [@dnd-kit](https://dnd-kit.com/)
- **Animation**: [Canvas Confetti](https://github.com/catdad/canvas-confetti)

## CI/CD Pipeline

The project uses a staged GitHub Actions pipeline that follows a **fail-fast** pattern.

```
push / pull_request
        │
        ▼
┌─────────────────────────────────────┐
│ Stage 1 – GATE CHECK  ❌ (Blocking) │
│  • npm audit --production           │
│  • npm run build                    │
└──────────────┬──────────────────────┘
               │ passes
       ┌───────┴────────┐
       ▼                ▼
┌─────────────┐  ┌──────────────────┐
│ Stage 2     │  │ Stage 3          │
│ QUALITY ⚠️  │  │ UNIT TESTS 📊    │
│ (Non-block) │  │ (Blocking)       │
│ • ESLint    │  │ • vitest run     │
│ • tsc check │  │ • coverage report│
└─────────────┘  └──────────────────┘
                         │ passes (on main)
                         ▼
               ┌──────────────────┐
               │ Stage 4 – DEPLOY │
               │ 🚀 Vercel CLI    │
               └──────────────────┘
```

### Workflows

| File | Purpose | Trigger |
|------|---------|---------|
| `ci.yml` | Main pipeline (Stages 1–3) | Every push & PR |
| `e2e.yml` | Optional Playwright E2E tests | Manual dispatch or `e2e` label on PR |
| `deploy.yml` | Production deployment to Vercel | After `CI Pipeline` succeeds on `main` |
| `pre-commit-check.yml` | Simulate pre-commit hook in CI | Manual dispatch |

### Local pre-commit hook (Husky)

After cloning and running `npm install`, a Git pre-commit hook is automatically installed via Husky. It prevents you from committing code that doesn't build:

```bash
npm install        # also runs `husky` via the prepare script
```

Every `git commit` will now run `npm run build` first and abort if the build fails.

### Required secrets for deployment

Add the following secrets to your GitHub repository settings before the deploy workflow will work:

| Secret | Description |
|--------|-------------|
| `VERCEL_TOKEN` | Vercel personal access token |
| `VERCEL_ORG_ID` | Vercel organisation / team ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |

### Available scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests (Vitest) |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.
