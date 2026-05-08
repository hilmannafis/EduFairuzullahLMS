# Quick Deployment Guide - Choose Your Method

## 🚀 Fastest Method: Netlify (5 minutes)

### Steps:
1. Go to [netlify.com](https://netlify.com) and sign up (free)
2. Drag your entire project folder onto the Netlify dashboard
3. Done! Your site is live with a URL like `https://your-site.netlify.app`

**That's it!** No configuration needed.

---

## 📦 Method 2: Firebase Hosting (10 minutes)

### Prerequisites:
- Install Node.js from [nodejs.org](https://nodejs.org)

### Steps:
```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Navigate to your project folder
cd "C:\Users\User 1\OneDrive - UMPSA\Desktop\kerja\cloud\project cloud"

# 4. Initialize
firebase init hosting
# Choose: Create new project, use current directory (./), No to SPA, No to overwrite

# 5. Deploy
firebase deploy --only hosting
```

Your site: `https://your-project.web.app`

---

## ☁️ Method 3: Azure Static Web Apps (15 minutes)

### Steps:
1. Go to [portal.azure.com](https://portal.azure.com)
2. Create a resource → Search "Static Web App"
3. Fill in:
   - Name: `edufairuzullah-lms`
   - Plan: Free
   - Source: Other
4. After creation, go to Deployment → Manage deployment token
5. Use Azure CLI or Storage Explorer to upload files

**Azure CLI method:**
```bash
az login
az staticwebapp deploy --name edufairuzullah-lms --resource-group YOUR_RG --source-location .
```

---

## 🌐 Method 4: AWS S3 (20 minutes)

### Steps:
1. Go to [aws.amazon.com](https://aws.amazon.com) and sign in
2. Open S3 service
3. Create bucket (name must be unique globally)
4. Upload all files
5. Enable "Static website hosting" in Properties
6. Set bucket policy to make it public
7. Access via S3 website endpoint

**See DEPLOYMENT_GUIDE.md for detailed AWS instructions**

---

## 💡 Recommendation for Learning

**Start with Netlify** - It's the easiest and fastest way to see your site live. Then try Firebase or Azure to learn more about cloud platforms.

---

## 📝 What You'll Need

- Your project files (already have them!)
- A cloud provider account (all have free tiers)
- 10-30 minutes depending on method

---

## ✅ After Deployment Checklist

- [ ] Test login with default credentials
- [ ] Test creating a course (as educator)
- [ ] Test enrolling in a course (as learner)
- [ ] Share the URL with your team/instructor
- [ ] Take a screenshot for documentation

---

**Need detailed instructions?** See `DEPLOYMENT_GUIDE.md` for comprehensive guides for each provider.






