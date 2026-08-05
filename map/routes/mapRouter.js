const express = require("express");

const buildings = require("../data/buildings");

const router = express.Router();

/*
    건물 목록(층/시설 정보 포함) 조회

    GET /api/map/buildings
*/
router.get("/buildings", (req, res) => {
    res.json({
        success: true,
        count: buildings.length,
        buildings,
    });
});

module.exports = router;
