const { exec } = require("child_process");
const path = require("path");

const executeJava = (filePath, inputPath) => {
    return new Promise((resolve, reject) => {
        const codeDir = path.dirname(filePath);
        const inputDir = path.dirname(inputPath);
        const codeFile = path.basename(filePath);
        const inputFile = path.basename(inputPath);

        const command = `docker run --rm --memory="512m" --pids-limit=50 --ulimit cpu=10 --network none -v "${codeDir}":/app/codes -v "${inputDir}":/app/inputs -w /app eclipse-temurin:11-jdk sh -c "cp codes/${codeFile} Main.java && javac Main.java && java Main < inputs/${inputFile}"`;

        exec(command, { timeout: 20000 }, (error, stdout, stderr) => {
            if (error) {
                const errMsg = error.message || "";
                
                if (error.killed) return reject("Time Limit Exceeded");
                if (errMsg.includes("12 Killed") || errMsg.includes("CPU time")) return reject("Time Limit Exceeded");
                if (errMsg.includes("11 Killed") || errMsg.includes("137")) return reject("Memory Limit Exceeded");
                if (errMsg.includes("maxBuffer")) return reject("Memory Limit Exceeded");
                
                console.error("\n❌ JAVA ERROR:");
                console.error(stderr || errMsg);
                console.error("--------------------------\n");
                return reject(stderr ? stderr : "Runtime Error");
            }
            if (stderr) {
                return reject(stderr);
            }
            resolve(stdout);
        });
    });
};
module.exports = { executeJava };