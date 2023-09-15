const { app } = require("../..");
const { on_issue_opened, on_pr_opened } = require("../../webhook_handlers");

// webhooks
on_issue_opened;
on_pr_opened;

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
      payload: event.body,
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Received!" }),
    };
  } catch (error) {
    app.log.error(error);
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
