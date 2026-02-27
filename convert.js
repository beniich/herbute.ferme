const fs = require('fs');

function styleToDict(styleStr) {
    const parts = styleStr.split(";");
    const styles = [];
    for (const p of parts) {
        if (!p.includes(":")) continue;
        let [k, ...vParts] = p.split(":");
        let v = vParts.join(":").trim().replace(/'/g, "\\'");
        k = k.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        styles.push(`${k}: '${v}'`);
    }
    return "{" + styles.join(", ") + "}";
}

function processHTML(inputFile, outputFile) {
    let content = fs.readFileSync(inputFile, "utf8");

    // Replacements
    content = content.replace(/class="/g, 'className="');
    content = content.replace(/for="/g, 'htmlFor="');
    // Events
    content = content.replace(/onclick="/g, 'onClick="');
    content = content.replace(/onmouseover="/g, 'onMouseOver="');
    content = content.replace(/onmouseout="/g, 'onMouseOut="');
    
    // Self-closing tags
    const tags = ["img", "input", "br", "hr", "meta", "link", "source"];
    for (const tag of tags) {
        const regex = new RegExp(`(<${tag}\\b[^>]*?)(?<!/)>`, "gi");
        content = content.replace(regex, "$1/>");
    }

    // Styles
    content = content.replace(/style="([^"]*)"/g, (match, p1) => {
        return `style={${styleToDict(p1)}}`;
    });

    // Style tag content to avoid JSX errors with CSS syntax
    content = content.replace(/<style>([\s\S]*?)<\/style>/g, (match, p1) => {
        const css = p1.replace(/`/g, "\\`");
        return `<style dangerouslySetInnerHTML={{__html: \`${css}\`}} />`;
    });
    
    content = content.replace(/className=""/g, '');

    // Cleanup inline handlers that are now onClick="..." but should be functions or valid expressions.
    // For now, let's just make it a Next.js Client Component string!
    const jsxContent = `
    "use client";
    import React, { useEffect } from 'react';
    
    export default function Component() {
        return (
            <>
                ${content.substring(content.indexOf('<body>') + 6, content.lastIndexOf('</body>'))}
            </>
        );
    }`;
    
    fs.writeFileSync(outputFile, jsxContent, "utf8");
}

processHTML(process.argv[2], process.argv[3]);
