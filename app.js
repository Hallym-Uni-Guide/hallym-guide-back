/*
터미널 입력
npm init -y
npm install express cors express-session
*/

const express = require("express");
const cors = require("cors");
const session = require("express-session");

const authRouter = require("./routes/auth");

const app = express();
const PORT = 3000;

// JSON 요청 데이터 처리
app.use(express.json());

// 프론트엔드 서버 주소
app.use(
    cors({
        origin: "http://localhost:5500",
        credentials: true
    })
);

// 세션 설정
app.use(
    session({
        secret: "campus-service-secret-key",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60
        }
    })
);

// 서버 테스트
app.get("/", (req, res) => {
    res.send("백엔드 서버 실행 중");
});

// 인증 관련 API
app.use("/api/auth", authRouter);

// 존재하지 않는 경로
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "존재하지 않는 API입니다."
    });
});

app.listen(PORT, () => {
    console.log(`서버 실행: http://localhost:${PORT}`);
});