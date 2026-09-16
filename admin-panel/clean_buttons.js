const fs = require('fs');
const path = require('path');

const directory = 'e:/Flutter/Flutter App/ThinkCodifyProjects/WA_AI_AUTOMATION/admin-panel/src/app';

const patterns = [
    /bg-indigo-600 hover:bg-indigo-500 text-white shadow-md/g,
    /bg-indigo-600 hover:bg-indigo-500 text-white gap-2/g,
    /bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2/g,
    /bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5/g,
    /bg-indigo-600 hover:bg-indigo-500 text-white/g,
    /bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 h-9 text-xs/g,
    /bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700/g,
    /bg-zinc-800 hover:bg-zinc-700 text-white/g,
    /text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/g,
    /h-8 w-8 border-zinc-700 hover:bg-zinc-800 text-zinc-400/g,
    /border-zinc-700 hover:bg-zinc-800 text-zinc-400/g,
    /bg-\[\#121214\] hover:bg-zinc-800 text-zinc-300 border-zinc-700/g,
    /h-8 border-zinc-700 bg-\[\#121214\] hover:bg-zinc-800 text-zinc-300/g,
    /bg-zinc-900\/50 hover:bg-zinc-800\/80 text-zinc-300 border border-zinc-800/g,
    /border-zinc-800 hover:bg-zinc-800\/50/g,
    /text-zinc-500 hover:text-zinc-300/g,
];

function cleanFile(filepath) {
    let content = fs.readFileSync(filepath, 'utf8');
    let original = content;
    
    for (const pattern of patterns) {
        content = content.replace(pattern, '');
    }
    
    // Clean up empty or extra whitespace in className
    content = content.replace(/className=\"\s+\"/g, 'className=\"\"');
    content = content.replace(/className=\"\s+/g, 'className=\"');
    content = content.replace(/\s+\"/g, '\"');
    // Remove empty className=""
    content = content.replace(/ className=\"\"/g, '');
    
    if (content !== original) {
        fs.writeFileSync(filepath, content, 'utf8');
        console.log('Updated ' + filepath);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            cleanFile(fullPath);
        }
    }
}

walkDir(directory);
console.log('Done!');
