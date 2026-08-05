const { GoogleGenAI } = require("@google/genai");

let ai = null;

// Gemini 클라이언트 생성
function getGeminiClient() {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error(
            "GEMINI_API_KEY가 .env 파일에 설정되지 않았습니다."
        );
    }

    if (!ai) {
        ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });
    }

    return ai;
}

// AI 질문
async function askAI(question) {
    const client = getGeminiClient();

    const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
당신은 대학교 학생들을 위한 학교생활 안내 챗봇입니다.

규칙
1. 학교생활 관련 질문에만 답변한다.
2. 확인되지 않은 일정은 추측하지 않는다.
3. 모르면 학교 홈페이지 확인을 안내한다.
4. 답변은 핵심만 간결하게 작성한다.

질문:
${question}
`
    });

    return response.text;
}

module.exports = {
    askAI
};