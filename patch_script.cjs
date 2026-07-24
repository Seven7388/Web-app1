const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const regex1 = /const theNewsApiKey = [^\n]+;\n\s*const rapidApiKey = [^\n]+;\n\s*let worldNewsArticles: any\[\] = \[\];\n\s*let newsDataArticles: any\[\] = \[\];\n\s*let currentsArticles: any\[\] = \[\];\n\s*let theNewsArticles: any\[\] = \[\];\n\s*let rapidApiArticles1: any\[\] = \[\];\n\s*let rapidApiArticles2: any\[\] = \[\];\n\s*let rapidApiArticles3: any\[\] = \[\];[\s\S]*?console.error\("Football News API error:", e\);\n\s*\}/;

const replacement1 = `const theNewsApiKey = process.env.THENEWS_API_KEY || "sxX0BHciBmEl7rKlirjO7CgDPmcsCBxasxQAlKmu";

    let worldNewsArticles: any[] = [];
    let newsDataArticles: any[] = [];
    let currentsArticles: any[] = [];
    let theNewsArticles: any[] = [];`;

code = code.replace(regex1, replacement1);

const regex2 = /const allArticles = \[\n\s*\.\.\.worldNewsArticles,\n\s*\.\.\.newsDataArticles,\n\s*\.\.\.currentsArticles,\n\s*\.\.\.theNewsArticles,\n\s*\.\.\.rapidApiArticles1,\n\s*\.\.\.rapidApiArticles2,\n\s*\.\.\.rapidApiArticles3\n\s*\];/;

const replacement2 = `const allArticles = [
        ...worldNewsArticles,
        ...newsDataArticles,
        ...currentsArticles,
        ...theNewsArticles
    ];`;

code = code.replace(regex2, replacement2);

fs.writeFileSync('server.ts', code);
