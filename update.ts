#!/usr/bin/env bun
import fs from "fs-extra";
import path from "path";
import { execSync } from "./exec-sync";
import { Octokit } from "@octokit/rest";
import { promptConfirm } from "./prompt-confirm";

/**
 * This calls out to the git api to get the latest tag for the devops repo
 */
async function getLatestTagAndUpdate() {
  const octokit: Octokit = new Octokit({
    auth: process.env.GIT_ACCESS_TOKEN,
  });

  const result = await octokit.rest.repos.listTags({
    owner: "vega-studio",
    repo: "node-devops",
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (result.status !== 200 || !result?.data?.[0]?.name) {
    console.error("Could not determine latest tag for node-devops");
    process.exit(1);
  }

  if (
    !(await promptConfirm(`Update devops to ${result.data[0].name}?`, false))
  ) {
    process.exit(0);
  }

  // Update the package to match the version AND the dependency
  const packageJson = fs.readJSONSync("package.json");
  packageJson.version = result.data[0].name;
  packageJson.devDependencies.devops = `git+ssh://github.com/vega-studio/node-devops.git#${result.data[0].name}`;
  fs.writeJSONSync("package.json", packageJson, { spaces: 2 });

  return result.data[0].name;
}

async function commitAndTag(version: string) {
  if (
    !(await promptConfirm(`Commit and tag changes and push to main?`, false))
  ) {
    process.exit(0);
  }

  // Add all of the files
  execSync("git", ["add", "."]);
  // Make a release commit
  execSync("git", ["commit", "-m", `Release ${version}`]);
  // Push the commit up
  execSync("git", ["push", "origin", "main"]);
  // Tag the release git tag -a 5.2.15-patch.2 -m "Release x.x.x"
  execSync("git", ["tag", "-a", version, "-m", `Release ${version}`]);
  // Push the tag
  execSync("git", ["push", "origin", "--tags"]);
}

async function ensureInstallationVersion() {
  // DO a complete sync of the dependencies to ensure we are absolutely up to
  // date
  fs.removeSync("node_modules/devops");
  execSync("bun", ["pm", "cache", "rm"]);
  execSync("bun", ["i"]);

  // Let the file system flush
  await new Promise((r) => setTimeout(r, 1000));

  console.warn("Current devops set to:");
  execSync("npm", ["ls", "devops"]);

  if (!(await promptConfirm(`Continue?`, false))) {
    process.exit(0);
  }
}

async function copyFiles(DEVOPS_PATH: string) {
  // Ensure the devops package exists
  if (!fs.existsSync(DEVOPS_PATH)) {
    throw new Error("Devops package not found");
  }

  // List all files to copy out of the devops project
  const toCopy: string[] = ["dist", "shim", ".storybook"];

  // List all files to remove from this project after the copy has completed
  const toRemove: string[] = ["dist/bin/main.js"];

  // List all files to rename after the remove has completed
  const toRename: [string, string][] = [
    ["dist/bin/main-gimp.js", "dist/bin/main.js"],
  ];

  // Perform all actions
  for (const file of toCopy) {
    fs.copySync(path.resolve(DEVOPS_PATH, file), path.resolve(file));
  }

  for (const file of toRemove) {
    fs.removeSync(path.resolve(file));
  }

  for (const [from, to] of toRename) {
    fs.renameSync(path.resolve(from), path.resolve(to));
  }

  // We now copy ALL of the dependencies, peerDependecnies, and
  // peerDependenciesMeta to this project's package.json
  const packageJson = JSON.parse(
    fs.readFileSync(path.resolve("package.json"), "utf-8")
  );

  const devopsPackageJson = JSON.parse(
    fs.readFileSync(path.resolve(DEVOPS_PATH, "package.json"), "utf-8")
  );

  const noBundle = new Set(devopsPackageJson.noBundle || []);

  // Remove all dependencies EXCEPT the dependencies found in noBundle. All
  // other dependencies will be bundled in our gimped version.
  devopsPackageJson.dependencies = Object.fromEntries(
    Object.entries(devopsPackageJson.dependencies).filter(([key]) =>
      noBundle.has(key)
    )
  );

  packageJson.dependencies = {
    ...packageJson.dependencies,
    ...devopsPackageJson.dependencies,
  };

  packageJson.peerDependencies = {
    ...packageJson.peerDependencies,
    ...devopsPackageJson.peerDependencies,
  };

  packageJson.peerDependenciesMeta = {
    ...packageJson.peerDependenciesMeta,
    ...devopsPackageJson.peerDependenciesMeta,
  };

  fs.writeFileSync(
    path.resolve("package.json"),
    JSON.stringify(packageJson, null, 2)
  );
}

/**
 * This script will copy the relevant files from the node_modules install of
 * devops to this project to make a full devops release but ONLY with the gimped
 * version of devops for public consumption.
 */
async function run() {
  const DEVOPS_PATH = path.resolve("node_modules", "devops");

  // Update package json with the latest version from the private devops repo
  const version = await getLatestTagAndUpdate();
  // Make sure our packages are up to date
  await ensureInstallationVersion();
  // Do file copies and artifact tasks
  await copyFiles(DEVOPS_PATH);
  // Commit and tag the release
  await commitAndTag(version);
}

run();
