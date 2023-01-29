Progetto realizzato da Luca Filippi, valido per l'esame di programmazione web dell'anno accademico 2022/2023.

Docker:

Sono presenti il dockerfile e il docker-compose.yml che sono stati forniti nelle istruzioni del progetto.

Database:

Per implementare la base di dati è stato scelto un database di tipo nosql, la scelta come consigliato è ricaduta su mongodb. Per realizzarlo mi sono appoggiato alla piattaforma cloud Atlas MongoDB.

Sono state create 4 collezioni: Users(userId, name, surname,bio, username, password), Messages(messageId, userId, text, data), Likes(userId, messageId)
, Followers(userId, userFollowId).

All'interno sono presenti i documenti caricati mendiante la funzione insertData() in db.js più altri caricati durante alcuni miei test, si possono vedere tutti nel file databaseDocuments.txt


Apllicazione Nodejs:

-> db.js si occuppa della gestione del database;

-> route.js si occuppa di gestire le varie api descritte nelle istruzioni del progetto;

-> hash.js definisce le funzioni usate per fare l'hash delle password e per la loro verifica;

-> jwt.js definisce le funzioni usate per l'autenticazione: impostare e verificare il token basato sullo username, e di ricavare lo username dal token;

-> app.js è il programma che verrà eseguito quando verrà lanciato quando partirà il container.

Per l'autenticazione ho scelto di usare una soluzione autocostruita basata su un token jwt rappresentato da una variabile global token definita in route.js
, inzialmente nulla e acquisisce un valore solo se si effutta un signin o un signup in modo corretto. Questa soluzione ha il difetto di supportare un solo client alla volta, ma risulta più conveninte ai fini del progetto, in quanto semplifica la gestione delle autorizzazioni. Nella realtà è preferibile
inseirire il token in un cookie (visibile a scopo dimostrativo in /api/auth/signin) e poi utilizzare questo cookie per gestire le autorizzazioni.

Cartella public:

         HTML -> sono presenti 4 file di tipo HTML:
              - index.html rapprenta la pagina principale nella quale si può usare una barra di ricerca per gli utenti e cercare le informazioni di un'utente e i messaggi da lui inviati dato lo userId;
              - login.html è la pagina usata da un utente per effetture il login;
              - signup.html è la pagina usata da un untente per registrasi;
              - feed.html è la pagina usata per visualizzare i feed da parte di un'utente loggato.
              - profilo.html è la pagina usata da un'utente loggato per visualizzare le proprie informazioni, i propri messaggi e followers.
              
         CSS -> per la decorazione delle pagine sono stati usati un file index.css e bootstrap.
         
         JAVASCIPT -> sono presenti 7 file di tipo js, ognuno di loro si occupa di una specifica funzionalità:
                   - validationSignin prende i valori di username e password da login.html e richiama con il metodo post /api/auth/signin;
                   - validationSignout analogo al precedente;
                   - searchBar.js gestisce la barra di ricerca riempiendo una tabella (inizialmente non visibile) con i risultati di /api/social/search;
                   - searchUser.js dopo aver letto uno userId ritorna se esistono le sue informazioni e i messaggi da lui inviato;
                   - feed.js se un'utente è loggato riempie una tabella con i suoi feed;
                   - profilo.js se un'utente è loggato riempie la pagina con le informazioni, i messaggi e i followers dell'utente;
                   - sendMessage.js se un'utente loggato scrive un messaggio nell'apposita textbox e preme invia, questo script aggiunge al database il nuovo messaggio.
                   
                   
Credenziali(username, password) di alcuni utenti nel database:

  ->(harry-potter, Edvige2000);
  
  ->(ron-weasley, Crosta);
  
  ->(hermione-granger, Grattastinchi);
  
  ->(draco-malfoy, Purosangue);
  
  ->(albus-silente, SorbettoAlLimone);
