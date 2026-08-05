const express = require("express");
const cors = require("cors");
const session = require("express-session");
const dotenv = require("dotenv");

dotenv.config();

const authRouter = require("./login/routes/auth");
const scheduleRouter = require("./calender/calender_routes/scheduleRouter");
const timetableRouter = require("./calender/calender_routes/timetableRouter");
const noticeRouter = require("./notice/routes/noticeRouter");
const academicCalendarRouter = require("./academic-calendar/routes/academicCalendarRouter");
const mapRouter = require("./map/routes/mapRouter");
const majorRouter = require("./major/routes/majorRouter");
const searchRouter = require("./search/searchRouter");
const chatRouter = require("./AiChat/routes/chatrouter");
const faqRouter = require("./AiChat/routes/faqrouter");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://127.0.0.1:5500",
            "http://localhost:5500",
            "http://127.0.0.1:5501",
            "http://localhost:5501",
        ],
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: "campus-service-secret-key",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60,
        },
    })
);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "한림 가이드 통합 백엔드 서버 실행 중",
    });
});

app.use("/api/auth", authRouter);
app.use("/api/schedules", scheduleRouter);
app.use("/api/timetable", timetableRouter);
app.use("/api/notices", noticeRouter);
app.use("/api/academic-calendar", academicCalendarRouter);
app.use("/api/map", mapRouter);
app.use("/api/majors", majorRouter);
app.use("/api/search", searchRouter);
app.use("/api/chat", chatRouter);
app.use("/api/faqs", faqRouter);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "존재하지 않는 API 주소입니다.",
    });
});

app.use((error, req, res, next) => {
    console.error("서버 오류:", error);

    res.status(500).json({
        success: false,
        message: "서버 내부 오류가 발생했습니다.",
    });
});

app.listen(PORT, () => {
    console.log(`통합 서버 실행: http://localhost:${PORT}`);
});
