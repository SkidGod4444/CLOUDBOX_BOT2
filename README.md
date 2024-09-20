# Telegram Bot with Cloudflare Workers

This project implements a Telegram bot utilizing Cloudflare Workers technology. The bot is specifically designed to integrate seamlessly with our web application, which can be accessed at https://l.devwtf.in/cloudbox. This integration enhances the functionality and user experience of our service.

## Prerequisites

- Node.js (version 12 or higher)
- npm (Node Package Manager)
- A Telegram Bot Token (obtain from BotFather on Telegram)
- Cloudflare account with Workers enabled
- OpenSSL (for generating secret)

## Setup

1. Clone this repository:

   ```
   git clone https://github.com/SkidGod4444/CLOUDBOX_BOT2.git
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up your environment variables:

   - Create a `wrangler.toml` file in the root directory (if not already present)

     ```
     wrangler generate <project-name>
     ```

   - Generate a secret value for ENV_SECRET using OpenSSL:

     ```
     openssl rand -hex 69
     ```

   - Add your Telegram Bot Token and the generated secret using Wrangler CLI:

     ```
     wrangler secret put ENV_TOKEN
     wrangler secret put ENV_SECRET
     ```

   - Your `wrangler.toml` file should look like this:

     ```toml
     main = "index.js"
     account_id = "your-cf-account-id"
     workers_dev = true
     ```

   Note: The ENV_TOKEN and ENV_SECRET are now securely stored as secrets and not visible in the wrangler.toml file.

4. Deploy to Cloudflare Workers:
   ```
   wrangler deploy
   ```

## Register Webhook
To register the webhook for your bot, send a GET request to the `/registerWebhook` endpoint of your Cloudflare Worker. You can do this by visiting the deployed URL in your web browser:
For example: `https://my-worker-123.username.workers.dev/registerWebhook`

## Usage

Now you are good to go!

## Support

For any questions or issues, please [open an issue](https://github.com/SkidGod4444/CLOUDBOX_BOT2/issues) on GitHub.
