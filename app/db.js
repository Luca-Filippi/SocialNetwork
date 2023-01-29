const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://SocialNetwork:progetto@socialnetwork.ea9qqmp.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
const hash = require("./hash.js");

let db;//campo privato

module.exports = {
    connect: async () => {
        try{
            await client.connect();
            db = client.db("SocialNetwork");
        } catch(errore) {
            console.error("[server] non riesco a connetermi al database SocialNetwork");
        }
    },
    getDb:  () => db,
    insertData: () => {
        const mongo = db;
        
        mongo.collection("Users").insertOne({"userId":1,"name":"Harry","surname":"Potter","bio":"Studente della casa Grifondoro","username":"harry-potter","password":hash.hashPassword("Edvige2000")});
        mongo.collection("Users").insertOne({"userId":2,"name":"Ronald","surname":"Weasley","bio":"Studente della casa Grifondoro","username":"ron-weasley","password":hash.hashPassword("Crosta")});
        mongo.collection("Users").insertOne({"userId":3,"name":"Hermione","surname":"Granger","bio":"Studente della casa Grifondoro","username":"hermione-granger","password":hash.hashPassword("GrattaStinchi")});
        mongo.collection("Users").insertOne({"userId":4,"name":"Draco","surname":"Malfoy","bio":"Studente della casa Serpeverde","username":"draco-malfoy","password":hash.hashPassword("Purosangue")});
        mongo.collection("Users").insertOne({"userId":5,"name":"Albus","surname":"Silente","bio":"Preside","username":"albus-silente","password":hash.hashPassword("SorbettoAlLimone")});
    
        mongo.collection("Messages").insertOne({"messageId":1,"userId":1,"text":"Che schifo pozioni!!!","data": Date()});
        mongo.collection("Messages").insertOne({"messageId":2,"userId":1,"text":"Nessuno mi crede :(","data": Date()});
        mongo.collection("Messages").insertOne({"messageId":3,"userId":2,"text":"Miseriaccia","data": Date()});
        mongo.collection("Messages").insertOne({"messageId":4,"userId":3,"text":"Viva rune antiche","data": Date()});
        mongo.collection("Messages").insertOne({"messageId":5,"userId":4,"text":"Lo dirò a mio padre","data": Date()});
        mongo.collection("Messages").insertOne({"messageId":6,"userId":5,"text":"Ho assoluta fiducia in Severus Piton","data": Date()});

        mongo.collection("Followers").insertOne({"userId":1,"userFollowId":2});
        mongo.collection("Followers").insertOne({"userId":1,"userFollowId":3});
        mongo.collection("Followers").insertOne({"userId":1,"userFollowId":5});
        mongo.collection("Followers").insertOne({"userId":5,"userFollowId":1});
        mongo.collection("Followers").insertOne({"userId":2,"userFollowId":1});
        mongo.collection("Followers").insertOne({"userId":2,"userFollowId":3});
        mongo.collection("Followers").insertOne({"userId":3,"userFollowId":1});
        mongo.collection("Followers").insertOne({"userId":3,"userFollowId":2});

        mongo.collection("Likes").insertOne({"userId":2,"messageId":1});
        mongo.collection("Likes").insertOne({"userId":2,"messageId":2});
        mongo.collection("Likes").insertOne({"userId":3,"messageId":2});
        mongo.collection("Likes").insertOne({"userId":1,"messageId":3});

        console.log("[server] Dati inseriti");
    }
}
