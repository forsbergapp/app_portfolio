const { getTimezoneOffset, getGregorian} = require ("./regional.service");
module.exports = {
	getTimezoneOffset: (req, res) => {
        try {
            return res.json(
                getTimezoneOffset(req.query.timezone)    
            )
        } catch (error) {
            return res.send(
                null
            )
        };
    },
	getGregorian: (req, res) => {
        try {
            return res.json(
                getGregorian(JSON.parse(req.query.hijridate), req.query.adjustment)    
            )
        } catch (error) {
            return res.send(
                null
            )
        }
	}
};