const fs = require('fs');
const path = require('path');
function dedupeImports(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            dedupeImports(fullPath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let orig = content;
            const regex = /import\s+\{([^}]+)\}\s+from\s+[\"']hugeicons-react[\"'];?/g;
            let match;
            while ((match = regex.exec(content)) !== null) {
                const icons = match[1].split(',').map(i => i.trim()).filter(Boolean);
                const uniqueIcons = [...new Set(icons)];
                const replacement = 'import { ' + uniqueIcons.join(', ') + ' } from \"hugeicons-react\";';
                content = content.substring(0, match.index) + replacement + content.substring(match.index + match[0].length);
                regex.lastIndex = match.index + replacement.length;
            }
            if (content !== orig) {
                fs.writeFileSync(fullPath, content);
                console.log('Deduped ' + fullPath);
            }
        }
    }
}
dedupeImports('e:/Flutter/Flutter App/ThinkCodifyProjects/WA_AI_AUTOMATION/admin-panel/src');
