const { app } = require(".");
const { genericMsg, prMsg } = require("./welcome");

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

const on_pr_opened = app.webhooks.on(
  "pull_request.opened",
  async ({ octokit, payload }) => {
    await octokit.rest.issues.createComment({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      body: prMsg,
      issue_number: payload.issue.number,
    });
  }
);

exports.on_issue_opened = on_issue_opened;
exports.on_pr_opened = on_pr_opened;
