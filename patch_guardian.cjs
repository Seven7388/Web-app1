const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldBlockStart = code.indexOf('// Simple in-memory cache to avoid Gemini API rate limits');
const oldBlockEnd = code.indexOf('// Background Journalist Article Expansion Route');

if (oldBlockStart !== -1 && oldBlockEnd !== -1) {
  const newBlock = `
function mapGuardianCategory(sectionId: string): string {
  const sec = (sectionId || "").toLowerCase();
  if (sec.includes("tech") || sec.includes("technology")) return "Tech";
  if (sec.includes("football")) return "Football";
  if (sec.includes("sport")) return "Sport";
  if (sec.includes("business")) return "Business";
  if (sec.includes("money")) return "Money";
  if (sec.includes("culture") || sec.includes("film") || sec.includes("music") || sec.includes("books")) return "Culture";
  if (sec.includes("lifestyle") || sec.includes("fashion") || sec.includes("food")) return "Lifestyle";
  if (sec.includes("environment") || sec.includes("climate")) return "Environment";
  if (sec.includes("science")) return "Science";
  if (sec.includes("politics")) return "Politics";
  if (sec.includes("world")) return "World news";
  if (sec.includes("travel")) return "Travel";
  return "News";
}

app.get("/api/news", async (req, res) => {
  const categoryParam = ((req.query.category as string) || "all").toLowerCase();

  let sectionQuery = "";
  if (categoryParam === "tech" || categoryParam === "technology") sectionQuery = "&section=technology";
  else if (categoryParam === "football") sectionQuery = "&section=football";
  else if (categoryParam === "sport") sectionQuery = "&section=sport";
  else if (categoryParam === "business") sectionQuery = "&section=business";
  else if (categoryParam === "money") sectionQuery = "&section=money";
  else if (categoryParam === "culture") sectionQuery = "&section=culture";
  else if (categoryParam === "lifestyle") sectionQuery = "&section=lifestyle";
  else if (categoryParam === "environment" || categoryParam === "climate crisis") sectionQuery = "&section=environment";
  else if (categoryParam === "science") sectionQuery = "&section=science";
  else if (categoryParam === "politics" || categoryParam === "us politics" || categoryParam === "uk politics") sectionQuery = "&section=politics";
  else if (categoryParam === "world news" || categoryParam === "world") sectionQuery = "&section=world";
  else if (categoryParam === "travel") sectionQuery = "&section=travel";

  try {
    const apiKey = process.env.GUARDIAN_API_KEY || "test";
    const response = await fetch(
      \`https://content.guardianapis.com/search?show-fields=thumbnail,trailText,body&page-size=30\${sectionQuery}&api-key=\${apiKey}\`
    );

    if (!response.ok) {
      throw new Error(\`Guardian API error: \${response.statusText}\`);
    }

    const data = await response.json();
    const results = data.response?.results || [];

    const articles = results.map((item: any) => ({
      id: item.id,
      title: item.webTitle,
      description: item.fields?.trailText?.replace(/<[^>]*>?/gm, '') || item.webTitle,
      content: item.fields?.body?.replace(/<[^>]*>?/gm, '') || item.fields?.trailText || item.webTitle,
      url: item.webUrl,
      imageUrl: item.fields?.thumbnail || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80",
      category: mapGuardianCategory(item.sectionId),
      source: "The Guardian",
      time: new Date(item.webPublicationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

    res.json({ articles });
  } catch (error) {
    console.error("Error fetching Guardian news:", error);
    res.status(500).json({ error: "Failed to fetch news stories" });
  }
});

`;
  
  code = code.substring(0, oldBlockStart) + newBlock + code.substring(oldBlockEnd);
  fs.writeFileSync('server.ts', code);
}
