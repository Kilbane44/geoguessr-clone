import os
import requests
import re
from bs4 import BeautifulSoup
import json # Import json library

# --- Configuration ---
HMTL_FILE = 'bollards_data.html'
OUTPUT_FOLDER = 'bollard_images'
JSON_OUTPUT_FILE = 'bollard_data.json' # Added JSON output filename
# -------------------

def sanitize_filename(name):
    """Removes or replaces characters that are invalid in filenames."""
    # Remove leading/trailing whitespace
    name = name.strip()
    # Replace spaces and invalid characters with underscores
    name = re.sub(r'[\\/*?:"<>|\s]+', '_', name)
    # Remove any potential consecutive underscores
    name = re.sub(r'__+', '_', name)
    return name

def download_images_from_html(html_path, output_dir, json_output_path):
    """
    Parses HTML, downloads images with cleaner names, and saves data to JSON.
    """
    print(f"Starting image download and data extraction...")
    print(f"HTML source file: {html_path}")
    print(f"Image output directory: {output_dir}")
    print(f"JSON output file: {json_output_path}")

    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        try:
            os.makedirs(output_dir)
            print(f"Created directory: {output_dir}")
        except OSError as e:
            print(f"Error creating directory {output_dir}: {e}")
            return

    # Read the HTML file
    try:
        with open(html_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
    except FileNotFoundError:
        print(f"Error: HTML file not found at {html_path}")
        return
    except Exception as e:
        print(f"Error reading HTML file: {e}")
        return

    # Parse the HTML
    soup = BeautifulSoup(html_content, 'html.parser')

    # Find the table body (assuming there's only one main table)
    table_body = soup.find('tbody')
    if not table_body:
        print("Error: Could not find the table body (tbody) in the HTML.")
        return

    rows = table_body.find_all('tr')
    print(f"Found {len(rows)} rows in the table.")

    download_count = 0
    error_count = 0
    bollard_data_list = [] # List to store data for JSON

    # Iterate through each row, **SKIPPING the first row (header)**
    for index, row in enumerate(rows):
        if index == 0: # Skip the first row (index 0)
            print("Skipping header row...")
            continue
            
        cells = row.find_all('td')
        # print(f"\nProcessing Row {index + 1} with {len(cells)} cells:")
        # for i, cell in enumerate(cells):
        #     print(f"  Cell {i}: {cell.get_text(strip=True)[:50]}...")

        if len(cells) < 2:
            # print(f"Skipping row {index + 1}: Not enough cells ({len(cells)})")
            continue

        try:
            # --- Data extraction (Reverted to searching for first text) ---
            row_num_text = cells[0].get_text(strip=True)
            country = None
            # Try finding country identifier in the next few cells
            for i in range(1, min(len(cells), 5)): # Check cells 1 through 4
                potential_name = cells[i].get_text(strip=True)
                if potential_name and len(potential_name) > 1: # Basic check for non-empty text
                    country = potential_name # Use the first non-empty cell found
                    print(f"Identified Name: '{country}' in cell {i}")
                    break

            if not country:
                # print(f"Skipping row {index + 1}: Could not identify country name in cells 1-4.")
                continue
            # else: # Debug print removed for brevity
                # print(f"Processing '{country}' (Row ID from Cell 0: {row_num_text})")

            img_tags = row.find_all('img')
            # print(f"  Found {len(img_tags)} img tags in the row.")

            sanitized_country = sanitize_filename(country)
            # Use the number from cell 0 if it's a digit, otherwise use index+1
            row_identifier = row_num_text if row_num_text.isdigit() else str(index + 1)

            row_entry = {"country": country, "id": row_identifier, "images": {}}
            image_urls_to_download = {}
            downloaded_filenames = {}

            # Assign images and create filenames
            if len(img_tags) > 0 and img_tags[0].get('src'):
                base_filename = f"{sanitized_country}_{row_identifier}_front"
                img_url = img_tags[0]['src']
                image_urls_to_download[base_filename] = img_url
                # We'll determine final filename with extension later

            if len(img_tags) > 1 and img_tags[1].get('src'):
                base_filename = f"{sanitized_country}_{row_identifier}_back"
                img_url = img_tags[1]['src']
                image_urls_to_download[base_filename] = img_url
                # We'll determine final filename with extension later

            if not image_urls_to_download:
                 print(f"  No image URLs found for {country}.")
                 continue

            # --- Download logic --- 
            for base_filename, img_url in image_urls_to_download.items():
                try:
                    # print(f"    Downloading: {base_filename} from {img_url[:50]}...")
                    response = requests.get(img_url, stream=True, timeout=15)
                    response.raise_for_status()

                    content_type = response.headers.get('content-type')
                    extension = '.jpg'
                    if '.png' in img_url:
                        extension = '.png'
                    elif '.gif' in img_url:
                        extension = '.gif'
                    elif content_type:
                        if 'image/jpeg' in content_type: extension = '.jpg'
                        elif 'image/png' in content_type: extension = '.png'
                        elif 'image/gif' in content_type: extension = '.gif'

                    final_filename = f"{base_filename}{extension}"
                    file_path = os.path.join(output_dir, final_filename)

                    with open(file_path, 'wb') as img_file:
                        for chunk in response.iter_content(chunk_size=8192):
                            img_file.write(chunk)
                    download_count += 1
                    # Store the relative path for JSON
                    if 'front' in base_filename:
                         row_entry["images"]["front"] = final_filename
                    elif 'back' in base_filename:
                         row_entry["images"]["back"] = final_filename

                except requests.exceptions.RequestException as e:
                    print(f"    Error downloading {img_url}: {e}")
                    error_count += 1
                except Exception as e:
                    print(f"    An unexpected error occurred for {img_url}: {e}")
                    error_count += 1
            
            # Add entry to list if at least one image was processed
            if row_entry["images"]:
                bollard_data_list.append(row_entry)

        except Exception as e:
            print(f"Error processing row {index + 1}: {e}")
            error_count += 1

    print("-" * 20)
    print(f"Image download finished.")
    print(f"Successfully downloaded: {download_count} images.")
    print(f"Errors encountered: {error_count}")
    print("-" * 20)

    # --- Save data to JSON ---
    try:
        print(f"Preparing to save data for {len(bollard_data_list)} entries to {json_output_path}...")
        if not bollard_data_list:
            print("Warning: The data list is empty. No JSON file will be written.")
        else:
            print(f"First entry in list (for verification): {bollard_data_list[0]}")
            with open(json_output_path, 'w', encoding='utf-8') as json_file:
                json.dump(bollard_data_list, json_file, indent=2, ensure_ascii=False)
            print(f"Successfully wrote data to {json_output_path}.")
    except Exception as e:
        print(f"Error writing JSON file: {e}")
    print("-" * 20)

# --- Main execution ---
if __name__ == "__main__":
    # Pass the JSON output path to the function
    download_images_from_html(HMTL_FILE, OUTPUT_FOLDER, JSON_OUTPUT_FILE) 