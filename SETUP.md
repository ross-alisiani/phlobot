# Phlobot — Setup Guide

This guide walks you through deploying Phlobot from scratch.
You don't need coding experience — just follow each step in order.

---

## What you'll create (all free to start)

| Service    | What it does              | Free tier |
|------------|---------------------------|-----------|
| GitHub     | Stores your code          | ✅ Free    |
| Vercel     | Hosts the website         | ✅ Free    |
| Supabase   | Database + login system   | ✅ Free    |
| Twilio     | Sends/receives SMS texts  | $15 trial |
| Resend     | Sends emails              | ✅ Free    |

---

## Step 1 — Create a GitHub account and upload the code

1. Go to [github.com](https://github.com) and create a free account.
2. Click **+** (top right) → **New repository**
3. Name it `phlobot`, set it to **Private**, click **Create repository**
4. Download [GitHub Desktop](https://desktop.github.com/) and install it
5. Open GitHub Desktop → **Add** → **Add Existing Repository**
6. Navigate to your `phlobot` folder and add it
7. Click **Publish Repository** → make sure it matches your GitHub account

---

## Step 2 — Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → **Start your project** (free)
2. Create a new project — remember your database password
3. Once created, go to **SQL Editor** (left sidebar)
4. Click **New query**
5. Copy the entire contents of `supabase/migrations/001_initial.sql`
6. Paste it and click **Run**
7. Go to **Settings → API** and copy:
   - **Project URL** → this is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → this is your `SUPABASE_SERVICE_ROLE_KEY`
   
   ⚠️ Keep the service_role key secret — never share it publicly.

---

## Step 3 — Create a Twilio account

1. Go to [twilio.com](https://twilio.com) → **Sign up** (free $15 trial credit)
2. Verify your email and phone number
3. From the Twilio Console dashboard, copy:
   - **Account SID** → `TWILIO_ACCOUNT_SID`
   - **Auth Token** → `TWILIO_AUTH_TOKEN`
4. Go to **Phone Numbers → Manage → Buy a number**
5. Search for a local number, buy it (~$1/month after trial)
6. This is your `TWILIO_PHONE_NUMBER` (format: +17205550100)
7. **Set up the webhook** (do this AFTER deploying to Vercel in Step 5):
   - Go to your phone number's settings
   - Under **Messaging**, set the webhook URL to:
     `https://your-app.vercel.app/api/sms/webhook`
   - Method: **HTTP POST**

---

## Step 4 — Create a Resend account

1. Go to [resend.com](https://resend.com) → **Sign up** (free — 3,000 emails/month)
2. Create an API key → copy it as `RESEND_API_KEY`
3. Add and verify your sending domain (or use their test domain to start)
4. Set `FROM_EMAIL` to something like `noreply@yourdomain.com`

---

## Step 5 — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → **Sign up with GitHub** (free)
2. Click **Add New Project**
3. Select your `phlobot` repository ₒ click **Import**
4. Before clicking Deploy, click **Environment Variables** and add all of these:

```
NEXT_PUBLIC_SUPABASE_URL         = (from Step 2)
NEXT_PUBLIC_SUPABASE_ANON_KEY    = (from Step 2)
SUPABASE_SERVICE_ROLE_KEY        = (from Step 2)
TWILIO_ACCOUNT_SID               = (from Step 3)
TWILIO_AUTH_TOKEN                = (from Step 3)
TWILIO_PHONE_NUMBER              = (from Step 3)
RESEND_API_KEY                   = (from Step 4)
FROM_EMAIL                       = noreply@yourdomain.com
NEXT_PUBLIC_APP_URL              = https://your-app.vercel.app
ADMIN_EMAILS                     = your@email.com
CRON_SECRET                      = (any random string, e.g. "phlobot-cron-2025")
```

5. Click **Deploy**
6. Once deployed, copy your app URL (e.g. `https://phlobot-abc123.vercel.app`)
7. Update `NEXT_PUBLIC_APP_URL` in Vercel to your real URL
8. Go back to Twilio and add your webhook URL (see Step 3, item 7)

---

## Step 6 — Test it end to end

1. Visit your app URL → click **Get Started** → create an advisor account
2. Go to **Admin** (`/admin`) → add yourself as an examiner with your real cell number
3. Go back to the advisor dashboard → click **New Request**
4. Fill in the form with a ZIP code near your examiner's zip
5. Submit → you should receive an SMS within seconds
6. Reply YES → you should get a confirmation text + a connection email

---

## Day-to-day operations

**To add an examiner:**
- Go to `/admin/examiners/new` and enter their details
- Or share the `/examiner-signup` link and let them self-register

**To manually enter a job (if an advisor texts/calls you):**
- Go to `/admin/jobs/new`

**To check on unfilled jobs:**
- The system automatically checks every hour and notifies advisors at the 24-hour mark

---

## Costs after free tiers

| Item                       | Cost          |
|----------------------------|---------------|
| Vercel hosting             | Free          |
| Supabase database          | Free up to 500MB |
| Twilio SMS (outbound)      | ~$0.0079/SMS  |
| Twilio SMS (inbound)       | ~$0.0075/SMS  |
| Resend email               | Free up to 3,000/month |
| Twilio phone number        | ~$1/month     |

At 100 jobs/month (each sending ~5 SMS): ~$6/month in Twilio costs.

---

## Getting help

If anything doesn't work, the most common issues are:
- Environment variables not set correctly in Vercel
- Twilio webhook URL not pointing to your deployed app
- Supabase SQL migration not run

Double-check these three things first.
