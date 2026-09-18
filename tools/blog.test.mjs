import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {renderArticle,readPosts,build} from './build.mjs';
const fixture=(t)=>{const d=fs.mkdtempSync(path.join(os.tmpdir(),'qingfeng-test-'));t.after(()=>fs.rmSync(d,{recursive:true,force:true}));return d;};
const article=(body='正文。',meta='')=>`---\ntitle: "测试文章"\ndate: "2026-09-01"\npublished: true\n${meta}\n---\n\n${body}`;
test('LaTeX renders server-side, headings have anchors, footnotes round-trip',()=>{
  const {html,toc}=renderArticle('## 直觉\n\n令 $x^2$ 为平方。[^note]\n\n$$\\int_0^1 x\\,dx=\\frac12$$ (1)\n\n[^note]: 注释内容。');
  assert.match(html,/class="katex"/);assert.match(html,/<math /);assert.match(html,/equation-number">\(1\)/);assert.match(html,/id="fn1"/);assert.match(html,/href="#fnref1"/);assert.equal(toc[0].id,'section-1');assert.match(html,/1　直觉/);
  assert.throws(()=>renderArticle('$\\doesnotexist{x}$'),/Undefined control sequence/);
});
test('untrusted markup is escaped; trusted HTML is disabled',()=>{
  const {html}=renderArticle('<script>alert(1)</script>\n\n[link](javascript:alert(1))');
  assert.doesNotMatch(html,/<script|href="javascript:/);assert.match(html,/&lt;script&gt;/);
});
test('only explicitly published posts enter the public build',t=>{
  const d=fixture(t);fs.writeFileSync(path.join(d,'public.md'),article());
  fs.writeFileSync(path.join(d,'secret.md'),article('secret sentence').replace('published: true','published: false'));
  assert.deepEqual(readPosts(d,{today:'2026-09-18'}).map(p=>p.slug),['public']);
  assert.equal(readPosts(d,{preview:true,today:'2026-09-18'}).length,2);
  const out=path.join(fixture(t),'site');build({out,postsDir:d});
  assert.ok(fs.existsSync(path.join(out,'blog/public/index.html')));assert.ok(!fs.existsSync(path.join(out,'blog/secret')));assert.ok(!fs.existsSync(path.join(out,'content')));assert.ok(!fs.existsSync(path.join(out,'node_modules')));
  for(const f of ['blog/index.html','blog/feed.xml','sitemap.xml'])assert.doesNotMatch(fs.readFileSync(path.join(out,f),'utf8'),/secret/);
});
test('reject reserved paths, future or invalid dates and missing bodies',t=>{
  const d=fixture(t),file=path.join(d,'about.md');fs.writeFileSync(file,article());assert.throws(()=>readPosts(d),/保留路径/);fs.unlinkSync(file);
  const p=path.join(d,'valid.md');
  fs.writeFileSync(p,article().replace('2026-09-01','2099-09-01'));assert.throws(()=>readPosts(d),/未来/);
  fs.writeFileSync(p,article().replace('2026-09-01','2026-02-30'));assert.throws(()=>readPosts(d),/日期无效/);
  fs.writeFileSync(p,article(''));assert.throws(()=>readPosts(d),/没有正文/);
});
test('empty collection is honest and rebuild removes withdrawn articles',t=>{
  const d=fixture(t),out=path.join(fixture(t),'site');const file=path.join(d,'withdraw.md');fs.writeFileSync(file,article());build({out,postsDir:d});fs.unlinkSync(file);build({out,postsDir:d});
  assert.ok(!fs.existsSync(path.join(out,'blog/withdraw')));assert.match(fs.readFileSync(path.join(out,'blog/index.html'),'utf8'),/00 篇随笔/);
});
