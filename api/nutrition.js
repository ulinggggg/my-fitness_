export default async function handler(req, res) {
    const { food } = req.query;
    const API_KEY = process.env.GEMINI_KEY;

    if (!API_KEY) {
        return res.status(500).json({ error: "轉運站 Key 沒設好，請檢查 Vercel 環境變數。" });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${GEMINI_API_KEY}`;

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

        // 檢查 Google 是否有報錯（例如 Key 打錯）
        if (data.error) {
            return res.status(200).json({ 
                candidates: [{ content: { parts: [{ text: `{"name":"Google 報錯","kcal":0,"protein":0,"carbs":0,"reasoning":"${data.error.message}"}` }] } }] 
            });
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "轉運站連線異常", message: error.message });
    }
}
