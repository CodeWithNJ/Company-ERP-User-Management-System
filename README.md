# Company ERP - User Management System

This repository contains the backend service for managing **companies, users, and roles** in a multi-tenant ERP platform.  
It provides secure APIs for **authentication, role-based access control, and user management**.

---

## 🚀 Features

- ✅ Multi-tenant company support
- ✅ Role-based access control (CA, SM, FM)
- ✅ JWT-based authentication with refresh tokens
- ✅ MySQL database with Prisma ORM
- ✅ Modular Express.js structure

---

## 🛠️ Tech Stack

- **Node.js + Express.js**
- **Prisma ORM**
- **MySQL**
- **JWT Authentication**
- **Dotenv for environment variables**

---

## 📦 Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/CodeWithNJ/Company-ERP-User-Management-System.git
   cd Company-ERP-User-Management-System
2. **Install Dependencies**
   ```bash
   npm install
3. **Create a .env File using the .env.sample file**
4. **Setup the Database**

   Make sure MySQL is running, then run:
    ```bash
   npx prisma migrate dev --name init
6. **Generate Prisma Client**
   Make sure MySQL is running, then run:
    ```bash
   npx prisma generate

## 📦 Running the Project

1. **Development Mode**
   ```bash
   npm run dev
