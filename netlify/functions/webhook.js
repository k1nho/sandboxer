const { App } = require("octokit");
const { genericMsg } = require("../../welcome");
const app = new App({
  appId: process.env.GITHUB_APP_ID,
  privateKey: process.env.PRIVATE_KEY.replace(/\\n/gm, "\n"),
  webhooks: {
    secret: process.env.WEBHOOK_SECRET,
  },
});

app.webhooks.on("issues.opened", async ({ event, payload }) => {
  await app.octokit.rest.issues.createComment({
    owner: payload.repository.owner,
    repo: payload.repository.name,
    body: genericMsg,
  });
  console.log(event);
});

const handler = async (event) => {
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
      body: JSON.stringify({ message: `Received!` }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
