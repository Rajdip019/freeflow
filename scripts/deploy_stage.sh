# Deploy to Vercel stage
# Requires VERCEL_TOKEN to be set in .env.local
eval $(grep '^VERCEL_TOKEN' ./.env.local)
echo "Deploying to stage..."
DEPLOYMENT_URL=$(vercel deploy --token=$VERCEL_TOKEN)
echo "Deployment URL to alias to stage: $DEPLOYMENT_URL"
vercel alias set $DEPLOYMENT_URL freeflow-stage.vercel.app --token=$VERCEL_TOKEN
./node_modules/.bin/vercel deploy --token $VERCEL_TOKEN --debug