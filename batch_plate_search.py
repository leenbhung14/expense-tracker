#!/usr/bin/env python3
"""
Batch EzyPlates Plate Number Search Script
Searches multiple plate numbers for availability on https://ezyplates.sa.gov.au/
"""

import time
import sys
import csv
from datetime import datetime
from plate_search_final import setup_driver, search_plate_number, validate_plate_number

def search_multiple_plates(plate_numbers, output_file=None):
    """
    Search multiple plate numbers
    
    Args:
        plate_numbers: List of plate numbers to search
        output_file: Optional CSV file to save results
    """
    driver = None
    results = []
    
    try:
        print("Setting up Chrome WebDriver...")
        driver = setup_driver()
        
        for i, plate_number in enumerate(plate_numbers, 1):
            print(f"\n{'='*60}")
            print(f"Searching plate {i}/{len(plate_numbers)}: {plate_number}")
            print(f"{'='*60}")
            
            # Validate plate number
            is_valid, validation_message = validate_plate_number(plate_number)
            if not is_valid:
                print(f"❌ Invalid plate number: {validation_message}")
                results.append({
                    'plate_number': plate_number,
                    'status': 'invalid',
                    'message': validation_message,
                    'timestamp': datetime.now().isoformat()
                })
                continue
            
            # Search for the plate number
            result = search_plate_number(driver, plate_number)
            result['timestamp'] = datetime.now().isoformat()
            results.append(result)
            
            # Display result
            print(f"Plate Number: {result['plate_number']}")
            print(f"Status: {result['status'].upper()}")
            print(f"Message: {result['message']}")
            
            if result['status'] == 'available':
                print("🎉 Plate number is AVAILABLE!")
            elif result['status'] == 'unavailable':
                print("❌ Plate number is UNAVAILABLE")
            else:
                print("❓ Status unknown or error occurred")
            
            # Add delay between searches to be respectful to the website
            if i < len(plate_numbers):
                print("Waiting 2 seconds before next search...")
                time.sleep(2)
        
        # Save results to CSV if output file specified
        if output_file:
            save_results_to_csv(results, output_file)
            print(f"\nResults saved to: {output_file}")
        
        # Print summary
        print_summary(results)
        
    except KeyboardInterrupt:
        print("\nBatch search interrupted by user")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if driver:
            driver.quit()

def save_results_to_csv(results, filename):
    """Save results to CSV file"""
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['plate_number', 'status', 'message', 'timestamp']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        writer.writeheader()
        for result in results:
            writer.writerow(result)

def print_summary(results):
    """Print a summary of the search results"""
    print(f"\n{'='*60}")
    print("SEARCH SUMMARY")
    print(f"{'='*60}")
    
    total = len(results)
    available = sum(1 for r in results if r['status'] == 'available')
    unavailable = sum(1 for r in results if r['status'] == 'unavailable')
    errors = sum(1 for r in results if r['status'] in ['error', 'unknown', 'invalid'])
    
    print(f"Total plates searched: {total}")
    print(f"Available: {available} 🎉")
    print(f"Unavailable: {unavailable} ❌")
    print(f"Errors/Unknown: {errors} ❓")
    
    if available > 0:
        print(f"\n🎉 Available plate numbers:")
        for result in results:
            if result['status'] == 'available':
                print(f"  - {result['plate_number']}")

def read_plate_numbers_from_file(filename):
    """Read plate numbers from a text file"""
    plate_numbers = []
    try:
        with open(filename, 'r') as file:
            for line in file:
                plate = line.strip().upper()
                if plate and not plate.startswith('#'):  # Skip empty lines and comments
                    plate_numbers.append(plate)
        return plate_numbers
    except FileNotFoundError:
        print(f"Error: File '{filename}' not found.")
        sys.exit(1)
    except Exception as e:
        print(f"Error reading file: {e}")
        sys.exit(1)

def main():
    """Main function to run the batch plate search"""
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python batch_plate_search.py <plate1> <plate2> <plate3> ...")
        print("  python batch_plate_search.py --file <filename>")
        print("  python batch_plate_search.py --file <filename> --output <output.csv>")
        print("\nExamples:")
        print("  python batch_plate_search.py ABC123 DEF456 GHI789")
        print("  python batch_plate_search.py --file plates.txt")
        print("  python batch_plate_search.py --file plates.txt --output results.csv")
        sys.exit(1)
    
    plate_numbers = []
    output_file = None
    
    # Parse command line arguments
    i = 1
    while i < len(sys.argv):
        if sys.argv[i] == '--file':
            if i + 1 >= len(sys.argv):
                print("Error: --file requires a filename")
                sys.exit(1)
            filename = sys.argv[i + 1]
            plate_numbers = read_plate_numbers_from_file(filename)
            i += 2
        elif sys.argv[i] == '--output':
            if i + 1 >= len(sys.argv):
                print("Error: --output requires a filename")
                sys.exit(1)
            output_file = sys.argv[i + 1]
            i += 2
        else:
            # Treat as plate number
            plate_numbers.append(sys.argv[i].upper())
            i += 1
    
    if not plate_numbers:
        print("Error: No plate numbers provided")
        sys.exit(1)
    
    print(f"Starting batch search for {len(plate_numbers)} plate numbers...")
    search_multiple_plates(plate_numbers, output_file)

if __name__ == "__main__":
    main()