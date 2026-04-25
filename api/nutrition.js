export default async function handler(req, res) {
    const { food } = req.query;
    const API_KEY = process.env.GEMINI_KEY;

    // 💡 診斷 1: 檢查 Key 是否存在
    if (!API_KEY) {
        return res.status(500).json({ error: "轉運站保險箱是空的！請在 Vercel 設定 GEMINI_KEY 環境變數並 Redeploy。" });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `你是一位運動營養師。分析：「${food}」。請僅回傳 JSON 格式：{"name":"名稱","kcal":數字,"protein":數字,"carbs":數字,"confidence":0.9,"reasoning":"邏輯"}`
                    }]
                }]
            })
        });

        const data = await response.json();

        // 💡 診斷 2: 檢查 Google 是否報錯
        if (data.error) {
            return res.status(500).json({ error: "Google API 報錯", details: data.error.message });
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "轉運站電路短路", message: error.message });
    }
}
