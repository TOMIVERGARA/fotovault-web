# fotovault  

![beta warning](https://img.shields.io/badge/status-beta-red)

![main](https://raw.githubusercontent.com/TOMIVERGARA/fotovault-web/refs/heads/dev/static/readme-main.png)

Organize and document your analog film rolls with fotovault, a comprehensive tool for managing film formats, tracking development details, and keeping every shot, every roll, every note—all in one place. Built with **SvelteKit** and **Supabase**.

## Features

- 🔐 **Secure Film Roll Storage** – Safely store and document your film rolls using Supabase's authentication and database, ensuring all your analog photography data is well-organized.
- 📁 **Organized Gallery** – Easily manage and categorize your photos.
- 🌐 **Desktop-Only Experience** – Designed exclusively for desktop use, providing the best possible experience for managing film rolls.
- ⚡ **Fast & Lightweight** – Built with SvelteKit for high performance.
- 📸 **Simple Uploads** – Drag and drop or select files to upload seamlessly.

## Tech Stack

- **Frontend:** SvelteKit (Svelte, TypeScript)
- **Backend:** Supabase (Auth, Storage, Database)
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** Supabase Auth (both email and google login)

## Installation

Clone the repository:

```sh
git clone https://github.com/yourusername/fotovault.git
cd fotovault
```

Install dependencies:

```sh
npm install
```

Create a `.env` file and add your Supabase credentials:

```sh
PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"
PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_KEY"
PUBLIC_CF_TURNSTILE_SITE_KEY="YOUR_CF_TURNSTILE_SITE_KEY"
```

Run the development server:

```sh
npm run dev
```

## Deployment

fotovault can be deployed on platforms like **Vercel**, **Netlify** or run locally.

## Contributing

Feel free to fork the repo and submit pull requests! Any contributions to improve security, performance, or features are welcome after review.

## License

MIT License
