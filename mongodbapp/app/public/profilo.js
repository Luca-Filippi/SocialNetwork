//lo script ritorna le informazioni personali
async function loadProfile() {
    let table = document.getElementById("tableMyMessages");
    table.hidden = false;
    table = document.getElementById("tableMyFollowers");
    table.hidden = false;
    let data = await fetch("api/social/whoami/");
    let dataJson = await data.json();
    if(dataJson?.messaggio !== null && dataJson?.messaggio !== undefined) {
        alert(dataJson.messaggio);
    } else {
        let div = document.getElementById("profilo");
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
        const followers = await (await fetch("api/social/followers/"+dataJson.userId)).json();
        data = await fetch("api/social/messages/"+dataJson.userId);
        dataJson = await data.json();
        if(dataJson?.messaggio !== null && dataJson?.messaggio !== undefined) {
            alert(dataJson.messaggio);
        } else {
            const tableBody = document.getElementById("messaggi");
            tableBody.innerHTML = "";
            dataJson.forEach(element => {
                const tr = document.createElement("tr");
                const tdMessage = document.createElement("td");
                const tdData = document.createElement("td");
                tdMessage.innerHTML = element['text'];
                tdData.innerHTML = element['data'];
                tr.appendChild(tdMessage);
                tr.appendChild(tdData);
                tableBody.appendChild(tr);
            });
        }
        if(followers === undefined || followers === null) {
            alert("Qualcosa è andato storto nel caricamento dei followers");
        }
        else if(followers?.messaggio !== null && followers?.messaggio) {
            alert(followers.messaggio);
        } else {
            const tableBody = document.getElementById("followers");
            for(let follower of followers) {
                data = await fetch("api/social/users/"+follower.userFollowId);
                dataJson = await data.json();
                if(dataJson?.messaggio !== null && dataJson?.messaggio !== undefined) {
                    alert(dataJson.messaggio);
                } else {
                    const tr = document.createElement("tr");
                    const tdUserId = document.createElement("td");
                    const tdUsername = document.createElement("td");
                    tdUserId.innerHTML = dataJson.userId;
                    tdUsername.innerHTML = dataJson.username;
                    tr.appendChild(tdUserId);
                    tr.appendChild(tdUsername);
                    tableBody.appendChild(tr)
                }
            }
        }
    }
}

loadProfile();
