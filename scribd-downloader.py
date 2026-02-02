from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import sys


# Set up Chrome options
options = Options()
options.add_experimental_option("detach", True)
options.add_argument("-devtools")


def convert_scribd_link(url):
    import re
    match = re.search(r'https://www\.scribd\.com/document/(\d+)/', url)
    if match:
        doc_id = match.group(1)
        return f'https://www.scribd.com/embeds/{doc_id}/content'
    else:
        return "Invalid Scribd URL"


# Input Scribd link
if len(sys.argv) > 1:
    input_url = sys.argv[1]
else:
    input_url = input("Input link Scribd: ")

converted_url = convert_scribd_link(input_url)
print("Link embed:", converted_url)


# INIT DRIVER
driver = webdriver.Chrome(options=options)
driver.get(converted_url)

wait = WebDriverWait(driver, 15)

# Wait for pages to load
wait.until(
    EC.presence_of_element_located((By.CSS_SELECTOR, "[class*='page']"))
)

# Remove cookie banner if present
try:
    wait.until(
        EC.presence_of_element_located(
            (By.CSS_SELECTOR, "[aria-label='Cookie Consent Banner']")
        )
    )
    driver.execute_script("""
        var cookieBanner = document.querySelector('[aria-label="Cookie Consent Banner"]');
        if (cookieBanner) cookieBanner.remove();
    """)
    print("[OK] Cookie banner deleted")
except TimeoutException:
    print("[INFO] Cookie banner not present")


# Get pages and scroll through them
prev_count = 0

while True:
    pages = driver.find_elements(By.CSS_SELECTOR, "[class*='page']")

    for page in pages:
        driver.execute_script(
            "arguments[0].scrollIntoView({block: 'center'});", page
        )

    try:
        last_page = pages[-1]
        wait.until(lambda _: last_page.is_displayed())
    except Exception:
        pass

    if len(pages) == prev_count:
        break

    prev_count = len(pages)

print("[OK] Scrolled and loaded all pages")


# DELETE TOOLBARS
driver.execute_script("""
    document.querySelectorAll('.toolbar_top, .toolbar_bottom')
        .forEach(el => el.remove());
""")

print("[OK] Toolbars removed")


# Remove container classes
elements = driver.find_elements(By.CLASS_NAME, "document_scroller")
for element in elements:
    driver.execute_script(
        "arguments[0].setAttribute('class', '');", element
    )

print("[OK] Containers cleaned")


# Inject print CSS
driver.execute_script("""
    var style = document.createElement('style');
    style.textContent = `
        @media print {
            @page { margin: 0; }
            .toolbar_top, .toolbar_bottom { display: none !important; }
        }
    `;
    document.head.appendChild(style);
""")

print("[OK] Print CSS injected")


# PRINT
driver.execute_script("window.scrollTo(0, 0);")

wait.until(
    lambda d: d.execute_script("return document.readyState") == "complete"
)

driver.execute_script("window.print();")

print("[OK] Finished!")