const { insertUserAccountView} = require ("./user_account_view.service");

module.exports = {

    insertUserAccountView: (app_id, data, res) => {
        insertUserAccountView(app_id, data, (err,results) => {
            if (err) {
                return (err,null);
            }
            return (null,results);
        });
    }
}