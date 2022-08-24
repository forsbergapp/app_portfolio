const { getTimezoneOffset, getGregorian} = require ("./regional.service");
module.exports = {
	getTimezoneOffset: (req, res) => {
        return res.json(
            getTimezoneOffset(req.query.timezone)
        )
    
    },
	getGregorian: (req, res) => {
        return res.json(
            getGregorian(JSON.parse(req.query.hijridate), req.query.adjustment)
        )
	}
};