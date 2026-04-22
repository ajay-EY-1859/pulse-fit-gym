@echo off
echo Setting up GitHub repository for PulseFit Gym Website...
echo.

echo Step 1: Create a new repository on GitHub
echo - Go to https://github.com/new
echo - Repository name: pulsefit-gym-website
echo - Make it public or private as preferred
echo - DO NOT initialize with README, .gitignore, or license
echo - Click "Create repository"
echo.
pause

echo Step 2: Add GitHub remote and push
set /p repo_url="Enter your GitHub repository URL: "
git remote add origin %repo_url%
git branch -M main
git push -u origin main

echo.
echo ✅ Repository setup complete!
echo Your PulseFit gym website is now ready for deployment.
echo.
echo Next steps:
echo 1. Set up MongoDB Atlas (see DEPLOYMENT_STEPS.md)
echo 2. Deploy backend to Render
echo 3. Deploy frontend to Vercel
echo.
pause