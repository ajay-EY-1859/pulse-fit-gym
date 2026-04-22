# 🚀 PulseFit Deployment Checklist

## ✅ COMPLETED Preparations:

- [x] Git repository initialized and configured
- [x] All project files committed (47 files, 4880+ lines)
- [x] .gitignore configured (excludes sensitive files)
- [x] Production JWT secret generated
- [x] Deployment configuration files created:
  - `vercel.json` - Vercel frontend config
  - `render.yaml` - Render backend config
  - `production-env-template.txt` - Environment variables template
- [x] README updated with deployment instructions
- [x] GitHub setup script created (`setup-github.bat`)

## 🔄 NEXT STEPS (Manual):

### 1. Create GitHub Repository
- Run `setup-github.bat` or manually create repo on GitHub
- Repository name suggestion: `pulsefit-gym-website`

### 2. Set up MongoDB Atlas
- Go to https://cloud.mongodb.com
- Create free cluster
- Create database user with strong password
- Get connection string: `mongodb+srv://username:password@cluster-url/pulsefit`

### 3. Deploy Backend to Render
- Go to https://render.com
- Create new Web Service
- Connect GitHub repository
- Settings:
  - Root Directory: `backend`
  - Build Command: `npm install`
  - Start Command: `npm start`
- Environment Variables (from `production-env-template.txt`):
  - `PORT=5000`
  - `MONGO_URI=<your-mongodb-atlas-connection-string>`
  - `JWT_SECRET=<generated-production-secret>`
  - `CLIENT_ORIGIN=<temporary-placeholder>`

### 4. Deploy Frontend to Vercel
- Go to https://vercel.com
- Import GitHub repository
- Configure:
  - Root Directory: `.` (root)
  - Build Command: `npm run build`
  - Output Directory: `dist`
- Environment Variable:
  - `VITE_API_URL=https://<your-render-app>.onrender.com/api`

### 5. Update Backend CORS Origin
- After Vercel deployment, get the frontend URL
- Update `CLIENT_ORIGIN` in Render environment variables
- Redeploy backend on Render

### 6. Final Testing
- Test user registration and login
- Test booking functionality
- Verify data persistence across sessions
- Check backend health: `https://<render-app>.onrender.com/api/health`

## 🔐 Security Notes:
- Never commit `.env` files
- Use strong, unique passwords for MongoDB Atlas
- Keep JWT secret secure and random
- Use restricted IP access for MongoDB in production

## 📞 Support:
If you encounter issues, check the deployment logs in Render/Vercel dashboards.