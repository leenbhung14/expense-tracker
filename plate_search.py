#!/usr/bin/env python3
"""
EzyPlates Plate Number Search Script
Searches for plate number availability on https://ezyplates.sa.gov.au/
"""

import time
import sys
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException

def setup_driver():
    """Setup Chrome WebDriver with appropriate options"""
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in headless mode
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")
    
    try:
        driver = webdriver.Chrome(options=chrome_options)
        return driver
    except Exception as e:
        print(f"Error setting up Chrome WebDriver: {e}")
        print("Please make sure Chrome and ChromeDriver are installed.")
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
        wait = WebDriverWait(driver, 10)
        
        # Find and fill the plate number input field
        print(f"Searching for plate number: {plate_number}")
        plate_input = wait.until(
            EC.presence_of_element_located((By.ID, "plate-number-line-1"))
        )
        plate_input.clear()
        plate_input.send_keys(plate_number)
        
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
        
        # Extract the result text
        result_text = result_element.text.strip()
        
        # Determine availability status
        if "Congratulations" in result_text or "available" in result_text.lower():
            status = "available"
        elif "unavailable" in result_text.lower() or "not available" in result_text.lower():
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
            "message": "Timeout waiting for page elements to load",
            "plate_number": plate_number
        }
    except NoSuchElementException as e:
        return {
            "status": "error",
            "message": f"Element not found: {e}",
            "plate_number": plate_number
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Unexpected error: {e}",
            "plate_number": plate_number
        }

def main():
    """Main function to run the plate search"""
    if len(sys.argv) != 2:
        print("Usage: python plate_search.py <plate_number>")
        print("Example: python plate_search.py EZYPLTE")
        sys.exit(1)
    
    plate_number = sys.argv[1].upper()
    
    # Validate plate number format (basic validation)
    if not plate_number.isalnum() or len(plate_number) > 7:
        print("Error: Plate number should be alphanumeric and maximum 7 characters")
        sys.exit(1)
    
    driver = None
    try:
        driver = setup_driver()
        result = search_plate_number(driver, plate_number)
        
        print("\n" + "="*50)
        print("SEARCH RESULTS")
        print("="*50)
        print(f"Plate Number: {result['plate_number']}")
        print(f"Status: {result['status'].upper()}")
        print(f"Message: {result['message']}")
        print("="*50)
        
    except KeyboardInterrupt:
        print("\nSearch interrupted by user")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if driver:
            driver.quit()

if __name__ == "__main__":
    main()