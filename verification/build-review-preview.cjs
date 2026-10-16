// Review harness only. Rebuilds current source modules into the supplied offline React preview.
// Keeps labelled missing-component and pitch-helper fixtures, never writes them into app source.
const fs=require('fs'),path=require('path');
let ts;try { ts=require('typescript'); } catch { ts=require(path.join(require('child_process').execFileSync('npm',['root','-g'],{encoding:'utf8'}).trim(),'typescript')); }
const [root,base,out]=process.argv.slice(2);
if(!root||!base||!out)throw Error('Usage: node build-preview.cjs source-root base-preview.html output.html');
let html=fs.readFileSync(base,'utf8');
const start=html.indexOf('const mods={'), end=html.indexOf('\n}};\nconst cache=',start);
if(start<0||end<0)throw Error('Preview module boundary missing');
const block=html.slice(start+12,end+2);
const matches=[...block.matchAll(/"(\/[^"\n]+)":function\(module,exports,require\)\{\n/g)];
const mods=new Map();
for(let i=0;i<matches.length;i++){
 const m=matches[i],last=i===matches.length-1;
 const body=block.slice(m.index+m[0].length,last?block.length-1:matches[i+1].index-2);
 mods.set(m[1],body);
}
let compiled=0; const fixtures=[], diagnostics=[];
function resolve(id,s){
 if(s.startsWith('@/'))return resolve('/__root.ts','./'+s.slice(2));
 if(!s.startsWith('.'))return s;
 if(s.endsWith('.css'))return '__css';
 const base=path.posix.normalize(path.posix.join(path.posix.dirname(id),s));
 for(const suffix of ['', '.ts','.tsx','.json','/index.ts','/index.tsx'])if(mods.has(base+suffix)||fs.existsSync(path.join(root,base+suffix)))return base+suffix;
 throw Error('Unresolved '+id+' -> '+s);
}
function compile(id){
 const p=path.join(root,id);
 if(!fs.existsSync(p)){fixtures.push(id);return;}
 if(id.endsWith('.json')){mods.set(id,'module.exports = '+fs.readFileSync(p,'utf8')+';');return;}
 const r=ts.transpileModule(fs.readFileSync(p,'utf8'),{fileName:id,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.React,esModuleInterop:true},reportDiagnostics:true});
 if(r.diagnostics.length)diagnostics.push(...r.diagnostics.map(d=>({file:id,text:ts.flattenDiagnosticMessageText(d.messageText,' ')})));
 const body=r.outputText.replace(/require\("([^"\n]+)"\)/g,(m,s)=>`require(${JSON.stringify(resolve(id,s))})`);
 mods.set(id,body);compiled++;
 for(const m of body.matchAll(/require\("(\/[^"\n]+)"\)/g))if(!mods.has(m[1])){mods.set(m[1],'');compile(m[1]);}
}
for(const id of [...mods.keys()])compile(id);
if(diagnostics.length)throw Error(JSON.stringify(diagnostics));
const bundled='const mods={'+[...mods].map(([id,body])=>JSON.stringify(id)+':function(module,exports,require){\n'+body+'\n}').join(',')+'}';
html=html.slice(0,start)+bundled+html.slice(end+3);
// Replace all historical component CSS copies; preserve only the compiled Tailwind prefix.
const styleMatches=[...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)];
const cssIds=[...new Set(styleMatches.flatMap(m=>[...m[1].matchAll(/\/\* Current source: ([^*]+) \*\//g)].map(x=>x[1])))];
if(!cssIds.length)throw Error('No component CSS markers');
const freshCss=cssIds.map(id=>'/* Current source: '+id+' */\n'+fs.readFileSync(path.join(root,id),'utf8')).join('\n');
let inserted=false;
html=html.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/g,(tag,body)=>{
 const first=body.indexOf('/* Current source: '); if(first<0)return tag;
 if(inserted)return '';
 inserted=true;
 return '<style>'+body.slice(0,first)+freshCss+'\n.conversion-preview-note{position:fixed;bottom:3px;left:50%;transform:translateX(-50%);font:9px/1.3 Arial,sans-serif;color:#475569;background:rgba(255,255,255,.9);padding:3px 8px;border-radius:5px;z-index:25;text-align:center;pointer-events:none;max-width:85vw}\n</style>';
});
// Bundle each local image once, then let the existing offline image adapter resolve it.
const assetStart=html.indexOf('const assets='),assetEnd=html.indexOf(';\nconst routeSubs=',assetStart);
if(assetStart<0||assetEnd<0)throw Error('asset map missing');
const assets=JSON.parse(html.slice(assetStart+13,assetEnd));
for(const [key] of Object.entries(assets)){
 const p=path.join(root,'public',key);
 if(!fs.existsSync(p))continue;
 const type=({'.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.svg':'image/svg+xml'})[path.extname(p)];
 if(type)assets[key]='data:'+type+';base64,'+fs.readFileSync(p).toString('base64');
}
for(const name of ['concrete-tile','natural-slate','long-run-metal']){
 const key='/assets/apex-roof-materials/'+name+'.webp';
 assets[key]='data:image/webp;base64,'+fs.readFileSync(path.join(root,'public',key)).toString('base64');
}
html=html.slice(0,assetStart+13)+JSON.stringify(assets)+html.slice(assetEnd);
// Review-only router: honour browser Back/Forward and reload, including file:// use.
html=html.replace("const routeSubs=new Set();let loc={path:'/demo/roofing-site',search:''};", "const routeSubs=new Set();const readRoute=()=>{const hash=window.location.hash.slice(1);const v=hash.startsWith('/')?hash:'/demo/roofing-site';const [pathname,search='']=v.split('?');return {path:pathname.split('#')[0],search};};let loc=readRoute();window.addEventListener('popstate',()=>{loc=readRoute();routeSubs.forEach(f=>f());window.scrollTo(0,0);});");
html=html.replace("loc={path:pathname.split('#')[0],search:query};routeSubs", "loc={path:pathname.split('#')[0],search:query};try{window.history.pushState({},'', '#'+href)}catch{}routeSubs");
html=html.replace("back:()=>navigate('/demo/roofing-site')", "back:()=>window.history.back()");
html=html.replace(/<title>[^<]*<\/title>/,'<title>Apex Roofing - verified review preview</title>');
fs.writeFileSync(out,html);
fs.writeFileSync(out+'.build.json',JSON.stringify({compiledModules:compiled,diagnostics,fixtures,sourceRoot:root,cssIds},null,2));
console.log(JSON.stringify({compiled,fixtures,bytes:html.length,cssIds}));
