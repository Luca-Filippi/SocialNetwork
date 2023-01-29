async function getFeed() {
    const data = await fetch("api/social/feed");
    const dataJson = await data.json();
    if(dataJson?.messaggio !== null && dataJson?.messaggio !== undefined) {
        alert(dataJson.messaggio);
    } else {
        document.getElementById("log").hidden = true;
        const table = document.getElementById("tableFeed");
        table.hidden = false;
        const tableBody = document.getElementById("feed");
        dataJson.forEach(element => {
            const tr = document.createElement("tr");
            const tdUsername = document.createElement("td");
            const tdMessage = document.createElement("td");
            const tdData = document.createElement("td");
            const tdLikes = document.createElement("td");
            const tdButtonAddLike = document.createElement("button");
            const tdButtonDeleteLike = document.createElement("button");
            tdUsername.innerHTML = element['username'];
            tdMessage.innerHTML = element['message'];
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
                fetch(url,request).then(res =>{
                    if(res.status === 404) {
                        alert("operazione fallita");
                    } else if(res.status == 401) {
                        alert("non sei loggato");
                    } else {
                        alert("oprazione completata");
                    }
                }).catch(err =>{alert(err);});
            });
            tdButtonDeleteLike.addEventListener("click", async e => {
                const url ="/api/social/like/"+element['messageId'];
                const request = {
                    headers: {
                        "content-type" : "application/json"
                    },
                    method:"DELETE"
                };
                fetch(url,request).then(res =>{
                    if(res.status === 404) {
                        alert("problema");
                    } else if(res.status == 401) {
                        alert("operazione fallita");
                    } else {
                        alert("oprazione completata");
                    }
                }).catch(err =>{alert(err);});
            })
            tr.appendChild(tdUsername);
            tr.appendChild(tdMessage);
            tr.appendChild(tdData);
            tr.appendChild(tdLikes);
            tr.appendChild(tdButtonAddLike);
            tr.appendChild(tdButtonDeleteLike);
            tableBody.appendChild(tr);
        });
    }
}

getFeed();

