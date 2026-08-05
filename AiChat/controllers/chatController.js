const path = require("path");

const {
    readJsonFile,
    writeJsonFile
} = require("../utils/fileManager");

const {
    findMatchingFAQ,
    increaseFAQCount
} = require("../services/faqService");

const {
    askAI
} = require("../services/aiService");

const CHAT_LOG_FILE_PATH = path.join(
    __dirname,
    "../data/chatLogs.json"
);

/**
 * 질문 및 답변 기록 저장
 */
function saveChatLog({
    question,
    answer,
    answerType,
    faqId = null
}) {
    const chatLogs = readJsonFile(CHAT_LOG_FILE_PATH);

    const newId =
        chatLogs.length > 0
            ? Math.max(...chatLogs.map(log => log.id)) + 1
            : 1;

    const newLog = {
        id: newId,
        question,
        answer,
        answerType,
        faqId,
        createdAt: new Date().toISOString()
    };

    chatLogs.push(newLog);

    const saved = writeJsonFile(
        CHAT_LOG_FILE_PATH,
        chatLogs
    );

    if (!saved) {
        throw new Error("질문 기록을 저장하지 못했습니다.");
    }

    return newLog;
}

/**
 * POST /api/chat
 */
async function sendChatMessage(req, res) {
    try {
        const { question } = req.body;

        if (
            typeof question !== "string" ||
            !question.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "질문 내용을 입력해주세요."
            });
        }

        const trimmedQuestion = question.trim();

        // 먼저 등록된 FAQ에서 일치하는 질문을 찾는다.
        const matchedFAQ = findMatchingFAQ(
            trimmedQuestion
        );

        if (matchedFAQ) {
            const updatedFAQ = increaseFAQCount(
                matchedFAQ.id
            );

            saveChatLog({
                question: trimmedQuestion,
                answer: updatedFAQ.answer,
                answerType: "FAQ",
                faqId: updatedFAQ.id
            });

            return res.json({
                success: true,
                answer: updatedFAQ.answer,
                answerType: "FAQ",
                matchedFAQ: {
                    id: updatedFAQ.id,
                    category: updatedFAQ.category,
                    question: updatedFAQ.question
                }
            });
        }

        // FAQ가 없으면 AI 모델에 질문
        const aiAnswer = await askAI(
            trimmedQuestion
        );

        saveChatLog({
            question: trimmedQuestion,
            answer: aiAnswer,
            answerType: "AI"
        });

        return res.json({
            success: true,
            answer: aiAnswer,
            answerType: "AI",
            matchedFAQ: null
        });
    } catch (error) {
        console.error("챗봇 처리 오류:", error);

        if (
            error.message.includes("GEMINI_API_KEY")
        ) {
            return res.status(500).json({
                success: false,
                message:
                    "Gemini API 키가 설정되지 않았습니다."
            });
        }

        return res.status(500).json({
            success: false,
            message:
                "챗봇 답변을 생성하는 중 오류가 발생했습니다."
        });
    }
}

/**
 * GET /api/chat/logs
 */
function getChatLogs(req, res) {
    try {
        const logs = readJsonFile(CHAT_LOG_FILE_PATH);

        const safeLogs = Array.isArray(logs) ? logs : [];

        const sortedLogs = [...safeLogs].sort(
            (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
        );

        return res.json({
            success: true,
            count: sortedLogs.length,
            logs: sortedLogs
        });
    } catch (error) {
        console.error("질문 기록 조회 오류:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    sendChatMessage,
    getChatLogs
};