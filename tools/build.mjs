import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import footnote from 'markdown-it-footnote';
import texmath from 'markdown-it-texmath';
import katex from 'katex';

export const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const SITE='https://liyuqin606-del.github.io';
const NAME='清枫玉林';
export const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shortHash=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0,10);
const asset=file=>`/${file}?v=${shortHash(path.join(ROOT,file))}`;
const day=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const md=new MarkdownIt({html:false,linkify:false,typographer:true})
  .use(footnote).use(texmath,{engine:katex,delimiters:['dollars','brackets','beg_end'],katexOptions:{trust:false,throwOnError:true,strict:'warn',maxExpand:1000}});
md.renderer.rules.footnote_caption=(tokens,idx)=>String(Number(tokens[idx].meta.id)+1);
// Render directly so invalid LaTeX fails the build instead of publishing an error message.
for(const type of ['math_inline','math_inline_double','math_block','math_block_eqno']){
  md.renderer.rules[type]=(tokens,i)=>{
    const display=type!=='math_inline';
    const math=katex.renderToString(tokens[i].content,{displayMode:display,trust:false,throwOnError:true,maxExpand:1000});
    return type==='math_block_eqno'?`<div class="numbered-equation">${math}<span class="equation-number">(${escape(tokens[i].info)})</span></div>`:math;
  };
}

export function renderArticle(body){
  const env={};const tokens=md.parse(body,env);const toc=[];let section=0,sub=0;
  for(let i=0;i<tokens.length;i++){
    const token=tokens[i];
    if(token.type!=='heading_open')continue;
    if(token.tag==='h1')throw new Error('正文请从 ## 二级标题开始，文章标题由 front matter 提供。');
    const level=Number(token.tag.slice(1));
    const text=tokens[i+1].content;const id=`section-${toc.length+1}`;
    token.attrSet('id',id);
    if(level===2){section++;sub=0;}else if(level===3)sub++;
    const number=level===2?`${section}`:level===3?`${section}.${sub}`:'';
    if(number){const prefix=new token.constructor('text','',0);prefix.content=`${number}　`;tokens[i+1].children.unshift(prefix);}
    toc.push({id,text,level,number});
  }
  return {html:md.renderer.render(tokens,md.options,env),toc:toc.filter(t=>t.level<=3)};
}

export function readPosts(directory,{preview=false,today=day()}={}){
  if(!fs.existsSync(directory))return [];
  const posts=[];
  for(const file of fs.readdirSync(directory).filter(f=>f.endsWith('.md'))){
    const {data,content}=matter(fs.readFileSync(path.join(directory,file),'utf8'));
    if(data.published!==true&&!preview)continue;
    const slug=file.slice(0,-3);
    if(['about','index','feed','404'].includes(slug))throw new Error(`此文件名为保留路径：${file}`);
    if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))throw new Error(`文章文件名只使用小写字母、数字和连字符：${file}`);
    if(typeof data.title!=='string'||!data.title.trim())throw new Error(`缺少标题：${file}`);
    const date=data.date instanceof Date?data.date.toISOString().slice(0,10):String(data.date||'');
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||Number.isNaN(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date)throw new Error(`日期无效：${file}`);
    if(data.published===true&&date>today)throw new Error(`发布日期不能为未来日期：${file}`);
    if(!content.trim())throw new Error(`文章没有正文：${file}`);
    const tags=data.tags??[];
    if(!Array.isArray(tags)||tags.some(t=>typeof t!=='string'))throw new Error(`tags 须为文字列表：${file}`);
    const summary=data.summary??'';
    if(typeof summary!=='string')throw new Error(`summary 须为文字：${file}`);
    const rendered=renderArticle(content);
    posts.push({slug,title:data.title.trim(),date,tags,summary,body:content,...rendered,minutes:Math.max(1,Math.ceil([...content.replace(/\s/g,'')].length/400)),preview:data.published!==true});
  }
  return posts.sort((a,b)=>b.date.localeCompare(a.date)||a.slug.localeCompare(b.slug));
}

const header=active=>`<a class="skip-link" href="#main">跳至正文</a><header class="book-header page"><a class="book-brand" href="/blog/">清枫玉林<span>李昱嵚的随笔</span></a><nav aria-label="博客导航"><a href="/blog/" ${active==='index'?'aria-current="page"':''}>文章</a><a href="/blog/about/" ${active==='about'?'aria-current="page"':''}>关于</a><a href="/?lang=zh">学术主页 <span aria-hidden="true">↗</span></a></nav></header>`;
const footer=()=>`<footer class="book-footer page"><span>© ${day().slice(0,4)} 李昱嵚 · 清枫玉林</span><div><a href="/blog/feed.xml">RSS 订阅</a><a href="#top">回到页首 ↑</a></div></footer>`;
function shell({title,description,url,active,content,math=false,noindex=false}){
  const pageTitle=title===NAME?NAME:`${title} · ${NAME}`;
  return `<!doctype html><html lang="zh-CN" id="top"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f7f7f2"><title>${escape(pageTitle)}</title><meta name="description" content="${escape(description)}"><meta property="og:type" content="${math?'article':'website'}"><meta property="og:title" content="${escape(pageTitle)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${SITE+url}"><link rel="canonical" href="${SITE+url}">${noindex?'<meta name="robots" content="noindex,nofollow">':''}<link rel="icon" href="/assets/favicon.svg"><link rel="alternate" type="application/rss+xml" title="清枫玉林" href="/blog/feed.xml"><link rel="stylesheet" href="${asset('assets/blog-fonts/fonts.css')}"><link rel="stylesheet" href="${asset('blog.css')}">${math?'<link rel="stylesheet" href="/assets/katex/katex.min.css">':''}</head><body>${header(active)}${content}${footer()}</body></html>`;
}

function indexPage(posts){
  let years='';
  for(const year of [...new Set(posts.map(p=>p.date.slice(0,4)))]){
    years+=`<section class="year-group" aria-label="${year}年随笔"><h3 class="year-label">${year}</h3><div>${posts.filter(p=>p.date.startsWith(year)).map(p=>`<article class="essay-row"><div class="essay-date"><time datetime="${p.date}">${p.date.slice(5).replace('-',' · ')}</time></div><div><h4><a href="/blog/${p.slug}/">${escape(p.title)}</a></h4>${p.summary?`<p>${escape(p.summary)}</p>`:''}<div class="essay-tags">${p.tags.map(escape).join(' / ')}</div></div><span class="essay-arrow" aria-hidden="true">↗</span></article>`).join('')}</div></section>`;
  }
  const empty=`<div class="blank-page"><span class="blank-folio" aria-hidden="true">—</span><div><h3>此处，留待落笔。</h3><p>第一篇随笔，留给下一个值得记下的念头。</p></div></div>`;
  return shell({title:NAME,description:'李昱嵚的中文随笔。关于学习、研究与日常。',url:'/blog/',active:'index',content:`<main id="main" class="page"><section class="book-opening"><div><p class="eyebrow">李昱嵚 · 中文随笔</p><h1>清枫玉林</h1></div><div class="opening-note"><p>关于学习、研究与日常。</p><p>把值得记下的念头，<br>慢慢写下来。</p></div></section><section class="essays" aria-labelledby="essays-title"><div class="section-rule"><h2 id="essays-title">篇目</h2><span>${String(posts.length).padStart(2,'0')} 篇随笔</span></div>${posts.length?years:empty}</section></main>`});
}

function articlePage(post){
  const toc=post.toc.length?`<aside class="contents"><details open><summary>本篇目录</summary><nav aria-label="文章目录">${post.toc.map(t=>`<a class="toc-level-${t.level}" href="#${t.id}"><span>${t.number}</span>${escape(t.text)}</a>`).join('')}</nav></details></aside>`:'<aside class="contents" aria-hidden="true"></aside>';
  return shell({title:post.title,description:post.summary||`${post.title}，李昱嵚的随笔。`,url:`/blog/${post.slug}/`,math:true,noindex:post.preview,content:`<main id="main" class="reading-layout page">${toc}<article class="reading"><header class="article-heading">${post.preview?'<p class="preview-note">本地排版预览 · 不会发布</p>':'<p class="eyebrow">清枫玉林 · 随笔</p>'}<h1>${escape(post.title)}</h1><p class="article-meta"><span>李昱嵚</span><time datetime="${post.date}">${post.date.replaceAll('-',' / ')}</time><span>约 ${post.minutes} 分钟</span></p>${post.summary?`<p class="article-deck">${escape(post.summary)}</p>`:''}</header><div class="prose">${post.html}</div><footer class="article-ending"><span aria-hidden="true">❧</span><p>${post.tags.map(escape).join(' / ')}</p><a href="/blog/">← 全部随笔</a></footer></article></main>`});
}

function aboutPage(){return shell({title:'关于这里',description:'清枫玉林，李昱嵚的中文随笔。',url:'/blog/about/',active:'about',content:`<main id="main" class="page about-page"><p class="eyebrow">清枫玉林</p><h1>关于这里</h1><div class="prose"><p>这里是李昱嵚的中文随笔，记录学习、研究与日常中的所见所思。</p><p>学术背景与研究方向，收录在<a href="/?lang=zh">个人主页</a>。这里留给文字本身。</p><h2>保持联系</h2><p>可以通过 <a href="/blog/feed.xml">RSS</a> 订阅新文章，也可以<a href="mailto:7805250202@csu.edu.cn">写信给我</a>。</p></div></main>`});}

function rss(posts){return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>清枫玉林</title><link>${SITE}/blog/</link><description>李昱嵚的中文随笔</description><language>zh-CN</language><atom:link href="${SITE}/blog/feed.xml" rel="self" type="application/rss+xml"/>${posts.map(p=>`<item><title>${escape(p.title)}</title><link>${SITE}/blog/${p.slug}/</link><guid isPermaLink="true">${SITE}/blog/${p.slug}/</guid><pubDate>${new Date(p.date+'T00:00:00+08:00').toUTCString()}</pubDate><description>${escape(p.summary||p.title)}</description></item>`).join('')}</channel></rss>`;}

export function build({out=path.join(ROOT,'_site'),postsDir=path.join(ROOT,'content/posts'),preview=false}={}){
  // Whitelist site files: source, drafts, dependencies and tools never enter the deployment artifact.
  if(path.resolve(out)===ROOT)throw new Error('输出目录不能是仓库根目录。');
  const posts=readPosts(postsDir,{preview});
  fs.mkdirSync(out,{recursive:true});
  const blog=path.join(out,'blog');
  fs.rmSync(blog,{recursive:true,force:true});
  const write=(relative,text)=>{const dest=path.join(out,relative);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,text);};
  for(const f of ['index.html','styles.css','script.js','figure.css','figure.js','blog.css','robots.txt','.nojekyll'])fs.copyFileSync(path.join(ROOT,f),path.join(out,f));
  fs.cpSync(path.join(ROOT,'assets'),path.join(out,'assets'),{recursive:true});
  const kd=path.join(out,'assets/katex');fs.mkdirSync(kd,{recursive:true});
  fs.copyFileSync(path.join(ROOT,'node_modules/katex/dist/katex.min.css'),path.join(kd,'katex.min.css'));
  fs.cpSync(path.join(ROOT,'node_modules/katex/dist/fonts'),path.join(kd,'fonts'),{recursive:true});
  fs.copyFileSync(path.join(ROOT,'node_modules/katex/LICENSE'),path.join(kd,'LICENSE'));
  write('blog/index.html',indexPage(posts));write('blog/about/index.html',aboutPage());write('blog/feed.xml',rss(posts.filter(p=>!p.preview)));
  for(const p of posts)write(`blog/${p.slug}/index.html`,articlePage(p));
  const urls=['/','/blog/','/blog/about/',...posts.filter(p=>!p.preview).map(p=>`/blog/${p.slug}/`)];
  write('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(u=>`<url><loc>${SITE+u}</loc></url>`).join('')}</urlset>`);
  write('404.html',shell({title:'这一页尚未写下',description:'页面不存在。',url:'/404.html',noindex:true,content:'<main id="main" class="page about-page"><p class="eyebrow">404</p><h1>这一页尚未写下。</h1><p><a href="/blog/">回到清枫玉林 →</a></p></main>'}));
  console.log(`Built ${posts.length} article(s) → ${out}`);
  return posts;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const preview=process.argv.includes('--preview');
  build({preview,out:path.join(ROOT,preview?'.blog-preview':'_site'),postsDir:path.join(ROOT,preview?'content/drafts':'content/posts')});
}
