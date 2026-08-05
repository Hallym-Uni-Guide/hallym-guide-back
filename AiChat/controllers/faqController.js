const {
    getPopularFAQs,
    getFAQById,
    increaseFAQCount,
    createFAQ
} = require("../services/faqService");

/**
 * GET /api/faqs
 */
function getFAQs(req, res) {
    try {
        const category = req.query.category || null;

        const requestedLimit = Number(
            req.query.limit || 10
        );

        const limit =
            Number.isInteger(requestedLimit) &&
            requestedLimit > 0
                ? requestedLimit
                : 10;

        const faqs = getPopularFAQs(
            limit,
            category
        );

        res.json({
            success: true,
            count: faqs.length,
            faqs
        });
    } catch (error) {
        console.error("FAQ 목록 조회 오류:", error);

        res.status(500).json({
            success: false,
            message:
                "FAQ 목록을 불러오지 못했습니다."
        });
    }
}

/**
 * GET /api/faqs/:id
 */
function getFAQDetail(req, res) {
    try {
        const faq = getFAQById(req.params.id);

        if (!faq) {
            return res.status(404).json({
                success: false,
                message: "FAQ를 찾을 수 없습니다."
            });
        }

        res.json({
            success: true,
            faq
        });
    } catch (error) {
        console.error("FAQ 상세 조회 오류:", error);

        res.status(500).json({
            success: false,
            message:
                "FAQ 정보를 불러오지 못했습니다."
        });
    }
}

/**
 * POST /api/faqs/:id/click
 */
function clickFAQ(req, res) {
    try {
        const faq = increaseFAQCount(
            req.params.id
        );

        if (!faq) {
            return res.status(404).json({
                success: false,
                message: "FAQ를 찾을 수 없습니다."
            });
        }

        res.json({
            success: true,
            message: "FAQ 조회 수가 증가했습니다.",
            faq
        });
    } catch (error) {
        console.error("FAQ 클릭 처리 오류:", error);

        res.status(500).json({
            success: false,
            message:
                "FAQ 클릭 정보를 저장하지 못했습니다."
        });
    }
}

/**
 * POST /api/faqs
 */
function addFAQ(req, res) {
    try {
        const {
            category,
            question,
            answer,
            keywords
        } = req.body;

        if (
            !category ||
            !question ||
            !answer
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "category, question, answer는 필수입니다."
            });
        }

        if (
            keywords !== undefined &&
            !Array.isArray(keywords)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "keywords는 배열 형태여야 합니다."
            });
        }

        const newFAQ = createFAQ({
            category: category.trim(),
            question: question.trim(),
            answer: answer.trim(),
            keywords: keywords || []
        });

        res.status(201).json({
            success: true,
            message: "FAQ가 등록되었습니다.",
            faq: newFAQ
        });
    } catch (error) {
        console.error("FAQ 등록 오류:", error);

        res.status(500).json({
            success: false,
            message: "FAQ를 등록하지 못했습니다."
        });
    }
}

module.exports = {
    getFAQs,
    getFAQDetail,
    clickFAQ,
    addFAQ
};