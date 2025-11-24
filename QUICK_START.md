# Quick Start Deployment Guide

This is a simplified guide to get your BookPage2Blog application deployed quickly.

## Fastest Path: Railway + Vercel (< 30 minutes)

### Step 1: Deploy Backend to Railway (10 minutes)

1. **Sign up at [railway.app](https://railway.app)** with GitHub

2. **Create new project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `bookPage2Blog-backend`

3. **Add PostgreSQL**:
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway automatically sets `DATABASE_URL`

4. **Add environment variables**:
   ```
   SECRET_KEY=<generate-random-string-here>
   DEBUG=False
   ALLOWED_HOSTS=bookpost-backend-production.up.railway.app
   CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
   GEMINI_API_KEY=<your-gemini-key>
   USE_S3=False
   ```

5. **Deploy**:
   - Railway auto-deploys on push
   - Copy your backend URL (e.g., `https://bookpost-backend-production.up.railway.app`)

### Step 2: Deploy Frontend to Vercel (10 minutes)

1. **Sign up at [vercel.com](https://vercel.com)** with GitHub

2. **Import project**:
   - Click "New Project"
   - Import `bookPage2Blog` from GitHub

3. **Configure**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Add environment variables**:
   ```
   VITE_BACKEND_URL=https://your-railway-backend.railway.app
   VITE_GEMINI_API_KEY=your-gemini-key
   ```

5. **Deploy**:
   - Click "Deploy"
   - Your app will be live at `https://your-app.vercel.app`

### Step 3: Update CORS Settings (2 minutes)

1. Go back to Railway
2. Update `CORS_ALLOWED_ORIGINS` to your Vercel URL
3. Redeploy

### Done! 🎉

Your app is now live and accessible worldwide!

---

## Alternative: AWS Deployment (Production-Grade)

For a more robust, scalable solution, follow the complete guide in `DEPLOYMENT.md`.

**AWS Setup includes**:
- AWS ECS Fargate for containerized backend
- AWS RDS PostgreSQL for database
- AWS S3 for image storage
- AWS Application Load Balancer
- Auto-scaling and high availability

**Time estimate**: 2-4 hours
**Cost**: ~$60-80/month
**Benefits**: Enterprise-grade, highly scalable, full control

---

## Environment Variable Generation

### SECRET_KEY (Django)
```python
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Or use this one-liner:
```bash
openssl rand -base64 50
```

---

## Testing Deployment

1. **Backend health check**:
   ```bash
   curl https://your-backend-url.com/api/posts/
   ```

2. **Frontend access**:
   - Visit your Vercel URL
   - Try uploading an image
   - Test text selection and underlining

---

## Troubleshooting

### Backend won't start
- Check Railway logs: Project → Deployments → View Logs
- Verify all environment variables are set
- Ensure `DATABASE_URL` is automatically set by Railway

### Frontend can't reach backend
- Verify `VITE_BACKEND_URL` in Vercel
- Check CORS settings in Railway
- Test backend API directly with curl

### Database connection error
- Railway automatically provides `DATABASE_URL`
- Ensure PostgreSQL service is running in Railway
- Check network connectivity

---

## Next Steps

1. **Set up custom domain** (optional):
   - Vercel: Project Settings → Domains
   - Railway: Project Settings → Networking

2. **Enable monitoring**:
   - Railway: Built-in metrics
   - Vercel: Analytics dashboard

3. **Add AWS S3 for image storage**:
   - Create S3 bucket
   - Add AWS credentials to Railway
   - Set `USE_S3=True`

4. **Set up CI/CD**:
   - GitHub Actions workflows already created
   - Add secrets in GitHub repo settings

---

## Cost Breakdown (Railway + Vercel)

- **Railway Hobby**: $5/month
- **Vercel Free**: $0/month
- **AWS S3** (optional): ~$1-5/month

**Total: $5-10/month** for MVP/testing

---

## Support

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Full deployment guide: See `DEPLOYMENT.md`
