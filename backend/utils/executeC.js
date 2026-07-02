const { exec } = require("child_process");
const path = require("path");

const executeC = (filePath, inputPath) => {
    return new Promise((resolve, reject) => {
        const codeDir = path.dirname(filePath);
        const inputDir = path.dirname(inputPath);
        const codeFile = path.basename(filePath);
        const inputFile = path.basename(inputPath);

        const command = `docker run --rm --memory="512m" --pids-limit=50 --ulimit cpu=10 --network none -v "${codeDir}":/app/codes -v "${inputDir}":/app/inputs -w /app gcc:latest sh -c "gcc codes/${codeFile} -o /app/a.out && /app/a.out < inputs/${inputFile}"`;

        exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
            if (error) {
                const errMsg = error.message || "";
                
                if (error.killed) return reject("Time Limit Exceeded");
                if (errMsg.includes("12 Killed") || errMsg.includes("CPU time")) return reject("Time Limit Exceeded");
                if (errMsg.includes("11 Killed") || errMsg.includes("137")) return reject("Memory Limit Exceeded");
                if (errMsg.includes("maxBuffer")) return reject("Memory Limit Exceeded");
                
                return reject(stderr ? stderr : "Runtime Error");
            }
            if (stderr) return reject(stderr);
            resolve(stdout);
        });
    });
};
module.exports = { executeC };