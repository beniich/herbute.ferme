import re
import sys

def style_to_dict(style_str):
    parts = style_str.split(";")
    styles = []
    for p in parts:
        if ":" not in p: continue
        k, v = p.split(":", 1)
        k = k.strip()
        v = v.strip().replace("'", "\\'")
        k = re.sub(r"-([a-z])", lambda m: m.group(1).upper(), k)
        styles.append(f"{k}: '{v}'")
    return "{" + ", ".join(styles) + "}"

def main():
    with open(sys.argv[1], "r", encoding="utf-8") as f:
        content = f.read()

    content = content.replace('class="', 'className="')
    content = content.replace('for="', 'htmlFor="')
    
    tags = ["img", "input", "br", "hr", "meta", "link", "source"]
    for tag in tags:
        content = re.sub(r"<(%s)\b([^>]*?)(?<!/)>" % tag, r"<\1\2/>", content, flags=re.IGNORECASE)

    def style_replacer(match):
        return f"style={{{style_to_dict(match.group(1))}}}"
    
    content = re.sub(r'style="([^"]*)"', style_replacer, content)
    
    def style_tag_replacer(match):
        css = match.group(1).replace("`", "\\`")
        return f"<style dangerouslySetInnerHTML={{{{__html: `{css}`}}}} />"
    content = re.sub(r"<style>([\s\S]*?)</style>", style_tag_replacer, content)
    
    # Check for empty classNames created by replacing class=""
    content = content.replace('className=""', '')

    with open(sys.argv[2], "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    main()
