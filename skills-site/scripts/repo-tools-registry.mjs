/**
 * Reads registry/repo-tools.yaml, the SSOT for tools/-installed CLI
 * tools that SKILL.md meta.requires_repo_tools / meta.requires_install
 * declare (see maintenance/scripts/skill/util/repo_tools_registry.py, its Python
 * counterpart). Exposes the "installable tools" list rendered on the site:
 * name + GitHub folder link only, no install instructions.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import { createGithubUrl, loadSubmodules } from "./github-url.mjs";

const SCRIPT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIRECTORY, "..", "..", "..");
const REPO_TOOLS_YAML_PATH = path.join(REPO_ROOT, "registry", "repo-tools.yaml");

const githubUrl = createGithubUrl(loadSubmodules(REPO_ROOT));

export function loadRepoToolsRegistry(filePath = REPO_TOOLS_YAML_PATH) {
  const data = yaml.load(fs.readFileSync(filePath, "utf8"));
  if (!data || typeof data !== "object" || !data.tools || typeof data.tools !== "object") {
    throw new Error(`${filePath}: expected a top-level 'tools' mapping`);
  }
  return Object.entries(data.tools)
    .map(([name, definition]) => ({
      name,
      path: definition?.path ?? "",
      githubUrl: githubUrl("tree", definition?.path ?? ""),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "en"));
}

/** Ordered list of repo-tools.yaml entries: { name, path, githubUrl }. */
export const REPO_TOOLS_REGISTRY = loadRepoToolsRegistry();
