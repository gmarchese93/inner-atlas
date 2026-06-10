import { rmSync } from "node:fs";

for (const lockfile of ["package-lock.json", "yarn.lock"]) {
  rmSync(lockfile, { force: true });
}

const managerEvidence = [
  process.env.npm_config_user_agent,
  process.env.npm_execpath,
]
  .filter(Boolean)
  .join(" ")
  .toLowerCase();

if (!managerEvidence.includes("pnpm")) {
  console.error("Use pnpm instead");
  process.exit(1);
}
