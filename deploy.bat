@echo off
echo Starting Firebase deployment process...
echo.

echo Step 1: Building the app...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed! Please check for errors.
    pause
    exit /b 1
)

echo.
echo Step 2: Please run 'firebase login' in a new terminal window
echo Then come back and press any key to continue...
pause

echo.
echo Step 3: Deploying to Firebase Hosting...
firebase deploy --only hosting

echo.
echo Deployment complete! Check the URL provided above.
pause
