# 清枫玉林 · 写作说明

作者：李昱嵚。博客地址：https://liyuqin606-del.github.io/blog/

## 开始一篇随笔

最方便的方式是先在自己熟悉的编辑器（例如 Obsidian）写 Markdown，写好后再发布。也可以在网站项目目录运行：

```sh
npm ci --ignore-scripts
npm run new -- my-first-note "我的第一篇随笔"
```

这会在 `content/drafts/my-first-note.md` 建立草稿，不覆盖已有文件。`content/drafts/` 已加入 Git 忽略列表，留在本机。

文章格式如下。文件名用小写英文、数字和连字符，它也会成为文章网址。标题可以是中文。

```markdown
---
title: "我的第一篇随笔"
date: "2026-09-18"
summary: "在这里写一两句文章简介，也可以留空。"
tags: [随笔]
published: false
---

在这里写正文，每段之间空一行。

## 第一节

正文的小标题从二级开始，系统会自动加章节编号和目录。

### 一个小节

行内公式用 $x^2+y^2=z^2$，独立公式用：

$$
\int_0^1 x\,dx=\frac{1}{2}
$$ (1)

需要补充说明时，可以使用脚注。[^note]

[^note]: 脚注的内容。
```

网页采用 LaTeX 风格的中文书页排版；公式由 KaTeX 在构建时生成，同时带有 MathML。无需读者安装 LaTeX，也不依赖浏览器执行 JavaScript。支持常见 LaTeX 数学语法，不是完整的 `.tex` 编译器；不支持的公式会阻止发布并给出错误。

## 本地预览

```sh
npm run preview
python3 -m http.server 4181 --bind 127.0.0.1 --directory .blog-preview
```

打开 http://127.0.0.1:4181/blog/ 。此预览读取本机 `content/drafts/`，显示“本地排版预览 · 不会发布”；不会进入 RSS 和站点地图。编辑后重新运行 `npm run preview`，刷新浏览器即可。`.blog-preview/` 不会上传。

## 发布

1. 完成文章，把日期改为实际发布日期，设为 `published: true`。
2. 将该文件从 `content/drafts/` 移到 `content/posts/`。
3. 执行 `npm test && npm run build`，在 `_site/` 预览公开版本。
4. 提交并推送到 GitHub 的 `main` 分支。GitHub Actions 会自动生成文章列表、正文、RSS 和站点地图，然后部署。以 Actions 的部署成功为准。

也可以直接在 GitHub 网页的 `content/posts/` 目录使用 **Add file → Create new file**，写入以上格式并将 `published` 设为 `true`。无需在本机安装工具。

**仓库是公开的。** 提交到仓库的源文件可以被查看，即使 `published: false`；未准备公开的文章应一直保留在本机 `content/drafts/`，不要强制加入 Git。公开构建只收录明确设置 `published: true` 的文章。不会提前发布未来日期，也没有定时任务；请在实际发布时填写当天或更早日期。

修改旧文：编辑原 Markdown 后再次推送，保持文件名便能保留文章链接。撤下文章：将其移回本地草稿目录或改为 `published: false` 后重新部署；已公开内容仍可能留在 Git 历史和他人的缓存中。

## 图片、打印与订阅

图片放入 `assets/blog/`，正文写 `![图片说明](/assets/blog/example.jpg)`。图片也会随仓库公开。

浏览器的“打印 / 存储为 PDF”使用 A4 文章版式，会隐藏导航和侧栏。RSS 地址为 https://liyuqin606-del.github.io/blog/feed.xml 。

页脚、目录、字体与数学公式全部由网站本身提供；没有评论账户、统计追踪或第三方在线字体请求。
