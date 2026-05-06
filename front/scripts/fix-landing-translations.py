import json
import os

messages_dir = "/Users/syd/work/katiraei/ziwound/front/messages"
files = ["ar.json", "en.json", "es.json", "fa.json", "nl.json", "pt.json", "ru.json", "tr.json", "zh.json"]

new_keys = {
    "home": {
        "hero": {
            "brandLabel": "Ziwound",
            "scrollIndicator": "Scroll"
        },
        "mapTeaser": {
            "overline": "Global Coverage",
            "title": "Crimes Documented Across the World",
            "description": "Our archive spans conflict zones and regions affected by human rights violations on nearly every continent. Explore the interactive map to see documented incidents by location, severity, and date.",
            "activeZones": "Active conflict zones",
            "verifiedReports": "Verified reports",
            "cta": "Explore Interactive Map"
        },
        "trustMission": {
            "pillar1Title": "Secure & Anonymous",
            "pillar1Desc": "Every report is handled with the highest security standards. Whistleblowers and witnesses can submit information safely and anonymously.",
            "pillar2Title": "Verified Documentation",
            "pillar2Desc": "Our team of researchers and legal experts carefully verifies all submitted evidence before it enters the public archive.",
            "pillar3Title": "Justice & Accountability",
            "pillar3Desc": "We believe in the power of documented truth to drive legal proceedings, international pressure, and lasting justice for victims.",
            "pillar4Title": "Global Solidarity",
            "pillar4Desc": "A worldwide network of human rights defenders, journalists, and citizens standing together against impunity."
        }
    }
}

def deep_update(original, update):
    for key, value in update.items():
        if isinstance(value, dict) and key in original and isinstance(original[key], dict):
            deep_update(original[key], value)
        else:
            original[key] = value
    return original

for filename in files:
    filepath = os.path.join(messages_dir, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    deep_update(data, new_keys)

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"Updated {filename}")

print("Done!")
