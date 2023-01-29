//script per la ricerca di un'utente dato lo userId: stampa sia le informazioni dell'untente sia i suoi messaggi
document.getElementById("searchUserBotton").addEventListener("click", async event => {
    const userId = document.getElementById("userId");
    let data = await fetch("api/social/users/" + userId.value);
    let dataJson = await data.json();
    if(dataJson?.messaggio !== null && dataJson?.messaggio !== undefined) {
        alert(dataJson.messaggio);
    } else {
        let div = document.getElementById("resultSearchByUserId");
        div.innerHTML = "";
        const nameLabel = document.createElement("label");
        nameLabel.innerHTML = "<strong> Nome: </strong>";
        const name = document.createElement("p");
        name.innerHTML = dataJson.name;
        const surnameLabel = document.createElement("label");
        surnameLabel.innerHTML = "<strong> Cognome: </strong>";
        const surname = document.createElement("p");
        surname.innerHTML = dataJson.surname;
        const usernameLabel = document.createElement("label");
        usernameLabel.innerHTML = "<strong> username: </strong>";
        const username = document.createElement("p");
        username.innerHTML = dataJson.username;
        const bioLabel = document.createElement("label");
        bioLabel.innerHTML = "<strong> Bio: </strong>";
        const bio = document.createElement("p");
        bio.innerHTML = dataJson.bio;
        div.appendChild(nameLabel);
        div.appendChild(name);
        div.appendChild(surnameLabel);
        div.appendChild(surname);
        div.appendChild(usernameLabel);
        div.appendChild(username);
        div.appendChild(bioLabel);
        div.appendChild(bio);
        data = await fetch("api/social/messages/"+dataJson.userId);
        dataJson = await data.json();
        const table = document.getElementById("tableMessaggi");
        if(dataJson?.messaggio !== null && dataJson?.messaggio !== undefined) {
            alert(dataJson.messaggio);
            table.hidden = true;
        } else {
            table.hidden = false;
            const tableBody = document.getElementById("messaggi");
            tableBody.innerHTML = "";
            dataJson.forEach(element => {
                const tr = document.createElement("tr");
                const tdMessage = document.createElement("td");
                const tdData = document.createElement("td");
                const tdLikes = document.createElement("td");
                const tdButtonAddLike = document.createElement("button");
                const tdButtonDeleteLike = document.createElement("button");
                tdMessage.innerHTML = element['text'];
                tdData.innerHTML = element['data'];
                tdLikes.innerHTML = element['likes'];
                tdButtonAddLike.innerText = 'ADD LIKE';
                tdButtonDeleteLike.innerText = 'DELETE LIKE'
                tdButtonAddLike.addEventListener("click", async e => {
                    const url ="/api/social/like/"+element['messageId'];
                    const request = {
                        headers: {
                            "content-type" : "application/json"
                        },
                        method:"POST"
                    };
                    fetch(url,request);
                });
                tdButtonDeleteLike.addEventListener("click", async e => {
                    const url ="/api/social/like/"+element['messageId'];
                    const request = {
                        headers: {
                            "content-type" : "application/json"
                        },
                        method:"DELETE"
                    };
                    fetch(url,request);
                })
                tr.appendChild(tdMessage);
                tr.appendChild(tdData);
                tr.appendChild(tdLikes);
                tr.appendChild(tdButtonAddLike);
                tr.appendChild(tdButtonDeleteLike);
                tableBody.appendChild(tr);
            });
        }
    }
});