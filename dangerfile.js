import {message, danger} from "danger"
import fixme from 'danger-plugin-fixme'

fixme()

// import jiraIssue from "danger-plugin-jira-issue"
const jiraIssue = require("danger-plugin-jira-issue").default

jiraIssue({
  key: ["JENKINS"],
  url: "https://issues.jenkins-ci.org/browse/",
  emoji: ":paperclip:",
  format(emoji, jiraUrls) {
    // Optional Formatter
    return "Some Custom Message";
  },
  location: "title" // Optional location, either 'title' or 'branch'
});

const modifiedMD = danger.git.modified_files.join("- ")
message("Changed Files in this PR: \n - " + modifiedMD)

// Provides advice if a summary section is missing, or body is too short
const includesSummary =
  danger.github.pr.body &&
  danger.github.pr.body.toLowerCase().includes('## summary');
if (!danger.github.pr.body || danger.github.pr.body.length < 50) {
  fail(':grey_question: This pull request needs a description.');
} else if (!includesSummary) {
  const title = ':clipboard: Missing Summary';
  const idea =
    'Can you add a Summary? ' +
    'To do so, add a "## Summary" section to your PR description. ' +
    'This is a good place to explain the motivation for making this change.';
  message(`${title} - <i>${idea}</i>`);
}

const modifiedAppFiles = danger.git.modified_files;
const hasAppChanges = modifiedAppFiles.length > 0;

const testChanges = modifiedAppFiles.filter(filepath =>
  filepath.includes('test'),
);
const hasTestChanges = testChanges.length > 0;

// Warn if there are library changes, but not tests
if (hasAppChanges && !hasTestChanges) {
  warn(
    "There are library changes, but not tests. That's OK as long as you're refactoring existing code",
  );
}


markdown(`
### Header3

*Bold*
`)
