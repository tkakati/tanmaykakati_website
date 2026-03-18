# Deploy to Vercel + tanmaykakati.com

## 1. Push this folder to GitHub

From your machine (in this `portfolio` directory):

```bash
cd portfolio
git init
git add .
git commit -m "Initial site: portfolio"
```

Repo: **[tkakati/tanmaykakati_website](https://github.com/tkakati/tanmaykakati_website)**

If `origin` is not set yet:

```bash
git branch -M main
git remote add origin https://github.com/tkakati/tanmaykakati_website.git
git push -u origin main
```

If the remote already exists with another URL:

```bash
git remote set-url origin https://github.com/tkakati/tanmaykakati_website.git
git push -u origin main
```

## 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New** → **Project** → **Import** your GitHub repo.
2. **Root Directory**: leave as `.` (repo root is this site).
3. **Framework Preset**: **Other** (static HTML/CSS/JS — no build command needed).
4. Deploy.

## 3. Connect tanmaykakati.com

1. Vercel project → **Settings** → **Domains** → add `tanmaykakati.com` and `www.tanmaykakati.com`.
2. Follow Vercel’s DNS instructions. Typical setup:
   - **Apex** (`tanmaykakati.com`): A record → `76.76.21.21` (or the IP Vercel shows).
   - **www**: CNAME → `cname.vercel-dns.com` (or what Vercel displays).

Add these records at your domain registrar (where you bought `tanmaykakati.com`). DNS can take up to 48 hours; often much faster.

## 4. HTTPS

Vercel provisions SSL automatically once the domain verifies.
