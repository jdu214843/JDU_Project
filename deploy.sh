#!/bin/bash

echo "🚀 Starting production deployment..."

# Check if required files exist
if [ ! -f "client/package.json" ] || [ ! -f "server/package.json" ]; then
    echo "❌ Error: package.json files not found!"
    exit 1
fi

# Build client
echo "📦 Building client..."
cd client
if [ -f ".env.production" ]; then
    echo "✅ Using production environment"
    cp .env.production .env
else
    echo "⚠️  Warning: .env.production not found. Create from .env.production.example"
fi
npm ci
npm run build
cd ..

# Copy client build to server public directory
echo "📁 Copying build files..."
rm -rf server/public
mkdir -p server/public
cp -r client/dist/* server/public/

# Set up server for production
echo "🔧 Setting up server..."
cd server
if [ -f ".env.production" ]; then
    echo "✅ Using production environment"
    cp .env.production .env
else
    echo "⚠️  Warning: .env.production not found. Create from .env.production.example"
fi
npm ci --production
cd ..

echo "✅ Build completed!"
echo ""
echo "📋 Next steps:"
echo "1. Set up your PostgreSQL database"
echo "2. Update DATABASE_URL in server/.env"
echo "3. Run migrations: cd server && npm run migrate"
echo "4. Deploy to your chosen platform:"
echo "   • Vercel: vercel --prod"
echo "   • Railway: railway up"
echo "   • Docker: docker build -t ecosoil . && docker run -p 4000:4000 ecosoil"
echo ""
echo "🌐 Your app will be available at the deployed URL!"
