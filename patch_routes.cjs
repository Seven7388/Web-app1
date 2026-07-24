const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const additionalRoutes = `
// Rapid API Endpoints
const rapidApiKey = "30dd6f5bbcmshc17011ac86de619p1a2ea8jsn2452ea58d58d";

app.post("/api/rapid/newsnow", async (req, res) => {
    try {
        const response = await fetch("https://newsnow.p.rapidapi.com/newsv2_top_news", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-rapidapi-host": "newsnow.p.rapidapi.com",
                "x-rapidapi-key": rapidApiKey
            },
            body: JSON.stringify({
                location: req.body.location || "us",
                language: req.body.language || "en",
                page: req.body.page || 1,
                time_bounded: req.body.time_bounded || false,
                from_date: req.body.from_date || "01/02/2021",
                to_date: req.body.to_date || "05/06/2021"
            })
        });
        const data = await response.json();
        res.json(data);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "NewsNow API error" });
    }
});

app.get("/api/rapid/politics", async (req, res) => {
    try {
        const response = await fetch("https://real-world-news-api1.p.rapidapi.com/politics/2024", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-rapidapi-host": "real-world-news-api1.p.rapidapi.com",
                "x-rapidapi-key": rapidApiKey
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Real World News API error" });
    }
});

app.get("/api/rapid/football", async (req, res) => {
    try {
        const response = await fetch(\`https://football-news11.p.rapidapi.com/api/news-by-league?league_id=\${req.query.league_id || 52}&lang=\${req.query.lang || 'en'}&page=\${req.query.page || 1}\`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-rapidapi-host": "football-news11.p.rapidapi.com",
                "x-rapidapi-key": rapidApiKey
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Football News API error" });
    }
});

app.get("/api/health"`;

code = code.replace('app.get("/api/health"', additionalRoutes);
fs.writeFileSync('server.ts', code);
