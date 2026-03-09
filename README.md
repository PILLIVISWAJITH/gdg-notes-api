# GDG Notes Management API

This is a backend API for managing personal notes, built for the GDG on Campus SRM Technical Recruitment 2026. 

## Tech Stack
* **Framework:** Node.js with Express.js
* **Database:** SQLite
* **Authentication:** JSON Web Tokens (JWT) & bcrypt

## Features
* User registration and login.
* Secure password hashing.
* CRUD operations for notes.
* **Role-Based Access Control (RBAC):** Regular users can manage only their own notes. Admin users can view all notes and delete any note.

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/PILLIVISWAJITH/gdg-notes-api.git](https://github.com/PILLIVISWAJITH/gdg-notes-api.git)
   cd gdg-notes-api
