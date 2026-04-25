export default async function handler(req, res) {
    // 1. 取得前端傳來的食物名稱
    const { food } = req.query;
    
    // 2. 從 Vercel 後台讀取隱藏的 Key
    const API_KEY = process.env.GEMINI_KEY; 

    // 3. 設定穩定版 Gemini 模型網址 (建議用 1.5-flash)
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
        
        // 4. 將 Google 的回傳結果轉發給前端
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "AI 轉接失敗", message: error.message });
    }
}
