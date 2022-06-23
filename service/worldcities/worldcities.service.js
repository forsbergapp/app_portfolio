module.exports = {
    getService: (callBack) => {
        const fs = require('fs');
        fs.readFile(__dirname + '/worldcities.json', 'utf8', (error, fileBuffer) => {
            if (error)
                callBack(error,null);
            else
                callBack(null,fileBuffer.toString());
        });
    }
}