#!/usr/bin/env node

import fs from "fs";
import path from "path";
import url from "url";
import pine from "../dist/index.js";

const task = process.argv.slice(2);
const supportedExts = [".mjs", ".js"];

let args = process.argv.slice(2);
let firstArg = args.find((a) => !a.startsWith("--"));

try {
  let filepath;
  if (firstArg.startsWith("/")) {
    filepath = firstArg;
  } else if (firstArg.startsWith("file:///")) {
    filepath = url.fileURLToPath(firstArg);
  } else {
    filepath = path.resolve(firstArg);
  }

  const ext = path.extname(filepath);
  if (!supportedExts.includes(ext)) {
    throw new Error(
      `File is not supported: ${path.basename(
        filepath
      )}. Supports: ${supportedExts.join(", ")} files`
    );
  }

  Object.assign(global, pine);
  pine.api.runCLI(args, false);
  await import(filepath);
} catch (err) {
  pine.log.error(err);
}
