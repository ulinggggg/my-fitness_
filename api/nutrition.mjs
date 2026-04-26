export 默认 async function handler(req, res) {
    const { food } = req.query;
    // 💡 這裡對齊妳在 Vercel 設定的名稱：GEMINI_KEY
    const API_KEY = process.env.GEMINI_KEY; 

    if (!API_KEY) {
        return res.status(200).json({ 
            candidates: [{ content: { parts: [{ text: '{"name":"Key未設定","kcal":0,"protein":0,"carbs":0,"reasoning":"請檢查Vercel變數名稱是否為GEMINI_KEY"}' }] } }] 
        });
    }

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${GEMINI_API_KEY}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `你是一位營養師。分析「${food}」。請僅回傳 JSON：{"name":"名稱","kcal":數字,"protein":數字,"carbs":數字,"reasoning":"邏輯"}` }] }]
            })
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(200).json({ 
            candidates: [{ content: { parts: [{ text: `{"name":"連線失敗","kcal":0,"protein":0,"carbs":0,"reasoning":"${error.message}"}` }] } }] 
        });
    }
}
