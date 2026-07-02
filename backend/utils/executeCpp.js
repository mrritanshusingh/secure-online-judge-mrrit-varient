const { exec } = require('child_process');
const path = require('path');

const executeCpp = (filePath, inputPath) => {
    return new Promise((resolve, reject) => {
        const codeDir = path.dirname(filePath);
        const inputDir = inputPath ? path.dirname(inputPath) : null;
        const codeFile = path.basename(filePath);
        const inputFile = inputPath ? path.basename(inputPath) : null;

        const command = inputPath 
            ? `docker run --rm --memory="512m" --network none -v "${codeDir}":/app/codes -v "${inputDir}":/app/inputs -w /app gcc:latest bash -c "g++ -O0 -w codes/${codeFile} -o /app/a.out && /app/a.out < inputs/${inputFile}"`
            : `docker run --rm --memory="512m" --network none -v "${codeDir}":/app/codes -w /app gcc:latest bash -c "g++ -O0 -w codes/${codeFile} -o /app/a.out && /app/a.out"`;

        exec(command, { timeout: 20000 }, (error, stdout, stderr) => {
            if (error) {
                if (error.killed) {
                    return reject("Time Limit Exceeded");
                }
                return reject(error.message || stderr);
            }
            if (stderr) {
                return reject(stderr);
            }
            resolve(stdout);
        });
    });
};

module.exports = { executeCpp };