const express = require("express");

const router = express.Router();

/*
    로그인한 사용자 아이디별로 시간표를 분리해서 저장
    서버를 종료하면 초기화됨
*/
let classesByUser = {};

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
    내 수업 전체 조회

    GET /api/timetable
*/
router.get("/", (req, res) => {
    const classes = classesByUser[req.session.user.id] || [];

    res.json({
        success: true,
        classes,
    });
});

/*
    수업 추가

    POST /api/timetable
*/
router.post("/", (req, res) => {
    const { subject, professor = "", schedules } = req.body;

    if (!subject) {
        return res.status(400).json({
            success: false,
            message: "과목명은 필수입니다.",
        });
    }

    if (!Array.isArray(schedules) || schedules.length === 0) {
        return res.status(400).json({
            success: false,
            message: "수업 시간 정보를 입력해주세요.",
        });
    }

    const allowedDays = ["월", "화", "수", "목", "금", "토", "일"];

    for (const schedule of schedules) {
        const { day, startTime, endTime, location = "" } = schedule;

        if (!allowedDays.includes(day)) {
            return res.status(400).json({
                success: false,
                message: "올바른 요일을 선택해주세요.",
            });
        }

        if (!startTime || !endTime) {
            return res.status(400).json({
                success: false,
                message: "시작 시간과 종료 시간을 입력해주세요.",
            });
        }

        if (startTime >= endTime) {
            return res.status(400).json({
                success: false,
                message: "종료 시간은 시작 시간보다 늦어야 합니다.",
            });
        }
    }

    const newClass = {
        id: nextId++,
        subject: subject.trim(),
        professor: professor.trim(),
        schedules: schedules.map((schedule) => ({
            day: schedule.day,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            location: schedule.location?.trim() || "",
        })),
    };

    const userId = req.session.user.id;

    if (!classesByUser[userId]) {
        classesByUser[userId] = [];
    }

    classesByUser[userId].push(newClass);

    res.status(201).json({
        success: true,
        message: "수업이 추가되었습니다.",
        class: newClass,
    });
});

/*
    수업 수정

    PUT /api/timetable/:id
*/
router.put("/:id", (req, res) => {
    const classId = Number(req.params.id);
    const { subject, professor = "", schedules } = req.body;

    const classes = classesByUser[req.session.user.id] || [];

    const targetClass = classes.find(
        (classItem) => classItem.id === classId
    );

    if (!targetClass) {
        return res.status(404).json({
            success: false,
            message: "해당 수업을 찾을 수 없습니다.",
        });
    }

    if (!subject) {
        return res.status(400).json({
            success: false,
            message: "과목명은 필수입니다.",
        });
    }

    if (!Array.isArray(schedules) || schedules.length === 0) {
        return res.status(400).json({
            success: false,
            message: "수업 시간 정보를 입력해주세요.",
        });
    }

    for (const schedule of schedules) {
        if (!schedule.day || !schedule.startTime || !schedule.endTime) {
            return res.status(400).json({
                success: false,
                message: "요일과 시간을 모두 입력해주세요.",
            });
        }

        if (schedule.startTime >= schedule.endTime) {
            return res.status(400).json({
                success: false,
                message: "종료 시간은 시작 시간보다 늦어야 합니다.",
            });
        }
    }

    targetClass.subject = subject.trim();
    targetClass.professor = professor.trim();
    targetClass.schedules = schedules.map((schedule) => ({
        day: schedule.day,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        location: schedule.location?.trim() || "",
    }));

    res.json({
        success: true,
        message: "수업이 수정되었습니다.",
        class: targetClass,
    });
});

/*
    수업 삭제

    DELETE /api/timetable/:id
*/
router.delete("/:id", (req, res) => {
    const classId = Number(req.params.id);

    const classes = classesByUser[req.session.user.id] || [];

    const classIndex = classes.findIndex(
        (classItem) => classItem.id === classId
    );

    if (classIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "해당 수업을 찾을 수 없습니다.",
        });
    }

    const deletedClass = classes.splice(classIndex, 1)[0];

    res.json({
        success: true,
        message: "수업이 삭제되었습니다.",
        class: deletedClass,
    });
});

module.exports = router;
