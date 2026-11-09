"""Real Chromium tests: C2 / D1 / W2; only fictional screenshots in CI artifacts."""
from contextlib import contextmanager
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from tempfile import TemporaryDirectory
from threading import Thread
from playwright.sync_api import sync_playwright


@contextmanager
def site():
    with TemporaryDirectory() as directory:
        (Path(directory) / 'SMARTwearable').symlink_to(Path('dist').resolve(), target_is_directory=True)
        server = ThreadingHTTPServer(('127.0.0.1', 0), partial(SimpleHTTPRequestHandler, directory=directory))
        thread = Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            yield f'http://127.0.0.1:{server.server_port}/SMARTwearable/'
        finally:
            server.shutdown(); server.server_close(); thread.join()


def run():
    Path('test-results').mkdir(exist_ok=True)
    with site() as url, sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(viewport={'width': 1280, 'height': 900}, has_touch=True, timezone_id='Europe/Zurich')
        # Date is fixed ONLY in the test, timers run normally. Production reads the tablet clock.
        context.add_init_script("""{
          const OriginalDate = Date;
          const fixed = OriginalDate.parse('2026-11-12T13:30:00Z');
          window.Date = class extends OriginalDate {
            constructor(...args) { super(...(args.length ? args : [fixed])); }
            static now() { return fixed; }
          };
        }""")
        page = context.new_page()
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(url)
        assert page.get_by_role('heading', name='Ihr Armband – Ihre Einstellungen').is_visible()
        assert page.locator('#preferences-submit').is_disabled()
        assert page.locator('.preference-option input:checked').count() == 0
        page.screenshot(path='test-results/settings-setup.png', full_page=True)
        page.evaluate("localStorage.setItem('smartwearable-preferences-v1', JSON.stringify({schema:1,pulseAlerts:true}))")
        page.reload()
        assert page.get_by_role('heading', name='Ihr Armband – Ihre Einstellungen').is_visible()
        assert page.locator('#preferences-submit').is_disabled()
        preference_fields = ['pulseAlerts', 'activityReminder', 'shareWithCareTeam']
        for combination in range(8):
            values = {field: bool(combination & (1 << index)) for index, field in enumerate(preference_fields)}
            for field, value in values.items():
                page.locator(f'input[name="{field}"][value="{str(value).lower()}"]').check()
            assert page.locator('#preferences-submit').is_enabled()
            page.locator('#preferences-submit').click()
            assert page.locator('[data-testid=week-minutes]').inner_text() == '80'
            stored = page.evaluate("JSON.parse(localStorage.getItem('smartwearable-preferences-v1'))")
            assert {field: stored[field] for field in preference_fields} == values
            if combination < 7:
                page.evaluate("localStorage.removeItem('smartwearable-preferences-v1')")
                page.reload()
                assert page.get_by_role('heading', name='Ihr Armband – Ihre Einstellungen').is_visible()

        page.screenshot(path='test-results/settings-home.png', full_page=True)
        page.locator('[data-preference-key="pulseAlerts"]').click()
        assert page.locator('[data-setting-group="pulseAlerts"]').evaluate('(el) => el === document.activeElement')
        assert page.locator('input[name="pulseAlerts"][value="true"]').is_checked()
        page.locator('input[name="pulseAlerts"][value="false"]').check()
        page.locator('[data-action="cancelSettings"]').click()
        assert 'Pulshinweise' in page.locator('[data-preference-key="pulseAlerts"]').inner_text()
        assert page.locator('[data-preference-key="pulseAlerts"]').inner_text().endswith('Ein')
        page.locator('[data-preference-key="shareWithCareTeam"]').click()
        page.locator('input[name="shareWithCareTeam"][value="false"]').check()
        page.locator('#preferences-submit').click()
        assert page.locator('[data-preference-key="shareWithCareTeam"]').inner_text().endswith('Nur ich')

        page.locator('[data-testid=week-minutes]').wait_for()
        assert page.locator('[data-testid=week-minutes]').inner_text() == '80'
        assert 'Donnerstag, 12. November 2026' in page.locator('.date-label').inner_text()
        assert 'Armband-Akku' in page.locator('.status-button').inner_text()
        page.evaluate('navigator.serviceWorker.ready')
        page.wait_for_function('!!navigator.serviceWorker.controller')
        assert page.locator('[data-action=update]').count() == 0

        def click(action):
            if action == 'controls' and page.locator('[data-action=controls]:visible').count() == 0:
                click('home')
            if action == 'today':
                click('currentWeek')
                day_click('2026-11-12')
                return
            if action == 'home' and page.locator('.home-button').count() == 0:
                return
            page.locator(f'[data-action="{action}"]:visible').first.click()

        def choose(action, value):
            page.locator(f'[data-change="{action}"]').select_option(value)

        def no_overflow():
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), 'horizontal page overflow'

        def aligned_bars():
            for row in page.locator(".matrix-row").all():
                bottoms = row.locator(".bar-plot").evaluate_all("els => els.map(e => e.getBoundingClientRect().bottom)")
                if bottoms: assert max(bottoms) - min(bottoms) < 2, bottoms

        def red_home():
            home = page.locator('.home-button')
            assert home.is_visible()
            assert home.evaluate('(el) => getComputedStyle(el).backgroundColor') == 'rgb(165, 47, 56)'
            assert home.evaluate('(el) => getComputedStyle(el).color') == 'rgb(255, 255, 255)'

        def week_click(start):
            page.locator(f'[data-action=selectWeek][data-week="{start}"]:visible').first.click()

        def day_click(date):
            page.locator(f'[data-action=date][data-date="{date}"]:visible').first.click()

        click('controls'); choose('scenario', 'S02')
        page.once('dialog', lambda d: d.accept())
        click('resetPreferences')
        assert page.get_by_role('heading', name='Ihr Armband – Ihre Einstellungen').is_visible()
        for field, value in [('pulseAlerts', True), ('activityReminder', False), ('shareWithCareTeam', False)]:
            page.locator(f'input[name="{field}"][value="{str(value).lower()}"]').check()
        page.locator('#preferences-submit').click()
        assert page.locator('[data-testid=week-minutes]').inner_text() != '80'
        click('controls'); page.once('dialog', lambda d: d.accept()); click('reset')
        assert page.locator('[data-testid=week-minutes]').inner_text() == '80'
        assert page.evaluate("JSON.parse(localStorage.getItem('smartwearable-preferences-v1')).activityReminder") is False

        no_overflow()
        assert 'Schritte' not in page.locator('main').inner_text()
        assert 'Puls' not in page.locator('main').inner_text()
        assert page.locator('.home-actions button').count() == 3
        assert page.locator('.preference-shortcuts button').count() == 3
        page.screenshot(path='test-results/c2-home-landscape.png', full_page=True)
        click('weeks'); red_home(); no_overflow(); aligned_bars()
        assert page.get_by_role('tab').count() == 0
        assert page.locator('.weeks-matrix .column-head').count() == 6
        page.screenshot(path='test-results/w2-weeks-landscape.png', full_page=True)
        week_click('2026-11-02')
        assert '95 Bewegungsminuten' in page.locator('main').inner_text()
        assert '2.11.' in page.locator('h1').inner_text()
        red_home()
        page.screenshot(path='test-results/d1-past-week.png', full_page=True)
        day_click('2026-11-05')
        assert page.locator('[data-testid=day-minutes]').inner_text() == '18'
        assert 'Bei sonstiger Bewegung' in page.locator('main').inner_text()
        assert 'Hauttemperatur' in page.locator('main').inner_text()
        click('back')
        assert '95 Bewegungsminuten' in page.locator('main').inner_text()
        click('home'); click('currentWeek')
        assert page.locator('.daily-matrix .column-head:disabled').count() == 3
        assert 'Heute' in page.locator('main').inner_text()
        assert 'Datenlücke' in page.locator('main').inner_text()
        assert 'Puls bei Bewegung' in page.locator('main').inner_text()
        aligned_bars()
        page.screenshot(path='test-results/d1-current-week.png', full_page=True)
        click('controls'); choose('device', 'G05'); click('home')
        stale = page.locator('[data-testid=week-minutes]').inner_text()
        assert stale != '80'
        click('today')
        assert int(page.locator('[data-testid=day-minutes]').inner_text()) < 15
        click('controls'); click('transfer')
        page.wait_for_function("document.querySelector('[data-action=transfer]')?.disabled === false")
        click('home'); assert page.locator('[data-testid=week-minutes]').inner_text() == '80'
        click('controls'); choose('scenario','S03'); click('home'); click('today')
        assert page.locator('[data-testid=day-minutes]').inner_text() == '7'
        click('controls'); choose('device','G07'); click('transfer')
        page.wait_for_function("document.querySelector('[data-action=transfer]')?.disabled === false")
        assert 'fehlgeschlagen' in page.locator('main').inner_text()
        page.once('dialog', lambda d:d.accept()); click('reset')
        assert page.locator('[data-testid=week-minutes]').inner_text() == '80'
        assert page.evaluate("JSON.parse(localStorage.getItem('smartwearable-preferences-v1')).activityReminder") is False

        for size in [{'width':820,'height':1180},{'width':1180,'height':820},{'width':400,'height':800}]:
            page.set_viewport_size(size)
            for action in ['home','weeks','currentWeek','today','device','info','controls']:
                click('home'); click(action); no_overflow()
                if action != 'home': red_home()
                if action in ['weeks','currentWeek'] and size['width'] > 700: aligned_bars()
            click('home')
            if size['width']==820: page.screenshot(path='test-results/c2-home-portrait.png',full_page=True)

        # N17: these are AVAILABLE app viewports, after OS bars have taken their space.
        for size in [{'width':1280,'height':640}, {'width':1180,'height':620}, {'width':1024,'height':560}, {'width':820,'height':1020}]:
            page.set_viewport_size(size)
            click('home')
            page.screenshot(path=f"test-results/compact-home-{size['width']}x{size['height']}.png", full_page=True)
            no_overflow()
            assert page.evaluate('document.documentElement.scrollHeight <= innerHeight + 1'), f"vertical home overflow {size}"
            assert 'Schritte' not in page.locator('main').inner_text()
            assert 'Puls' not in page.locator('main').inner_text()
            for control in page.locator('.compact-shell button, .comparison-link').all():
                box = control.bounding_box()
                assert box and box['y'] >= 0 and box['y'] + box['height'] <= size['height'] + 1, (size, box)
                assert box['height'] >= 48 and box['width'] >= 48, (size, box)
            # Navigation remains usable from the same compact screen.
            click('currentWeek')
            assert 'Schritte' in page.locator('main').inner_text()
            assert 'Puls' in page.locator('main').inner_text()
            click('home')

        # N18: compact measurement pages after space taken by the Android bars.
        for size in [{'width':1280,'height':640}, {'width':1180,'height':620}, {'width':1024,'height':640}, {'width':820,'height':1020}]:
            page.set_viewport_size(size)
            for action in ['weeks','currentWeek','today']:
                click('home'); click(action)
                red_home(); no_overflow(); aligned_bars()
                assert page.locator('.detail-toolbar h1').count() == 1
                assert page.locator('.site-header, .brand-name, .date-status').count() == 0
                page.screenshot(path=f"test-results/detail-{action}-{size['width']}x{size['height']}.png",full_page=True)
                assert page.evaluate('document.documentElement.scrollHeight <= innerHeight + 1'), f"vertical detail overflow {action} {size}: "+str(page.locator('.detail-shell > *, .detail-main > *, .matrix-row').evaluate_all('els => els.map(e => [e.className,Math.round(e.getBoundingClientRect().height)])'))
                for control in page.locator('.detail-toolbar button').all():
                    box=control.bounding_box()
                    assert box and box['y'] >= 0 and box['y']+box['height'] <= size['height']+1
                    assert box['height'] >= 48 and box['width'] >= 48, box
                if action == 'today':
                    assert not page.locator('.more-details').evaluate('(el) => el.open')
                    plots=page.locator('[data-time-start]').evaluate_all('els => els.map(e => [e.dataset.timeStart,e.dataset.timeEnd])')
                    assert len(plots)==2 and plots[0]==plots[1]==['480','870'],plots
                    bounds=page.locator('.time-lanes, .pulse-plot').evaluate_all('els => els.map(e => [e.getBoundingClientRect().left,e.getBoundingClientRect().right])')
                    assert abs(bounds[0][0]-bounds[1][0])<2 and abs(bounds[0][1]-bounds[1][1])<2,bounds
                    for axis in page.locator('.time-axis').all():
                        ticks=axis.locator('span:visible').evaluate_all('els => els.map(e => [e.getBoundingClientRect().left,e.getBoundingClientRect().right])')
                        assert all(ticks[i][1]+4 <= ticks[i+1][0] for i in range(len(ticks)-1)), ticks
                    page.locator('.more-details > summary').click()
                    assert page.get_by_role('heading',name='Hauttemperatur',exact=True).is_visible()
                    assert page.locator('.sample-table tbody tr').count()>0
                    page.locator('.more-details > summary').click()
                if action == 'currentWeek':
                    page.locator('.gap-notes > summary').click()
                    assert '13:00–14:00' in page.locator('.gap-notes').inner_text()
                    page.locator('.gap-notes > summary').click()

        page.set_viewport_size({'width':1280,'height':900})
        # Actual browser layout at doubled CSS zoom, not Android system text sizing.
        page.evaluate("document.documentElement.style.zoom='2'")
        for action in ['home','weeks','currentWeek','today','device','controls']:
            click('home'); click(action); no_overflow()
        click('home');page.locator('[data-preference-key="activityReminder"]').click();no_overflow()
        click('cancelSettings')
        page.evaluate("document.documentElement.style.zoom='1'")
        page.set_viewport_size({'width':400,'height':800})
        page.locator('[data-preference-key="activityReminder"]').click();no_overflow()
        page.locator('#preferences-submit').scroll_into_view_if_needed()
        assert page.locator('#preferences-submit').is_visible()
        click('cancelSettings')
        click('home')
        for _ in range(10):
            click('weeks'); week_click('2026-11-02'); day_click('2026-11-05');click('back');click('home')
        context.set_offline(True)
        page.reload();page.locator('[data-testid=week-minutes]').wait_for()
        assert page.locator('[data-testid=week-minutes]').inner_text() == '80'
        click('weeks'); week_click('2026-11-02'); day_click('2026-11-05');click('back');click('home')
        click('controls');choose('device','G09');click('device')
        assert 'noch nicht abschätzbar' in page.locator('main').inner_text()
        assert not errors,errors
        browser.close()
        print('Chromium passed: preference setup and all eight combinations, local persistence/edit/cancel, separate settings reset, C2/D1/W2 routes, responsive layouts, zoom, simulation and offline reload.')


if __name__ == '__main__':
    run()
