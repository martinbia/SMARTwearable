"""Real Chromium smoke test on CI; screenshots are CI artifacts, not patient data."""
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
            server.shutdown()
            server.server_close()
            thread.join()


def run():
    Path('test-results').mkdir(exist_ok=True)
    with site() as url, sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(viewport={'width': 820, 'height': 1180}, has_touch=True)
        page = context.new_page()
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(url)
        page.locator('[data-testid=minutes]').wait_for()
        assert page.locator('[data-testid=minutes]').inner_text() == '24'
        page.evaluate('navigator.serviceWorker.ready')
        page.wait_for_function('!!navigator.serviceWorker.controller')

        def click(action):
            page.locator(f'[data-action="{action}"]').first.click()

        def choose(action, value):
            page.locator(f'[data-change="{action}"]').select_option(value)

        def no_overflow():
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), 'horizontal page overflow'

        no_overflow()
        page.screenshot(path='test-results/today-portrait.png', full_page=True)
        click('controls')
        choose('variant', 'B')
        click('today')
        assert page.locator('[data-testid=minutes]').inner_text() == '24'
        page.set_viewport_size({'width': 1180, 'height': 820})
        no_overflow()
        assert page.locator('[data-variant=B]').count() == 1
        page.screenshot(path='test-results/today-landscape.png', full_page=True)
        click('details')
        assert page.get_by_role('heading', name='Hauttemperatur', exact=True).count() == 1
        click('back')
        click('week')
        assert page.locator('[data-action=date]').count() == 7
        page.locator('[data-date="2026-11-07"]').click()
        assert 'Messsignal fehlt' in page.locator('main').inner_text()

        click('controls')
        choose('scenario', 'S03')
        click('today')
        assert page.locator('[data-testid=minutes]').inner_text() == '12'
        assert '270 von 390' in page.locator('main').inner_text()
        click('controls')
        choose('scenario', 'S01')
        choose('device', 'G05')
        click('today')
        assert page.locator('[data-testid=minutes]').inner_text() == '6'
        click('controls')
        click('transfer')
        page.wait_for_function("document.querySelector('[data-action=transfer]')?.disabled === false")
        click('today')
        assert page.locator('[data-testid=minutes]').inner_text() == '24'

        # Narrow reflow checks are not a claim of real Android/browser zoom coverage.
        page.set_viewport_size({'width': 400, 'height': 800})
        for action in ['today', 'week', 'device', 'controls']:
            click(action)
            no_overflow()
        page.set_viewport_size({'width': 820, 'height': 1180})
        page.once('dialog', lambda dialog: dialog.accept())
        click('reset')
        assert page.locator('[data-variant=A]').count() == 1

        context.set_offline(True)
        page.reload()
        page.locator('[data-testid=minutes]').wait_for()
        assert page.locator('[data-testid=minutes]').inner_text() == '24'
        click('week')
        assert page.locator('[data-action=date]').count() == 7
        click('controls')
        choose('device', 'G09')
        click('device')
        assert 'noch nicht abschätzbar' in page.locator('main').inner_text()
        assert not errors, errors
        browser.close()
    print('Chromium smoke passed: subpath, navigation, variants, scenarios, responsive reflow and offline reload.')


if __name__ == '__main__':
    run()
