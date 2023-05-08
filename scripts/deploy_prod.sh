# Deploy to Vercel production
# Requires VERCEL_TOKEN to be set in .env.local
eval $(grep '^VERCEL_TOKEN' ./.env.local)
echo "Deploying to production..."
./node_modules/.bin/vercel deploy --prod --token $VERCEL_TOKEN