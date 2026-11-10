## このフォルダの責務

- `skills-site/` はスキル公開サイト（Astro＋Azure Static Web Apps）、`tools-site/` はツールのドキュメントサイト（VitePress＋GitHub Pages）。それぞれの規約は `skills-site/AGENTS.md` と `tools-site/README.md`。
- 公開する中身は、アンブレラの SSOT（`_umbrella/registry/ai-tools.yaml`・`repo-tools.yaml`）と、そこから辿るスキル・ツールで決まる。公開対象を変えたいときは SSOT 側を直し、サイトのスクリプトに一覧を書き足さない。
- `_umbrella/skills/` は公開元のスキル（AI-skills サブモジュール）を確かめるための入口。ここからスキルを直したら、コミットは `skills/` のリポジトリで行う。

## このフォルダだけを開いたとき

アンブレラ（fdshg693/AI）の `site/` として clone されている前提。共通の手順（Junction・フックの作り方、`_umbrella/` の扱い、2 段階コミット）は [repo-layout](../maintenance/docs/repo-layout.md#サブモジュールを単体で開く)。ビルドや検査はアンブレラのルートの `just skills-site-check` などで行う（pnpm のワークスペースはアンブレラにある）。
