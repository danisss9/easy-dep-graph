#! /usr/bin/env node

import shell from "shelljs";

/* import path from "path";
import fs from "fs-extra";
import concat from "concat";
import { nanoid } from "nanoid"; */

void (async function main() {
  // Get if user wants to only see a specific package
  const packageArgIndex = process.argv.findIndex(
    (a) => a.toLowerCase() === "--package"
  );
  const packageName =
    packageArgIndex !== -1 ? process.argv[packageArgIndex + 1] : undefined;

  // Run npm list command
  const result = shell.exec(`npm list --json ${packageName ?? "--all"}`, {
    windowsHide: true,
    silent: true,
  });

  // Parse the result to a JSON object
  const packageInfo: PackageInfo = JSON.parse(result.stdout);
  console.log(`Generating dependencies graph for: "${packageInfo.name}"...`);
})();

interface PackageInfo {
  name: string;
  version: string;
  dependencies: Record<string, Dependecy>;
}

interface Dependecy {
  version: string;
  overridden?: boolean;
  dependencies?: Record<string, Dependecy>;
}

interface FlatDependecy {
  version: string;
  dependencies: string[];
}

function getDependecies(
  deps: Record<string, Dependecy>,
  flatDeps: Record<string, FlatDependecy>
): void {
  /*   for (const dep of Object.entries(deps)) {
    const depName = dep[0];
    const depInfo = dep[1];




    flatDeps[dep[0]] = 

    
  }

  return flatDeps; */
}
