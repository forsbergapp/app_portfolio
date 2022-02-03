const fetch = require('node-fetch');
module.exports = {
    getService: async (url) => {
        var res = await fetch(url,{method: 'GET'});
        const geodata = await res.json();
        return geodata;
    }
}