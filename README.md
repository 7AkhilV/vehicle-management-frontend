# Vehicle Management Dashboard - Frontend

A React-based Single Page Application for managing vehicles with Role-Based Access Control.

## Features

- JWT Authentication with secure cookie storage
- Role-based access (Admin & User)
- User Management (Admin only)
- Vehicle Management (Admin only)
- Vehicle Assignment System
- Responsive design with Tailwind CSS

## Tech Stack

- React 18+ with Vite
- Tailwind CSS
- React Router DOM
- Axios
- js-cookie

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <https://github.com/7AkhilV/vehicle-management-frontend.git>
   cd vehicle-management-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```
   Update `VITE_API_BASE_URL` with your backend API URL

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open browser at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The build files will be in the `dist` directory.

## Demo Credentials

- **Admin:** admin@example.com / admin123
- **User:** john@example.com / password123

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── auth/       # Authentication components
│   ├── common/     # Common UI components
│   └── layout/     # Layout components
├── pages/          # Page components
│   ├── admin/      # Admin pages
│   └── user/       # User pages
├── context/        # React context (Auth)
├── services/       # API service files
├── utils/          # Utility functions
├── hooks/          # Custom React hooks
└── App.jsx         # Main app component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Deployment

This project is configured for Netlify deployment.

## Features by Role

### Admin
- Create, read, update, and delete users
- Create, read, update, and delete vehicles
- Assign and unassign vehicles to users
- View all users and their assigned vehicles

### User
- View own profile
- View assigned vehicles

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000/api` |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
