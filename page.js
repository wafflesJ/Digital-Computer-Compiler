//firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, get, child, push } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";  // <-- Add push here

const firebaseConfig = {
    apiKey: "AIzaSyAR-seX20iq8NXNBKUTF9v8LReBDKIvuSg",
    authDomain: "digitalcomputer-f1044.firebaseapp.com",
    databaseURL: "https://digitalcomputer-f1044-default-rtdb.firebaseio.com",
    projectId: "digitalcomputer-f1044",
    storageBucket: "digitalcomputer-f1044.firebasestorage.app",
    messagingSenderId: "215156053764",
    appId: "1:215156053764:web:eee6d626698082b971a251",
    measurementId: "G-JFBFR7VB6T"
  };

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);


//code
import {Compile} from './compiler.js';

let saved = false;
let Name = "New Project";
let saveTime = "Load";
let created=false;

const editor = document.getElementById('editor');
const highlight = document.getElementById('highlight');
const select = document.getElementById('select');
const newButton = document.getElementById('new-button');
const loadCont = document.getElementById('loadCont');
const savedText = document.getElementById('saved');
const input = document.getElementById('speed');
const menu = document.getElementById('menu');
const Output = document.getElementById('output');


export let speed=10;

loadNamesFireBase();

function saveCodeFirebase() {
  if(!saved) {
    saved=true;
    const Ref = ref(db, 'Projects/' +Name);
      set(Ref, {code: editor.value})  
          .catch((error) => saved=false);
          
      const newRef = ref(db, 'Names/' +Name);
      set(newRef, Name)  
          .catch((error) => saved=false);
        if(saved) {
          //update time
          savedText.innerHTML = "Saved";
          saveTime = new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
          });
          if(created) {
            const name=Name;
            const button = document.createElement('button');
            button.innerHTML=name;
            button.onclick = () => loadCode(name);
            button.className="text-box";
            button.style.cursor = 'pointer';
            loadCont.prepend(button);
            created=false;
          }
        }
  }
}

function loadNamesFireBase() {
    const Ref = ref(db, 'Names');
    get(Ref).then((snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const project = childSnapshot.val();
                const button = document.createElement('button');
                button.innerHTML=project;
                button.onclick = () => loadCode(project);
                button.className="text-box";
                button.style.cursor = 'pointer';
                loadCont.appendChild(button)
                
            });
        }
    }).catch((error) => {
        console.error("Error loading Projects:", error);
    });
}

function loadCode(name){
  const Ref = ref(db, 'Projects/' + name);
  get(Ref).then((snapshot) => {
        if (snapshot.exists()) {
                const code = snapshot.val().code;
                editor.value=code;
                highlight.innerHTML =  applySyntaxHighlighting(code);
                select.style.display="none";
                Name=name;
                saved=true;
                Output.innerHTML="";
                Compile();
            }
    }).catch((error) => {
        console.error("Error loading Code:", error);
    });
}


newButton.addEventListener('submit', (e) => {
  e.preventDefault();
  Name=document.getElementById('nameField').value.trim();
  document.getElementById('nameField').value="";
  savedText.innerHTML = "Last Saved: Never";
  saveTime = "Never";
  select.style.display="none";
  editor.innerHTML="";
  highlight.innerHTML = "";
  created=true;
});
function updateCaretPosition() {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  const caretPos = rect.top + window.scrollY;

  highlight.style.setProperty('--caret-top', `${caretPos}px`);
}


function applySyntaxHighlighting(text) {
  let highlightedText = '';
  let cursor = 0;

  const processedText = text.replace(syntaxRules[1], (match) => {
    const className = match.startsWith(';') ? 'comment' : 'string';
    return `<span class="${className}">${match}</span>`;
  });

  
  highlightedText = processedText.replace(syntaxRules[2], (match) => {
    return `<span class="number">${match}</span>`;
  }).replace(syntaxRules[3], (match) => {
    return `<span class="number-hex">${match}</span>`;
  }).replace(syntaxRules[4], (match) => {
    return `<span class="number-bin">${match}</span>`;
  });

  highlightedText = highlightedText.replace(syntaxRules[0], (match) => {
    return `<span class="keyword">${match}</span>`;
  }).replace(syntaxRules[5], (match) => {
    return `<span class="label">${match}</span>`;
  });

  return highlightedText;
}


const syntaxRules = [
  
  /\b(lda|ldx|ldy|sta|stx|sty|adc|sbc|cmp|cpx|cpy|inc|inx|iny|dec|dex|dey|bcc|bcs|beq|bmi|bne|bpl|jmp|jsr|rts|pha|pla|tax|tay|txa|tya|wrt|dsp)\b/g,
  /;[^\n]*|".*?"|'.*?'|`.*?`/g,
  /#?\$\d+(\.\d+)?\b/g,   // Match numbers (decimal, hex, binary)
  /#?\$0x[0-9a-fA-F]+\b/g,  // Match hexadecimal numbers
  /#?\$0b[01]+\b/g,   // Match binary numbers
  /\.[a-zA-Z0-9_]+:/g

];




    editor.addEventListener('input', () => {
      const text = editor.value;
      highlight.innerHTML = applySyntaxHighlighting(text);
      saved=false;
      savedText.innerHTML = "Last Saved: "+saveTime;
      highlight.scrollTop = editor.scrollTop;
      highlight.scrollLeft = editor.scrollLeft;
      updateCaretPosition();
    });

    editor.addEventListener('scroll', () => {
      highlight.scrollTop = editor.scrollTop;
      highlight.scrollLeft = editor.scrollLeft;
      updateCaretPosition();
    });
    
    
    function formatValue(value) {
  let num = parseFloat(value);
  
  if (num >= 1000000) {
    num = num / 1000000;
    return num.toFixed(2)+' MHz';
  }

  if (num >= 1000) {
    num = num / 1000;
    return num.toFixed(2) +' KHz';
  }

  return num.toFixed(2) +' Hz';
}

    menu.addEventListener('click', () => {
      //return menu
      select.style.display="flex";
    });
    
    document.addEventListener('keydown', function(event) {
            if ((event.metaKey || event.ctrlKey) && event.key === 's') {
                event.preventDefault(); 
                saveCodeFirebase();
            }
        });
        
    input.addEventListener('focus', () => {
        input.value = speed;
    });

    input.addEventListener('input', () => {
      speed= input.value;
    });

    input.addEventListener('blur', () => {
      if(speed>10000000)
      if(confirm("WARNING:\nClock Speed Exceeds 10 Million Steps per Seconds\nReset to 10 Million?")) {
        speed=10000000;
      } 
     input.value = formatValue(speed);
    });
    function copyCode() {
      const text = Output.innerText; 
      navigator.clipboard.writeText(text).then().catch(err => {
        alert("Failed to copy: " + err);
      });
    }
    document.getElementById("copy").addEventListener("click", copyCode);

    //*/
