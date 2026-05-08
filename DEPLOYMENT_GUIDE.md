# Cloud Deployment Guide for Edu Fairuzullah LMS

This guide will teach you how to deploy your HTML-based LMS prototype to various public cloud providers. Since your application is a static website (HTML, CSS, JavaScript), it can be deployed to any static hosting service.

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Microsoft Azure - Static Web Apps](#microsoft-azure---static-web-apps)
3. [AWS - S3 + CloudFront](#aws---s3--cloudfront)
4. [Google Cloud - Firebase Hosting](#google-cloud---firebase-hosting)
5. [Alternative Options](#alternative-options)
6. [Post-Deployment Steps](#post-deployment-steps)

---

## Pre-Deployment Checklist

Before deploying, ensure you have:
- ✅ All files ready (index.html, educator.html, learner.html, dashboard.html, app.js, styles.css)
- ✅ A cloud provider account (free tier available for most)
- ✅ Basic understanding of the cloud provider's console

---

## Microsoft Azure - Static Web Apps

Azure Static Web Apps is perfect for static websites and offers free hosting.

### Step 1: Prepare Your Files
1. Create a folder structure:
   ```
   lms-project/
   ├── index.html
   ├── dashboard.html
   ├── educator.html
   ├── learner.html
   ├── app.js
   └── styles.css
   ```

### Step 2: Create Azure Account
1. Go to [portal.azure.com](https://portal.azure.com)
2. Sign up for a free account (includes $200 credit for 30 days)

### Step 3: Deploy via Azure Portal
1. **Login to Azure Portal**
2. **Click "Create a resource"**
3. **Search for "Static Web App"**
4. **Click "Create"**

5. **Fill in the form:**
   - **Subscription:** Choose your subscription
   - **Resource Group:** Create new or use existing
   - **Name:** `edufairuzullah-lms` (must be unique)
   - **Plan type:** Free
   - **Region:** Choose closest to you (e.g., East US)
   - **Source:** Other
   - **SKU:** Free

6. **Click "Review + Create"** then **"Create"**

7. **After creation, go to your Static Web App:**
   - Click on the resource
   - Go to **"Overview"**
   - Click **"Browse"** to see your site (it will be empty initially)

### Step 4: Upload Files
1. In your Static Web App, go to **"Deployment"** → **"Manage deployment token"**
2. Copy the deployment token
3. Use Azure CLI or upload via Azure Storage Explorer

**Option A: Using Azure CLI**
```bash
# Install Azure CLI first from https://aka.ms/installazurecliwindows

# Login
az login

# Deploy files
az staticwebapp deploy \
  --name edufairuzullah-lms \
  --resource-group your-resource-group \
  --source-location . \
  --token YOUR_DEPLOYMENT_TOKEN
```

**Option B: Using Azure Storage Explorer**
1. Download [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/)
2. Connect using your Azure account
3. Navigate to your Static Web App's storage
4. Upload all HTML, CSS, and JS files

### Step 5: Access Your Site
- Your site URL will be: `https://edufairuzullah-lms.azurestaticapps.net`
- Share this URL with users

---

## AWS - S3 + CloudFront

Amazon S3 can host static websites, and CloudFront provides CDN for faster access.

### Step 1: Create S3 Bucket
1. **Login to AWS Console** ([aws.amazon.com](https://aws.amazon.com))
2. **Go to S3 service**
3. **Click "Create bucket"**
4. **Configure:**
   - **Bucket name:** `edufairuzullah-lms` (must be globally unique)
   - **Region:** Choose closest region
   - **Block Public Access:** Uncheck "Block all public access" (for static hosting)
   - **Bucket Versioning:** Disable (optional)
   - **Default encryption:** Enable (recommended)

5. **Click "Create bucket"**

### Step 2: Enable Static Website Hosting
1. **Click on your bucket**
2. **Go to "Properties" tab**
3. **Scroll to "Static website hosting"**
4. **Click "Edit"**
5. **Enable static website hosting:**
   - **Hosting type:** Enable
   - **Index document:** `index.html`
   - **Error document:** `index.html` (for SPA routing)

6. **Click "Save changes"**

### Step 3: Set Bucket Policy (Make it Public)
1. **Go to "Permissions" tab**
2. **Click "Bucket policy"**
3. **Add this policy:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::edufairuzullah-lms/*"
    }
  ]
}
```
4. **Replace `edufairuzullah-lms` with your bucket name**
5. **Click "Save changes"**

### Step 4: Upload Files
1. **Go to "Objects" tab**
2. **Click "Upload"**
3. **Add all your files:**
   - index.html
   - dashboard.html
   - educator.html
   - learner.html
   - app.js
   - styles.css
4. **Set permissions:**
   - Under "Permissions", select "Grant public-read access"
5. **Click "Upload"**

### Step 5: Access Your Site
- Your site URL will be shown in "Static website hosting" section
- Format: `http://edufairuzullah-lms.s3-website-region.amazonaws.com`

### Step 6: (Optional) Add CloudFront CDN
1. **Go to CloudFront service**
2. **Click "Create distribution"**
3. **Origin settings:**
   - **Origin domain:** Select your S3 bucket
   - **Origin path:** Leave empty
   - **Name:** Auto-filled

4. **Default cache behavior:**
   - **Viewer protocol policy:** Redirect HTTP to HTTPS
   - **Allowed HTTP methods:** GET, HEAD, OPTIONS

5. **Distribution settings:**
   - **Price class:** Use all edge locations (or cheapest for testing)
   - **Alternate domain names:** (Optional) Add your custom domain

6. **Click "Create distribution"**
7. **Wait 5-15 minutes for deployment**
8. **Access via CloudFront URL:** `https://d1234567890.cloudfront.net`

---

## Google Cloud - Firebase Hosting

Firebase Hosting is Google's solution for static websites, very easy to use.

### Step 1: Install Firebase CLI
1. **Install Node.js** from [nodejs.org](https://nodejs.org)
2. **Open terminal/command prompt**
3. **Install Firebase CLI:**
```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase
```bash
firebase login
```
- This will open a browser for authentication

### Step 3: Initialize Firebase Project
1. **Navigate to your project folder:**
```bash
cd "C:\Users\User 1\OneDrive - UMPSA\Desktop\kerja\cloud\project cloud"
```

2. **Initialize Firebase:**
```bash
firebase init hosting
```

3. **Follow the prompts:**
   - **Select "Use an existing project"** or **"Create a new project"**
   - **Project name:** `edufairuzullah-lms`
   - **What do you want to use as your public directory?** `./` (current directory)
   - **Configure as a single-page app?** `No`
   - **Set up automatic builds?** `No`
   - **File index.html already exists. Overwrite?** `No`

### Step 4: Deploy
```bash
firebase deploy --only hosting
```

### Step 5: Access Your Site
- Your site URL: `https://edufairuzullah-lms.web.app`
- Or: `https://edufairuzullah-lms.firebaseapp.com`

### Step 6: Update Files
Whenever you make changes:
```bash
firebase deploy --only hosting
```

---

## Alternative Options

### Option 1: Netlify (Easiest - Recommended for Beginners)
1. **Go to [netlify.com](https://netlify.com)**
2. **Sign up for free account**
3. **Drag and drop your project folder** onto Netlify dashboard
4. **Your site is live immediately!**
5. **URL format:** `https://random-name-123.netlify.app`

### Option 2: Vercel
1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up with GitHub/GitLab/Bitbucket**
3. **Import your project**
4. **Deploy automatically**

### Option 3: GitHub Pages (Free)
1. **Create GitHub repository**
2. **Upload all files**
3. **Go to Settings → Pages**
4. **Select branch and folder**
5. **Your site:** `https://username.github.io/repository-name`

---

## Post-Deployment Steps

### 1. Test Your Deployment
- ✅ Test login functionality
- ✅ Test course creation (as educator)
- ✅ Test course enrollment (as learner)
- ✅ Test all CRUD operations
- ✅ Check on mobile devices

### 2. Configure Custom Domain (Optional)
Most providers allow custom domains:
- **Azure:** Add custom domain in Static Web App settings
- **AWS:** Use Route 53 or configure in CloudFront
- **Firebase:** Add domain in Hosting settings

### 3. Enable HTTPS
- **Azure:** Automatic with Static Web Apps
- **AWS:** Automatic with CloudFront
- **Firebase:** Automatic
- **Netlify/Vercel:** Automatic

### 4. Set Up Monitoring
- Monitor site uptime
- Set up alerts for downtime
- Track usage statistics

### 5. Cost Optimization
- Use free tiers when possible
- Monitor usage to avoid unexpected charges
- Set up billing alerts

---

## Comparison Table

| Provider | Free Tier | Ease of Use | CDN | Custom Domain | Best For |
|----------|-----------|-------------|-----|---------------|----------|
| **Azure Static Web Apps** | ✅ Yes | ⭐⭐⭐ | ✅ Yes | ✅ Yes | Azure ecosystem |
| **AWS S3 + CloudFront** | ⚠️ Limited | ⭐⭐ | ✅ Yes | ✅ Yes | AWS ecosystem |
| **Firebase Hosting** | ✅ Yes | ⭐⭐⭐⭐ | ✅ Yes | ✅ Yes | Quick deployment |
| **Netlify** | ✅ Yes | ⭐⭐⭐⭐⭐ | ✅ Yes | ✅ Yes | Beginners |
| **Vercel** | ✅ Yes | ⭐⭐⭐⭐⭐ | ✅ Yes | ✅ Yes | Developers |
| **GitHub Pages** | ✅ Yes | ⭐⭐⭐⭐ | ✅ Yes | ✅ Yes | Open source |

---

## Troubleshooting

### Issue: Site shows blank page
**Solution:** 
- Check browser console for errors
- Ensure all file paths are correct
- Verify index.html is in root directory

### Issue: 404 errors on navigation
**Solution:**
- Configure error document to redirect to index.html
- For SPA routing, set up proper redirect rules

### Issue: CORS errors
**Solution:**
- Static sites shouldn't have CORS issues
- Check if you're trying to access external APIs

### Issue: localStorage not working
**Solution:**
- localStorage works on all modern browsers
- Check if browser allows localStorage
- Try incognito/private mode

---

## Next Steps for Production

1. **Backend Integration:** Replace localStorage with real database
2. **Authentication:** Implement proper OAuth/JWT
3. **File Upload:** Add cloud storage for course materials
4. **API Development:** Create RESTful API
5. **Database:** Set up cloud database (Azure Cosmos DB, AWS RDS, etc.)
6. **Security:** Implement proper password hashing, HTTPS, security headers

---

## Quick Start Commands

### Azure CLI
```bash
az login
az staticwebapp deploy --name YOUR_APP_NAME --resource-group YOUR_RG --source-location .
```

### Firebase
```bash
firebase login
firebase init hosting
firebase deploy
```

### AWS CLI
```bash
aws s3 sync . s3://YOUR_BUCKET_NAME --acl public-read
```

---

## Resources

- [Azure Static Web Apps Docs](https://docs.microsoft.com/azure/static-web-apps/)
- [AWS S3 Static Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Netlify Docs](https://docs.netlify.com/)

---

**Need Help?** Each cloud provider has extensive documentation and support communities. Start with the provider's official documentation for the most up-to-date instructions.






