#!/usr/bin/env python3
import json
import re
import sys
import os

def contains_arabic(text):
    # Unicode block for Arabic: \u0600 to \u06FF
    return bool(re.search(r'[\u0600-\u06FF]', text))

def main():
    # Check if the input file name is provided.
    if len(sys.argv) < 2:
        print("Usage: python script.py <input_file.txt>")
        sys.exit(1)
        
    input_filename = sys.argv[1]
    base, _ = os.path.splitext(input_filename)
    output_filename = base + ".json"
    
    # Using a fixed timestamp; adjust as needed.
    timestamp = "2025-02-05T22:14:11.248Z"
    
    metadata = {
        "scriptName": "roaming-around",
        "originalCreator": "user",
        "coAuthors": [],
        "dateCreated": timestamp,
        "lastUpdated": timestamp
    }
    
    # List of keywords to identify dialogue lines.
    dialogue_keywords = ["spect-actor:", "tilskuer:", "المتفرج:"]
    
    script_lines = {}
    with open(input_filename, "r", encoding="utf-8") as f:
        for i, line in enumerate(f, start=1):
            line = line.strip()
            if not line:
                continue
            
            # Check if the line is dialogue and wrap the keyword with stars.
            is_dialogue = False
            for keyword in dialogue_keywords:
                # Check case-insensitively for English keywords.
                if line.lower().startswith(keyword.lower()):
                    is_dialogue = True
                    keyword_length = len(keyword)
                    # Insert two asterisks before and after the dialogue keyword.
                    line = f"**{line[:keyword_length]}**{line[keyword_length:]}"
                    break
            
            # Set alignment: right if the line contains Arabic characters.
            alignment = "right" if contains_arabic(line) else "left"
            
            # Create the JSON entry for this line.
            script_lines[str(i)] = {
                "text": line,
                "alignment": alignment,
                "style": "regular",
                "dialogue": is_dialogue,
                "createdAt": timestamp,
                "editedAt": timestamp
            }
    
    # Build the final JSON structure.
    output_data = {
        "metadata": metadata,
        "script": script_lines
    }
    
    # Write out the JSON file.
    with open(output_filename, "w", encoding="utf-8") as outfile:
        json.dump(output_data, outfile, ensure_ascii=False, indent=2)
    
    print(f"JSON file created: {output_filename}")

if __name__ == '__main__':
    main()
