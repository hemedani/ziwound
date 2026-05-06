import json
import os

messages_dir = "/Users/syd/work/katiraei/ziwound/front/messages"
files = ["ar.json", "en.json", "es.json", "fa.json", "nl.json", "pt.json", "ru.json", "tr.json", "zh.json"]

new_home_keys = {
    "hero": {
        "slide1": {
            "title": "Documenting Crimes Against Humanity",
            "subtitle": "A secure, permanent archive of war crimes and human rights violations. Every report contributes to the pursuit of justice.",
            "cta": "Submit Report",
            "secondaryCta": "Explore Archive"
        },
        "slide2": {
            "title": "Truth Cannot Be Erased",
            "subtitle": "Survivors, witnesses, and investigators from across the globe unite here to preserve evidence and demand accountability.",
            "cta": "Learn More",
            "secondaryCta": "View Timeline"
        },
        "slide3": {
            "title": "Justice Begins With Evidence",
            "subtitle": "From conflict zones to courtrooms, verified documentation is the foundation of justice for victims worldwide.",
            "cta": "Submit Report",
            "secondaryCta": "Read Stories"
        }
    },
    "impactStats": {
        "reports": "Reports Documented",
        "countries": "Countries",
        "locations": "Locations Mapped",
        "documents": "Documents Archived"
    },
    "featured": {
        "overline": "Featured",
        "title": "Documented Cases & Stories",
        "subtitle": "A selection of verified reports and survivor testimonies from our global archive.",
        "readMore": "Read More"
    },
    "mission": {
        "overline": "Our Mission",
        "title": "Truth is the Foundation of Justice",
        "p1": "Ziwound exists to ensure that no crime against humanity goes undocumented. We provide a secure, permanent, and verifiable archive of war crimes and human rights violations from conflict zones around the world.",
        "p2": "By combining cutting-edge technology with rigorous verification, we empower survivors, witnesses, and investigators to preserve evidence that can stand the test of time and the scrutiny of courts.",
        "tagline": "For the victims. For justice. For history."
    },
    "submitCTA": {
        "title": "Your Voice Can Bring Justice",
        "subtitle": "If you have witnessed or have evidence of war crimes or human rights violations, your testimony matters. Submit a report securely and help build the case for justice.",
        "primary": "Submit a Report",
        "secondary": "Explore Documented Crimes",
        "note": "All submissions are encrypted and can be made anonymously. We protect your identity at every step."
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

    if "home" not in data:
        data["home"] = {}

    deep_update(data["home"], new_home_keys)

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"Updated {filename}")

print("Done!")
