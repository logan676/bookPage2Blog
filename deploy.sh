#!/bin/bash

# BookPage2Blog Deployment Helper Script
# This script helps automate deployment tasks

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}BookPage2Blog Deployment Helper${NC}"
echo "=================================="
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "Checking prerequisites..."

if ! command_exists git; then
    echo -e "${RED}✗ Git is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Git installed${NC}"

if ! command_exists node; then
    echo -e "${RED}✗ Node.js is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js installed${NC}"

if ! command_exists npm; then
    echo -e "${RED}✗ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm installed${NC}"

echo ""

# Menu
echo "What would you like to do?"
echo "1) Setup GitHub repositories"
echo "2) Deploy frontend to Vercel"
echo "3) Test frontend build"
echo "4) Generate Django SECRET_KEY"
echo "5) Check deployment status"
echo "6) View deployment guides"
echo "0) Exit"
echo ""
read -p "Enter your choice [0-6]: " choice

case $choice in
    1)
        echo ""
        echo -e "${YELLOW}Setting up GitHub repositories...${NC}"
        echo ""

        if ! command_exists gh; then
            echo -e "${RED}GitHub CLI (gh) is not installed.${NC}"
            echo "Install it from: https://cli.github.com/"
            exit 1
        fi

        read -p "Create repository for frontend? (y/n): " create_fe
        if [ "$create_fe" = "y" ]; then
            echo "Creating frontend repository..."
            cd ~/Documents/bookPage2Blog
            if [ ! -d .git ]; then
                git init
                git add .
                git commit -m "Initial commit: BookPage2Blog frontend"
            fi
            gh repo create bookPage2Blog --public --source=. --remote=origin --push || echo "Repository might already exist"
        fi

        read -p "Create repository for backend? (y/n): " create_be
        if [ "$create_be" = "y" ]; then
            echo "Creating backend repository..."
            cd ~/Documents/bookPage2Blog-backend
            if [ ! -d .git ]; then
                git init
                git add .
                git commit -m "Initial commit: BookPage2Blog backend"
            fi
            gh repo create bookPage2Blog-backend --public --source=. --remote=origin --push || echo "Repository might already exist"
        fi

        echo -e "${GREEN}✓ Done!${NC}"
        ;;

    2)
        echo ""
        echo -e "${YELLOW}Deploying frontend to Vercel...${NC}"
        echo ""

        if ! command_exists vercel; then
            echo "Installing Vercel CLI..."
            npm install -g vercel
        fi

        cd ~/Documents/bookPage2Blog

        echo "Starting Vercel deployment..."
        vercel --prod

        echo -e "${GREEN}✓ Deployment complete!${NC}"
        echo "Don't forget to set environment variables in Vercel dashboard:"
        echo "  - VITE_BACKEND_URL"
        echo "  - VITE_GEMINI_API_KEY"
        ;;

    3)
        echo ""
        echo -e "${YELLOW}Testing frontend build...${NC}"
        echo ""

        cd ~/Documents/bookPage2Blog

        echo "Installing dependencies..."
        npm install

        echo "Building..."
        npm run build

        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ Build successful!${NC}"
            echo "Preview build with: npm run preview"
        else
            echo -e "${RED}✗ Build failed${NC}"
            exit 1
        fi
        ;;

    4)
        echo ""
        echo "Generating Django SECRET_KEY..."
        echo ""

        if command_exists python3; then
            python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
        elif command_exists openssl; then
            openssl rand -base64 50
        else
            echo -e "${RED}Neither Python nor OpenSSL found.${NC}"
            echo "Please install one of them to generate a secret key."
        fi
        ;;

    5)
        echo ""
        echo -e "${YELLOW}Checking deployment status...${NC}"
        echo ""

        echo "Frontend (local):"
        if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
            echo -e "${GREEN}✓ Running on http://localhost:3001${NC}"
        else
            echo -e "${YELLOW}⚠ Not running${NC}"
        fi

        echo ""
        echo "Backend (local):"
        if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
            echo -e "${GREEN}✓ Running on http://localhost:8000${NC}"
        else
            echo -e "${YELLOW}⚠ Not running${NC}"
        fi

        echo ""
        echo "GitHub repositories:"
        if command_exists gh; then
            echo "Frontend: $(gh repo view bookPage2Blog --json url -q .url 2>/dev/null || echo 'Not found')"
            echo "Backend: $(gh repo view bookPage2Blog-backend --json url -q .url 2>/dev/null || echo 'Not found')"
        else
            echo "Install GitHub CLI to check: https://cli.github.com/"
        fi
        ;;

    6)
        echo ""
        echo -e "${YELLOW}Available deployment guides:${NC}"
        echo ""
        echo "1. QUICK_START.md - Fast 30-minute deployment (Railway + Vercel)"
        echo "2. DEPLOYMENT.md - Complete deployment guide (all options)"
        echo "3. DEPLOYMENT_SUMMARY.md - Overview and comparison"
        echo ""
        read -p "Open which guide? (1-3, 0 to skip): " guide_choice

        case $guide_choice in
            1) open ~/Documents/bookPage2Blog/QUICK_START.md 2>/dev/null || cat ~/Documents/bookPage2Blog/QUICK_START.md ;;
            2) open ~/Documents/bookPage2Blog/DEPLOYMENT.md 2>/dev/null || cat ~/Documents/bookPage2Blog/DEPLOYMENT.md ;;
            3) open ~/Documents/bookPage2Blog/DEPLOYMENT_SUMMARY.md 2>/dev/null || cat ~/Documents/bookPage2Blog/DEPLOYMENT_SUMMARY.md ;;
            *) echo "Skipping..." ;;
        esac
        ;;

    0)
        echo "Exiting..."
        exit 0
        ;;

    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}All done! 🎉${NC}"
