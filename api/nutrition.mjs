export default async function handler(req, res) {
    const { food } = req.query;
    const API_KEY = process.env.GEMINI_KEY;

    if (!API_KEY) {
        return res.status(200).json({ 
            candidates: [{ content: { parts: [{ text: '{"name":"錯誤","kcal":0,"protein":0,"carbs":0,"reasoning":"Key未設定"}' }] } }] 
        });
    }

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${GEMINI_API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `你是一位營養師。分析「${food}」。請僅回傳 JSON：{"name":"名稱","kcal":數字,"protein":數字,"carbs":數字,"reasoning":"邏輯"}`
                    }]
                }]
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || "Google API 連線失敗");
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        // 即使出錯也回傳 200 JSON，防止前端解析失敗
        res.status(200).json({ 
            candidates: [{ content: { parts: [{ text: `{"name":"分析失敗","kcal":0,"protein":0,"carbs":0,"reasoning":"${error.message}"}` }] } }] 
        });
    }
}
