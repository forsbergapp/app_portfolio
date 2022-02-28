const { insertProfileSearch} = require ("./profile_search.service");

module.exports = {

    insertProfileSearch: (app_id, data, res) => {
        insertProfileSearch(app_id, data, (err,results) => {
            if (err) {
                return (err,null);
            }
            return (null,results);
        });
    }
}