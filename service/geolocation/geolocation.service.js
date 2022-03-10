const axios = require('axios');
module.exports = {
    getService: async (url) => {
        let res = await axios({
            url: url,
            method: 'GET'
        })
        return res.data;
    }
}