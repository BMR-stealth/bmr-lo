# Loan Officer Portal

A web application for loan officers to manage their clients and loan applications.

## Running with Docker (Recommended)

### Prerequisites
- Docker
- Docker Compose

### Quick Start
1. Clone the repository:
```bash
git clone <repository-url>
cd loan-officer-portal
```

2. Start the application:
```bash
docker-compose up --build
```

3. Create a superuser:
```bash
docker-compose exec backend python manage.py createsuperuser
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Admin Interface: http://localhost:8000/admin

### Docker Commands
- Start the application: `docker-compose up`
- Stop the application: `docker-compose down`
- View logs: `docker-compose logs`
- Rebuild containers: `docker-compose up --build`
- Run migrations: `docker-compose exec backend python manage.py migrate`
- Create superuser: `docker-compose exec backend python manage.py createsuperuser`

## Running Locally (Alternative)

### Prerequisites
- Python 3.13 or higher
- Node.js 18 or higher
- PostgreSQL 17
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd loan-officer-portal
```

### 2. Backend Setup

1. Create a Python virtual environment:
```bash
cd loan-officer-backend
python -m venv venv
```

2. Activate the virtual environment:
- On Windows:
```bash
venv\Scripts\activate
```
- On macOS/Linux:
```bash
source venv/bin/activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Create a .env file in the loan-officer-backend directory:
```
DEBUG=True
SECRET_KEY='django-insecure-your-secret-key-here'
DB_NAME=loan_officer_db
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ORIGIN_WHITELIST=http://localhost:3000
```

5. Set up the PostgreSQL database:
```bash
createdb loan_officer_db
```

6. Run migrations:
```bash
python manage.py migrate
```

7. Create a superuser:
```bash
python manage.py createsuperuser
```

8. Start the Django development server:
```bash
python manage.py runserver
```

### 3. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd ../loan-officer-portal
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Accessing the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Admin Interface: http://localhost:8000/admin

## Default Ports
- Frontend: 3000
- Backend: 8000
- PostgreSQL: 5432

## Common Issues and Solutions

1. Database Connection Error:
   - Make sure PostgreSQL is running
   - Check your database credentials in .env file
   - Verify the port number (default is 5432)

2. CORS Issues:
   - Ensure the frontend URL is listed in CORS_ORIGIN_WHITELIST
   - Check if the backend is running on the correct port

3. Authentication Issues:
   - Clear browser cookies and local storage
   - Make sure you're using the correct credentials
   - Verify the superuser was created successfully

## Development Notes

- The backend uses Django REST framework for the API
- The frontend is built with Next.js and TypeScript
- Authentication is handled via Django's session-based auth
- All API endpoints require CSRF tokens for non-GET requests

## Required Python Packages
```
django==5.1.3
djangorestframework==3.14.0
django-cors-headers==4.3.1
psycopg2-binary==2.9.9
python-dotenv==1.0.0
django-allauth==0.58.2
```

## Required Node.js Packages
```
next
react
react-dom
@tanstack/react-query
axios
typescript
tailwindcss
``` 