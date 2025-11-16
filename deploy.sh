#!/bin/bash

# PartyPilot Automated Deployment Script
# This script automates the deployment of PartyPilot to Railway and Vercel

set -e  # Exit on error

echo "🚀 PartyPilot Deployment Script"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if required tools are installed
print_info "Checking prerequisites..."

if ! command -v railway &> /dev/null; then
    print_warning "Railway CLI not found. Install with: npm install -g railway"
    RAILWAY_AVAILABLE=false
else
    print_success "Railway CLI installed"
    RAILWAY_AVAILABLE=true
fi

if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Install with: npm install -g vercel"
    VERCEL_AVAILABLE=false
else
    print_success "Vercel CLI installed"
    VERCEL_AVAILABLE=true
fi

echo ""
print_info "Deployment Options:"
echo "1. Deploy Backend to Railway (recommended)"
echo "2. Deploy Backend to Render (via web interface)"
echo "3. Deploy Frontend to Vercel"
echo "4. Full deployment (Railway + Vercel)"
echo "5. Manual deployment instructions"
echo ""

read -p "Select option (1-5): " DEPLOY_OPTION

case $DEPLOY_OPTION in
    1)
        if [ "$RAILWAY_AVAILABLE" = false ]; then
            print_error "Railway CLI not installed"
            exit 1
        fi

        print_info "Deploying backend to Railway..."
        echo ""
        print_warning "You will need to authenticate with Railway"
        print_warning "You will need to provide:"
        echo "  - OPENAI_API_KEY"
        echo "  - PostgreSQL database"
        echo ""

        read -p "Continue? (y/n): " CONTINUE
        if [ "$CONTINUE" != "y" ]; then
            print_error "Deployment cancelled"
            exit 0
        fi

        # Railway login
        print_info "Logging into Railway..."
        railway login

        # Create new project
        print_info "Creating Railway project..."
        railway init

        # Add PostgreSQL
        print_info "Adding PostgreSQL database..."
        print_warning "Run this command in Railway dashboard: Add PostgreSQL plugin"
        echo "Visit: https://railway.app/dashboard"
        read -p "Press Enter when PostgreSQL is added..."

        # Set environment variables
        print_info "Setting environment variables..."

        JWT_SECRET=$(openssl rand -base64 32)
        echo ""
        print_success "Generated JWT_SECRET: $JWT_SECRET"

        railway variables set JWT_SECRET="$JWT_SECRET"
        railway variables set NODE_ENV=production
        railway variables set PORT=3001
        railway variables set LOG_LEVEL=info

        echo ""
        print_warning "Please provide your OpenAI API key:"
        read -sp "OPENAI_API_KEY: " OPENAI_KEY
        echo ""
        railway variables set OPENAI_API_KEY="$OPENAI_KEY"

        print_info "Note: You'll need to set CORS_ORIGIN and APP_URL after deploying frontend"

        # Deploy
        print_info "Deploying to Railway..."
        railway up

        print_success "Backend deployed to Railway!"
        echo ""
        print_info "Get your API URL:"
        echo "  railway status"
        echo ""
        ;;

    2)
        print_info "Deploying backend to Render..."
        echo ""
        print_success "Follow these steps:"
        echo "1. Visit: https://render.com/"
        echo "2. Click 'New' → 'Blueprint'"
        echo "3. Connect GitHub: ehudso7/PartyPilot"
        echo "4. Render will auto-detect render.yaml"
        echo "5. Set environment variables:"
        echo "   - OPENAI_API_KEY"
        echo "   - CORS_ORIGIN (your Vercel URL)"
        echo "   - APP_URL (your Vercel URL)"
        echo "6. Deploy!"
        echo ""
        print_info "Opening Render in browser..."
        echo "URL: https://render.com/"
        ;;

    3)
        if [ "$VERCEL_AVAILABLE" = false ]; then
            print_error "Vercel CLI not installed"
            exit 1
        fi

        print_info "Deploying frontend to Vercel..."
        echo ""
        print_warning "You will need to authenticate with Vercel"
        echo ""

        read -p "Continue? (y/n): " CONTINUE
        if [ "$CONTINUE" != "y" ]; then
            print_error "Deployment cancelled"
            exit 0
        fi

        # Vercel login
        print_info "Logging into Vercel..."
        vercel login

        # Deploy
        print_info "Deploying to Vercel..."
        cd apps/web
        vercel --prod

        print_success "Frontend deployed to Vercel!"
        echo ""
        print_warning "Don't forget to:"
        echo "1. Set NEXT_PUBLIC_API_URL in Vercel environment variables"
        echo "2. Set root directory to 'apps/web' in Vercel project settings"
        echo ""
        ;;

    4)
        print_info "Full deployment starting..."
        echo ""
        print_warning "This will deploy both backend (Railway) and frontend (Vercel)"
        echo ""

        if [ "$RAILWAY_AVAILABLE" = false ] || [ "$VERCEL_AVAILABLE" = false ]; then
            print_error "Both Railway and Vercel CLIs must be installed"
            exit 1
        fi

        # Deploy backend first
        $0 1

        echo ""
        print_info "Backend deployed. Now deploying frontend..."
        sleep 2

        # Deploy frontend
        $0 3

        print_success "Full deployment complete!"
        ;;

    5)
        print_info "Manual Deployment Instructions"
        echo ""
        print_success "Backend Deployment (Railway - Recommended):"
        echo "1. Visit: https://railway.app/new"
        echo "2. Click 'Deploy from GitHub repo'"
        echo "3. Select: ehudso7/PartyPilot"
        echo "4. Railway will detect railway.json ✅"
        echo "5. Add PostgreSQL database (click + New → Database → PostgreSQL)"
        echo "6. Set environment variables:"
        echo "   - JWT_SECRET=$(openssl rand -base64 32)"
        echo "   - OPENAI_API_KEY=sk-..."
        echo "   - NODE_ENV=production"
        echo "   - PORT=3001"
        echo "   - CORS_ORIGIN=https://your-vercel-url.vercel.app"
        echo "   - APP_URL=https://your-vercel-url.vercel.app"
        echo "   - LOG_LEVEL=info"
        echo "7. Deploy!"
        echo ""
        print_success "Frontend Deployment (Vercel):"
        echo "1. Visit: https://vercel.com/new"
        echo "2. Import Git Repository: ehudso7/PartyPilot"
        echo "3. Set Root Directory: apps/web"
        echo "4. Set environment variable:"
        echo "   - NEXT_PUBLIC_API_URL=https://your-railway-url.railway.app"
        echo "5. Deploy!"
        echo ""
        print_success "Alternative: Render (Backend):"
        echo "1. Visit: https://render.com/"
        echo "2. Click 'New' → 'Blueprint'"
        echo "3. Connect: ehudso7/PartyPilot"
        echo "4. Render auto-detects render.yaml ✅"
        echo "5. Set missing env vars (OPENAI_API_KEY, CORS_ORIGIN, APP_URL)"
        echo "6. Deploy!"
        echo ""
        print_info "For detailed instructions, see:"
        echo "  - LAUNCH_INSTRUCTIONS.md"
        echo "  - DEPLOYMENT_COMPLETE_GUIDE.md"
        echo ""
        ;;

    *)
        print_error "Invalid option"
        exit 1
        ;;
esac

echo ""
print_success "Deployment process complete!"
print_info "Next steps:"
echo "1. Test API health: curl https://your-api-url/health"
echo "2. Test frontend: Visit https://your-frontend-url"
echo "3. Update CORS settings if needed"
echo "4. Monitor logs in Railway/Vercel dashboard"
echo ""
