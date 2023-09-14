const { App } = require("octokit");
require("dotenv").config();

const app = new App({
  appId: process.env.GITHUB_APP_ID,
  privateKey: process.env.PRIVATE_KEY.replace(/\\n/gm, "\n"),
  webhooks: {
    secret: process.env.WEBHOOK_SECRET,
  },
});

exports.handler = async function (event) {
  try {
    await app.webhooks.verifyAndReceive({
      id:
        event.headers["X-GitHub-Delivery"] ||
        event.headers["x-github-delivery"],
      name: event.headers["X-GitHub-Event"] || event.headers["x-github-event"],
      signature:
        event.headers["X-Hub-Signature-256"] ||
        event.headers["x-hub-signature-256"],
      payload: JSON.parse(event.body),
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "hello world" }),
    };
  } catch (error) {
    app.log.error(error);
    return {
      statusCode: error.status || 500,
      error: "there was an error",
    };
  }
};
