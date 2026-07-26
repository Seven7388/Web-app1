const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const additionalRoute = `
  if (activePage === "cookie-policy") {
    return (
      <CookiePolicyView
        onBack={handleClosePage}
      />
    );
  }
`;

code = code.replace('if (activePage === "terms-of-service") {', additionalRoute + '\n  if (activePage === "terms-of-service") {');

const footerLinks = `<button onClick={() => handleOpenPage("privacy-policy")} className="hover:underline">Privacy Policy</button>
                <span>&middot;</span>
                <button onClick={() => handleOpenPage("cookie-policy")} className="hover:underline">Cookie Policy</button>
                <span>&middot;</span>
                <button onClick={() => handleOpenPage("terms-of-service")} className="hover:underline">Terms of Service</button>`;

code = code.replace(/<button onClick=\{\(\) => handleOpenPage\("privacy-policy"\)\} className="hover:underline">Privacy Policy<\/button>\s*<span>&middot;<\/span>\s*<button onClick=\{\(\) => handleOpenPage\("terms-of-service"\)\} className="hover:underline">Terms of Service<\/button>/g, footerLinks);

fs.writeFileSync('src/App.tsx', code);
