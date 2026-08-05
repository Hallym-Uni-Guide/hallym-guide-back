const express = require("express");
const router = express.Router();

const {
    getNotices,
    getNoticeCategories,
} = require("../noticeCrawler");

/**
 * 공지사항 카테고리 목록 조회
 *
 * GET /api/notices/categories
 */
router.get("/categories", (req, res) => {
    const categories = getNoticeCategories();

    res.status(200).json({
        success: true,
        categories,
    });
});

/**
 * 공지사항 조회
 *
 * GET /api/notices
 * GET /api/notices?category=safety
 * GET /api/notices?category=general&subCategory=event
 * GET /api/notices?category=general&subCategory=employment&limit=5
 */
router.get("/", async (req, res) => {
    try {
        const category =
            typeof req.query.category === "string"
                ? req.query.category
                : "general";

        const subCategory =
            typeof req.query.subCategory === "string"
                ? req.query.subCategory
                : "all";

        const requestedLimit = Number(req.query.limit);

        const limit =
            Number.isInteger(requestedLimit) &&
            requestedLimit > 0 &&
            requestedLimit <= 30
                ? requestedLimit
                : 10;

        const result = await getNotices({
            category,
            subCategory,
            limit,
        });

        res.status(200).json({
            success: true,
            category: result.category,
            categoryName: result.categoryName,
            subCategory: result.subCategory,
            subCategoryName: result.subCategoryName,
            count: result.notices.length,
            notices: result.notices,
            crawledAt: new Date().toISOString(),
        });
    } catch (error) {
        const isInvalidCategory =
            error.message.includes("존재하지 않는");

        res.status(isInvalidCategory ? 400 : 500).json({
            success: false,
            count: 0,
            notices: [],
            message: error.message,
        });
    }
});

module.exports = router;