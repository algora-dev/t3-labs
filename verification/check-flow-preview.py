"""UI regression checks for the standalone review HTML, not live assistant tests.
Run: python verification/check-flow-preview.py /path/to/apex-flow-refined-preview.html
Requires Playwright and Chromium. No enquiry or booking is sent.
The successful assistant responses below are explicit TEST-ONLY stream fixtures.
"""
import json, sys, os
from pathlib import Path
from playwright.sync_api import sync_playwright
HTML = Path(sys.argv[1] if len(sys.argv)>1 else '/mnt/data/apex-flow-refined-preview.html').read_text()
OUT = Path(os.getenv('FLOW_EVIDENCE','/mnt/data/apex-flow-evidence')); OUT.mkdir(parents=True,exist_ok=True)
checks=[];errors=[]
def check(ok,label):
    if not ok: raise AssertionError(label)
    checks.append(label)
    print(f"PASS {len(checks)}: {label}",flush=True)
def settle(page,ms=120):page.wait_for_timeout(ms)
def helper(page):return page.locator('.dh-panel')
def button(page,name):return page.get_by_role('button',name=name,exact=True)
def open_page(browser,w=1440,h=1000):
    page=browser.new_page(viewport={'width':w,'height':h});page.set_default_timeout(4500)
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.set_content(HTML,wait_until='load');settle(page)
    return page
def start(page):button(page,'Start the demo').click();settle(page)
def select(page,task):
    page.evaluate("id=>window.__APEX_REQUIRE('/lib/demo-helper/store.ts').updateHelper({type:'select',task:id})",task);settle(page)
def state(page):return page.evaluate("window.__APEX_REQUIRE('/lib/demo-helper/store.ts').getHelper()")
def intro_to_quick(page):
    start(page);helper(page).get_by_role('button',name='Skip task',exact=True).click();helper(page).get_by_role('button',name='Skip task',exact=True).click()
    button(page,'Open the Quick Roof Estimate').click();settle(page)
FIXTURE_JS="""() => {
 const original=window.fetch;
 window.__requests=[]; window.__nextTurn=null; window.__failNext=false;
 window.fetch=async (url,init) => {
   if(url==='/api/chat' && init?.method==='POST') {
     window.__requests.push(JSON.parse(init.body));
     await new Promise(r=>setTimeout(r,180));
     if(window.__failNext) { window.__failNext=false; return new Response(JSON.stringify({error:'TEST ONLY: temporary failure'}),{status:503}); }
     const turn=window.__nextTurn ?? {message:'TEST ONLY: an unscripted question received an answer.',actions:[]};
     return new Response(new ReadableStream({start(controller){
       controller.enqueue(new TextEncoder().encode('data: '+JSON.stringify({type:'turn',turn})+'\\n\\n'));
       controller.close();
     }}),{status:200,headers:{'Content-Type':'text/event-stream'}});
   }
   return original(url,init);
 };
}"""
KNOWLEDGE={'message':'TEST ONLY: the answer includes a relevant Apex page.','actions':[{'type':'NAVIGATE_INTERNAL','label':'Read the page','url':'/demo/roofing-site/services/insurance-work','external':False}]}
ESTIMATE={'message':'TEST ONLY: a structured price and enquiry action.','cards':[{'type':'estimate','estimate':{'id':'TEST-ONLY','project':{'roofArea':120,'materialLabel':'Test tile','componentScope':'specified_components'},'lineItems':[{'catalogItemId':'TEST','label':'Test covering','quantity':120,'unit':'m²','rate':50,'subtotal':6000}],'symbol':'£','currency':'GBP','total':6000,'assumptions':[],'exclusions':[],'disclaimer':'Test fixture, not catalogue pricing.'}}], 'actions':[{'type':'OPEN_INQUIRY','label':'Preview quote enquiry'}]}

def main():
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.getenv('CHROMIUM','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
  # Current-source layout, navigation, actual local sample and real Quick enquiry.
  for w,h in ([] if os.getenv('FLOW_FOCUS') else [(1440,1000),(1024,768),(768,1024),(390,844),(320,568),(844,390)]):
   p=open_page(browser,w,h);prefix=f'{w}x{h}'
   check(p.locator('.t3-cv-intro').is_visible(),prefix+' intro visible');check(p.locator('.dh-panel').count()==0,prefix+' no duplicate welcome')
   check('ask your own questions' in p.locator('.t3-cv-intro').inner_text(),prefix+' intro encourages own questions')
   if w in (1440,390):p.screenshot(path=str(OUT/f'intro-{w}.png'))
   start(p);check(helper(p).get_by_role('button',name='Open assistant + add example',exact=True).count()==1,prefix+' one preparation action')
   button(p,'Open assistant + add example').click();settle(p)
   inp=p.get_by_role('textbox',name='Ask the Smart Assistant');check('insurance work' in inp.input_value(),prefix+' input prefilled')
   check('press Send' in helper(p).inner_text(),prefix+' prepared guidance');check(helper(p).get_by_role('button',name='Open assistant + add example',exact=True).count()==0,prefix+' no repeat preparation button')
   check(helper(p).is_visible(),prefix+' preparing never hides guide')
   if w<760:
    g=helper(p).bounding_box();a=p.locator('[data-apex-assistant]').bounding_box();i=inp.bounding_box()
    check(a['y']+a['height']<=g['y']-5,prefix+' reserved space prevents panel overlap')
    check(i['y']+i['height']<=g['y'],prefix+' input unobstructed')
   if w in (1440,390):p.screenshot(path=str(OUT/f'assistant-prepared-{w}.png'))
   inp.fill('My own unsent Apex question')
   helper(p).get_by_role('button',name='Skip task',exact=True).click();settle(p)
   # Skip first task must not auto-hide. Skip price task enters quick and closes chat.
   check(helper(p).is_visible(),prefix+' next task stays open');helper(p).get_by_role('button',name='Skip task',exact=True).click();settle(p)
   check(p.locator('[data-apex-assistant]').count()==0,prefix+' Quick transition closes assistant')
   button(p,'Open the Quick Roof Estimate').click();settle(p)
   check(p.locator('.qr-demo-example').is_visible(),prefix+' focused sample visible');check(p.locator('.qr-progress').count()==0,prefix+' no competing full questionnaire')
   check(helper(p).is_visible(),prefix+' guide remains manually open on tool entry')
   # Opening assistant deliberately again must work and preserve unsent draft.
   p.get_by_role('button',name='Open Smart Assistant',exact=True).click();settle(p)
   check(inp.input_value()=='My own unsent Apex question',prefix+' unsent chat preserved through transition')
   p.get_by_role('button',name='Close assistant',exact=True).click();settle(p)
   # Explicit Hide/Show never loses task progress.
   button(p,'Hide guide').click();settle(p);check(p.locator('.dh-launcher').is_visible(),prefix+' explicit hide works')
   p.locator('.dh-launcher').click();settle(p);check(state(p)['current']=='quick-price',prefix+' show restores same task')
   p.get_by_role('button',name='Calculate this example',exact=False).click();settle(p)
   check(p.locator('.qr-price-value').is_visible(),prefix+' real sample calculation gives a range')
   check(p.get_by_role('heading',name='Your ballpark roof estimate',exact=True).count()==1,prefix+' single result title')
   p.get_by_role('button',name='Request a quote',exact=False).click();settle(p)
   check(p.get_by_role('button',name='Preview with example details',exact=False).is_visible(),prefix+' fast enquiry available')
   check(p.locator('input[autocomplete="name"]').count()==0,prefix+' no compulsory typing in fast path')
   p.get_by_role('button',name='Preview with example details',exact=False).click();settle(p)
   check(p.get_by_text('Enquiry preview ready. Nothing was sent.',exact=True).is_visible(),prefix+' actual enquiry preview')
   check('homeowner@example.com' in p.locator('.qr-enquiry-confirm').inner_text(),prefix+' fictional contact explicitly shown')
   check('Concrete tiles' in p.locator('.qr-enquiry-confirm').inner_text(),prefix+' chosen covering attached')
   check(state(p)['status']['quick-price']=='observed',prefix+' enquiry sequence marks observed')
   check('Read what the business receives' in helper(p).inner_text(),prefix+' guide does not compete with enquiry preview')
   check(p.locator('.t3-cv-closing').count()==0,prefix+' closer waits during enquiry')
   p.get_by_role('button',name='Return to my estimate',exact=False).click();settle(p,1450)
   check(p.locator('.t3-cv-closing').count()==0,prefix+' no timer hides final benefit')
   check('NEED MORE DETAIL?' in helper(p).inner_text(),prefix+' advanced tools visible before closing')
   check('public or trade pricing' in helper(p).inner_text(),prefix+' business pricing explanation retained')
   helper(p).get_by_role('button',name='What could this do for my business?',exact=False).click();settle(p)
   check(p.locator('.t3-cv-closing').is_visible(),prefix+' acknowledged benefit opens closer')
   check('What if you could have solutions like this for $999?' in p.locator('.t3-cv-offer').inner_text(),prefix+' exact approved offer')
   check(p.get_by_role('link',name='Book a free 20-minute call',exact=False).get_attribute('href')=='https://calendly.com/insights-t3labs/20-minute-meeting',prefix+' booking link retained, not visited')
   if w in (1440,390):p.screenshot(path=str(OUT/f'closing-{w}.png'))
   button(p,'Keep exploring').click();settle(p);check('Keep exploring.' in helper(p).inner_text(),prefix+' compact finish, no duplicate pitch')
   p.evaluate("document.dispatchEvent(new MouseEvent('mousemove',{clientY:120}));document.dispatchEvent(new MouseEvent('mouseout',{clientY:0,relatedTarget:null}))");settle(p)
   check(p.locator('.t3-cv-closing').count()==0,prefix+' closer never repeats after dismissal')
   check(p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),prefix+' no horizontal page overflow');p.close()
  # Keep asset-heavy preview cases independent; release renderer caches between groups.
  if not os.getenv('FLOW_FOCUS'):
   check(not errors,'no JavaScript errors in layout and local-flow checks')
   (OUT/'layout-checks.json').write_text(json.dumps({'passed':len(checks),'failed':0,'checks':checks,'pageErrors':errors},indent=2))
   if os.getenv('FLOW_LAYOUT_ONLY'):
    browser.close();print(json.dumps({'passed':len(checks),'pageErrors':errors}));return
   browser.close()
   browser=pw.chromium.launch(executable_path=os.getenv('CHROMIUM','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
  # Actual assistant frontend with explicit test-only structured stream responses.
  p=open_page(browser);start(p);p.evaluate(FIXTURE_JS)
  p.get_by_role('button',name='Open Smart Assistant',exact=True).click();settle(p)
  inp=p.get_by_role('textbox',name='Ask the Smart Assistant');inp.fill('Can I collect roofing supplies?');p.locator('[data-apex-assistant]').get_by_role('button',name='Send message',exact=True).click()
  settle(p,40);check('Getting your answer' in helper(p).inner_text(),'freestyle send reports waiting without using example')
  settle(p,300);check(p.evaluate('window.__requests[0].message')=='Can I collect roofing supplies?','arbitrary question sent unchanged')
  check(state(p)['started'],'freestyle automatically starts relevant task');check('Ready to move on?' in helper(p).inner_text(),'free response offers honest manual continuation')
  check(state(p)['status']['answers']=='untried','generic response not falsely verified')
  p.evaluate('turn=>window.__nextTurn=turn',KNOWLEDGE);inp.fill('Where can I read about Apex insurance help?');p.locator('[data-apex-assistant]').get_by_role('button',name='Send message',exact=True).click();settle(p,350)
  check('Open the page' in helper(p).inner_text(),'actual structured answer updates guidance');button(p,'Read the page').click();settle(p)
  check(state(p)['status']['answers']=='observed','actual navigation action verifies answer task')
  helper(p).get_by_role('button',name='Next: a price through chat',exact=False).click();settle(p)
  button(p,'Open assistant + add example').click();settle(p);check('120 m²' in inp.input_value(),'price prompt opens and prefills once')
  p.evaluate('window.__failNext=true');p.locator('[data-apex-assistant]').get_by_role('button',name='Send message',exact=True).click();settle(p,350)
  check(state(p)['error'],'network failure reported honestly')
  inp.fill('Please price the Apex roof details I supplied.');p.evaluate('turn=>window.__nextTurn=turn',ESTIMATE);p.locator('[data-apex-assistant]').get_by_role('button',name='Send message',exact=True).click();settle(p,40)
  check('Getting your answer' in helper(p).inner_text(),'retry clears stale error while sending')
  settle(p,350);check('assistant-estimate' in state(p)['milestones'],'structured estimate accepted for custom request')
  check('Review the price' in helper(p).inner_text(),'estimate directs user to actual enquiry action')
  button(p,'Preview quote enquiry').click();settle(p)
  check('outside the supplied lean export' in p.locator('[data-apex-assistant]').inner_text(),'missing assistant enquiry clearly labelled, not faked')
  # Missing component boundary: simulate ONLY its two orchestration events for transition coverage.
  p.evaluate("(()=>{const s=__APEX_REQUIRE('/lib/demo-helper/store.ts');s.recordHelperSignal('assistant-enquiry-open');s.recordHelperSignal('assistant-enquiry-ready');})()")
  check(state(p)['status']['assistant-price']=='observed','enquiry event contract tested with labelled fixture')
  button(p,'Back to chat').click();helper(p).get_by_role('button',name='Next: a price without chat',exact=False).click();settle(p)
  check(p.locator('[data-apex-assistant]').count()==0,'verified price-to-Quick transition also closes chat')
  p.get_by_role('button',name='Open Smart Assistant',exact=True).click();settle(p)
  check('Please price the Apex roof details I supplied.' in p.locator('[data-apex-assistant]').inner_text(),'conversation preserved for freestyling after close')
  p.close()
  # Draft-replacement cancellation: typing, then choosing example, never silently overwrites.
  p=open_page(browser);start(p);p.get_by_role('button',name='Open Smart Assistant',exact=True).click();settle(p)
  inp=p.get_by_role('textbox',name='Ask the Smart Assistant');inp.fill('Keep this unsent custom request')
  p.once('dialog',lambda d:d.dismiss());button(p,'Open assistant + add example').click();settle(p)
  check(inp.input_value()=='Keep this unsent custom request','cancel preserves unsent message')
  check('Your question, your choice' in helper(p).inner_text(),'cancel moves guidance to existing message, not fake prepared state')
  p.close()
  # Sample covering is a real input; normal questionnaire and typed enquiry stay available.
  p=open_page(browser);intro_to_quick(p)
  p.get_by_role('radio',name='Natural slate',exact=False).check();p.get_by_role('button',name='Calculate this example',exact=False).click();settle(p)
  slatePrice=p.locator('.qr-price-value').inner_text()
  check('Natural slate' in p.locator('.qr-home-summary').inner_text(),'sample covering changes actual result input')
  p.get_by_role('button',name='Request a quote',exact=False).click();p.get_by_role('button',name='Edit details / add notes or files',exact=True).click();settle(p)
  p.locator('input[autocomplete="name"]').fill('Alex Example');p.locator('input[autocomplete="email"]').fill('alex@example.com');p.locator('textarea').fill('Please discuss the roof condition.')
  p.once('dialog',lambda d:d.dismiss());button(p,'Use example contact details').click();check(p.locator('input[autocomplete="name"]').input_value()=='Alex Example','manual contact details protected')
  p.get_by_role('button',name='Preview my enquiry',exact=False).click();settle(p)
  check('Please discuss the roof condition.' in p.locator('.qr-enquiry-confirm').inner_text(),'manual notes in same enquiry output')
  check('Natural slate' in p.locator('.qr-enquiry-confirm').inner_text(),'actual nondefault covering attached to manual enquiry')
  p.get_by_role('button',name='Edit details / add notes or files',exact=True).click();check(p.locator('textarea').input_value()=='Please discuss the roof condition.','edit preview retains notes')
  p.close()
  p=open_page(browser);intro_to_quick(p);button(p,'Try the full tool instead').click();settle(p)
  check(p.locator('.qr-progress').is_visible(),'normal roof questionnaire available');check(p.locator('.qr-demo-example').count()==0,'full and sample paths exclusive')
  p.get_by_role('radio',name='Hipped roof',exact=False).first.check();p.get_by_role('button',name='Continue',exact=False).click();settle(p)
  check('Picture your roof from above' in p.locator('.qr-panel-heading').inner_text(),'short size instructions')
  p.get_by_role('radio',name='Small',exact=False).first.check();p.get_by_role('button',name='Continue',exact=False).click();settle(p)
  check(p.get_by_role('heading',name='How steep is your roof?',exact=True).is_visible(),'normal homeowner flow not replaced')
  p.evaluate("window.__APEX_REQUIRE('/lib/demo-helper/store.ts').sendHelperCommand('quick-example')");settle(p)
  p.once('dialog',lambda d:d.dismiss());p.get_by_role('button',name='Calculate this example',exact=False).click();settle(p)
  check(p.locator('.qr-demo-example').is_visible(),'sample replacement cancellation respected')
  button(p,'Try the full tool instead').click();check(p.get_by_role('heading',name='How steep is your roof?',exact=True).is_visible(),'prior homeowner step preserved')
  p.close()
  # Dragging and explicit visibility after routing.
  p=open_page(browser);start(p);grip=button(p,'Move demo helper. Use arrow keys to move; Home to reset position.');r=grip.bounding_box();before=helper(p).bounding_box()
  p.mouse.move(r['x']+15,r['y']+15);p.mouse.down();p.mouse.move(r['x']+150,r['y']-70,steps=5);p.mouse.up();settle(p)
  check(helper(p).bounding_box()['x']>before['x']+80,'desktop drag remains available')
  grip.focus();p.keyboard.press('Home');settle(p);check(helper(p).bounding_box()['x']==22,'keyboard reset position retained')
  p.locator('body').click(position={'x':900,'y':150});check(helper(p).is_visible(),'outside click never hides helper')
  button(p,'Hide guide').click();p.evaluate("__APEX_NAV('/demo/roofing-site/about')");settle(p);check(p.locator('.dh-launcher').is_visible(),'manual hide persists through navigation')
  p.close()
  # Narrow viewport with reduced motion / high contrast.
  p=open_page(browser,390,500);p.emulate_media(reduced_motion='reduce',contrast='more');start(p);button(p,'Open assistant + add example').click();settle(p)
  a=p.locator('[data-apex-assistant]').bounding_box();g=helper(p).bounding_box();check(a['y']+a['height']<g['y'],'short mobile viewport reserves guide space')
  check(p.evaluate("getComputedStyle(document.querySelector('.dh-panel')).backgroundColor")=='rgb(10, 11, 16)','high contrast uses solid background');p.close()
  browser.close()
 check(not errors,'no JavaScript page errors in exercised preview flows')
 report={'passed':len(checks),'failed':0,'pageErrors':errors,'checks':checks,'boundary':'Current-source standalone review harness; successful assistant responses and missing assistant enquiry events are explicit test-only fixtures. No real bookings/enquiries. Not a full Next.js or live-backend test.'}
 (OUT/'browser-checks.json').write_text(json.dumps(report,indent=2));print(json.dumps({'passed':len(checks),'pageErrors':errors}))
if __name__=='__main__':
 try:main()
 except Exception:
  (OUT/'browser-partial.json').write_text(json.dumps({'passed':len(checks),'checks':checks,'pageErrors':errors},indent=2));raise
