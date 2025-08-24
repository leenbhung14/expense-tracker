#!/usr/bin/env python3
"""
EzyPlates Plate Number Search Script (Simple Version)
Searches for plate number availability on https://ezyplates.sa.gov.au/
Uses system ChromeDriver
"""

import time
import sys
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.common.exceptions import TimeoutException, NoSuchElementException

def setup_driver():
    """Setup Chrome WebDriver with system ChromeDriver"""
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in headless mode
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    
    try:
        # Try to use system ChromeDriver
        driver = webdriver.Chrome(options=chrome_options)
        
        # Execute script to remove webdriver property
        driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        
        return driver
    except Exception as e:
        print(f"Error setting up Chrome WebDriver: {e}")
        print("Please make sure Chrome and ChromeDriver are installed.")
        print("You can install ChromeDriver with: sudo apt install chromium-chromedriver")
        sys.exit(1)

def search_plate_number(driver, plate_number):
    """
    Search for a plate number on the EzyPlates website
    
    Args:
        driver: Selenium WebDriver instance
        plate_number: The plate number to search for
    
    Returns:
        dict: Search results with status and message
    """
    try:
        # Navigate to the website
        print(f"Navigating to EzyPlates website...")
        driver.get("https://ezyplates.sa.gov.au/")
        
        # Wait for the page to load
        wait = WebDriverWait(driver, 15)
        
        # Wait for the page to be fully loaded
        wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
        time.sleep(2)  # Additional wait for dynamic content
        
        # Find and fill the plate number input field
        print(f"Searching for plate number: {plate_number}")
        plate_input = wait.until(
            EC.presence_of_element_located((By.ID, "plate-number-line-1"))
        )
        
        # Clear the field and enter the plate number
        plate_input.clear()
        time.sleep(0.5)
        plate_input.send_keys(plate_number)
        time.sleep(0.5)
        
        # Find and click the search button
        search_button = wait.until(
            EC.element_to_be_clickable((By.ID, "check-availability"))
        )
        search_button.click()
        
        # Wait for results to appear
        print("Waiting for results...")
        result_element = wait.until(
            EC.presence_of_element_located((By.ID, "plate-availability-result"))
        )
        
        # Wait a bit more for the result to fully load
        time.sleep(2)
        
        # Extract the result text
        result_text = result_element.text.strip()
        
        # Determine availability status based on the result text
        if "NOT available" in result_text or "not available" in result_text.lower() or "unavailable" in result_text.lower():
            status = "unavailable"
        elif "Congratulations" in result_text or "available" in result_text.lower():
            status = "available"
        elif "already taken" in result_text.lower() or "taken" in result_text.lower():
            status = "unavailable"
        else:
            status = "unknown"
        
        return {
            "status": status,
            "message": result_text,
            "plate_number": plate_number
        }
        
    except TimeoutException:
        return {
            "status": "error",
            "message": "Timeout waiting for page elements to load. The website might be slow or the page structure has changed.",
            "plate_number": plate_number
        }
    except NoSuchElementException as e:
        return {
            "status": "error",
            "message": f"Element not found: {e}. The website structure might have changed.",
            "plate_number": plate_number
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Unexpected error: {e}",
            "plate_number": plate_number
        }

def validate_plate_number(plate_number):
    """Validate the plate number format"""
    if not plate_number:
        return False, "Plate number cannot be empty"
    
    if len(plate_number) > 7:
        return False, "Plate number cannot be longer than 7 characters"
    
    if not plate_number.replace(" ", "").isalnum():
        return False, "Plate number should only contain letters and numbers"
    
    return True, "Valid"

def main():
    """Main function to run the plate search"""
    if len(sys.argv) != 2:
        print("Usage: python plate_search_simple.py <plate_number>")
        print("Example: python plate_search_simple.py EZYPLTE")
        print("Example: python plate_search_simple.py ABC123")
        sys.exit(1)
    
    plate_number = sys.argv[1].upper().replace(" ", "")
    
    # Validate plate number format
    is_valid, validation_message = validate_plate_number(plate_number)
    if not is_valid:
        print(f"Error: {validation_message}")
        sys.exit(1)
    
    driver = None
    try:
        print("Setting up Chrome WebDriver...")
        driver = setup_driver()
        
        result = search_plate_number(driver, plate_number)
        
        print("\n" + "="*60)
        print("SEARCH RESULTS")
        print("="*60)
        print(f"Plate Number: {result['plate_number']}")
        print(f"Status: {result['status'].upper()}")
        print(f"Message: {result['message']}")
        print("="*60)
        
        # Return appropriate exit code
        if result['status'] == 'available':
            sys.exit(0)
        elif result['status'] == 'unavailable':
            sys.exit(1)
        else:
            sys.exit(2)
        
    except KeyboardInterrupt:
        print("\nSearch interrupted by user")
        sys.exit(130)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
    finally:
        if driver:
            driver.quit()

if __name__ == "__main__":
    main()