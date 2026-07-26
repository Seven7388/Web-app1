const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  'import { GoogleGenAI, Type } from "@google/genai";',
  'import { GoogleGenAI, Type } from "@google/genai";\nimport cors from "cors";'
);

code = code.replace(
  'app.use(express.json());\n\nconst PORT = 3000;',
  'app.use(express.json());\napp.use(cors());\n\nconst PORT = process.env.PORT || 3000;'
);

code = code.replace(
  'const PORT = 3000;',
  'const PORT = process.env.PORT || 3000;'
);

fs.writeFileSync('server.ts', code);
