# EzyPlates Plate Number Search Script

This Python script automates the search for plate number availability on the [EzyPlates website](https://ezyplates.sa.gov.au/).

## Features

- Automatically searches for plate number availability
- Handles both available and unavailable plate numbers
- Runs in headless mode (no browser window)
- Automatic ChromeDriver management
- Error handling and validation
- Clean output formatting

## Prerequisites

- Python 3.7 or higher
- Google Chrome browser installed
- Internet connection

## Installation

1. **Clone or download the script files**

2. **Install required dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

   Or install manually:
   ```bash
   pip install selenium webdriver-manager
   ```

## Usage

### Basic Usage

```bash
python plate_search_final.py <plate_number>
```

### Examples

```bash
# Search for a specific plate number
python plate_search_final.py EZYPLTE

# Search for another plate number
python plate_search_final.py ABC123

# Search with spaces (they will be removed automatically)
python plate_search_final.py "ABC 123"
```

### Batch Search Usage

```bash
# Search multiple plates from command line
python batch_plate_search.py ABC123 DEF456 GHI789

# Search plates from a file
python batch_plate_search.py --file plates.txt

# Search plates from a file and save results to CSV
python batch_plate_search.py --file plates.txt --output results.csv
```

### Output

The script will display:
- Plate number being searched
- Availability status (AVAILABLE, UNAVAILABLE, or ERROR)
- Full message from the website
- Appropriate exit code

### Exit Codes

- `0`: Plate number is available
- `1`: Plate number is unavailable
- `2`: Unknown status or error
- `130`: Script interrupted by user

### File Formats

#### Plate Numbers File (for batch search)
Create a text file with one plate number per line:
```
ABC123
DEF456
GHI789
# This is a comment
JKL012
```

#### CSV Output File
The batch search can save results to a CSV file with columns:
- `plate_number`: The searched plate number
- `status`: available/unavailable/error/unknown
- `message`: Full message from the website
- `timestamp`: When the search was performed

## Script Versions

### `plate_search.py`
Basic version that requires manual ChromeDriver installation.

### `plate_search_improved.py`
Improved version with webdriver-manager for automatic ChromeDriver management.

### `plate_search_simple.py`
Simple version that uses system ChromeDriver.

### `plate_search_final.py` (Recommended)
Final version with:
- System ChromeDriver support
- Better error handling
- Anti-detection measures
- Input validation
- Proper exit codes
- Emoji indicators for results

### `batch_plate_search.py`
Batch search script that can search multiple plate numbers:
- Search multiple plates from command line
- Search plates from a text file
- Save results to CSV file
- Summary statistics

## Troubleshooting

### Common Issues

1. **Chrome not installed**
   - Make sure Google Chrome is installed on your system

2. **Permission errors**
   - Run with appropriate permissions for your system

3. **Network issues**
   - Check your internet connection
   - The website might be temporarily unavailable

4. **Element not found errors**
   - The website structure might have changed
   - Try running the script again

### Debug Mode

To see the browser window (for debugging), modify the script by removing the `--headless` option:

```python
# Comment out or remove this line in setup_driver():
# chrome_options.add_argument("--headless")
```

## Legal Notice

This script is for educational and personal use only. Please respect the website's terms of service and rate limiting. Do not use this script for commercial purposes or to overload the website with requests.

## License

This script is provided as-is for educational purposes.