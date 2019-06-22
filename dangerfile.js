import { message, danger, schedule } from "danger"
import { readFileSync } from "fs";
import jiraIssue from "danger-plugin-jira-issue"
//import labels from "danger-plugin-labels"
import spellcheck from "danger-plugin-spellcheck"
import * as commitLint from 'danger-plugin-commit-lint'


const getStart = pattern => ["a", "e", "i", "o", "u"].find(vowel => pattern.startsWith(vowel.toLowerCase())) ? "an" : "a";

/**
 * Have danger fail if she detects a FIXME annotation inside your code.
 */
function fixme(patterns = ["FIXME"]) {
  const newOrModifiedFiles = danger.git.modified_files.concat(danger.git.created_files)

  for (const file of newOrModifiedFiles) {
    const content = readFileSync(file).toString()
    for (const pattern of patterns) {
      if (content.includes(pattern)) {
        fail(`${getStart(pattern)} \`${pattern}\` was left in: ${file}`)
      }
    }
  }
}

(function main() {
  const prTemplate = readFileSync('.github/PULL_REQUEST_TEMPLATE.md').toString().replace(/\n\r|\r\n|\n|\r/g, '\n')
  const prBody = danger.github.pr.body.replace(/\n\r|\r\n|\n|\r/g, '\n');
  if (!prBody || prBody.length <= prTemplate.length) {
    fail(":grey_question: This pull request needs a description. Please use the template.");
    return
  }
  if (prBody == prTemplate) {
    fail(":grey_question: This pull request needs a description. Please populate the template.");
    return
  }

  commitLint.check({
    disable: ["subject_cap"]
  })

  fixme()

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

  schedule(spellcheck())

  //schedule(labels({
  //  // A checked box with "WIP" will apply the "Work In Progress" label
  //  rules: [
  //    { match: /\bWIP\b/i, label: "Work In Progress" },
  //    { match: /\bquestion\b/i, label: "Question" },
  //    { match: /Ready for Review/i, label: "Ready for Review" }
  //  ],
  //  validate: async (labels) => {
  //    if (labels.includes("Question")) {
  //      fail("Please direct questions to the community on Spectrum.")
  //      await closeIssue();
  //      return false;
  //    }
  //    if (labels.length < 1 || labels.length > 3) {
  //      fail("Please specify at least one and at most 3 labels.");
  //      return false;
  //    }
  //    return true;
  //  }
  //}))

  if (danger.git.modified_files.length) {
    message("Changed Files in this PR: \n" + danger.git.modified_files.map(file => `- ${file}`).join("\n"))
  }

  if (danger.git.created_files.lenght) {
    message("Created Files in this PR: \n" + danger.git.created_files.map(file => `- ${file}`).join("\n"))
  }

  // Provides advice if a summary section is missing, or body is too short
  const includesSummary = prBody && prBody.toLowerCase().includes("## summary");
  if (!includesSummary) {
    const title = ":clipboard: Missing Summary";
    const idea =
      "Can you add a Summary? " +
      "To do so, add a \"## Summary\" section to your PR description. " +
      "This is a good place to explain the motivation for making this change.";
    message(`${title} - <i>${idea}</i>`);
  }

  //const modifiedAppFiles = danger.git.modified_files;
  //const hasAppChanges = modifiedAppFiles.length > 0;

  //const testChanges = modifiedAppFiles.filter(filepath =>
  //  filepath.includes("test"),
  //);
  //const hasTestChanges = testChanges.length > 0;

  //// Warn if there are library changes, but not tests
  //if (hasAppChanges && !hasTestChanges) {
  //  warn(
  //    "There are library changes, but not tests. That's OK as long as you're refactoring existing code",
  //  );
  //}


  markdown(`
  ### Header3

  *Bold*
  `)
})();
