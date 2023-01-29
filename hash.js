const bcrypt = require('bcryptjs');

let hashPassword = (password) => {
    try{
        return bcrypt.hashSync(password,12);
    } catch(errore) {
        return '';
    }
};

let verifyPassword = (password, hashedPassword) => {
    try {
        const verify = bcrypt.compare(password, hashedPassword);
        return verify;
    } catch(errore) {
        return false;
    }
};

module.exports = {
    hashPassword,
    verifyPassword
};