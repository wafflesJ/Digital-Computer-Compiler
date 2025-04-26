//firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, get, child, push } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";  // <-- Add push here

const firebaseConfig = {
  apiKey: "AIzaSyDei-h3yGZiT5CB3r7TZh0hGxcjfNj5bWM",
  authDomain: "assembly-3cd3e.firebaseapp.com",
  databaseURL: "https://assembly-3cd3e-default-rtdb.firebaseio.com",
  projectId: "assembly-3cd3e",
  storageBucket: "assembly-3cd3e.firebasestorage.app",
  messagingSenderId: "334002690864",
  appId: "1:334002690864:web:1fa2a7fd0080b1b72406f5"
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

  const processedText = text.replace(/;[^\n]*|".*?"|'.*?'|`.*?`/g, (match) => {
    const className = match.startsWith(';') ? 'comment' : 'string';
    return `<span class="${className}">${match}</span>`;
  });

  
  highlightedText = processedText.replace(/#?\$\d+(\.\d+)?\b/g
, (match) => {
    return `<span class="number">${match}</span>`;
  }).replace(/#?\$0x[0-9a-fA-F]+\b/g, (match) => {
    return `<span class="number-hex">${match}</span>`;
  }).replace(/#?\$0b[01]+\b/g, (match) => {
    return `<span class="number-bin">${match}</span>`;
  });

  highlightedText = highlightedText.replace(/\b(nop|lda|ldx|ldy|sta|stx|sty|adc|sbc|and|ora|eor|cmp|cpx|cpy|bit|inc|inx|iny|dec|dex|dey|bcc|bcs|beq|bmi|bne|bpl|bvc|bvs|jmp|jsr|rts|pha|php|pla|plp|tax|tay|txa|tya|tsx|txs|wrt|wrb|dsb|clb|cls|lsr|lsl|ssb|ror|rol)\b/g, (match) => {
    return `<span class="keyword">${match}</span>`;
  }).replace(/\.[a-zA-Z0-9_]+:/g, (match) => {
    return `<span class="label">${match}</span>`;
  });

  return highlightedText;
}


const syntaxRules = [
  
  { regex: /\b(nop|lda|ldx|ldy|sta|stx|sty|adc|sbc|and|ora|eor|cmp|cpx|cpy|bit|inc|inx|iny|dec|dex|dey|bcc|bcs|beq|bmi|bne|bpl|bvc|bvs|jmp|jsr|rts|pha|php|pla|plp|tax|tay|txa|tya|tsx|txs|wrt|wrb|dsb|clb|cls|lsr|lsl|ssb|ror|rol)\b/g, className: 'keyword' },
  { regex: /".*?"|'.*?'|`.*?`/g, className: 'string' },
  { regex: /;[^\n]*/g, className: 'comment' },  // Match comments starting with ";"
  { regex: /#?\$\d+(\.\d+)?\b/g, className: 'number' },  // Match numbers (decimal, hex, binary)
  { regex: /#?\$0x[0-9a-fA-F]+\b/g, className: 'number-hex' },  // Match hexadecimal numbers
  { regex: /#?\$0b[01]+\b/g, className: 'number-bin' },  // Match binary numbers
  { regex:  /\.[a-zA-Z0-9_]+:/g, className: 'label'}

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
        
        
    //*/
