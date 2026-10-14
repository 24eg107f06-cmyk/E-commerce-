#!/usr/bin/env bash

# =========================================================
# MYSHOP STARTUP SCRIPT
# =========================================================

echo "========================================================="
echo "  🚀 Starting MYSHOP Full-Stack E-Commerce Platform"
echo "========================================================="

# 1. Start Spring Boot Backend in background
echo "[1/2] Launching Spring Boot Backend on http://localhost:8080..."
cd backend || exit
mvn spring-boot:run &
BACKEND_PID=$!
cd ..

# 2. Start React Frontend
echo "[2/2] Launching React Vite Frontend on http://localhost:5173..."
cd frontend || exit
npm run dev &
FRONTEND_PID=$!
cd ..

echo "---------------------------------------------------------"
echo "MYSHOP is starting up!"
echo "Backend:  http://localhost:8080"
echo "Frontend: http://localhost:5173"
echo "Press [Ctrl + C] to stop all services."
echo "---------------------------------------------------------"

trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM EXIT
wait
