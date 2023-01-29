//script per la barra di ricerca
document.getElementById("searchButton").addEventListener("click", async event => {
    const query = document.getElementById("searchParameter");
    const data = await fetch("api/social/search?username=" + query.value);
    const dataJson = await data.json();
    if(dataJson?.messaggio !== null && dataJson?.messaggio !== undefined) {
        alert(dataJson.messaggio);
    } else {
        const table = document.getElementById("tableSearchBar");
        table.hidden = false;
        const tableBody = document.getElementById("result");
        tableBody.innerHTML = "";
        dataJson.forEach(element => {
            const tr = document.createElement("tr");
            const tdUserId = document.createElement("td");
            const tdUsername = document.createElement("td");
            const tdName = document.createElement("td");
            const tdSurname = document.createElement("td");
            const tdButtonFollow = document.createElement("button");
            const tdButtonUnfollow = document.createElement("button");
            tdUserId.innerHTML = element['userId'];
            tdUsername.innerHTML = element['username'];
            tdName.innerHTML = element['name'];
            tdSurname.innerHTML = element['surname'];
            tdButtonFollow.innerText = 'FOLLOW';
            tdButtonUnfollow.innerText = 'UNFOLLOW'
            tdButtonFollow.addEventListener("click", async e => {
                const url ="/api/social/followers/"+element['userId'];
                const request = {
                    headers: {
                        "content-type" : "application/json"
                    },
                    method:"POST"
                };
                fetch(url,request);
            });
            tdButtonUnfollow.addEventListener("click", async e => {
                const url ="/api/social/followers/"+element['userId'];
                const request = {
                    headers: {
                        "content-type" : "application/json"
                    },
                    method:"DELETE"
                };
                fetch(url,request);
            })
            tr.appendChild(tdUserId);
            tr.appendChild(tdUsername);
            tr.appendChild(tdName);
            tr.appendChild(tdSurname);
            tr.appendChild(tdButtonFollow);
            tr.appendChild(tdButtonUnfollow);
            tableBody.appendChild(tr);
        });
    }
   
});