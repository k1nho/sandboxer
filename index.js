const { App } = require("octokit");
require("dotenv").config();

const app = new App({
  appId: process.env.GITHUB_APP_ID,
  privateKey: process.env.PRIVATE_KEY.replace(/\\n/gm, "\n"),
  webhooks: {
    secret: process.env.WEBHOOK_SECRET,
  },
});

exports.app = app;
