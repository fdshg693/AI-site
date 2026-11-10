/**
 * GitHub links for umbrella-relative paths (fdshg693/AI).
 *
 * After the submodule split, `skills/`, `tools/`, `agent-compat/` and `site/`
 * are gitlinks in the umbrella: `github.com/fdshg693/AI/tree/main/tools/aim`
 * is a 404. A path under a submodule is linked into that submodule's own
 * repository instead (read from the umbrella's `.gitmodules`), at its `main`.
 * Shared by skills-site and tools-site.
 */

import fs from "node:fs";
import path from "node:path";

export const UMBRELLA_GITHUB_URL = "https://github.com/fdshg693/AI";

/** Parse `.gitmodules` text into [{ path, url }] (url without `.git`), longest path first. */
export function parseGitmodules(text) {
  const sections = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#") || line.startsWith(";")) continue;
    if (line.startsWith("[")) {
      sections.push({});
      continue;
    }
    const index = line.indexOf("=");
    if (index === -1 || sections.length === 0) continue;
    sections[sections.length - 1][line.slice(0, index).trim()] = line.slice(index + 1).trim();
  }
  return sections
    .filter((section) => section.path && section.url)
    .map((section) => ({
      path: section.path.replace(/\\/g, "/").replace(/\/+$/, ""),
      url: section.url.replace(/\.git$/, "").replace(/\/+$/, ""),
    }))
    .sort((a, b) => b.path.length - a.path.length);
}

export function loadSubmodules(repoRoot) {
  const file = path.join(repoRoot, ".gitmodules");
  return fs.existsSync(file) ? parseGitmodules(fs.readFileSync(file, "utf8")) : [];
}

/**
 * Returns `(kind, repoRelativePath) => url` where kind is "tree" or "blob".
 * Paths inside a submodule resolve to that submodule's repository.
 */
export function createGithubUrl(submodules, baseUrl = UMBRELLA_GITHUB_URL) {
  return (kind, repoRelativePath) => {
    const target = repoRelativePath.replace(/\\/g, "/").replace(/^\/+/, "");
    for (const submodule of submodules) {
      if (target === submodule.path) return `${submodule.url}/tree/main`;
      if (target.startsWith(`${submodule.path}/`)) {
        return `${submodule.url}/${kind}/main/${target.slice(submodule.path.length + 1)}`;
      }
    }
    return `${baseUrl}/${kind}/main/${target}`;
  };
}
