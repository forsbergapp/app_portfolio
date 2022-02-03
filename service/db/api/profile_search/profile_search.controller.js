const { insertProfileSearch} = require ("./profile_search.service");

module.exports = {

    insertProfileSearch: (data, res) => {
        insertProfileSearch(data, (err,results) => {
            if (err) {
                console.log(err);
                return (err,null);
            }
            return (null,results);
        });
    }
}