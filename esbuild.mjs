// "build": "npx prisma generate && node esbuild.mjs"

import glob from "glob-all";
import ncp from "ncp";
import { execSync } from "child_process";

ncp("./public", "./dist", { overwrite: true }, (err) => {
  if (err) {
    return console.error(err);
  }

  const files = glob.sync(["dist/**/*.js"]);
  for (let file of files) {
    execSync(`esbuild ${file} --outfile=${file} --minify --allow-overwrite`);
  }

  console.log(`Minification Complete! (${files.length} files)`);
});
