import {loadViewFile} from './files.js'
import {ñ} from './utils.js'

class View{
    constructor(textView, target){
        target.innerHTML = textView;
    }
}

class PageState {
    currentState = new View("", ñ('#Content'));
    change = (state) => this.currentState = state;
}

const page = new PageState();

const GoChange = (html) => {
    page.change(new View(html, ñ('#Content')));
}

export const GoTo = (viewName) => {
    return new Promise((resolve,reject)=>{
        loadViewFile(viewName).then((res)=>{
            if (document.startViewTransition) 
                document.startViewTransition(() => resolve(GoChange(res)));
            else
                resolve(GoChange(res));
        });
    });
}
