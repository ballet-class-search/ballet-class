# TODO.md

## 優先度高

- [ ] Static individual pages regeneration flow
  - 完了条件: Google Sheetsの最新データから `school_1.html` から `school_13.html` 相当を再生成でき、卒業生実績も個別ページに表示される。
- [ ] Confirm GitHub Actions is enabled and blocking bad pushes
  - 完了条件: `site-integrity.yml` がGitHub上で実行され、旧 `Ballet Classe` 版やインライン `const CSV_URL` 版を含む変更が失敗することを確認する。
- [ ] Create one canonical generator for all public files
  - 完了条件: `index.html`, `schools-data.js`, `school_*.html`, `sitemap.xml` を同じデータ構造から生成でき、旧インラインHTMLを生成しない。

## 優先度中

- [ ] Search Console recrawl workflow
  - 完了条件: Search Consoleでトップページとサイトマップを送信し、タイトル・説明文・ファビコンの反映状況を確認する。
- [ ] Improve production CSS handling
  - 完了条件: Tailwind CDN警告を解消するか、CDN利用を当面の方針として明記する。
- [ ] Document spreadsheet column schema
  - 完了条件: CSV列名、読み込み候補名、複数値の区切りルールをMarkdownまたは生成スクリプト内で一覧化する。

## 優先度低

- [ ] Add richer article/SEO pages
  - 完了条件: バレエ教室選び、留学、コンクール、メソッド比較などの記事ページが追加され、トップやサイトマップから辿れる。
- [ ] Add visual regression screenshots
  - 完了条件: PC幅とスマホ幅でトップ・モーダル・個別ページのスクリーンショット確認手順が用意される。

## 保留

- [ ] HTTPS/canonical policy review
  - 完了条件: HTTPSが安定運用されていることを確認し、canonical、OG URL、Search Console設定を必要に応じて統一する。

## 完了済み

- [x] Restore top page from old inline `Ballet Classe` version
  - 完了条件: `index.html` が `Ballet Map` 版になり、外部 `schools-data.js` と `app.js` を読む。
- [x] Add graduate performance filter
  - 完了条件: `卒業生実績` プルダウンが表示され、セル内スペース区切りのバレエ団名で絞り込める。
- [x] Hide click count from users
  - 完了条件: モーダルにクリック数表示が出ない。
- [x] Add old-version integrity guard
  - 完了条件: `scripts/check_site_integrity.py` と `.github/workflows/site-integrity.yml` が存在する。
