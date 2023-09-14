const { app } = require(".");
const { genericMsg } = require("./welcome");

const on_issue_opened = app.webhooks.on(
  "issues.opened",
  async ({ octokit, payload }) => {
    await octokit.rest.issues.createComment({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      body: genericMsg,
      issue_number: payload.issue.number,
    });
  }
);

exports.on_issue_opened = on_issue_opened;
