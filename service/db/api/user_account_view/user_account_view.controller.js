const { insertUserAccountView} = require ("./user_account_view.service");

module.exports = {

    insertUserAccountView: (data, res) => {
        insertUserAccountView(data, (err,results) => {
            if (err) {
                console.log(err);
                return (err,null);
            }
            return (null,results);
        });
    }
}