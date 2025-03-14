#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🚀 Preparing project for Vercel deployment...\n');

// Ask for backend URL
rl.question('Enter your backend API URL (e.g., https://your-backend.herokuapp.com/api): ', (backendUrl) => {
    if (!backendUrl) {
        console.log('❌ Backend URL is required. Exiting...');
        rl.close();
        return;
    }

    // Update .env.production
    const envPath = path.join(process.cwd(), 'frontend', '.env.production');
    fs.writeFileSync(envPath, `REACT_APP_API_URL=${backendUrl}`);
    console.log(`✅ Updated ${envPath} with API URL: ${backendUrl}`);

    // Check if vercel CLI is installed
    let vercelInstalled = false;
    try {
        execSync('vercel --version', { stdio: 'pipe' });
        vercelInstalled = true;
    } catch (error) {
        console.log('ℹ️ Vercel CLI is not installed. You can install it with: npm i -g vercel');
    }

    console.log('\n📋 Deployment Checklist:');
    console.log('  1. Backend is deployed and accessible at:', backendUrl);
    console.log('  2. Frontend .env.production is updated with the backend URL');
    console.log('  3. CORS is configured on the backend to allow requests from Vercel');

    if (vercelInstalled) {
        rl.question('\nDo you want to deploy to Vercel now? (y/n): ', (answer) => {
            if (answer.toLowerCase() === 'y') {
                console.log('\n🚀 Deploying to Vercel...');
                try {
                    process.chdir(path.join(process.cwd(), 'frontend'));
                    execSync('vercel', { stdio: 'inherit' });
                } catch (error) {
                    console.error('❌ Deployment failed:', error.message);
                }
            } else {
                console.log('\nTo deploy manually:');
                console.log('  1. cd frontend');
                console.log('  2. vercel');
            }
            rl.close();
        });
    } else {
        console.log('\nTo deploy to Vercel:');
        console.log('  1. Install Vercel CLI: npm i -g vercel');
        console.log('  2. cd frontend');
        console.log('  3. vercel');
        rl.close();
    }
}); 