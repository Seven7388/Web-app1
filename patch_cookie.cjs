const fs = require('fs');
let code = fs.readFileSync('src/components/CookieBanner.tsx', 'utf8');

code = code.replace(
  'analyze our traffic. By clicking "Accept All", you consent to our use of cookies.',
  'analyze our traffic. By clicking "Accept All", you consent to our use of cookies. <a href="?page=cookie-policy" className="underline hover:text-white">Learn more</a>'
);

fs.writeFileSync('src/components/CookieBanner.tsx', code);
