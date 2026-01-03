import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distFolder = path.join(__dirname, 'dist');

console.log('🚀 Starting deployment...');

// 1. Check if dist exists
if (!fs.existsSync(distFolder)) {
  console.error('❌ Error: dist folder not found.');
  console.error('👉 Run "npm run build" before deploying.');
  process.exit(1);
}

try {
  // 2. Get the remote URL
  let remoteUrl;
  try {
    remoteUrl = execSync('git config --get remote.origin.url', { encoding: 'utf8' }).trim();
  } catch (e) {
    console.error('❌ Error: Could not determine remote origin URL. Are you in a git repo?');
    process.exit(1);
  }

  console.log(`📦 Deploying to: ${remoteUrl}`);
  
  // 3. Move to dist folder
  process.chdir(distFolder);

  // 4. CLEANUP: Remove existing .git directory if it exists to ensure a fresh start
  // This fixes the "branch named gh-pages already exists" error
  if (fs.existsSync('.git')) {
    console.log('🧹 Cleaning up previous git record...');
    // Recursive delete for .git folder
    fs.rmSync('.git', { recursive: true, force: true });
  }

  // 5. Initialize temporary git repo
  execSync('git init');
  
  // 6. Create and checkout the branch (using -B to force reset if it somehow still exists)
  execSync('git checkout -B gh-pages');
  
  // 7. Add all files
  console.log('📄 Adding files...');
  execSync('git add -A');

  // 8. Commit
  try {
    execSync('git config user.name "Deploy Bot"');
    execSync('git config user.email "deploy@taxheaven.com"');
  } catch (e) { /* ignore */ }
  
  execSync('git commit -m "Deploy to GitHub Pages"');

  // 9. Push
  console.log('⬆️  Pushing to GitHub Pages...');
  execSync(`git push -f ${remoteUrl} gh-pages`);

  console.log('✅ Deployment successful!');
  console.log('🌍 Your site should be live at your GitHub Pages URL shortly.');

} catch (error) {
  console.error('❌ Deployment failed.');
  console.error(error.message);
  process.exit(1);
}