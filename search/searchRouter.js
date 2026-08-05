const express = require("express");

const { getNotices } = require("../notice/noticeCrawler");
const buildings = require("../map/data/buildings");
const { ACADEMIC_CALENDAR_EVENTS } = require("../academic-calendar/academicCalendarData");
const { SCHOOL_LIFE_ITEMS } = require("./schoolLifeData");

const router = express.Router();

const allowedTypes = ["all", "notice", "schoolLife", "campus", "schedule"];

// 검색 대상으로 크롤링할 공지사항 카테고리
const NOTICE_SEARCH_TARGETS = [
    { category: "general", subCategory: "all" },
    { category: "academic" },
    { category: "scholarship" },
    { category: "safety" },
];

async function collectNoticeResults() {
    const settled = await Promise.allSettled(
        NOTICE_SEARCH_TARGETS.map((target) => getNotices({ ...target, limit: 20 }))
    );

    const results = [];

    settled.forEach((outcome) => {
        if (outcome.status !== "fulfilled") return;

        outcome.value.notices.forEach((notice) => {
            results.push({
                id: `notice-${notice.category}-${notice.subCategory || "all"}-${notice.id}`,
                type: "notice",
                category: notice.subCategoryName || notice.categoryName,
                title: notice.title,
                content: `${notice.writer || ""} · ${notice.date || ""}`.trim(),
                url: notice.url,
            });
        });
    });

    return results;
}

function collectCampusResults() {
    return buildings.map((building) => ({
        id: `campus-${building.id}`,
        type: "campus",
        category: "캠퍼스",
        title: building.name,
        content: building.description || "",
        url: `/campus-map?building=${encodeURIComponent(building.name)}`,
    }));
}

function collectScheduleResults() {
    return ACADEMIC_CALENDAR_EVENTS.map((event, index) => ({
        id: `schedule-${index}`,
        type: "schedule",
        category: "학사일정",
        title: event.label,
        content: `${event.start} ~ ${event.end}`,
        url: "/academic-calendar",
    }));
}

function collectSchoolLifeResults() {
    return SCHOOL_LIFE_ITEMS.map((item, index) => ({
        id: `schoolLife-${index}`,
        type: "schoolLife",
        category: "학교생활",
        title: item.title,
        content: item.content,
        url: item.url,
    }));
}

router.get("/", async (req, res) => {
    const keyword = String(req.query.keyword || "").trim().toLowerCase();

    const requestedType = String(req.query.type || "all").trim();
    const type = allowedTypes.includes(requestedType) ? requestedType : "all";

    if (!keyword) {
        return res.status(400).json({
            success: false,
            message: "검색어를 입력해주세요.",
        });
    }

    try {
        const [noticeResults, campusResults, scheduleResults] = await Promise.all([
            collectNoticeResults(),
            collectCampusResults(),
            collectScheduleResults(),
        ]);

        const schoolLifeResults = collectSchoolLifeResults();

        const searchData = [...noticeResults, ...campusResults, ...scheduleResults, ...schoolLifeResults];

        const keywordResults = searchData.filter((item) => {
            const searchableText = [item.title, item.content, item.category]
                .map((value) => String(value || "").toLowerCase())
                .join(" ");

            return searchableText.includes(keyword);
        });

        const filterCounts = {
            all: keywordResults.length,
            notice: 0,
            schoolLife: 0,
            campus: 0,
            schedule: 0,
        };

        keywordResults.forEach((item) => {
            if (filterCounts[item.type] !== undefined) {
                filterCounts[item.type]++;
            }
        });

        const filteredResults =
            type === "all" ? keywordResults : keywordResults.filter((item) => item.type === type);

        return res.json({
            success: true,
            keyword: req.query.keyword.trim(),
            selectedType: type,
            totalCount: filteredResults.length,
            filterCounts,
            results: filteredResults,
        });
    } catch (error) {
        console.error("검색 처리 오류:", error);

        return res.status(500).json({
            success: false,
            message: "검색 중 오류가 발생했습니다.",
        });
    }
});

module.exports = router;
