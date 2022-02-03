const { insertUserAccountLogon} = require ("./user_account_logon.service");

module.exports = {

    insertUserAccountLogon: (data, res) => {
        insertUserAccountLogon(data, (err,results) => {
            if (err) {
                console.log(err);
                return (err,null);
            }
            return (null,results);
        });
    }
}