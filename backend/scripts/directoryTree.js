import fs from 'fs';
import path from 'path';
import { createCanvas } from 'canvas';

// Directory tree creation function
function createDirectoryTree(dir, padding = '', exclude = ['node_modules', '.git', 'build', 'dist']) {
    let tree = '';
    const items = fs.readdirSync(dir);

    items.forEach((item, index) => {
        const isLast = index === items.length - 1;
        const itemPath = path.join(dir, item);
        const stats = fs.statSync(itemPath);

        if (exclude.includes(item)) return;

        tree += `${padding}${isLast ? '└── ' : '├── '}${item}\n`;

        if (stats.isDirectory()) {
            tree += createDirectoryTree(
                itemPath,
                padding + (isLast ? '    ' : '│   '),
                exclude
            );
        }
    });

    return tree;
}

// A4 image generation function
function saveTreeAsA4Images(treeText) {
    const A4_WIDTH = 794;  // 8.27 inches * 96 DPI
    const A4_HEIGHT = 1123; // 11.69 inches * 96 DPI
    const lineHeight = 20;
    const fontSize = 14;
    const padding = 20;
    
    const lines = treeText.split('\n');
    const linesPerPage = Math.floor((A4_HEIGHT - padding * 2) / lineHeight);
    const totalPages = Math.ceil(lines.length / linesPerPage);
    
    for (let pageNum = 0; pageNum < totalPages; pageNum++) {
        const canvas = createCanvas(A4_WIDTH, A4_HEIGHT);
        const ctx = canvas.getContext('2d');
        
        // Page setup
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, A4_WIDTH, A4_HEIGHT);
        ctx.fillStyle = '#000000';
        ctx.font = `${fontSize}px Courier New`;
        
        // Get lines for current page
        const startLine = pageNum * linesPerPage;
        const endLine = Math.min((pageNum + 1) * linesPerPage, lines.length);
        const pageLines = lines.slice(startLine, endLine);
        
        // Add page header
        ctx.fillText(`Directory Structure - Page ${pageNum + 1}/${totalPages}`, padding, padding);
        
        // Draw directory tree
        pageLines.forEach((line, index) => {
            ctx.fillText(
                line, 
                padding, 
                padding * 2 + lineHeight * index
            );
        });
        
        // Save page as PNG
        const buffer = canvas.toBuffer('image/png');
        const outputPath = path.join(
            process.cwd(), 
            `directory-tree-page-${pageNum + 1}.png`
        );
        fs.writeFileSync(outputPath, buffer);
        console.log(`Generated: directory-tree-page-${pageNum + 1}.png`);
    }
}

// Main execution
function main() {
    const rootDir = process.argv[2] || './';
    console.log('Generating directory tree for:', rootDir);
    console.log('─'.repeat(50));
    
    const treeText = createDirectoryTree(rootDir);
    console.log(treeText);
    
    console.log('─'.repeat(50));
    console.log('Creating A4 PNG files...');
    saveTreeAsA4Images(rootDir + '\n│\n' + treeText);
}

main();