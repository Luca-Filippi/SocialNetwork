const express = require("express");
const db = require("./db.js");
const router = express.Router();
const hash = require("./hash.js");
const jwt = require("./jwt.js");
const cookieParser = require("cookie-parser");
//const { MongoNetworkError, MongoError } = require("mongodb");
const { exitCode } = require("process");

let token = null;

checkRequestBody = function(req) {
    if(req.body.name === null || req.body.surname === null || req.body.username === null || req.body.password === null) {
        throw Error("dati non validi");
    }
}

router.post("/auth/signin", async(req,res) => {
    try{
        const mongo = db.getDb();
        const username = req.body.username;
        const password = req.body.password;
        const user = await mongo.collection("Users").findOne({'username' : username });
        if(user !== null && user !== undefined && hash.verifyPassword(password,user.password)) {
            token = jwt.setToken(username);
            console.log("loggin effettuato da " + username);
            let payload = jwt.getPayload(token);
            res.cookie("token", token, {httpOnly: true});
            res.json({token: token, payload: payload});
        } else {
            res.status(404).json({'messaggio': "username o password errati"});
            console.log("[server] Username o password errati")
        }
    } catch(errore) {
        res.status(500).json({"messaggio": "Errore in auth/signin"});
        console.error("[server] error post -> /auth/signin " + errore);
    }
});

router.post("/auth/signup", async (req,res) => {
    try{
        const mongo = db.getDb();
        let lastId = await mongo.collection("Users").count();
        checkRequestBody(req);
        let users = await mongo.collection("Users").find({'username' : req.body.username}).toArray();
        if(users.length === 0) {
            lastId =  lastId + 1;
            const user = await mongo.collection("Users").insertOne({'userId': lastId, 'name' : req.body.name,
            'surname': req.body.surname, 'bio': req.body.bio, 'username':req.body.username,
             'password': hash.hashPassword(req.body.password)});
            console.log("[server] Aggiunto il nuovo utente " + req.body.username);
            token = jwt.setToken(req.body.username);
            console.log("[server] l'utente " + req.body.username + " è connesso al server");
            let payload = jwt.getPayload(token);
            res.cookie("token", token, {httpOnly:true});
            res.json({token: token, payload: payload});
            res.json(user);
        } else {
            res.status(404).json({"messaggio": "username non valido"})
            console.log("[server] lo username inserito esiste già");
        }
    } catch(errore) {
        res.status(500).json({"messaggio": "Errore in auth/signup"});
        console.error("[server] errore post -> /auth/signup " + errore);
    }
});

router.get("/social/users/:id", async (req,res) => {
    try{
        const mongo = db.getDb();
        let user= await mongo.collection("Users").findOne({'userId' : parseInt(req.params.id)});
        if(user !== null && user !== undefined) {
            console.log("[server] ho trovato l'utente " + user.username);
            res.json({"userId": user.userId, "name": user.name, "surname" : user.surname, "bio" : user.bio,
             "username" : user.username, "password" : user.password});
        } else {
            console.log("[server] non ho trovato questo utente");
            res.status(404).json({"messaggio":"l'utente non è stato trovato"});
        }
    } catch(errore) {
        res.status(500).json({'messaggio': "qualcosa è andato storto :("});
        console.error("[server] errore get -> /user/:id" + errore);
    }
});

router.get("/social/messages/:userId", async (req,res) => {
    try{
        const mongo = db.getDb();
        let messages = await mongo.collection("Messages").find({'userId': parseInt(req.params.userId)}).toArray();
        if(messages[0] !== null && messages[0] !== undefined) {
            let clearMessages = [];
            for(let message of messages) {
                let numberOfLikes = await mongo.collection("Likes").find({"messageId" : message.messageId}).count();
                clearMessages.push({"messageId" : message.messageId, "userId" : message.userId,
                 "text" : message.text, "data" : message.data, "likes": numberOfLikes});
            }
            res.json(clearMessages);
            console.log("[server] ho trovato dei messaggi legati all'utente: " + parseInt(req.params.userId));
        } else {
            console.log("[server] non ho trovato nessun messaggio");
            res.status(404).json({"messaggio":"non è stato trovato nessun messaggio"});
        }
    } catch(errore) {
        res.status(500).json({'messaggio': "qualcosa è andato storto :("});
        console.error("[server] errore get -> /messages/:userId " + errore);
    }
    
});

router.get("/social/followers/:id", async (req,res) => {
    try{
        const mongo = db.getDb();
        let followers = await mongo.collection("Followers").find({'userId' : parseInt(req.params.id)}).toArray();
        if(followers[0] !== null && followers[0] !== undefined) {
            let clearFollowers = [];
            for(let follower of followers) {
                clearFollowers.push({"userId" : follower.userId, "userFollowId" : follower.userFollowId});
            }
            console.log("[server] ho trovato dei messaggi legati all'utente: " + parseInt(req.params.id));
            res.json(clearFollowers);
        } else {
            console.log("[server] non ho trovato nessun follower");
            res.status(404).json({"messaggio":"non è stato trovato nessun follower"});
        }
    } catch(errore) {
        res.status(500).json({'messaggio': "qualcosa è andato storto :("});
        console.error("[server] errore get -> /followers/:id" + errore);
    }
    
});

router.post("/social/followers/:id", async (req,res) => {

    try{
        const mongo = db.getDb();
        let payload = jwt.getPayload(token);
        let user = await mongo.collection("Users").findOne({'username': payload.username});
        if(user !== null && user !== undefined) {
            if(await mongo.collection("Users").findOne({'userId' : parseInt(req.params.id)}) !== null) {
                if(await mongo.collection("Followers").find({'userId' : user.userId, 'userFollowId' : parseInt(user.userId)}).count() === 0) {
                    const addedFollower = await mongo.collection("Followers").insertOne({'userId' : parseInt(req.params.id) , 'userFollowId': parseInt(user.userId)});
                    if(addedFollower !== null && addedFollower !== undefined) {
                        res.json(addedFollower);
                        console.log("[server] aggiunto il follow correttamnte");
                    } else {
                        res.status(404).json({"messaggio": "l'aggiunta di questo follower è fallita"});
                        console.log("[server] non sono riuscuto ad aggiungere questo follower");
                    }
                } else {
                    res.status(404).json({"messaggio": "segui già questo utente!!"});
                    console.log("[server] il client segue già questo utente");
                }
            } else {
                res.status(404).json({"messaggio": "l'aggiunta di questo follower è fallita"});
                console.log("[server] non riesco ad aggiungere questo follower, controlla l'id inserito");
            }
        } else {
            res.status(401).json({"messaggio": "non sei loggato"});
            console.log("[server] il client non è loggato");
        }
    } catch(errore) {
        res.status(500).json({'messaggio': "qualcosa è andato storto :("});
        console.error("[server] errore post -> /followers/:id " + errore);
    }
});

router.delete("/social/followers/:id", async (req,res) => {
    try{
        const mongo = db.getDb();
        let payload = jwt.getPayload(token);
        let user = await mongo.collection("Users").findOne({'username': payload.username});
        if(user !== null && user !== undefined) {
            let follower = await mongo.collection("Followers").findOne({'userId': 1},{'userFollowId' : parseInt(req.params.id)});
            if(follower !== null && follower !== undefined) {
                await mongo.collection("Followers").deleteOne(follower);
                res.json(follower);
                console.log("[server] follower eliminato correttamente");
            } else {
                res.status(404).json({"messaggio": "il follower non è stato eliminato"});
                console.log("[server] non sono riuscuto ad eliminare questo follower");
            }
        } else {
            res.status(401).json({"messaggio": "non sei loggato"});
            console.log("[server] il client non è loggato");
        }
    } catch(errore) {
        res.status(500).json({'messaggio': "qualcosa è andato storto :("});
        console.error("[server] errore delete -> /followers/:id " + errore);
    }
});

router.get("/social/messages/:userId/:idMsg", async (req,res) => {
    try{
        const mongo = db.getDb();
        let message = await mongo.collection("Messages").findOne({'userId' : parseInt(req.params.userId), 'messageId' : parseInt(req.params.idMsg)});
        if(message !== null && message !== undefined) {
            let numberOfLikes = await mongo.collection("Likes").find({"messageId" : message.messageId}).count();
            console.log("[server] ho trovato il messaggio cercato: utente " + parseInt(req.params.userId) + " messaggio "+ parseInt(req.params.idMsg));
            res.json({"messageId" : message.messageId, "userId" : message.userId, "text" : message.text,
             "data" : message.data, "likes": numberOfLikes});
        } else {
            console.log("[server] non ho trovato questo messaggio");
            res.status(404).json({"messaggio":"il messaggio non è stato trovato"});
        }
    } catch(errore) {
        res.status(500).json({'messaggio': "qualcosa è andato storto :("});
        console.error("[server] errore get -> /messages/:userId/:idMsg " + errore);
    }
});

router.post("/social/messages", async (req,res) => {
    try{
        const mongo = db.getDb();
        let payload = jwt.getPayload(token);
        let user = await mongo.collection("Users").findOne({'username': payload.username});
        if(user !== null && user !== undefined) {
            let numberOfMessages = await mongo.collection("Messages").count();
            let message = await mongo.collection("Messages").insertOne({'userId': parseInt(user.userId) ,
             'messageId': numberOfMessages + 1,'text' : req.body.text, 'data': Date()});
            res.json(message);
            console.log("[server] messaggio inserito correttamente da " + payload.username);
        } else {
            res.status(401).json({"messaggio": "Non sei loggato"});
            console.log("[server] il client non è loggato");
        }
    } catch(errore) {
        res.status(500).json({'messaggio': "qualcosa è andato storto :("});
        console.error("[server] errore post -> /messages " + errore);
    }
});

router.post("/social/like/:messageId", async (req,res) => {
    try{
        const mongo = db.getDb();
        let payload = jwt.getPayload(token);
        let user = await mongo.collection("Users").findOne({'username': payload.username});
        if(user !== null && user !== undefined) {
            if(await mongo.collection("Messages").findOne({'messageId' : parseInt(req.params.messageId)}) !== null){
                if(await mongo.collection("Likes").find({'userId' : user.userId, 'messageId' : parseInt(req.params.messageId)}).count() === 0) {
                    const like = await mongo.collection("Likes").insertOne({'userId' : user.userId, 'messageId' : parseInt(req.params.messageId)});
                    res.json(like);
                    console.log("[server] like al messaggio: " + req.params.messageId + " inserito nel modo corretto");
                } else {
                    res.status(404).json({"messaggio": "hai già messo like a questo messaggio!!"});
                    console.log("[server] il like è gia stato inserito precedentemente");
                }
            } else {
                res.status(404).json({"messaggio": "non trovo il messaggio"});
                console.log("[server] messageId non corretto");
            }
        } else {
            res.status(401).json({"messaggio" : "Non sei loggato"});
            console.log("[server] il client non è loggato");
        }
    } catch(errore) {
        res.status(500).json({'messaggio': "qualcosa è andato storto :("});
        console.error("[server] errore post -> /like/:messageId " + errore);
    }
});

router.delete("/social/like/:messageId", async (req,res) => {
    try{
        const mongo = db.getDb();
        let payload = jwt.getPayload(token);
        let user = await mongo.collection("Users").findOne({'username': payload.username});
        if(user !== null || user !== undefined) {
            let like = await mongo.collection("Likes").findOne({'messageId' : parseInt(req.params.messageId)}, {'userId' : user.userId});
            if(like !== null && like !== undefined) {
                mongo.collection("Likes").deleteOne(like);
                res.json(like);
                console.log("[server] like al messaggio: " + req.params.messageId + " eliminato correttamente");
            } else {
                res.status(404).json({"messaggio": "il like selezionato non esiste"});
                console.log("[server] il like selezionato non esiste");
            }
        } else {
            res.status(401).json({"messaggio" : "Non sei loggato"});
            console.log("[server] il client non è loggato");
        }
    } catch(errore) {
        res.status(500).json({'messaggio': "qualcosa è andato storto :("});
        console.error("[server] errore delete -> /like/:messageId " + errore);
    }
});

router.get("/social/feed", async (req,res) => {
    try{
        const mongo = db.getDb();
        let payload = jwt.getPayload(token);
        let user = await mongo.collection("Users").findOne({'username': payload.username});
        if(user !== null && user !== undefined) {
            let followers = await mongo.collection("Followers").find({'userId': user.userId}).toArray();
            let feed= [];
            for(let follower of followers) {
                let followerMessages = await mongo.collection("Messages").find({'userId': follower.userFollowId}).sort({'data': 1}).toArray();
                let message = followerMessages[0];
                if(message !== null || message !== undefined) {
                    let numberOfLikes = await mongo.collection("Likes").find({"messageId" : message.messageId}).count();
                    let author = await mongo.collection("Users").findOne({"userId": follower.userFollowId});
                    let data = {'messageId' : message.messageId, 'username' : author.username, 'message': message.text,
                     'data': message.data, "likes" : numberOfLikes}
                    feed.push(data);
                }
            }
            console.log("[server] carico i feed di " + payload.username)
            res.json(feed);
        } else {
            res.status(401).json({"messaggio": "Non sei loggato"});
            console.log("[server] il client non è loggato");
        }
    } catch(errore) {
        res.status(500).json({'messaggio': "non riesco a caricare i feed :(, verifica di essere loggato"});
        console.error("[server] errore get -> /feed " + errore);
    }
});

router.get("/social/search", async (req,res) => {//esempio /api/social/search?username=a
    try{
        const mongo = db.getDb();
        const query1 = req.query.username;
        let users = await mongo.collection("Users").find({"username": new RegExp(query1)}).toArray()
        if(users[0] !== null && users[0] !== undefined) {
            let clearUsers = [];
            for(let user of users) {
                clearUsers.push({"userId": user.userId, "name": user.name, "surname" : user.surname, "bio" : user.bio,
                "username" : user.username, "password" : user.password});
            }
            res.json(clearUsers);
            console.log("[server] la ricerca con il paramatro username = " + query1 + " è andata a buon fine");
        } else {
            console.log("[server] la ricerca con il paramatro username = " + query1 + " è fallita");
            res.json({"messaggio": "nessun utente è stato trovato con questi parametri di ricerca"});
        }
    } catch(errore) {
        res.status(500).json({"messaggio": "qualcosa è andato storto in /api/social/search"})
        console.error("[server] errore get -> /search?q=query " + errore);
    }
});

router.get("/social/whoami", async (req,res) => {
    try{
        const mongo = db.getDb();
        let payload = jwt.getPayload(token);
        let user = await mongo.collection("Users").findOne({'username' : payload.username})
        if(user !== null && user !== undefined){
            console.log("[server] carico le informazioni personali di " + user.username);
            res.json({"userId": user.userId, "name": user.name, "surname" : user.surname, "bio" : user.bio,
             "username" : user.username, "password" : user.password});
        } else {
            res.json({"messaggio": "Non sei loggato"});
            console.log("[server] il client non è loggato]");
        }
    } catch(errore) {
        res.status(500).json({'messaggio': "qualcosa è andato storto :("});
        console.error("[server] errore get -> /whoami " + errore);
    }
});

module.exports = router;