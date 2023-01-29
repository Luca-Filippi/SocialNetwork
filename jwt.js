const jwt = require('jsonwebtoken');

let option = {
    //algorithm: "HS256",
    expiresIn: 86400
};

let setToken = (username) => {
    let payload = {username: username, isLogged: true};
    var token = jwt.sign(payload, "secret", option);

    return token;
};
//viene usata una chiave condivisa, non una coppia di chiavi pubblica e privata 

let getPayload = (token) => {
    let decode = jwt.decode(token, { complete: true});
    return decode.payload;
};

let checkToken = (token) => {
    jwt.verify(token, "secret", option);
}

module.exports = {
    setToken,
    getPayload,
    checkToken
};