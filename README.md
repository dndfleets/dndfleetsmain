# DND Fleets - Luxury Car Rental

A premium luxury car rental application built with modern web technologies.

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- A Supabase account - [sign up here](https://supabase.com)

### Installation

Follow these steps:

```sh
# Step 1: Navigate to the project directory.
cd dnd-fleets-luxury-drive-main

# Step 2: Install the necessary dependencies.
npm install

# Step 3: Set up Supabase (see Supabase Setup section below)

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

### Supabase Setup

**Important**: This project requires a Supabase database to function. Follow these steps:

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Get your API credentials**:
   - Go to your project → Settings → API
   - Copy your Project URL and anon/public key

3. **Configure environment variables**:
   ```sh
   # Copy the example file
   cp .env.example .env
   
   # Edit .env and add your Supabase credentials:
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Set up the database schema**:
   - Go to SQL Editor in your Supabase dashboard
   - Run the migration files from `supabase/migrations/` in order
   - Or use the Supabase CLI: `supabase db push`

5. **Create the storage bucket**:
   - The migrations should create the `car-images` bucket automatically
   - If not, create it manually in Storage settings and make it public

For detailed instructions, see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build

## Project Structure

- `src/components/` - React components
- `src/pages/` - Page components
- `src/integrations/` - Third-party integrations (Supabase)
- `public/` - Static assets
- `supabase/` - Supabase configuration and migrations
