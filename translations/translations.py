#!/usr/local/bin/python3

import csv
import os

TEMPLATE = """{{
    "extensionName": {{
        "message": "{extensionName}",
        "description": "Extension name"
    }},
    "extensionDescription": {{
        "message": "{extensionDescription}",
        "description": "Extension description"
    }},
    "contextMenuItemLabel": {{
        "message": "{contextMenuItemLabel}",
        "description": "Context menu item label for closing other tabs"
    }}
}}
"""

def convert_translations_to_json():
    with open('translations.csv') as csvfile:
        # Skip header and en
        csvfile.readline()
        csvfile.readline()

        csvreader = csv.reader(csvfile)

        for row in csvreader:
            (code, language, extensionName, extensionDescription, contextMenuItemLabel) = row
            directory = "../extension/_locales/{}".format(code)
            
            if not os.path.exists(directory):
                os.makedirs(directory)

            file = directory + "/messages.json"
            with open(file, "w") as json_file:
                json_file.write(TEMPLATE.format(**locals()))

if __name__ == "__main__":
    convert_translations_to_json()