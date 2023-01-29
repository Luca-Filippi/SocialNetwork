document.getElementById("button").addEventListener("click", async e => {
    e.preventDefault;
    const name = document.getElementById("name");
    const surname = document.getElementById("surname");
    const bio = document.getElementById("bio");
    const username = document.getElementById("un");
    const password = document.getElementById("pass");
    const data = {
        'name': name.value,
        'surname': surname.value,
        'bio': bio.value,
        'username': username.value,
        'password': password.value
    };
    const url ="/api/auth/signup";
    const request = {
        headers: {
            'content-type':'application/json'
        },
        body:JSON.stringify(data),
        method:"POST"
    };
    await fetch(url,request);
    window.location.href = "http://localhost:3000";
});