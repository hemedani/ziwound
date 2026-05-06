import json
import os

messages_dir = "/Users/syd/work/katiraei/ziwound/front/messages"
files = ["ar.json", "en.json", "es.json", "fa.json", "nl.json", "pt.json", "ru.json", "tr.json", "zh.json"]

new_footer_keys = {
    "legal": "Legal",
    "documents": "Documents",
    "blog": "Blog"
}

for filename in files:
    filepath = os.path.join(messages_dir, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    if "footer" not in data:
        data["footer"] = {}

    for key, value in new_footer_keys.items():
        if key not in data["footer"]:
            data["footer"][key] = value

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"Updated {filename}")

print("Done!")
