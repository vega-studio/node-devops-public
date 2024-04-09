#!/usr/bin/env bun
import fs from "fs-extra";
import path from "path";
import { execSync } from "./exec-sync";

/**
 * This script will copy the relevant files from the node_modules install of
 * devops to this project to make a full devops release but ONLY with the gimped
 * version of devops for public consumption.
 */
async function run() {
  const DEVOPS_PATH = path.resolve("node_modules", "devops");
  // DO a complete sync of the dependencies to ensure we are absolutely up to
  // date
  fs.removeSync("node_modules/devops");
  execSync("bun", ["pm", "cache", "rm"]);
  execSync("bun", ["i"]);

  // Let the file system flush
  await new Promise((r) => setTimeout(r, 1000));

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

run();
