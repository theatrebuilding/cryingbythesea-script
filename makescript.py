#!/usr/bin/env python3
import json
import re
import sys
import os

# A helper function that checks if a string contains any Arabic characters.
def contains_arabic(text):
    # Unicode block for Arabic: \u0600 to \u06FF
    return bool(re.search(r'[\u0600-\u06FF]', text))

def main():
    # Ensure an input file was provided.
    if len(sys.argv) < 2:
        print("Usage: python script.py <input_file.txt>")
        sys.exit(1)
        
    input_filename = sys.argv[1]
    
    # Derive an output filename (e.g. input.txt -> input.json)
    base, _ = os.path.splitext(input_filename)
    output_filename = base + ".json"
    
    # Using the sample timestamp; you could also generate the current UTC timestamp.
    timestamp = "2025-02-05T22:14:11.248Z"
    
    # Set up the metadata according to the specification.
    metadata = {
        "scriptName": "crying by the sea",
        "originalCreator": "Monia",
        "coAuthors": [],
        "dateCreated": timestamp,
        "lastUpdated": timestamp
    }
    
    # Process the input file line by line.
    script_lines = {}
    with open(input_filename, "r", encoding="utf-8") as f:
        # Enumerate starting at 1 to match line numbering.
        for i, line in enumerate(f, start=1):
            # Remove any leading/trailing whitespace.
            line = line.strip()
            if not line:
                # Skip blank lines.
                continue
            
            # Determine alignment: right if the text contains Arabic characters.
            alignment = "right" if contains_arabic(line) else "left"
            
            # Each line gets an entry keyed by its line number as a string.
            script_lines[str(i)] = {
                "text": line,
                "alignment": alignment,
                "style": "regular",
                "createdAt": timestamp,
                "editedAt": timestamp
            }
    
    # Build the final JSON structure.
    output_data = {
        "metadata": metadata,
        "script": script_lines
    }
    
    # Write the JSON to the output file with proper formatting.
    with open(output_filename, "w", encoding="utf-8") as outfile:
        json.dump(output_data, outfile, ensure_ascii=False, indent=2)
    
    print(f"JSON file created: {output_filename}")

if __name__ == '__main__':
    main()
