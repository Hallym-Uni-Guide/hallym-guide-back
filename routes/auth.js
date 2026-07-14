const express = require("express");
const users = require("../data/users");

const router = express.Router();

/*
    현재 로그인 상태 확인

    GET /api/auth/me
*/
router.get("/me", (req, res) => {
    // 세션에 로그인 사용자 정보가 없는 경우
    if (!req.session.user) {
        return res.status(200).json({
            success: true,
            loggedIn: false,
            user: null
        });
    }

    // 로그인되어 있는 경우
    return res.status(200).json({
        success: true,
        loggedIn: true,
        user: req.session.user
    });
});

/*
    로그인

    POST /api/auth/login

    Request Body
    {
        "id": "user1",
        "password": "1234"
    }
*/
router.post("/login", (req, res) => {
    const { id, password } = req.body;

    if (!id || !password) {
        return res.status(400).json({
            success: false,
            message: "아이디와 비밀번호를 입력해주세요."
        });
    }

    const foundUser = users.find(
        (user) => user.id === id && user.password === password
    );

    if (!foundUser) {
        return res.status(401).json({
            success: false,
            message: "아이디 또는 비밀번호가 일치하지 않습니다."
        });
    }

    // 비밀번호는 세션에 저장하거나 프론트엔드로 보내면 안 됨
    const loginUser = {
        id: foundUser.id,
        name: foundUser.name,
        major: foundUser.major,
        interest: foundUser.interest,
        intro: foundUser.intro
    };

    req.session.user = loginUser;

    return res.status(200).json({
        success: true,
        message: "로그인 성공",
        user: loginUser
    });
});

/*
    로그아웃

    POST /api/auth/logout
*/
router.post("/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({
                success: false,
                message: "로그아웃 처리 중 오류가 발생했습니다."
            });
        }

        res.clearCookie("connect.sid");

        return res.status(200).json({
            success: true,
            message: "로그아웃 성공"
        });
    });
});

module.exports = router;