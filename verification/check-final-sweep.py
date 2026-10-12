"""Current-source standalone review tests. Does not call the live assistant/admin.
Run: python verification/check-final-sweep.py /absolute/path/to/preview.html
Requires Python Playwright and Chromium. Emulated viewport/keyboard != physical phone.
"""
import json, os, sys, traceback, base64
from pathlib import Path
from playwright.sync_api import sync_playwright
HTML=Path(sys.argv[1]).read_bytes()
OUT=Path(os.getenv('FINAL_EVIDENCE','/mnt/data/apex-verified-sweep/final-evidence'));OUT.mkdir(parents=True,exist_ok=True)
ROOT=Path(__file__).resolve().parents[1]
# Navigation to local HTTP/file origins is blocked in this runtime. Use set_content.
# The following storage shim tests the same-tab data contract, not real browser persistence.
STORAGE="""() => { class MemoryStorage {constructor(){this.data={}} getItem(k){return this.data[k]??null} setItem(k,v){this.data[k]=String(v)} removeItem(k){delete this.data[k]} clear(){this.data={}} key(i){return Object.keys(this.data)[i]??null} get length(){return Object.keys(this.data).length}}
Object.defineProperty(window,'sessionStorage',{configurable:true,value:new MemoryStorage()});Object.defineProperty(window,'localStorage',{configurable:true,value:new MemoryStorage()}); }"""
checks=[];cases=[];errors=[]
def check(ok,label):
 if not ok:raise AssertionError(label)
 checks.append(label)
def button(p,label):return p.get_by_role('button',name=label,exact=True)
def settle(p):p.wait_for_timeout(100)
def state(p):return p.evaluate("__APEX_REQUIRE('/lib/demo-helper/store.ts').getHelper()")
def fresh(browser,w=390,h=844):
 ctx=browser.new_context(viewport={'width':w,'height':h},has_touch=w<980,is_mobile=w<=430)
 p=ctx.new_page();p.set_default_timeout(6000);p.on('pageerror',lambda e:errors.append(str(e)));p.route('https://**',lambda route:route.abort());p.evaluate(STORAGE);p.set_content(HTML.decode(),wait_until='load');return p

def start(p):button(p,'Start the demo').click();settle(p)
def quick(p):
 start(p);button(p,'Skip task').click();button(p,'Skip task').click();button(p,'Open the Quick Roof Estimate').click();settle(p)
def calc(p):p.get_by_role('button',name='Calculate this example',exact=False).click();settle(p)
def enquiry(p):p.get_by_role('button',name='Request a quote',exact=False).click();settle(p)
def normalised(p):return p.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')
def case(name,fn):
 try:fn();cases.append({'name':name,'passed':True});print('PASS',name,flush=True)
 except Exception as e:cases.append({'name':name,'passed':False,'error':str(e)});print('FAIL',name,repr(e),flush=True);traceback.print_exc()

def layout(browser,w,h):
 p=fresh(browser,w,h);start(p);button(p,'Open assistant + add example').click();settle(p)
 g=p.locator('.dh-panel').bounding_box();a=p.locator('[data-apex-assistant]').bounding_box();c=p.locator('.dh-content').bounding_box();i=p.locator('[data-apex-assistant] textarea').bounding_box()
 sep=(a['y']+a['height']<=g['y'] or a['x']>=g['x']+g['width'] or g['x']>=a['x']+a['width'])
 check(sep,'helper and assistant do not overlap');check(c['height']>=60 and c['y']+c['height']<=g['y']+g['height'],'instruction region is usable and inside panel')
 instruction=p.locator('.dh-instruction').bounding_box();check(instruction['y']>=c['y'] and instruction['y']+instruction['height']<=c['y']+c['height'],'next instruction is actually visible, not scrolled out of the panel');
 check(i['y']+i['height']<=a['y']+a['height']+1,'input stays inside visible assistant');check(normalised(p),'no horizontal page overflow')
 check(not state(p)['collapsed'],'preparing never hides guide');check(p.get_by_role('button',name='Open assistant + add example',exact=True).count()==0,'no duplicate prefill button')
 if w<980:
  for label in ['Close assistant','Start new conversation','Send message']:
   r=p.locator('[data-apex-assistant]').get_by_role('button',name=label,exact=True).bounding_box();check(r['width']>=44 and r['height']>=44,label+' has 44px touch target')
 if w in (390,844):p.screenshot(path=str(OUT/f'assistant-{w}-{h}.png'))
 p.context.close()

def end_to_end(browser,w,h):
 p=fresh(browser,w,h);quick(p)
 photos=p.locator('.qr-demo-example img');check(photos.count()==3,'three actual photo assets displayed');check(photos.evaluate_all('(imgs)=>imgs.every(i=>i.complete&&i.naturalWidth>0)'),'all photos decoded')
 check('pre-filled' in p.locator('.qr-demo-example').inner_text().lower(),'shortcut explicitly explained')
 if w in (390,1440):p.screenshot(path=str(OUT/f'sample-{w}.png'),full_page=True)
 calc(p);check(p.locator('.qr-example-result').is_visible(),'result identifies prefilled example');enquiry(p)
 p.get_by_role('button',name='Preview with example details',exact=False).click();settle(p)
 check(state(p)['status']['quick-price']=='observed','enquiry not merely navigation completes task')
 p.get_by_role('button',name='Return to my estimate',exact=False).click();settle(p);check(p.locator('.t3-cv-closing').count()==0,'benefit has no automatic reading timer')
 p.get_by_role('button',name='What could this do for my business?',exact=False).click();settle(p)
 check('What if you could have solutions like this for $999?' in p.locator('.t3-cv-offer').inner_text(),'approved offer unchanged')
 button(p,'Keep exploring').click();settle(p)
 dash=p.get_by_role('button',name='Explore the business dashboard',exact=False)
 check(dash.evaluate("e=>getComputedStyle(e).backgroundColor")=='rgb(5, 6, 7)','dashboard button is opaque black')
 dash.click();settle(p);check('/admin' in p.url,'one click reaches admin destination in review router')
 check(p.get_by_role('button',name='Open the business dashboard',exact=True).count()==0,'no repeated dashboard open action')
 check(p.get_by_role('heading',name='This part needs the running website.').is_visible(),'missing admin is clearly labelled, never faked')
 button(p,'Hide guide').click();p.get_by_role('navigation',name='Business dashboard navigation').get_by_role('link',name='Back to Apex Roofing',exact=False).click();settle(p)
 check('/admin' not in p.url,'return works with helper hidden');check(state(p)['collapsed'],'return honours manual hide');check(p.locator('.t3-cv-closing').count()==0,'closing does not reappear after admin return');check(normalised(p),'flow has no horizontal overflow')
 saved=p.evaluate("sessionStorage.getItem('apex.demo.conversion.v1')");check(json.loads(saved)['closerSeen'],'once-only flag is saved for reload (storage-contract check)')
 p.context.close()

def enquiry_memory(browser):
 p=fresh(browser,320,568);quick(p);calc(p);enquiry(p);button(p,'Edit details / add notes or files').click()
 p.locator('input[autocomplete=name]').fill('Alex Example');p.locator('input[autocomplete=email]').fill('alex.'+'longword'*12+'@example.com');p.locator('.qr-enquiry textarea').fill('Please review '+('X'*180))
 png=base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aC2EAAAAASUVORK5CYII=')
 p.locator('input[type=file]').set_input_files({'name':'Example-roof.png','mimeType':'image/png','buffer':png})
 button(p,'Close quote enquiry').click();enquiry(p)
 check(p.locator('input[autocomplete=name]').input_value()=='Alex Example','contact not lost on close/reopen')
 check('X'*180 in p.locator('.qr-enquiry textarea').input_value(),'notes not lost on close/reopen')
 p.get_by_role('button',name='Preview my enquiry',exact=False).click();settle(p)
 check('Example-roof.png' in p.locator('.qr-enquiry-confirm').inner_text(),'file metadata retained without uploading')
 check(normalised(p),'long notes/email do not overflow mobile')
 p.get_by_role('button',name='Return to my estimate',exact=False).click();enquiry(p)
 check(p.locator('.qr-enquiry-confirm').is_visible(),'reopening a prepared enquiry retains confirmation')
 saved=p.evaluate('JSON.stringify({session:sessionStorage.data,local:localStorage.data})');check('Alex Example' not in saved and 'Example-roof.png' not in saved,'no contact or attachment data persisted to storage')
 p.screenshot(path=str(OUT/'enquiry-mobile.png'),full_page=True);p.context.close()

def keyboard_view(browser):
 p=fresh(browser,390,844);start(p);button(p,'Open assistant + add example').click();settle(p)
 check(not p.locator('textarea[aria-label="Ask the Smart Assistant"]').evaluate('e=>e===document.activeElement'),'prefill does not force mobile keyboard open')
 # This is a viewport simulation, not a claim to run a real phone keyboard.
 p.evaluate("Object.defineProperty(visualViewport,'height',{configurable:true,get:()=>320});Object.defineProperty(visualViewport,'offsetTop',{configurable:true,get:()=>100});visualViewport.dispatchEvent(new Event('resize'))")
 settle(p);g=p.locator('.dh-panel').bounding_box();a=p.locator('[data-apex-assistant]').bounding_box();c=p.locator('.dh-content').bounding_box();check(g['y']>=100 and g['y']+g['height']<=420,'guide fits reduced visual viewport');check(a['y']>=100 and a['y']+a['height']<=g['y'],'assistant fits above guide');check(c['height']>=60,'keyboard layout still shows the instruction')
 p.context.close()

def admin_early(browser):
 p=fresh(browser);start(p);button(p,'1 of 3 ▾').click();p.get_by_role('navigation',name='Choose a demo task').get_by_role('button',name='Business dashboard',exact=False).click();settle(p)
 check('/admin' in p.url,'task-menu dashboard entry also navigates once');check(p.locator('.t3-cv-closing').count()==0,'opening optional admin does not force final invitation')
 p.go_back();settle(p);check(state(p)['current']=='answers','browser Back resumes unfinished tour')
 button(p,'Finish tour').click();settle(p);check(p.locator('.t3-cv-closing').is_visible(),'early admin exploration does not lose final invitation');p.context.close()

def panel_safety(browser):
 p=fresh(browser);start(p);button(p,'Open assistant + add example').click();settle(p)
 button(p,'Start new conversation').click();settle(p)
 check(p.locator('.sa-reset-dialog').evaluate('e=>e.open'),'reset confirmation is native modal above helper')
 check(p.locator('.sa-reset-dialog').evaluate('e=>e.contains(document.activeElement)'),'reset gets focus')
 p.keyboard.press('Escape');settle(p);check(p.locator('[data-apex-assistant]').is_visible(),'Escape closes only confirmation')
 check(p.locator('.sa-reset-dialog').count()==0,'confirmation dismissed')
 button(p,'Finish tour').click();settle(p);check(p.locator('.t3-cv-closing').is_visible(),'finish works while chat open')
 check(p.evaluate('document.body.style.overflow')=='hidden','modal holds scroll lock');p.keyboard.press('Escape');settle(p)
 check(p.locator('[data-apex-assistant]').is_visible(),'Escape on invitation does not close chat beneath')
 check(p.evaluate('document.body.style.overflow')=='hidden','assistant retains own scroll lock');button(p,'Close assistant').click();settle(p);check(p.evaluate('document.body.style.overflow')!='hidden','last panel release unlocks body');p.context.close()

def microphone(browser):
 p=fresh(browser);p.evaluate("() => {window.__speechStarts=0;window.SpeechRecognition=class{start(){window.__speechStarts++}stop(){this.onend?.()}};}")
 start(p);button(p,'Open assistant + add example').click();button(p,'Start voice input').click();check(p.evaluate('__speechStarts')==1,'test recognition started once')
 button(p,'Close assistant').click();settle(p);check(p.evaluate('__speechStarts')==1,'recognition cannot restart while hidden');p.context.close()

def overlapping_enquiries(browser):
 p=fresh(browser);quick(p);calc(p);enquiry(p);p.get_by_role('button',name='Open Smart Assistant',exact=True).click();settle(p)
 check('quick-enquiry' in p.evaluate("__APEX_REQUIRE('/lib/demo-helper/store.ts').surfaceSnapshot()"),'open enquiry remains tracked when chat opens')
 button(p,'Close assistant').click();button(p,'Finish tour').click();settle(p);check(p.locator('.t3-cv-closing').count()==0,'invitation waits while enquiry is still open after chat closes')
 button(p,'Close quote enquiry').click();settle(p);check(p.locator('.t3-cv-closing').is_visible(),'queued invitation appears after enquiry closes');p.context.close()

def accessibility(browser):
 p=fresh(browser,390,844);p.emulate_media(reduced_motion='reduce',contrast='more');p.locator('.t3-cv-dialog').get_by_role('button',name='Explore on my own',exact=True).click();settle(p)
 launch=p.locator('.dh-launcher');launch.hover();check(launch.evaluate('e=>getComputedStyle(e).transform')=='none','reduced motion disables launcher enlargement');check(launch.evaluate('e=>getComputedStyle(e).backgroundColor')=='rgb(10, 11, 16)','increased contrast gets solid background');p.context.close()

def full_questionnaire(browser,w,h,kind):
 p=fresh(browser,w,h);quick(p);button(p,'Try the full tool instead').click();button(p,'Hide guide').click();settle(p)
 def choose(name,value):
  p.locator(f'label.qr-choice:has(input[name="{name}"][value="{value}"])').click();settle(p)
 def next_step():
  check(normalised(p),'questionnaire step fits viewport');p.get_by_role('button',name='Continue',exact=False).click();settle(p)
 check(p.get_by_role('heading',name='Which roof looks most like yours?',exact=True).is_visible(),'full tool starts at roof choice')
 if kind=='flat':choose('category','flat')
 else:choose('shape','hip')
 next_step();choose('size','medium');choose('storeys','2')
 if kind=='mixed':choose('extension','yes');choose('extension-size','medium');choose('flat-complexity','complex')
 if kind=='flat':choose('flat-complexity','simple')
 next_step()
 if kind!='flat':choose('pitch','typical');next_step()
 choose('project','reroof');choose('existing','membrane' if kind=='flat' else 'tile');next_step()
 choose('covering','grp' if kind=='flat' else 'tile')
 if kind=='mixed':choose('flat-covering','epdm')
 p.get_by_role('button',name='See my estimate',exact=False).click();settle(p)
 check(p.locator('.qr-price-value').is_visible(),'complete questionnaire produces a local calculated range')
 check(p.locator('.qr-example-result').count()==0,'own roof result is not labelled as sample')
 check(normalised(p),'own roof result fits viewport')
 check('Flat-roof extension' in p.locator('.qr-home-summary').inner_text() if kind=='mixed' else True,'mixed section remains in summary')
 enquiry(p);button(p,'Edit details / add notes or files').click();p.locator('input[autocomplete=name]').fill('Jamie Example');p.locator('input[autocomplete=email]').fill('jamie@example.com')
 p.get_by_role('button',name='Preview my enquiry',exact=False).click();settle(p)
 check('Jamie Example' in p.locator('.qr-enquiry-confirm').inner_text(),'own roof can use normal editable enquiry')
 p.get_by_role('button',name='Return to my estimate',exact=False).click();settle(p)
 p.get_by_role('button',name='Change my roof',exact=False).click();settle(p)
 choose('size','small') if p.locator('input[name=size]').count() else None
 # Move to Size, change a property, then return via all normal screens.
 next_step();choose('size','small');next_step()
 if kind!='flat':next_step()
 next_step();p.get_by_role('button',name='See my estimate',exact=False).click();settle(p);enquiry(p)
 check(p.locator('.qr-enquiry-confirm').count()==0,'changed roof does not resurrect prior enquiry confirmation')
 # State is reset for new roof input rather than attached to the wrong estimate.
 if p.get_by_role('button',name='Edit details / add notes or files',exact=True).count():button(p,'Edit details / add notes or files').click()
 check(p.locator('input[autocomplete=name]').input_value()=='','new roof does not inherit old enquiry contact')
 check(normalised(p),'new enquiry remains within viewport')
 p.context.close()

def desktop_position(browser):
 p=fresh(browser,1440,900);start(p);button(p,'Open assistant + add example').click();settle(p)
 # Use the actual drag handle; moving down cannot put the input outside the window.
 handle=p.locator('[data-apex-assistant] [aria-label="Drag to move"]')
 if handle.count()==0:
  # Desktop header carries the pointer handlers, while its buttons remain separate.
  handle=p.locator('[data-apex-assistant]').locator('header')
 rect=handle.bounding_box()
 p.mouse.move(rect['x']+max(10,rect['width']*.3),rect['y']+12);p.mouse.down();p.mouse.move(1370,885,steps=8);p.mouse.up();settle(p)
 rect=p.locator('[data-apex-assistant]').bounding_box();check(rect['y']>=0 and rect['y']+rect['height']<=900,'dragging keeps the whole assistant within desktop')
 p.context.close()

with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path=os.getenv('CHROMIUM','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
 for w,h in [(320,568),(360,640),(390,844),(430,932),(768,1024),(844,390),(1024,768),(1440,900),(390,320)]:case(f'panel layout {w}x{h}',lambda w=w,h=h:layout(b,w,h))
 for w,h in [(320,568),(390,844),(768,1024),(1440,900)]:case(f'full local flow {w}x{h}',lambda w=w,h=h:end_to_end(b,w,h))
 for name,fn in [('enquiry memory and long text',enquiry_memory),('simulated phone keyboard',keyboard_view),('early admin and browser Back',admin_early),('native modal and scroll ownership',panel_safety),('microphone close safety (mock)',microphone),('overlapping enquiry surfaces',overlapping_enquiries),('motion and contrast',accessibility)]:case(name,lambda fn=fn:fn(b))
 for w,h,kind in [(320,568,'pitched'),(390,844,'flat'),(390,844,'mixed'),(1440,900,'pitched')]:case(f'full homeowner questionnaire {kind} {w}px',lambda w=w,h=h,kind=kind:full_questionnaire(b,w,h,kind))
 case('desktop assistant drag bounds',lambda:desktop_position(b))
 b.close()

report={'scenarios':cases,'assertionsPassed':len(checks),'checks':checks,'pageErrors':errors,'boundary':'Offline current-source React set_content harness; memory-storage shim, no live assistant/admin, real origin reload, or physical device testing.'}
(OUT/'report.json').write_text(json.dumps(report,indent=2));print(json.dumps({'passedScenarios':sum(x['passed'] for x in cases),'failedScenarios':sum(not x['passed'] for x in cases),'passedAssertions':len(checks),'pageErrors':errors}),flush=True)
sys.exit(1 if any(not c['passed'] for c in cases) or errors else 0)
