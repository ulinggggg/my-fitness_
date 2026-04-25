export default async function handler(req, res) {
    const { food } = req.query;
    const API_KEY = process.env.GEMINI_KEY;

    // 💡 診斷區：如果這行報錯，代表 Vercel 的 Key 沒抓到
    if (!API_KEY) {
        return res.status(500).json({ error: "Vercel 環境變數沒抓到，請檢查 Key 名稱並 Redeploy。" });
    }

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `分析「${food}」並回傳 JSON: {"name":"名稱","kcal":100,"protein":10,"carbs":10}` }] }]
            })
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (e) {
        res.status(500).json({ error: "連線失敗", message: e.message });
    }
}
