"""Regression-check the delivered HTML in ordinary and opaque-origin preview frames.
Usage: python scripts/verify-helper-preview.py preview.html artifact_directory
Requires Playwright + Chromium. Does not use live AI or submit an enquiry.
"""
from pathlib import Path
from contextlib import contextmanager
import json, sys, traceback
from playwright.sync_api import sync_playwright

HTML=Path(sys.argv[1]).read_text()
OUT=Path(sys.argv[2]); OUT.mkdir(parents=True,exist_ok=True)
checks=[]; failures=[]; errors=[]

def check(value, name):
    if not value: raise AssertionError(name)
    checks.append(name)

def pause(frame): frame.wait_for_timeout(120)
def visible(frame,selector): return frame.locator(selector).count()>0 and frame.locator(selector).first.is_visible()
def within(frame, selector):
    b=frame.locator(selector).bounding_box()
    # Element bounds in an iframe include the parent's offset; tests use edge-to-edge frames.
    size=frame.evaluate('({w:innerWidth,h:innerHeight})')
    return b and b['x']>=-1 and b['y']>=-1 and b['x']+b['width']<=size['w']+1 and b['y']+b['height']<=size['h']+1

def no_overflow(frame): return frame.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')
def nav(frame,path): frame.evaluate('(path)=>window.__APEX_NAV(path)',path); pause(frame)

with sync_playwright() as pw:
    browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    @contextmanager
    def fresh(width=1440,height=900,mode='top',name='',prelude=''):
        page=browser.new_page(viewport={'width':width,'height':height}); page.set_default_timeout(7000)
        local_errors=[];page.on('pageerror',lambda e:local_errors.append(str(e)))
        page.on('dialog',lambda d:d.accept())
        payload=HTML.replace('<script>','<script>'+prelude,1) if prelude else HTML
        if mode=='top':
            page.set_content(payload,wait_until='domcontentloaded'); frame=page.main_frame
        else:
            sandbox=' sandbox="allow-scripts"' if mode=='sandbox' else ''
            page.set_content('<style>html,body{margin:0;height:100%;overflow:hidden}iframe{display:block;width:100%;height:100%;border:0}</style><iframe title="Artifact preview" name="'+name+'"'+sandbox+'></iframe>')
            page.locator('iframe').evaluate('(el,html)=>el.srcdoc=html',payload)
            page.wait_for_timeout(200);frame=page.frames[-1]
        frame.wait_for_selector('.contractor-site',timeout=10000); pause(frame)
        try: yield page,frame,local_errors
        except Exception:
            key=f'failure-{len(failures)+1}'
            page.screenshot(path=str(OUT/(key+'.png')))
            (OUT/(key+'.txt')).write_text(frame.locator('body').inner_text())
            (OUT/(key+'-overflow.json')).write_text(json.dumps(frame.evaluate("Array.from(document.querySelectorAll('body *')).map(e=>({tag:e.tagName,cls:e.className,r:e.getBoundingClientRect().right,w:e.getBoundingClientRect().width})).filter(e=>e.r>innerWidth+1&&e.w>5).slice(0,50)"),indent=2))
            raise
        finally:
            errors.extend(local_errors);page.close()
    def scenario(name,fn):
        try: fn()
        except Exception as e: failures.append({'scenario':name,'error':str(e),'traceback':traceback.format_exc()});print('FAIL',name,str(e))
        else: print('PASS',name)

    def arrivals():
        for mode in ['top','iframe','sandbox']:
            with fresh(mode=mode) as (page,f,errs):
                check(visible(f,'.dh-panel'),f'{mode}: helper appears without clicking')
                check(visible(f,'.sa-apex-launcher'),f'{mode}: assistant launcher is also visible')
                rect=f.locator('.dh-panel').bounding_box()
                check(abs(rect['x']+rect['width']/2-720)<3 and abs(rect['y']+rect['height']/2-450)<3,f'{mode}: welcome is centred')
                check(f.locator('.dh-panel').evaluate('(el)=>el.parentElement===document.body'),f'{mode}: helper escapes clipping containers')
                check(not errs,f'{mode}: no runtime errors')
                if mode=='iframe': page.screenshot(path=str(OUT/'welcome-desktop.png'))
    scenario('first arrival, including iframe and denied storage',arrivals)

    def pinned():
        with fresh(mode='iframe',name='apex-assistant-website') as (_,f,errs):
            check(f.locator('.dh-panel,.dh-launcher').count()==0,'named assistant frame: no duplicate guide')
            check(f.locator('.sa-apex-launcher').count()==0,'named assistant frame: no duplicate assistant')
            check(visible(f,'.contractor-site'),'named assistant frame: website remains visible')
            check(not errs,'named assistant frame: no runtime errors')
        with fresh(mode='iframe',name='ordinary-site-preview') as (_,f,_):
            check(visible(f,'.dh-panel'),'unrelated named preview: guide is not suppressed')
    scenario('only suppress intentional assistant embeds',pinned)

    def controls():
        with fresh(mode='iframe') as (page,f,errs):
            original=f.locator('.dh-panel').bounding_box()
            drag=f.get_by_role('button',name='Move demo helper.',exact=False)
            b=drag.bounding_box();page.mouse.move(b['x']+25,b['y']+15);page.mouse.down();page.mouse.move(b['x']+135,b['y']+40,steps=10);page.mouse.up();pause(f)
            moved=f.locator('.dh-panel').bounding_box()
            check(moved['x']>original['x']+75,'desktop: actual pointer dragging moves the helper')
            check(abs(moved['width']-original['width'])<1,'desktop: dragging does not resize the welcome card')
            drag.focus();drag.press('ArrowLeft');pause(f)
            check(f.locator('.dh-panel').bounding_box()['x']<moved['x'],'desktop: keyboard arrow positioning')
            drag.press('Home');pause(f)
            check(abs(f.locator('.dh-panel').bounding_box()['x']-original['x'])<2,'desktop: Home recentres the welcome')
            f.get_by_role('button',name='Hide guide',exact=True).click();pause(f)
            check(visible(f,'.dh-launcher') and not visible(f,'.dh-panel'),'minimise leaves a visible launcher')
            f.locator('.dh-launcher').click();pause(f)
            check(visible(f,'.dh-panel'),'launcher reopens the same welcome')
            f.locator('.dh-panel').press('Escape');pause(f)
            check(visible(f,'.dh-panel'),'Escape does not unexpectedly hide the non-modal guide')
            f.get_by_role('button',name='Hide guide',exact=True).click();pause(f)
            f.locator('.dh-demo-strip button').click();pause(f)
            check(visible(f,'.dh-panel'),'site strip recovers the helper without a reload')
            f.locator('.dh-panel .dh-primary').click();pause(f)
            check('Ask instead of searching.' in f.locator('.dh-panel').inner_text(),'start opens task one')
            check('dh-welcome' not in f.locator('.dh-panel').get_attribute('class'),'task panel docks after the welcome')
            f.locator('.dh-panel .dh-primary').click();pause(f)
            check(visible(f,'[data-apex-assistant]'),'helper opens the actual assistant component')
            text=f.locator('[data-apex-assistant] textarea').input_value()
            check('insurance work' in text,'example question is prepared in the assistant')
            check(f.locator('[data-apex-assistant]').get_by_text('Do you handle insurance work, and where can I read more about it?',exact=True).count()<=1,'question is not automatically submitted')
            f.locator('[data-apex-assistant]').get_by_role('button',name='Send message',exact=True).click();f.wait_for_timeout(300)
            check('running website' in f.locator('[data-apex-assistant]').inner_text(),'offline chat is explicitly unavailable, not faked')
            check(not errs,'helper controls and offline assistant: no runtime errors')
    scenario('drag, minimise, recover, prepare and fail safely',controls)

    def mobile():
        for w,h in [(320,568),(390,844),(768,1024),(1024,768)]:
            with fresh(width=w,height=h,mode='sandbox') as (page,f,errs):
                check(visible(f,'.dh-panel') and within(f,'.dh-panel'),f'{w}px: welcome stays inside viewport')
                check(no_overflow(f),f'{w}px: homepage has no horizontal overflow')
                if w==390:page.screenshot(path=str(OUT/'welcome-mobile.png'))
                f.locator('.dh-panel .dh-primary').click();pause(f)
                check(within(f,'.dh-panel'),f'{w}px: active task stays on screen')
                f.locator('.dh-panel .dh-primary').click();pause(f)
                check(visible(f,'.dh-panel'),f'{w}px: opening chat does not hide the guide')
                f.get_by_role('button',name='Hide guide',exact=True).click();pause(f)
                check(visible(f,'.dh-launcher'),f'{w}px: explicit Hide makes room for chat')
                check(visible(f,'[data-apex-assistant]'),f'{w}px: assistant opens from guide')
                if w==390:page.screenshot(path=str(OUT/'assistant-mobile.png'))
                check(not errs,f'{w}px: no runtime errors')
    scenario('mobile, tablet and short desktop layouts',mobile)

    def navigation():
        with fresh(mode='iframe') as (page,f,errs):
            f.get_by_role('button',name='Hide guide',exact=True).click();pause(f)
            check(f.locator('.at-choices .at-choice').count()==3,'homepage offers all three real tool routes')
            check(f.locator('.at-choices .at-choice-icon svg path').count()==3,'all tool cards use the shared professional icons')
            check(f.locator('.apex-contact-icon svg').count()==2,'header phone and email use matching SVG icons')
            f.locator('.at-choices').scroll_into_view_if_needed();page.screenshot(path=str(OUT/'roof-tools-desktop.png'))
            for target,title in [('/demo/roofing-site/estimate','Roof tools'),('/demo/roofing-site/quick-estimate','Quick Roof Estimate'),('/demo/roofing-site/price-list','Products & prices'),('/demo/roofing-site/services/insurance-work','Insurance'),('/supplier-pricing-tool/apex-roofing','Detailed'),('/supplier-pricing-tool/apex-roofing/admin?demo=helper','Business controls'),('/supplier-pricing-tool/quote?supplier=apex-roofing','Customer quote')]:
                nav(f,target);f.wait_for_timeout(180)
                check(f.get_by_role('navigation',name='Breadcrumb',exact=True).count()==1,f'{target.split("?")[0]}: one semantic breadcrumb trail')
                check(f.get_by_role('navigation',name='Breadcrumb',exact=True).get_by_role('link',name='Apex Roofing').is_visible(),f'{target.split("?")[0]}: visible home link')
            # Check the true content page rather than a generic placeholder.
            nav(f,'/demo/roofing-site/services/insurance-work')
            check('Page navigation preview' not in f.locator('body').inner_text(),'service links render actual page content in review HTML')
            f.get_by_role('navigation',name='Breadcrumb',exact=True).get_by_role('link',name='Apex Roofing').click();pause(f)
            check(visible(f,'.contractor-site'),'breadcrumb returns to actual Apex homepage')
            check(visible(f,'.dh-launcher'),'navigation respects the visitor’s minimised guide')
            check(not errs,'navigation and admin preview: no runtime errors')
    scenario('icons, route coverage and breadcrumb return paths',navigation)

    def run_quick(w,h,flat=False):
        with fresh(width=w,height=h,mode='sandbox') as (page,f,errs):
            # Use real UI controls to reach Task 3, not a simulated success event.
            f.locator('.dh-panel .dh-primary').click();pause(f)
            f.get_by_role('button',name='Skip this task',exact=True).click();pause(f)
            f.get_by_role('button',name='Skip this task',exact=True).click();pause(f)
            f.locator('.dh-panel .dh-primary').click();pause(f)
            check(visible(f,'.at-choice-page'),f'{w}px {"flat" if flat else "pitched"}: helper opens tool chooser')
            check(visible(f,'.dh-panel'),f'{w}px: Quick task navigation keeps guide visible')
            f.get_by_role('button',name='Hide guide',exact=True).click();pause(f)
            f.locator('.at-choice').filter(has_text='I don’t have measurements').click();pause(f)
            check(visible(f,'.qr-app'),f'{w}px: quick estimate uses real component')
            f.locator('input[name="category"][value="flat"]' if flat else 'input[name="shape"][value="gable"]').check(force=True)
            f.locator('.qr-app').get_by_role('button',name='Continue',exact=False).last.click();pause(f)
            f.locator('input[name="size"][value="small"]').check(force=True)
            if flat:f.locator('input[name="flat-complexity"][value="complex"]').check(force=True)
            f.locator('.qr-app').get_by_role('button',name='Continue',exact=False).last.click();pause(f)
            if not flat:
                f.locator('input[name="pitch"][value="typical"]').check(force=True)
                f.locator('.qr-app').get_by_role('button',name='Continue',exact=False).last.click();pause(f)
            f.locator('input[name="existing"][value="membrane"]' if flat else 'input[name="existing"][value="tile"]').check(force=True)
            f.locator('.qr-app').get_by_role('button',name='Continue',exact=False).last.click();pause(f)
            f.locator('input[name="covering"][value="epdm"]' if flat else 'input[name="covering"][value="tile"]').check(force=True)
            f.get_by_role('button',name='See my estimate',exact=False).click();pause(f)
            check('Your estimated roof cost' in f.locator('main.qr-main').inner_text(),f'{w}px {"flat" if flat else "pitched"}: real calculation produces a price range')
            check(no_overflow(f),f'{w}px: estimate result has no horizontal overflow')
            if w==390:page.screenshot(path=str(OUT/'estimate-mobile.png'))
            elif not flat:page.screenshot(path=str(OUT/'estimate-desktop.png'))
            f.get_by_role('button',name='Request a proper quote',exact=False).click();pause(f)
            check('are attached' in f.locator('.qr-enquiry').inner_text(),f'{w}px: enquiry carries the calculated range')
            f.get_by_role('button',name='Preview my enquiry',exact=False).click();pause(f)
            check('Enquiry preview ready.' not in f.locator('.qr-enquiry').inner_text(),f'{w}px: empty enquiry cannot bypass validation')
            check(f.locator('.qr-enquiry input[required]').first.evaluate('(el)=>!el.validity.valid'),f'{w}px: native required validation is preserved')
            f.get_by_role('button',name='Use example contact details',exact=True).click()
            f.locator('.qr-enquiry input[type="email"]').fill('not-an-email')
            f.get_by_role('button',name='Preview my enquiry',exact=False).click();pause(f)
            check('Enquiry preview ready.' not in f.locator('.qr-enquiry').inner_text(),f'{w}px: malformed email cannot complete the task')
            f.locator('.qr-enquiry input[type="email"]').fill('homeowner@example.com')
            f.locator('input[type="file"]').set_input_files({'name':'roof-photo.png','mimeType':'image/png','buffer':b'preview metadata only'})
            if flat:
                f.locator('.qr-enquiry input[type="email"]').press('Enter');pause(f)
            else:
                f.get_by_role('button',name='Preview my enquiry',exact=False).click();pause(f)
            check('Enquiry preview ready. Nothing was sent.' in f.locator('.qr-enquiry').inner_text(),f'{w}px: local enquiry confirmation')
            check('roof-photo.png' in f.locator('.qr-enquiry').inner_text(),f'{w}px: attachment name carried without upload')
            check(visible(f,'.dh-launcher'),f'{w}px: user-hidden guide stays hidden on enquiry completion')
            f.locator('.dh-launcher').click();pause(f)
            check('EXPERIENCE COMPLETE' in f.locator('.dh-panel').inner_text(),f'{w}px: helper observes real completed enquiry')
            check(no_overflow(f),f'{w}px: helper benefit panel does not overflow')
            if w==390:page.screenshot(path=str(OUT/'enquiry-helper-mobile.png'))
            check(not errs,f'{w}px quick flow: no runtime errors')
    scenario('desktop real pitched estimate and local enquiry',lambda:run_quick(1440,900))
    scenario('mobile real flat estimate and local enquiry',lambda:run_quick(390,844,flat=True))

    def resizing():
        with fresh(width=1440,height=1000,mode='iframe') as (page,f,errs):
            b=f.get_by_role('button',name='Move demo helper.',exact=False);b.focus()
            for _ in range(15):b.press('Shift+ArrowRight')
            pause(f);page.set_viewport_size({'width':820,'height':620});pause(f)
            check(within(f,'.dh-panel'),'resize clamps the saved desktop position')
            f.get_by_role('button',name='Hide guide',exact=True).click();pause(f)
            page.set_viewport_size({'width':390,'height':740});pause(f)
            f.locator('.dh-launcher').click();pause(f)
            check(within(f,'.dh-panel'),'desktop-to-mobile transition recentres welcome')
            check(not errs,'resizing: no runtime errors')
    scenario('resize recovery',resizing)

    def brand_and_manual_controls():
        for w,h in [(1440,1000),(390,844),(320,568)]:
            with fresh(width=w,height=h,mode='sandbox') as (page,f,errs):
                panel=f.locator('.dh-panel'); hide=f.get_by_role('button',name='Hide guide',exact=True)
                rect=panel.bounding_box(); bar=hide.bounding_box()
                check(abs(bar['width']-(rect['width']-2))<2,f'{w}px: Hide is full panel width')
                check(bar['height']>=44,f'{w}px: Hide has a comfortable touch target')
                check(f.locator('.dh-logo').first.evaluate('(el)=>el.complete && el.naturalWidth===1024'),f'{w}px: supplied transparent T3 logo renders offline')
                style=panel.evaluate('(el)=>{const s=getComputedStyle(el);return {bg:s.backgroundColor,blur:s.backdropFilter,opacity:s.opacity,font:s.fontFamily}}')
                check(style['bg']=='rgba(10, 11, 16, 0.95)',f'{w}px: near-black glass uses background alpha')
                check(style['opacity']=='1',f'{w}px: whole widget opacity is not reduced')
                check(style['font'].startswith('Inter'),f'{w}px: T3 font stack, not Apex Manrope')
                check(f.locator('.dh-primary').evaluate('(el)=>getComputedStyle(el).backgroundColor')=='rgb(215, 255, 0)',f'{w}px: primary uses the exact T3 lime')
                check(f.locator('.dh-bottom').evaluate('(el)=>getComputedStyle(el).backgroundColor')!='rgb(252, 252, 253)',f'{w}px: no inherited light footer')
                page.mouse.click(3,80);pause(f)
                check(visible(f,'.dh-panel'),f'{w}px: clicking outside does not dismiss the guide')
                if w==1440:page.screenshot(path=str(OUT/'t3-welcome-desktop.png'))
                if w==390:page.screenshot(path=str(OUT/'t3-welcome-mobile.png'))
                f.locator('.dh-panel .dh-primary').click();pause(f)
                f.get_by_role('button',name='Continue manually',exact=True).click()
                f.get_by_role('button',name='I’ve tried it. Continue.',exact=True).click();pause(f)
                check(visible(f,'.dh-panel'),f'{w}px: manual completion leaves guide open')
                f.locator('.dh-panel .dh-primary').click();pause(f)
                check(visible(f,'.dh-panel') and 'From a question to an enquiry.' in f.locator('.dh-panel').inner_text(),f'{w}px: Next task stays open')
                f.get_by_role('button',name='Skip this task',exact=True).click();pause(f)
                check(visible(f,'.dh-panel'),f'{w}px: Skip keeps guide open')
                f.locator('.dh-panel .dh-primary').click();pause(f)
                check(visible(f,'.dh-panel'),f'{w}px: tool entry does not hide guide')
                nav(f,'/demo/roofing-site/quick-estimate')
                check(visible(f,'.dh-panel'),f'{w}px: mounting Quick Estimate does not hide guide')
                # Hide is separate from movement and remains pinned when the content scrolls.
                top=hide.bounding_box()['y'];f.locator('.dh-content').evaluate('(el)=>el.scrollTop=el.scrollHeight');pause(f)
                check(abs(hide.bounding_box()['y']-top)<1,f'{w}px: Hide bar is not scrolled away')
                hide.click();pause(f)
                check(visible(f,'.dh-launcher') and not visible(f,'.dh-panel'),f'{w}px: only Hide closes the panel')
                nav(f,'/demo/roofing-site/estimate');nav(f,'/demo/roofing-site/quick-estimate')
                check(visible(f,'.dh-launcher'),f'{w}px: hidden preference survives navigation')
                f.locator('.dh-launcher').click();pause(f)
                check('No measurements? No problem.' in f.locator('.dh-panel').inner_text(),f'{w}px: Show resumes the same task')
                check(no_overflow(f),f'{w}px: dark helper introduces no horizontal overflow')
                check(not errs,f'{w}px: brand/control regression has no JS errors')
    scenario('T3 identity, full-width Hide, open Next and manual control',brand_and_manual_controls)

    def selected_roof_plans():
        shapes=['mono','gable','hip','l_gable','t_gable','l_hip','u_gable','dormer','complex','flat']
        sizes=['small','small_medium','medium','medium_large','large']
        for w,h in [(1440,1100),(390,844)]:
            with fresh(width=w,height=h,mode='sandbox') as (page,f,errs):
                f.get_by_role('button',name='Hide guide',exact=True).click();pause(f)
                nav(f,'/demo/roofing-site/quick-estimate')
                for shape in shapes:
                    choice=f.locator('.qr-choice').filter(has=f.locator('input[name="category"][value="flat"]' if shape=='flat' else f'input[name="shape"][value="{shape}"]'))
                    choice.scroll_into_view_if_needed();choice.click();pause(f)
                    f.locator('.qr-app').get_by_role('button',name='Continue',exact=False).last.click();pause(f)
                    drawings=f.locator('.qr-roof-plan')
                    check(drawings.count()==5,f'{w}px {shape}: five plan-view size options')
                    meta=drawings.evaluate_all('(els)=>els.map(e=>({shape:e.dataset.roofShape,size:e.dataset.roofSize,scale:+e.dataset.planScale,hidden:e.getAttribute("aria-hidden"),w:e.getBoundingClientRect().width,edges:e.querySelectorAll(".qr-plan-edge").length}))')
                    check([m['shape'] for m in meta]==[shape]*5 and [m['size'] for m in meta]==sizes,f'{w}px {shape}: every drawing matches the selected shape and size')
                    check(all(meta[i]['scale']<meta[i+1]['scale'] for i in range(4)),f'{w}px {shape}: relative footprint scale increases')
                    check(max(m['w'] for m in meta)-min(m['w'] for m in meta)<1,f'{w}px {shape}: all cards share one illustration canvas scale')
                    check(all(m['hidden']=='true' and m['edges']>0 for m in meta),f'{w}px {shape}: decorative plans retain roof edges')
                    check(no_overflow(f),f'{w}px {shape}: no horizontal overflow')
                    f.locator('input[name="size"][value="medium"]').check(force=True)
                    check(f.locator('input[name="size"][value="medium"]').is_checked(),f'{w}px {shape}: choice remains an accessible working radio')
                    if shape in ['hip','l_gable','dormer','complex']:
                        f.locator('.qr-size-grid').screenshot(path=str(OUT/f'roof-size-{shape}-{w}.png'))
                    if shape=='hip':page.screenshot(path=str(OUT/f'roof-size-page-{w}.png'),full_page=True)
                    f.locator('.qr-progress button').first.click();pause(f)
                check(not errs,f'{w}px all plan illustrations: no JS errors')
    scenario('all ten roof styles across all five size choices, desktop and mobile',selected_roof_plans)

    def visible_guide_enquiry():
        with fresh(width=1800,height=1050,mode='sandbox') as (page,f,errs):
            f.locator('.dh-panel .dh-primary').click();pause(f)
            f.get_by_role('button',name='Skip this task',exact=True).click();pause(f)
            f.get_by_role('button',name='Skip this task',exact=True).click();pause(f)
            f.locator('.dh-panel .dh-primary').click();pause(f)
            nav(f,'/demo/roofing-site/quick-estimate')
            f.locator('input[name="shape"][value="gable"]').check(force=True)
            f.locator('.qr-app').get_by_role('button',name='Continue',exact=False).last.click();pause(f)
            f.locator('input[name="size"][value="small"]').check(force=True)
            f.locator('.qr-app').get_by_role('button',name='Continue',exact=False).last.click();pause(f)
            f.locator('input[name="pitch"][value="typical"]').check(force=True)
            f.locator('.qr-app').get_by_role('button',name='Continue',exact=False).last.click();pause(f)
            f.locator('input[name="existing"][value="tile"]').check(force=True)
            f.locator('.qr-app').get_by_role('button',name='Continue',exact=False).last.click();pause(f)
            f.locator('input[name="covering"][value="tile"]').check(force=True)
            f.get_by_role('button',name='See my estimate',exact=False).click();pause(f)
            check(visible(f,'.dh-panel'),'unhidden guide stays visible on calculated result')
            f.locator('.qr-app').get_by_role('button',name='Request a proper quote',exact=False).click();pause(f)
            check(visible(f,'.dh-panel'),'opening an enquiry does not dismiss guide')
            f.get_by_role('button',name='Use example contact details',exact=True).click();pause(f)
            f.locator('.qr-enquiry input[type="email"]').focus();pause(f)
            check(visible(f,'.dh-panel'),'focusing a field outside guide does not dismiss it')
            page.set_viewport_size({'width':390,'height':844});pause(f)
            f.locator('.qr-enquiry input[type="email"]').focus();pause(f)
            check(visible(f,'.dh-panel'),'mobile field focus also keeps guide visible')
            check(within(f,'.dh-panel'),'open guide stays in mobile viewport over form')
            page.screenshot(path=str(OUT/'t3-guide-enquiry-mobile.png'))
            page.set_viewport_size({'width':1800,'height':1050});pause(f)
            f.get_by_role('button',name='Preview my enquiry',exact=False).click();pause(f)
            check(visible(f,'.dh-panel') and 'EXPERIENCE COMPLETE' in f.locator('.dh-panel').inner_text(),'real enquiry completion updates, but does not hide, visible guide')
            f.locator('.dh-advanced a').first.click();pause(f)
            check(visible(f,'.dh-panel'),'following advanced tool link keeps guide open')
            check(not errs,'persistent guide through estimate, mobile form and enquiry: no runtime errors')
    scenario('real pricing and enquiry without ever hiding the guide',visible_guide_enquiry)

    def mobile_visual_viewport():
        with fresh(width=390,height=844,mode='sandbox') as (page,f,errs):
            f.evaluate('''() => {
              Object.defineProperty(visualViewport, 'height', {configurable:true, value:340});
              Object.defineProperty(visualViewport, 'offsetTop', {configurable:true, value:0});
              visualViewport.dispatchEvent(new Event('resize'));
            }''');pause(f)
            box=f.locator('.dh-panel').bounding_box()
            check(box['y']>=0 and box['y']+box['height']<=341,'simulated keyboard: welcome follows visible viewport')
            hide=f.get_by_role('button',name='Hide guide',exact=True)
            check(hide.bounding_box()['y']+hide.bounding_box()['height']<340,'simulated keyboard: Hide remains reachable')
            check(visible(f,'.dh-panel'),'simulated keyboard never auto-hides guide')
            hide.click();f.locator('.dh-launcher').click();pause(f)
            check(f.locator('.dh-panel').bounding_box()['y']>=0,'simulated keyboard: manual Show restores visible panel')
            f.evaluate('''() => {
              delete visualViewport.height; delete visualViewport.offsetTop;
              visualViewport.dispatchEvent(new Event('resize'));
            }''');pause(f)
            check(within(f,'.dh-panel'),'after simulated keyboard: full viewport layout restored')
            page.emulate_media(reduced_motion='reduce');pause(f)
            check(f.locator('.dh-primary').evaluate('(e)=>getComputedStyle(e,"::before").display')=='none','reduced-motion preference disables glint effect')
            page.emulate_media(media='print');pause(f)
            check(not visible(f,'.dh-panel'),'printing does not include the guide')
            check(not errs,'viewport and preference checks: no JS errors')
    scenario('visual-viewport recovery, reduced motion and print',mobile_visual_viewport)

    browser.close()
results={'browser':'Chromium via Playwright','scope':'actual-source standalone HTML; document and iframe/srcdoc including sandbox=allow-scripts (storage denied); no live Next server or live AI','assertions_passed':len(checks),'failed_scenarios':failures,'page_errors':errors,'checks':checks}
(OUT/'browser-results.json').write_text(json.dumps(results,indent=2))
print('ASSERTIONS',len(checks),'FAILED SCENARIOS',len(failures),'JS ERRORS',len(errors))
sys.exit(1 if failures or errors else 0)
