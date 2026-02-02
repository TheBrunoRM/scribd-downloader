"""
Script to download documents from Scribd.
This script uses Selenium to convert Scribd document links to embeddable format,
scrolls through the document, removes unwanted elements, and opens the print dialog.
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import sys


# Set up Google options
options = Options()
options.add_experimental_option("detach", True)  # Keep Chrome running
# Enable Developer Tools to open automatically
options.add_argument("-devtools")


# Convert link
def convert_scribd_link(url):
    import re
    match = re.search(r'https://www\.scribd\.com/document/(\d+)/', url)
    if match:
        doc_id = match.group(1)
        return f'https://www.scribd.com/embeds/{doc_id}/content'
    else:
        return "Invalid Scribd URL"


# Input Scribd link
# Check if an argument was passed via command line
if len(sys.argv) > 1:
    input_url = sys.argv[1]  # Take the first argument after the script name
else:
    # Fallback: Ask for input if no argument is provided
    input_url = input("Input link Scribd: ")
converted_url = convert_scribd_link(input_url)
print("Link embed:", converted_url)

# Initialize the WebDriver with the specified options
driver = webdriver.Chrome(options=options)

# Open the webpage
driver.get(converted_url)

wait = WebDriverWait(driver, 15)

wait.until(
    EC.presence_of_element_located((By.CSS_SELECTOR, "[class*='page']"))
)

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
    print("✅ Cookie banner deleted")
except:
    print("ℹ️ Cookie banner not present")



pages = driver.find_elements(By.CSS_SELECTOR, "[class*='page']")

for page in pages:
    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", page)

    wait.until(
        lambda d: page.is_displayed()
    )

print("Scrolled and loaded the pages") 


# STEP 02: DELETE DIVS - CLASS
# Delete footer top & bottom
toolbar_top_exists = driver.execute_script("""
        var toolbarTop = document.querySelector('.toolbar_top');
        if (toolbarTop) {
            toolbarTop.parentNode.removeChild(toolbarTop);
            return true;  // Indicate that it was removed
        }
        return false;  // Indicate that it was not found
    """)

# Debug message for toolbar_top
if toolbar_top_exists:
    print("'toolbar_top' was successfully deleted.")
else:
    print("'toolbar_top' was not found.")

# Check and delete toolbar_bottom
toolbar_bottom_exists = driver.execute_script("""
    var toolbarBottom = document.querySelector('.toolbar_bottom');
    if (toolbarBottom) {
        toolbarBottom.parentNode.removeChild(toolbarBottom);
        return true;  // Indicate that it was removed
    }
    return false;           // Indicate that it was not found
""")

# Debug message for toolbar_bottom
if toolbar_bottom_exists:
    print("✅ 'toolbar_bottom' was successfully deleted.")
else:
    print("❌ 'toolbar_bottom' was not found.") 

# Deleting container:
elements = driver.find_elements(By.CLASS_NAME, "document_scroller")

# Loop through each element and change its class
for element in elements:
    driver.execute_script("arguments[0].setAttribute('class', '');", element)

print("  -------  Deleted containers  ----------")


# STEP 03: INJECT PRINT CSS
# Add CSS to remove margins when printing (no whitespace around pages)
driver.execute_script("""
    var style = document.createElement('style');
    style.id = 'scribd-print-styles';
    style.textContent = `
        @media print {
            @page {
                margin: 0;
            }
            .toolbar_top, .toolbar_bottom {
                display: none !important;
            }
        }
    `;
    document.head.appendChild(style);
""")
print("✅ Print CSS injected (no margins)")


# STEP 04: PRINT PDF
# Scroll back to top
driver.execute_script("window.scrollTo(0, 0);")

wait.until(
    lambda d: d.execute_script("return document.readyState") == "complete"
)

# Open print window
driver.execute_script("window.print();")