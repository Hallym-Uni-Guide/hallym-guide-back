const express = require("express");

const {
    sendChatMessage,
    getChatLogs
} = require("../controllers/chatController");

const router = express.Router();

// 챗봇에게 질문
router.post("/", sendChatMessage);

// 질문 및 답변 기록 조회
router.get("/logs", getChatLogs);

module.exports = router;
