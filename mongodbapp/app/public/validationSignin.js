//fatto con una promise al posto di una funzione asincrona
document.getElementById("button").addEventListener("click", async e => {
    e.preventDefault();
    var username = document.getElementById("username");
    var password = document.getElementById("password");
    const url ="/api/auth/signin";
    const request = {
        headers: {
            "content-type" : "application/json"
        },
        body:JSON.stringify({'username': username.value, 'password':password.value}),
        method:"POST"
    };
    await fetch(url,request).then(data=>{return JSON.stringify({'username': username.value, 'password':password.value})})
    .then(res =>{
        if(res.status === 500) {
            alert("signin fallito");
        } else if(res.status == 404) {
            alert("username o password errati");
        } else {
            alert("signin effettuato con successo");
        }
    }).catch(err =>{alert(err);});
    window.location.href = "http://localhost:3000";
}); //questo script serve per mandare le credenziali

