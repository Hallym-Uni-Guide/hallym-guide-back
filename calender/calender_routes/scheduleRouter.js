const express = require("express");

const router = express.Router();

/*
    로그인한 사용자 아이디별로 개인 일정을 분리해서 저장
    서버를 종료하면 초기화됨
*/
let schedulesByUser = {};

let nextId = 1;

function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "로그인이 필요합니다.",
        });
    }

    next();
}

router.use(requireLogin);

/*
    월별 일정 조회

    GET /api/schedules?year=2026&month=7
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

    const monthText = String(month).padStart(2, "0");
    const targetMonth = `${year}-${monthText}`;

    const schedules = schedulesByUser[req.session.user.id] || [];

    const filteredSchedules = schedules.filter((schedule) =>
        schedule.date.startsWith(targetMonth)
    );

    filteredSchedules.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );

    res.json({
        success: true,
        year,
        month,
        schedules: filteredSchedules,
    });
});

/*
    일정 추가

    POST /api/schedules

    body:
    {
        "title": "팀 회의",
        "date": "2026-07-20",
        "description": "프로젝트 회의"
    }
*/
router.post("/", (req, res) => {
    const { title, date, description = "" } = req.body;

    if (!title || !date) {
        return res.status(400).json({
            success: false,
            message: "일정 제목과 날짜는 필수입니다.",
        });
    }

    // YYYY-MM-DD 형식 검사
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!datePattern.test(date)) {
        return res.status(400).json({
            success: false,
            message: "날짜는 YYYY-MM-DD 형식으로 입력해주세요.",
        });
    }

    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
        return res.status(400).json({
            success: false,
            message: "올바르지 않은 날짜입니다.",
        });
    }

    const newSchedule = {
        id: nextId++,
        title: title.trim(),
        date,
        description: description.trim(),
    };

    const userId = req.session.user.id;

    if (!schedulesByUser[userId]) {
        schedulesByUser[userId] = [];
    }

    schedulesByUser[userId].push(newSchedule);

    res.status(201).json({
        success: true,
        message: "일정이 추가되었습니다.",
        schedule: newSchedule,
    });
});

/*
    일정 삭제

    DELETE /api/schedules/:id
*/
router.delete("/:id", (req, res) => {
    const scheduleId = Number(req.params.id);

    const schedules = schedulesByUser[req.session.user.id] || [];

    const scheduleIndex = schedules.findIndex(
        (schedule) => schedule.id === scheduleId
    );

    if (scheduleIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "해당 일정을 찾을 수 없습니다.",
        });
    }

    const deletedSchedule = schedules.splice(scheduleIndex, 1)[0];

    res.json({
        success: true,
        message: "일정이 삭제되었습니다.",
        schedule: deletedSchedule,
    });
});

module.exports = router;
