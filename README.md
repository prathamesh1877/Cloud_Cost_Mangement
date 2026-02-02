# Cloud Cost Management Application

A cloud cost management dashboard built with React, Vite, and Tailwind CSS for tracking spending, managing resources, and analyzing usage patterns.

## 🎯 Features

- User authentication with JWT and role-based access control (Admin, Manager, User)
- Dashboard with spending overview and metrics
- Cost analytics with spending trends and breakdowns
- Cloud storage management and monitoring
- User and department management
- Interactive charts using Recharts
- Responsive design with Tailwind CSS

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run mock API server (optional)
npm run json-server
```

Available at `http://localhost:5173`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run json-server` - Start JSON mock API server (port 3000)

## 🔐 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@cloudcost.com | admin123 |
| Manager | manager@cloudcost.com | manager123 |
| User | user@cloudcost.com | user123 |

## 📁 Project Structure

```
src/
├── components/     # Reusable React components
├── pages/         # Page components
├── context/       # Auth context
├── services/      # API services
├── utils/         # Utility functions
└── assets/        # Static assets
jsondata/api.json  # Mock API data
```

## 🛠️ Tech Stack

- **React 19** - UI library
- **Vite 7** - Build tool
- **Tailwind CSS 4** - Styling
- **React Router 7** - Routing
- **Recharts** - Charts & visualization
- **Axios** - HTTP client
- **JWT Decode** - Token handling

## 📚 Key Components

- **AuthContext** - Authentication state management
- **ProtectedRoute** - Route protection with auth check
- **RoleBasedUI** - Conditional rendering by user role
- **CloudDashboard** - Main dashboard with stats & charts
- **Analytics** - Usage metrics and trends

## 🚧 Future Work

See [TODO.md](TODO.md) for planned enhancements.

---

**Last Updated**: December 2025
