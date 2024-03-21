#!/usr/bin/env bun
import fs from "fs-extra";
import path from "path";

/**
 * This script will copy the relevant files from the node_modules install of
 * devops to this project to make a full devops release but ONLY with the gimped
 * version of devops for public consumption.
 */
async function run() {
  const DEVOPS_PATH = path.resolve("node_modules", "devops");

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
    fs.removeSync(path.resolve(DEVOPS_PATH, file));
  }

  for (const [from, to] of toRename) {
    fs.renameSync(path.resolve(from), path.resolve(to));
  }
}

run();
