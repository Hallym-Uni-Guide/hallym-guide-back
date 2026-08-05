const express = require("express");

const {
    getFAQs,
    getFAQDetail,
    clickFAQ,
    addFAQ
} = require("../controllers/faqController");

const router = express.Router();

// 인기 FAQ 목록
router.get("/", getFAQs);

// FAQ 등록
router.post("/", addFAQ);

// FAQ 클릭 수 증가
router.post("/:id/click", clickFAQ);

// FAQ 상세 조회
router.get("/:id", getFAQDetail);

module.exports = router;