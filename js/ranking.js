import {getUserData, DeleteUser} from "./database.js";
import {emailToId} from './utils.js'
// populate table with new data
function updateTable(users, values) {
    console.log(users);
    let content = document.getElementById("ContenidoRanking");
    content.innerHTML = "";
    let p = "";
    users.forEach((user,i) => {
        p +=   `<div class="FranjaPuntaje">
                <div class="NumeroPosicion">${(i+1)}.</div>
                <div class="NombreJugador">${user.username}</div>
                <div class="PuntajeJugador">${user.score}</div>
            </div>`;
    });
    content.insertAdjacentHTML("beforeend", p);



}

window.Delete = (email)=>{
    DeleteUser(emailToId( email)).then((res)=>{
        console.log("Borrado!: ",emailToId( email));
        Reload()
    }).catch((e)=>console.log("Problema borrando: "+e));
}

window.Reload = ()=>{
    getUserData().then((usrObj)=>{
        let users = []
        for (const u in usrObj) 
            if (usrObj.hasOwnProperty(u)) 
                users.push(usrObj[u]);
            
        
        users.sort((a, b) => { return b.score - a.score; });
        console.log("da: ",users.length);
        updateTable(users.slice(0, 10), ['acceptAssesment','username', 'email', 'score', 'company', 'mailBox']);
        
    })
}

function example() {
    // fetch initial data and populate table
    fetch("https://2k03zcp0bd.execute-api.us-east-1.amazonaws.com/ninjas", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((res) => {
        res.json().then((data) => {
            updateTable(data.Items, [ 'acceptAssesment', 'email', 'score', 'timestamp', 'timestamp']);
        }).catch((err) => {
            console.log("ERROR: " + err);
        });
    });
}

window.Reload();
