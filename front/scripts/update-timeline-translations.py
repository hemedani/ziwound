import json
import os

messages_dir = "/Users/syd/work/katiraei/ziwound/front/messages"
files = ["ar.json", "en.json", "es.json", "fa.json", "nl.json", "pt.json", "ru.json", "tr.json", "zh.json"]

timeline_keys = {
    "timeline": {
        "overline": "Timeline",
        "title": "Recent Documented Events",
        "subtitle": "A chronological record of recently verified incidents and investigations from our global network.",
        "viewDetails": "View Details"
    }
}

for filename in files:
    filepath = os.path.join(messages_dir, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    if "home" not in data:
        data["home"] = {}

    data["home"].update(timeline_keys)

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"Updated {filename}")

print("Done!")
