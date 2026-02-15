# ContentCraft AI - Development Makefile

.PHONY: help install dev build docker-up docker-down docker-logs clean test lint

# Default target
help:
	@echo "ContentCraft AI - Available Commands"
	@echo "===================================="
	@echo "make install       - Install all dependencies"
	@echo "make dev           - Start development servers"
	@echo "make build         - Build production frontend"
	@echo "make docker-up     - Start all services with Docker"
	@echo "make docker-down   - Stop all Docker services"
	@echo "make docker-logs   - View Docker logs"
	@echo "make clean         - Clean node_modules and build files"
	@echo "make test          - Run tests"
	@echo "make lint          - Run linting"

# Install dependencies
install:
	@echo "Installing backend dependencies..."
	cd backend && npm install
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

# Development mode
dev:
	@echo "Starting development servers..."
	@echo "Backend will run on http://localhost:5000"
	@echo "Frontend will run on http://localhost:3000"
	@make dev-backend & make dev-frontend

dev-backend:
	cd backend && npm run dev

dev-frontend:
	cd frontend && npm run dev

# Production build
build:
	@echo "Building frontend for production..."
	cd frontend && npm run build

# Docker commands
docker-up:
	@echo "Starting Docker services..."
	docker-compose up -d
	@echo "Services started:"
	@echo "  - Frontend: http://localhost:3000"
	@echo "  - Backend API: http://localhost:5000"
	@echo "  - API Docs: http://localhost:5000/api-docs"

docker-down:
	@echo "Stopping Docker services..."
	docker-compose down

docker-logs:
	docker-compose logs -f

docker-build:
	@echo "Rebuilding Docker images..."
	docker-compose up -d --build

# Cleanup
clean:
	@echo "Cleaning up..."
	rm -rf backend/node_modules frontend/node_modules
	rm -rf frontend/dist
	rm -rf backend/logs
	docker-compose down -v

# Testing
test:
	@echo "Running backend tests..."
	cd backend && npm test
	@echo "Running frontend tests..."
	cd frontend && npm test

# Linting
lint:
	@echo "Linting backend..."
	cd backend && npm run lint
	@echo "Linting frontend..."
	cd frontend && npm run lint

# Database
db-seed:
	@echo "Seeding database..."
	cd backend && npm run seed

db-reset:
	@echo "Resetting database..."
	cd backend && npm run db:reset

# Setup
setup:
	@echo "Setting up ContentCraft AI..."
	@make install
	@echo "Creating environment files..."
	@if [ ! -f backend/.env ]; then cp backend/.env.example backend/.env; echo "Created backend/.env - please edit with your API keys"; fi
	@if [ ! -f frontend/.env.local ]; then cp frontend/.env.example frontend/.env.local; echo "Created frontend/.env.local"; fi
	@echo "Setup complete! Run 'make dev' to start development."
