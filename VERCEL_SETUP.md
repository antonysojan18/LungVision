# How to Set VITE_API_URL in Vercel

Here is the step-by-step process to configure your backend URL in Vercel.

1.  **Log in to Vercel Dashboard**
    - Go to [vercel.com](https://vercel.com) and log in.

2.  **Select Your Project**
    - Click on your **LungVision** project from the list.

3.  **Go to Settings**
    - Click the **Settings** tab at the top of the page.

4.  **Open Environment Variables**
    - In the left sidebar menu, click on **Environment Variables**.

5.  **Add New Variable**
    - **Key**: Enter `VITE_API_URL` (exactly as written).
    - **Value**: Enter the full URL of your deployed backend API.
      - Example (if using Render): `https://lungvision-api.onrender.com/api`
      - Example (if backend is also on Vercel): `https://lungvision.vercel.app/api`
    - **Environments**: Ensure Production, Preview, and Development are all checked.

6.  **Save**
    - Click the **Save** button.

7.  **Redeploy (Required)**
    - Environment variables only take effect on **new deployments**.
    - Go to the **Deployments** tab.
    - Click the three dots (...) on your latest deployment.
    - Select **Redeploy**.
    - Click **Redeploy** again to confirm.

Once the redeployment finishes, your frontend will automatically use this new URL to talk to your backend.
