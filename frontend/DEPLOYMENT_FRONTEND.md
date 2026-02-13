# Frontend Deployment Guide (Netlify)

## Prerequisites
1.  Your **Render Backend URL**. It looks like `https://sdms-backend.onrender.com`.
2.  This project pushed to GitHub.

## Step 1: Update Configuration
1.  Open [`netlify.toml`](file:///d:/sdms/sdms-fullstack/sdms-fullstack/frontend/netlify.toml).
2.  Find the line: `to = "https://CHANGE_ME_TO_YOUR_RENDER_URL.onrender.com/api/:splat"`
3.  **Replace** `https://CHANGE_ME_TO_YOUR_RENDER_URL.onrender.com` with your **actual Render Backend URL**.
4.  Save and Push the changes to GitHub.

## Step 2: Deploy on Netlify
1.  Log in to [Netlify](https://app.netlify.com/).
2.  Click **Add new site** > **Import an existing project**.
3.  Choose **GitHub**.
4.  Select your repository (`sdms-fullstack`?).
5.  **Site Settings**:
    *   **Base directory**: `sdms-fullstack/frontend` (or just `frontend` if that's how it appears).
    *   **Build command**: `npm run build` (should be auto-filled).
    *   **Publish directory**: `dist` (should be auto-filled).
6.  Click **Deploy site**.

## Troubleshooting
*   **"Page Not Found" on refresh**: The `netlify.toml` file fixes this. If it happens, ensure the file is in the `frontend` folder.
*   **Login fails**: Check the Network tab in your browser. If requests to `/api/auth/login` fail, your Backend URL in `netlify.toml` might be wrong.
