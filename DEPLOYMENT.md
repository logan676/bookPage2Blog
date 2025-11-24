# BookPage2Blog - Complete Deployment Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         USER                                 │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼──────┐          ┌──────▼────────┐
│   VERCEL     │          │   AWS ALB     │
│  (Frontend)  │          │ (Load Balancer)│
└───────┬──────┘          └──────┬────────┘
        │                        │
        │                 ┌──────▼────────┐
        │                 │  AWS ECS/EC2  │
        │                 │  (Django API)  │
        │                 └──────┬────────┘
        │                        │
        └────────API Calls───────┘
                                 │
                   ┌─────────────┼─────────────┐
                   │             │             │
            ┌──────▼─────┐ ┌────▼─────┐ ┌────▼─────┐
            │  AWS RDS   │ │  AWS S3  │ │  Gemini  │
            │(PostgreSQL)│ │ (Images) │ │   API    │
            └────────────┘ └──────────┘ └──────────┘
```

---

## Option 1: Production-Ready Deployment (Recommended)

### Frontend: Vercel
- **Service**: Vercel
- **Features**:
  - Automatic deployments from GitHub
  - Edge CDN for global performance
  - Automatic HTTPS/SSL
  - Zero-downtime deployments
  - Preview deployments for PRs

### Backend: AWS ECS Fargate + RDS
- **Service**: AWS ECS Fargate (Serverless containers)
- **Database**: AWS RDS PostgreSQL
- **Storage**: AWS S3 for images
- **Load Balancer**: AWS Application Load Balancer
- **Features**:
  - Auto-scaling based on traffic
  - Managed infrastructure
  - High availability across multiple AZs
  - No server management

### Estimated Monthly Cost:
- Vercel: Free tier (Pro: $20/month)
- AWS ECS Fargate: ~$25-40/month (1 task)
- RDS PostgreSQL (db.t3.micro): ~$15/month
- S3 Storage: ~$1-5/month
- ALB: ~$16/month
- **Total: ~$60-100/month**

---

## Option 2: Cost-Optimized Deployment

### Frontend: Vercel (same)

### Backend: AWS EC2 + RDS
- **Service**: Single AWS EC2 t3.micro instance
- **Database**: AWS RDS PostgreSQL (db.t3.micro)
- **Storage**: AWS S3
- **Features**:
  - More control over server
  - Lower cost for low traffic
  - Requires manual scaling

### Estimated Monthly Cost:
- Vercel: Free tier
- EC2 t3.micro: ~$8/month
- RDS db.t3.micro: ~$15/month
- S3 Storage: ~$1-5/month
- **Total: ~$25-30/month**

---

## Option 3: Rapid Prototyping / MVP

### Frontend: Vercel (same)

### Backend: Railway or Render
- **Service**: Railway.app or Render.com
- **Database**: Included PostgreSQL
- **Storage**: AWS S3 (or Cloudinary)
- **Features**:
  - Fastest setup (< 10 minutes)
  - Built-in CI/CD
  - Automatic SSL
  - Great for MVPs

### Estimated Monthly Cost:
- Vercel: Free tier
- Railway: $5/month (Hobby) or $20/month (Pro)
- S3 Storage: ~$1-5/month
- **Total: ~$6-25/month**

---

## Deployment Steps

### Phase 1: GitHub Setup

#### 1.1 Initialize Git Repositories
```bash
# Frontend
cd ~/Documents/bookPage2Blog
git init
git add .
git commit -m "Initial commit: BookPage2Blog frontend"

# Create GitHub repo and push
gh repo create bookPage2Blog --public --source=. --remote=origin --push

# Backend
cd ~/Documents/bookPage2Blog-backend
git init
git add .
git commit -m "Initial commit: BookPage2Blog backend"
gh repo create bookPage2Blog-backend --public --source=. --remote=origin --push
```

#### 1.2 Add .gitignore files
Frontend: Already has .gitignore for node_modules, .env, etc.
Backend: Ensure db.sqlite3, venv/, .env are ignored

---

### Phase 2: Frontend Deployment to Vercel

#### 2.1 Prepare Frontend
```bash
cd ~/Documents/bookPage2Blog

# Add environment variable configuration
cat > .env.production << EOF
VITE_BACKEND_URL=https://your-backend-url.com
VITE_GEMINI_API_KEY=your-gemini-key
EOF

# Add to .gitignore
echo ".env.production" >> .gitignore
```

#### 2.2 Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts:
# - Link to existing project or create new
# - Set project name: bookpage2blog
# - Framework preset: Vite
# - Build command: npm run build
# - Output directory: dist
```

#### 2.3 Configure Environment Variables in Vercel
In Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add:
   - `VITE_BACKEND_URL`: Your backend API URL
   - `VITE_GEMINI_API_KEY`: Your Gemini API key
3. Redeploy

#### 2.4 Set up Custom Domain (Optional)
1. Vercel Dashboard → Domains
2. Add custom domain (e.g., bookpage2blog.com)
3. Update DNS records as instructed

---

### Phase 3: Backend Deployment to AWS

#### Option 3A: AWS ECS Fargate (Recommended for Production)

**Prerequisites:**
- AWS Account
- AWS CLI installed and configured
- Docker installed

**3A.1 Create Dockerfile**
```dockerfile
# ~/Documents/bookPage2Blog-backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copy application
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

# Run migrations and start server
CMD ["sh", "-c", "python manage.py migrate && gunicorn bookpost_project.wsgi:application --bind 0.0.0.0:8000"]

EXPOSE 8000
```

**3A.2 Create docker-compose.yml for local testing**
```yaml
# ~/Documents/bookPage2Blog-backend/docker-compose.yml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DEBUG=False
      - SECRET_KEY=${SECRET_KEY}
      - DATABASE_URL=${DATABASE_URL}
      - ALLOWED_HOSTS=*
      - CORS_ALLOWED_ORIGINS=${CORS_ALLOWED_ORIGINS}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - USE_S3=True
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
      - AWS_STORAGE_BUCKET_NAME=${AWS_STORAGE_BUCKET_NAME}
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=bookpost
      - POSTGRES_USER=bookpost
      - POSTGRES_PASSWORD=changeme
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**3A.3 Set up AWS Infrastructure**

```bash
# Install AWS CLI
brew install awscli  # macOS
# or: pip install awscli

# Configure AWS credentials
aws configure
# Enter: Access Key ID, Secret Access Key, Region (e.g., us-east-1)

# Create RDS PostgreSQL database
aws rds create-db-instance \
    --db-instance-identifier bookpost-db \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --engine-version 15.3 \
    --master-username bookpost \
    --master-user-password CHANGE_THIS_PASSWORD \
    --allocated-storage 20 \
    --vpc-security-group-ids sg-xxxxx \
    --backup-retention-period 7 \
    --no-publicly-accessible

# Create S3 bucket for media files
aws s3 mb s3://bookpost-media-files --region us-east-1

# Set bucket policy for public read
aws s3api put-bucket-policy --bucket bookpost-media-files --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicRead",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::bookpost-media-files/*"
    }
  ]
}'

# Create ECR repository for Docker images
aws ecr create-repository --repository-name bookpost-backend

# Get ECR login command
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and push Docker image
cd ~/Documents/bookPage2Blog-backend
docker build -t bookpost-backend .
docker tag bookpost-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/bookpost-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/bookpost-backend:latest
```

**3A.4 Create ECS Cluster and Task Definition**

Use AWS Console or CLI to create:
1. ECS Cluster (Fargate type)
2. Task Definition with:
   - Image: Your ECR image URI
   - CPU: 256 (.25 vCPU)
   - Memory: 512 MB
   - Environment variables (from Secrets Manager)
3. Service with:
   - Desired tasks: 1 (or more for HA)
   - Load balancer: Application Load Balancer
   - Auto-scaling: Optional

**3A.5 Update Django settings for production**
```python
# Add to settings.py
import dj_database_url

if not DEBUG:
    # Use DATABASE_URL environment variable
    DATABASES['default'] = dj_database_url.config(conn_max_age=600)

    # Security settings
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'

    # ALLOWED_HOSTS from environment
    ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '').split(',')
```

**3A.6 Install additional requirements**
```txt
# Add to requirements.txt
dj-database-url==2.1.0
gunicorn==21.2.0
psycopg2-binary==2.9.9
```

---

#### Option 3B: Railway (Fastest Setup)

**3B.1 Prepare Backend**
```bash
cd ~/Documents/bookPage2Blog-backend

# Create Procfile for Railway
echo "web: gunicorn bookpost_project.wsgi:application --bind 0.0.0.0:\$PORT" > Procfile

# Create railway.json
cat > railway.json << EOF
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "python manage.py migrate && gunicorn bookpost_project.wsgi:application --bind 0.0.0.0:\$PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
EOF

# Commit
git add .
git commit -m "Add Railway deployment config"
git push
```

**3B.2 Deploy to Railway**
1. Go to railway.app
2. Sign in with GitHub
3. New Project → Deploy from GitHub repo
4. Select `bookPage2Blog-backend`
5. Add PostgreSQL database (in same project)
6. Configure environment variables:
   - `SECRET_KEY`: Generate strong key
   - `DEBUG`: False
   - `ALLOWED_HOSTS`: your-app.railway.app
   - `CORS_ALLOWED_ORIGINS`: https://your-vercel-app.vercel.app
   - `GEMINI_API_KEY`: Your API key
   - `USE_S3`: True
   - `AWS_ACCESS_KEY_ID`: Your AWS key
   - `AWS_SECRET_ACCESS_KEY`: Your AWS secret
   - `AWS_STORAGE_BUCKET_NAME`: Your S3 bucket

**3B.3 Get Backend URL**
- Railway will provide URL like: `https://bookpost-backend-production.up.railway.app`
- Update Vercel frontend with this URL

---

### Phase 4: CI/CD with GitHub Actions

#### 4.1 Frontend CI/CD
```yaml
# ~/Documents/bookPage2Blog/.github/workflows/deploy.yml
name: Deploy Frontend

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_BACKEND_URL: ${{ secrets.VITE_BACKEND_URL }}
          VITE_GEMINI_API_KEY: ${{ secrets.VITE_GEMINI_API_KEY }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

#### 4.2 Backend CI/CD (for AWS ECS)
```yaml
# ~/Documents/bookPage2Blog-backend/.github/workflows/deploy.yml
name: Deploy Backend to AWS ECS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build, tag, and push image to Amazon ECR
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: bookpost-backend
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest

      - name: Update ECS service
        run: |
          aws ecs update-service --cluster bookpost-cluster --service bookpost-service --force-new-deployment
```

---

### Phase 5: Environment Variables & Secrets

#### Frontend (Vercel)
```bash
# Set via Vercel CLI or Dashboard
vercel env add VITE_BACKEND_URL production
vercel env add VITE_GEMINI_API_KEY production
```

#### Backend (AWS Secrets Manager)
```bash
# Create secrets
aws secretsmanager create-secret \
    --name bookpost/django/secret-key \
    --secret-string "your-super-secret-key"

aws secretsmanager create-secret \
    --name bookpost/django/database-url \
    --secret-string "postgresql://user:pass@host:5432/dbname"

aws secretsmanager create-secret \
    --name bookpost/gemini/api-key \
    --secret-string "your-gemini-api-key"

# Reference in ECS Task Definition
```

---

### Phase 6: Monitoring & Logging

#### CloudWatch Logs (AWS)
- Automatically enabled for ECS Fargate
- View logs in AWS CloudWatch Console

#### Vercel Analytics
- Built-in analytics in Vercel Dashboard
- Shows traffic, performance metrics

#### Sentry (Error Tracking)
```bash
# Frontend
npm install @sentry/react

# Backend
pip install sentry-sdk[django]
```

---

## Production Checklist

### Security
- [ ] Set DEBUG=False
- [ ] Use strong SECRET_KEY
- [ ] Enable HTTPS only
- [ ] Set ALLOWED_HOSTS correctly
- [ ] Configure CORS properly
- [ ] Use AWS Secrets Manager for sensitive data
- [ ] Enable Django security middleware
- [ ] Set up AWS IAM roles with least privilege
- [ ] Enable S3 bucket encryption
- [ ] Use RDS encryption at rest

### Performance
- [ ] Enable Vercel Edge CDN
- [ ] Configure Cloudflare (optional)
- [ ] Set up Redis for Django caching (optional)
- [ ] Enable database connection pooling
- [ ] Configure S3 CloudFront CDN
- [ ] Enable gzip compression

### Reliability
- [ ] Set up database backups (RDS automated)
- [ ] Configure auto-scaling for ECS
- [ ] Set up health checks
- [ ] Configure CloudWatch alarms
- [ ] Set up status page (e.g., status.io)

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure CloudWatch dashboards
- [ ] Set up uptime monitoring
- [ ] Enable application logs

---

## Cost Optimization Tips

1. **Use AWS Free Tier** (first 12 months):
   - 750 hours/month of t3.micro EC2
   - 750 hours/month of db.t3.micro RDS
   - 5GB S3 storage

2. **Use Reserved Instances** (for production):
   - Save up to 72% vs on-demand pricing

3. **Enable Auto-Scaling**:
   - Scale down during low traffic

4. **Use CloudFront CDN**:
   - Reduce origin server load

5. **Optimize Images**:
   - Compress before upload
   - Use WebP format

---

## Recommended Deployment Path

**For MVP/Testing:**
```
Frontend: Vercel (Free)
Backend: Railway ($5-20/month)
Total: ~$5-20/month
Time to deploy: 30 minutes
```

**For Production:**
```
Frontend: Vercel (Free or Pro $20)
Backend: AWS ECS Fargate (~$40/month)
Database: AWS RDS (~$15/month)
Storage: AWS S3 (~$5/month)
Total: ~$60-80/month
Time to deploy: 2-4 hours
```

---

## Next Steps

1. Choose deployment option based on requirements
2. Set up GitHub repositories
3. Deploy frontend to Vercel
4. Set up AWS infrastructure or Railway
5. Deploy backend
6. Configure environment variables
7. Test end-to-end
8. Set up monitoring
9. Configure custom domains
10. Enable CI/CD

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **AWS ECS Guide**: https://docs.aws.amazon.com/ecs/
- **Django Deployment**: https://docs.djangoproject.com/en/stable/howto/deployment/

---

## Troubleshooting

### Common Issues

**Frontend can't connect to backend:**
- Check CORS settings in Django
- Verify VITE_BACKEND_URL is correct
- Check network/firewall rules

**Backend static files not loading:**
- Run `python manage.py collectstatic`
- Configure WhiteNoise middleware
- Check S3 bucket permissions

**Database connection errors:**
- Verify DATABASE_URL format
- Check RDS security groups
- Ensure RDS is accessible from ECS

**Image uploads failing:**
- Check S3 bucket permissions
- Verify AWS credentials
- Check USE_S3 environment variable
