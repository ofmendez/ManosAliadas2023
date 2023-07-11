import { ñ,InsertElement, ConmuteClassAndInner} from './utils.js'
import {loadDataFile} from './files.js'
import {createUserData ,getUserData, updateScore} from "./database.js";
import * as views from "./views.js";


window.views = views
let Questions = {}    
let TotalQuestions = {}    
let countdownTimer = {}
let progress = 0
let answered = {}
let totalPoints = 0
let pointsBySuccess = 600
let timeTrans = 0;
let pausedTime = false


views.GoTo("Wellcome").then(()=>{  
    ñ('#startButton').addEventListener('click', (e)=>{
        console.log("startButton");
        ñ('#PopUpRegistro').hidden = false;
        // GoToLobby();
    });
});
loadDataFile("txt").then((res)=>{
    TotalQuestions = res[0].Questions;
    console.log(TotalQuestions);
});
    // loadDataFile('json')

window.TryLogin = (form)=>{
    progress = localStorage.getItem("progress") || 0;
    getUserData().then((res)=>{
        let exist = false
        for (const u in res) 
            if (res.hasOwnProperty(u)) 
                exist |= u=== form.elements['idUsername'].value
        localStorage.setItem("userName", form.elements['idUsername'].value );
        if(exist)
            GoToLobby();
        else
            Login(form)
        return false;

    }).catch((res)=> {
        console.log("Error login: "+res)
        alert("Ranking, Ha ocurrido un error, intente nuevamente.")
        return false;
    });
    return false;
}

const GoToLobby = ()=>{
    Questions = TotalQuestions;

    views.GoTo("Lobby").then(()=>{
        console.log("id: ",Questions[progress].id,"level: ",Questions[progress].level);
        let questionBtns = ñ('.ContenedorSeleccionNivel');
        questionBtns.forEach( (b, i)=> {
            b.classList.add(i===Questions[progress].level?'NivelActual':(i>=Questions[progress].level?'NivelInactivo':'NivelActivo'));
        });
        questionBtns[Questions[progress].level].addEventListener('click', ()=> GoQuestion(progress) );
    });
}

const GoQuestion = ()=>{
    views.GoTo("Pregunta").then((res)=>{
        SetQuestionAndAnswers(Questions[progress]);
        RunTimer();
    });
}

const SetQuestionAndAnswers = (question)=>{
    ñ('#TituloNivel').innerHTML="NIVEL "+(question.level+1)
    ñ('.SeccionPuntaje')[0].innerHTML=totalPoints
    ñ('#TextoPregunta').innerHTML = question.statement;
    for(let ans of question.Answers){
        let r = InsertElement('div',['Respuesta'],'',ñ('#contRespuestas'),undefined,false);
        r.addEventListener("click", () => Answer(ans, question));
        let aImg= InsertElement('img',['IconoRespuestas'],'',r,undefined,false);
        aImg.src = `../Images/Ans${ans.id}.png`;
        InsertElement('div',['BotonRespuesta'],ans.text,r,'answer'+ans.id,false);
        InsertElement('div',['space2vh'],'',ñ('#contRespuestas'),undefined,false);
    }
    InsertElement('div',['space2vh'],'',ñ('#contRespuestas'),undefined,false);
}

const Answer = (ans, question)=>{
    let classTarget = ans.isCorrect ?'RespuestaCorrecta':'RespuestaIncorrecta';
    UpdateStatus(ans.id, ans.isCorrect)
    // AnimateAnswer(ans,ñ('#answer'+ans.id), classTarget,  0);
    AnimateAnswer(ans,ñ('#answer'+ans.id), classTarget,  150);
}

const UpdateStatus = ( idAns, isCorrect)=>{
    answered = JSON.parse( localStorage.answered ||JSON.stringify({}));
    answered[progress] = idAns;
    localStorage.answered = JSON.stringify(answered);
    if (isCorrect)
        totalPoints += pointsBySuccess -timeTrans
    progress++;
    localStorage.progress = progress;
}


const RunTimer = ()=>{
    countdownTimer = setInterval(() => {
        timeTrans = pausedTime? timeTrans: timeTrans +1;
        timeTrans = timeTrans>=pointsBySuccess? pointsBySuccess: timeTrans;
    }, 1000);
}
const Login = (form)=>{
    localStorage.removeItem("answered");
    localStorage.removeItem("progress");
    progress = 0;
    createUserData(
        form.elements['idUsername'].value,
    ).then((res)=>{
        views.GoTo("Instrucciones01").then(()=>{
            ñ('#idNext').addEventListener('click', (e)=>{
                views.GoTo("Instrucciones02").then(()=>{
                    ñ('#idNext').addEventListener('click', (e)=>GoToLobby() );
                });
            });
        });
    }).catch((e)=> {
        console.log("E.login: "+e);
        alert("Ha ocurrido un error, intente nuevamente. E.login.")
    })
}


const AnimateAnswer = (ans, element, classTarget, interval)=>{
    document.body.classList.add('avoidEvents');
    ConmuteClassAndInner(element,classTarget,'dumb')
    setTimeout(() => {ConmuteClassAndInner(element,'dumb',classTarget)}, interval);
    setTimeout(() => {ConmuteClassAndInner(element,classTarget,'dumb')}, interval*2);
    setTimeout(() => {ConmuteClassAndInner(element,'dumb',classTarget)}, interval*3);
    setTimeout(() => {ConmuteClassAndInner(element,classTarget,'dumb')}, interval*4);
    setTimeout(() => {ShowFinalMessage(ans); document.body.classList.remove('avoidEvents');}, interval*5);
}

const ShowFinalMessage = (ans)=>{
    clearInterval(countdownTimer);
    // views.GoTo("FinalTrivias").then(()=>{   
    views.GoTo("Retroalimentacion").then(()=>{   
        ñ('#BackgroundImageFull').src = ans.isCorrect? "../Images/FondoCorrecta.jpg":"../Images/FondoIncorrecta.jpg";
        ñ('#BackgroundImageFull').hidden = false;
        ñ('#idNext').addEventListener('click', (e)=>NextQuestionOrResults() );
    });
}


const NextQuestionOrResults = ()=>{
    if (Object.keys(answered).length === (Questions.length) )
        GoToResults();
    else if(Questions[progress-1].level !== Questions[progress].level)
        GoToLobby();
    else
        GoQuestion(progress);
}

const GoToResults = ()=>{
    document.body.classList.add('avoidEvents');
    updateScore( localStorage.getItem("userName"), totalPoints, answered)
    .then((res)=>{
        views.GoTo("FinalTrivias").then((res)=>{
            console.log("Terminado!");
            localStorage.removeItem("answered");
            localStorage.removeItem("progress");
            document.body.classList.remove('avoidEvents');
        });
    }).catch((e) =>{
        console.log("Error Update: "+e);
        alert("Ocurrió un error, intenta nuevamente.");
        document.body.classList.remove('avoidEvents');
        GoToResults();
    });
}




//////////////////////////////////////////////

