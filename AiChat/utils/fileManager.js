//json파일 읽고 저장

const fs = require("fs");
const path = require("path");

/**
 * JSON 파일을 읽는 함수
 * @param {string} filePath
 * @returns {Array|Object}
 */
function readJsonFile(filePath) {
    try {
        const absolutePath = path.resolve(filePath);

        if (!fs.existsSync(absolutePath)) {
            return [];
        }

        const fileContent = fs.readFileSync(absolutePath, "utf-8");

        if (!fileContent.trim()) {
            return [];
        }

        return JSON.parse(fileContent);
    } catch (error) {
        console.error("JSON 파일 읽기 오류:", error);
        return [];
    }
}

/**
 * JSON 파일에 데이터를 저장하는 함수
 * @param {string} filePath
 * @param {Array|Object} data
 */
function writeJsonFile(filePath, data) {
    try {
        const absolutePath = path.resolve(filePath);
        const directoryPath = path.dirname(absolutePath);

        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, {
                recursive: true
            });
        }

        fs.writeFileSync(
            absolutePath,
            JSON.stringify(data, null, 2),
            "utf-8"
        );

        return true;
    } catch (error) {
        console.error("JSON 파일 저장 오류:", error);
        return false;
    }
}

module.exports = {
    readJsonFile,
    writeJsonFile
};