import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js'
import { getDatabase, set, ref, onValue, child, push, update, remove } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-database.js'
import {loadCredentials} from './files.js'

let firebaseConfig = {}
let database ={}
let app = {}
let existDatabase = false;


const getDB = function (){
    return new Promise((resolve,reject)=>{
        if (existDatabase){
            resolve(database)
        } else{
            existDatabase =true;
            loadCredentials().then((res)=>{
                firebaseConfig =res;
                app = initializeApp(firebaseConfig);
                database = getDatabase(app);
                resolve(database);
            });
        }
    });
};

export function getUserData() {
    // return true;
    return new Promise((resolve,reject)=>{
        getDB().then((db)=>{
            const starCountRef = ref(db, '/users');
            onValue(starCountRef, (snapshot) => {
                resolve(snapshot.val())
            }, {
                onlyOnce: false
            });
        }).catch((e)=> reject("error getDB: "+e))
    });
}



export function updateScore(userId, newScore) {
    return true;
    return new Promise((resolve,reject)=>{
        getDB().then((db)=>{
            const updates = {};
            updates['/users/' + userId+'/score'] = newScore;
            update(ref(db), updates).then(()=>{
                resolve("Updated!! ")
            });
        }).catch((e)=> reject("error getDB: "+e))
    });
}

export function DeleteUser(userId) {
    return true;

    return new Promise((resolve,reject)=>{
        getDB().then((db)=>{
            set(ref(db, 'users/' + userId),  null ).then((res)=> resolve("DELETED!!"));
        }).catch((e)=> reject("error getDB: "+e))
    });
}


export function createUserData(_username) {

    return new Promise((resolve,reject)=>{
        getDB().then((db)=>{
            set(ref(db, 'users/' + _username), {
                p1 : -1,
                p2 : -1,
                p3 : -1,
                p4 : -1,
                p5 : -1,
                p6 : -1,
                p7 : -1,
                p8 : -1,
                p9 : -1,
                p10 : -1,
                p11 : -1,
                p12 : -1,
                p13 : -1,
                p14 : -1,
                p15 : -1,
                p16 : -1,
                p17 : -1,
                p18 : -1,
                score : 0
            }).then((res)=> resolve("writted"));
        }).catch((e)=> reject("error getDB: "+e))
    });
}

// export {createUserData }