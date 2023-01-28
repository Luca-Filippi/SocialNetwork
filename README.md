Progetto realizzato da Luca Filippi, valido per l'esame di programmazione web dell'anno accademico 2022/2023.

File presenti nella carella mongodbapp:

-> Dockerfile

-> docker-compose.yml

-> app.js: file javascript che viene eseguito quando viene fatto partire il container; app userà le api create nel file route.js e il database definito in db.js e si metterà in ascolto sula porta 3000

-> route.js: file javascript che si occuppa di gestire le varie api; come metodi di autenticazione ho definito sia una soluzione autocostruita tramite token ma anche una soluzione tramite cookie (solo nel signin),
ma solo la prima è stata usata in tutte le api.

-> db.js : si occuppa della connessione con mongodb, ho scelto di effettuare il collegamneto con il database 

-> 
