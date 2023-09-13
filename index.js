const { App, Octokit } = require("octokit");
const { genericMsg } = require("./welcome");
const fs = require("fs");
require("dotenv").config();

function main() {
  startApp();
}

async function startApp() {
  const app = new App({
    appId: process.env.GITHUB_APP_ID,
    privateKey: process.env.PRIVATE_KEY.replace(/\\n/gm, "\n"),
    webhooks: {
      secret: process.env.WEBHOOK_SECRET,
    },
  });

  //const octokit = await app.getInstallationOctokit(41775422);

  const loginToInstallID = new Map();
  for await (const { installation } of app.eachInstallation.iterator()) {
    if (!loginToInstallID.has(installation.account.login)) {
      loginToInstallID.set(installation.account.login, installation.id);
    }
  }

  saveToJSON(loginToInstallID);

  const myapp = await octokitGenerate(app, "k1nho", loginToInstallID);
  await myapp.rest.issues.create({
    owner: "k1nho",
    repo: "sandboxer",
    title: "Welcome to sandboxer",
    body: genericMsg,
  });
}

/**
 * @description generates an octokit instance for an specific installation given a user
 * @async
 * @param {App} app
 * @param {string} user
 * @param {Map<string, number>} loginToInstallID
 * */
async function octokitGenerate(app, user, loginToInstallID) {
  if (!loginToInstallID.has(user)) {
    throw new Error(`login ${user} not registered`);
  }

  const octoInstance = await app.getInstallationOctokit(
    loginToInstallID.get(user)
  );

  return octoInstance;
}

/**
 * @param {Map<string, int>} loginToInstallID
 */
function saveToJSON(loginToInstallID) {
  const entries = Object.fromEntries(loginToInstallID);
  const jsonString = JSON.stringify(entries);

  fs.writeFile("user_to_installID.json", jsonString, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

main();
