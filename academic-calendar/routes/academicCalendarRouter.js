const express = require("express");

const { ACADEMIC_CALENDAR_EVENTS } = require("../academicCalendarData");

const router = express.Router();

/*
    월별 학사일정 조회

    GET /api/academic-calendar?year=2026&month=7
*/
router.get("/", (req, res) => {
    const year = Number(req.query.year);
    const month = Number(req.query.month);

    if (!year || !month || month < 1 || month > 12) {
        return res.status(400).json({
            success: false,
            message: "올바른 연도와 월을 입력해주세요.",
        });
    }

    const monthStart = `${year}-${String(month).padStart(2, "0")}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const monthEnd = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

    const events = ACADEMIC_CALENDAR_EVENTS.filter(
        (event) => event.start <= monthEnd && event.end >= monthStart
    );

    res.json({
        success: true,
        year,
        month,
        events,
    });
});

module.exports = router;
