# Employee Management System - Frontend

A modern Single Page Application (SPA) built with React (TypeScript) + Vite for managing companies, departments, employees, and users with role-based access control.

![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-6-purple)
![MUI](https://img.shields.io/badge/MUI-6-blue)

---

## 🚀 Features

- **JWT Authentication** – Secure token-based login with auto-refresh  
- **Role-Based Access Control** – System Admin, HR Manager, Employee views  
- **Company Management** – Full CRUD with pagination  
- **Department Management** – Filtered by company with pagination  
- **Employee Management** – Full CRUD with status toggle and days employed  
- **User Management** – Create System Admins and HR Managers  
- **Dashboard** – Real-time analytics and statistics  
- **Employee Profile** – Read-only profile page for employees  
- **Toast Notifications** – User-friendly success and error messages  
- **Multi-Language Ready** – English support with Arabic-ready backend  
- **Responsive UI** – Built with Material UI components  

---

## 📦 Prerequisites

- Node.js v18 or higher  
- npm v9 or higher  
- Docker  
- Docker Compose  
- Backend API running at `http://localhost:8000`
- The app will be available at http://localhost:5173
---

## ⚡ Quick Start (Docker - Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/AdhamMo1/Employee-Management-System-FrontEnd.git

# 2. Go into the project
cd Employee-Management-System-FrontEnd

# 3. Run the app with Docker
docker-compose up --build
