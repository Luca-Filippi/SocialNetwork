document.getElementById("bottone").addEventListener('click', e => {
    e.preventDefault();
    const message = document.getElementById("message");
    const url = "/api/social/messages";
    const data = {
        'text': message.value
    };
    const request = {
        headers: {
            'content-type': 'application/json'
            },
            body:JSON.stringify(data),
            method:"POST"
            };
    fetch(url,request).then(data=>{return JSON.stringify(data)})
    .then(res =>{
        if(res.status === 404) {
            alert("operazione fallita");
        } else if(res.status == 401) {
            alert("non sei loggato");
        } else {
            alert("oprazione completata");
        }
    }).catch(err =>{alert(err);});
        });