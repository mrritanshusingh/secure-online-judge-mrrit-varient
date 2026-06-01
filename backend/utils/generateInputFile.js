const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const dirInputs = path.join(__dirname, '../inputs');
if (!fs.existsSync(dirInputs)) {
    fs.mkdirSync(dirInputs, { recursive: true });
}

const generateInputFile = async (input) => {
    const jobId = uuid();
    const filename = `${jobId}.txt`;
    const filePath = path.join(dirInputs, filename);
    
    await fs.promises.writeFile(filePath, input);
    return filePath;
};

module.exports = {
    generateInputFile
};