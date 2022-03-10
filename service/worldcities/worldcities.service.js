module.exports = {
    getService: () => {
        const fs = require('fs');
        var cities;
        cities = fs.readFileSync(__dirname + '/worldcities.json', 'utf8');
        return cities;
    }
}