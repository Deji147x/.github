# Voltixio Content Manager (Starter App)

This version includes a **Send to GHL** action using your n8n webhook flow.

## Run locally
Open `app/index.html` in your browser.

## GHL connection flow
1. Add your **n8n webhook URL** in Settings.
2. Confirm Location ID is `8BlvEgHfpyevZboFrRry`.
3. Add GHL PIT in the form (session-only use).
4. Create a job and wait for `Completed`.
5. Click **Send to GHL**.

The app sends a JSON payload to your webhook with video metadata + final asset URL.

## Security note
Do not keep production PIT tokens in client-side apps. Move token handling to server-side as soon as possible.


## Default n8n webhook
- `https://n8n.voltixio.com/webhook/fe696ec2-ea68-446e-ab1a-3e0d2ce3eaab22dssdsds`
