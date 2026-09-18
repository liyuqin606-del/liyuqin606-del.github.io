import fs from 'node:fs';
import path from 'node:path';
import {ROOT} from './build.mjs';
const [slug,title]=process.argv.slice(2);
if(!slug||!title||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)||['about','index','feed','404'].includes(slug)){
  console.error('用法：npm run new -- my-first-note "我的第一篇随笔"（文件名用小写字母、数字和连字符）');process.exit(1);
}
const date=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const file=path.join(ROOT,'content/drafts',slug+'.md');
fs.mkdirSync(path.dirname(file),{recursive:true});
fs.writeFileSync(file,`---\ntitle: ${JSON.stringify(title)}\ndate: "${date}"\nsummary: ""\ntags: []\npublished: false\n---\n\n在这里写下正文。\n\n## 第一节\n\n继续写下你的想法。\n`,{flag:'wx'});
console.log(`已建立本地草稿：${file}\n预览：npm run preview。写好后按 WRITING.md 发布。`);
