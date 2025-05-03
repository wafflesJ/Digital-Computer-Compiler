export const Instuctions = [];
let count=0;
let labels = new Map();
export let MemSet = [];
const Output = document.getElementById("output");

export function Compile() {
  count=0;
  Instuctions.length = 0;
  MemSet.length = 0;
  const text = document.getElementById('editor').value;
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
  const words = lines[i].match(/(?:[^\s"']+|["'`][^"'`]*["'`])/g);
    if(words!=''&&words!=null) {
    if(words[0].startsWith('.')||words[0].startsWith('$')) {
      if(words[0].endsWith(':')) {
        labels.set(words[0].slice(1, -1), count);
      } else if(words[1]=='=') {
        MemSet.push(convertMEM(words));
      }else count++;
    } else count++;
    }
  }
  
  for (let i = 0; i < lines.length; i++) {
  const words = lines[i].match(/(?:[^\s"']+|["'`][^"'`]*["'`])/g);
    if(words!=''&&words!=null) {
      if(!(words[0].startsWith('.')||words[0].startsWith('$'))) {
        if (actions.has(words[0])) {
          actions.get(words[0])(words[1],words[2],words[3]);
        } else {
          Output.innerHTML="Compilation error: '"+words[0]+"' does not exist.";
          return;
      }
      } 
    }
    
  }
  MakeBinary();
}
function MakeBinary() {
  let binary="";
  let line=0;
  let lineNums=[0];
  for (let i = 0; i < Instuctions.length; i++) {
    line+=binaryCodes[Instuctions[i].op].inc;
    lineNums.push(line);
  }
  line=0;
  for (let i = 0; i < Instuctions.length; i++) {
    let code =Instuctions[i]
    if(code.memory) {
      if(!binaryCodes[code.op].address ){
        Output.innerHTML="Compilation error: '"+symbols[code.op]+"' does not accept addresses, only numbers.";
        return;
      } else 
        binary+=binaryCodes[code.op].address;
    } else {
      if(!binaryCodes[code.op].base){
        Output.innerHTML="Compilation error: '"+symbols[code.op]+"' does not accept numbers, only addresses.";
        return;
      } else
      binary+=binaryCodes[code.op].base;
    }
      if(code.op==24) {//jsr
        binary+=line.toString(2).padStart(8, '0')+" 00000000\n";
        binary+="00000010 00010000\n"
      }
      
      if(code.label) {
        binary+=lineNums[code.value].toString(2).padStart(8, "0");
      } else if(code.value!=undefined)
        binary+=code.value.toString(2).padStart(8, "0");
      if(code.op==33) {//dsp
        binary+="\n"+(code.col&255).toString(2).padStart(8, '0');
        binary+=" "+(code.col&0xF00>>8).toString(2).padStart(4, '0');
      }
      if(code.op==32) {//wrt
        binary+="\n"+(code.col&255).toString(2).padStart(8, '0');
        binary+=" 00000000";
      }
      if(binaryCodes[code.op].address&&code.memory) {//add address data 
          if(code.col==undefined)binary+="\n00000000 0000";
          let bits = 0b0000;
          if(binaryCodes[code.op].base&&code.col==undefined) {//if both
            bits|=0b0001; 
            line++;
          }
          if(code.ofset=="X") bits|=0b0100;
          if(code.ofset=="Y") bits|=0b0010;
          binary+=bits.toString(2).padStart(4, '0');
      }
      
      binary+=binaryCodes[code.op].follow;
      line+=binaryCodes[code.op].inc;
  }
  for(let i=line;i<256;i++)binary+="00000000 00000000\n";
  Output.innerHTML=binary;
}

const binaryCodes = [
  {base:"11010000 ",address:"01100000 ",follow:"\n",inc:1},//lda
  {base:"00110000 ",address:"11100000 ",follow:"\n",inc:1},//ldx
  {base:"10110000 ",address:"00010000 ",follow:"\n",inc:1},//ldy
  {address:"11000000 ",follow:"\n",inc:2},//sta
  {address:"00100000 ",follow:"\n",inc:2},//stx
  {address:"10100000 ",follow:"\n",inc:2},//sty
  {base:"01110000 ",address:"10010000 ",follow:"\n",inc:1},//adc
  {base:"11110000 ",address:"01010000 ",follow:"\n",inc:1},//sbc
  {base:"11000110 00000000\n00000000 00000000\n00000010 00000000\n",follow:" 00000000\n",inc:4},//cmp
  {base:"00100110 00000000\n00000000 00000000\n00000010 00000000\n",follow:" 00000000\n",inc:4},//cpx
  {base:"10100110 00000000\n00000000 00000000\n00000010 00000000\n",follow:" 00000000\n",inc:4},//cpy
  {address:"10000000 ",follow:"\n",inc:2},//inc
  {base:"10000010 01000000\n00000000 00000000",follow:"\n",inc:2},//inx
  {base:"10000010 00100000\n00000000 00000000",follow:"\n",inc:2},//iny
  {address:"01000010 ",follow:"\n",inc:2},//dec
  {base:"01000010 01000000\n00000000 00000000",follow:"\n",inc:2},//dex
  {base:"01000000 00100000\n00000000 00000000",follow:"\n",inc:2},//dey
  {base:"10001010 00010000\n",follow:" 00000000\n",inc:2},//bcc
  {base:"00001010 00010000\n",follow:" 00000000\n",inc:2},//bcs
  {base:"00101010 00010000\n",follow:" 00000000\n",inc:2},//beq
  {base:"11001010 00010000\n",follow:" 00000000\n",inc:2},//bmi
  {base:"10101010 00010000\n",follow:" 00000000\n",inc:2},//bne
  {base:"11001010 00010000\n",follow:" 00000000\n",inc:2},//bpl
  {base:"00000010 00010000\n",follow:" 00000000\n",inc:2},//jmp
  {base:"00000010 00001000\n",follow:" 00000000\n",inc:4},//jsr
  {base:"00000010 00010000\n",follow:"00000000 00001000\n",inc:2},//rts
  {base:"11000010 00001000\n",follow:"00000000 00000000\n",inc:2},//pha
  {base:"01100010 00000000\n",follow:"00000000 00001000\n",inc:2},//pla
  {base:"11000010 01000000\n",follow:"00000000 00000000\n",inc:2},//tax
  {base:"11000010 00100000\n",follow:"00000000 00000000\n",inc:2},//tay
  {base:"00100010 10000000\n",follow:"00000000 00000000\n",inc:2},//txa
  {base:"10100010 10000000\n",follow:"00000000 00000000\n",inc:2},//tya
  {base:"00000000 ",address:"00000000 ",follow:"\n",inc:2},//wrt WIP
  {base:"00000000 ",address:"00000001 ",follow:"\n",inc:2},//dsp
  {base:"01100010 00000110\n00000000 00000000",follow:"\n",inc:2}//dsp


];


const valueRegex = [
  { regex: /0x[0-9A-Fa-f]+/g, type: 'number-hex' },
  { regex: /0b[01]+/g, type: 'number-bin' },
  { regex: /\d+/g, type: 'number-dec' },
  { regex: /(["'`]).*?\1/g, type: 'string' },
];


function arrayMaker(words) {
  const final = [];
  words.forEach((value) => {
    for (let rule of valueRegex) {
      const match = value.match(rule.regex);
      if (match) {
        if (rule.type === 'number-hex') {
          final.push(parseInt(value.slice(1), 16));
        } else if (rule.type === 'number-dec') {
          final.push(parseInt(value.slice(1), 10)); // Parse decimal
        } else if (rule.type === 'number-bin') {
          final.push(parseInt(value.slice(2), 2));  // Parse binary to decimal
        } else if (rule.type === 'string') {
          final.push(...Array.from(value.slice(1,-1)).map(char => char.charCodeAt(0))); // Parse binary to decimal
        } 
      }
    }
  });
  return final;
  //return Array.from(str).map(char => char.charCodeAt(0));
}


function convertMEM(values) {
  const value=values[0].slice(1).trim();
  
  
  for (let rule of valueRegex) {
    const match = value.match(rule.regex);
    if (match) {
      if (rule.type === 'number-hex') {
        return {address: parseInt(value, 16), value: arrayMaker(values.slice(2))}; // Parse hex to decimal
      } else if (rule.type === 'number-dec') {
        return {address: parseInt(value, 10), value: arrayMaker(values.slice(2))}; // Parse decimal
      } else if (rule.type === 'number-bin') {
        return {address: parseInt(value.slice(2), 2), value: arrayMaker(values.slice(2))}; // Parse binary to decimal
      } 
    }
  }
  return 'Unknown';
}
function LabelConvert(value) {
  if(labels.has(value)) {
    return (labels.get(value) - 1).toString();;
  } else 
  return value;
}

function convert(value,valueB) {
  if (value==undefined) return 0;
  value = value.trim();
  let ofsetVal = "null";
  let mem=false;
  
  if (/["'`]$/.test(value)) {
    return {value: value.charAt(1).charCodeAt(0), memory: false}; // Remove surrounding quotes
  } else if (value.startsWith('#$')) {
      value= value.slice(2); 
      mem=true;
  }else if (value.startsWith('$')) {
    value= value.slice(1); 
  }
  if(mem) {
    if(valueB==="X"||valueB==="Y") {
      ofsetVal=valueB;
    }
  }
  
  for (let rule of valueRegex) {
    const match = value.match(rule.regex);
    if (match) {
      if (rule.type === 'number-hex') {
        return {value: parseInt(value, 16), memory: mem,ofset: ofsetVal}; // Parse hex to decimal
      } else if (rule.type === 'number-dec') {
        return {value: parseInt(value, 10), memory: mem,ofset: ofsetVal}; // Parse decimal
      } else if (rule.type === 'number-bin') {
        return {value: parseInt(value.slice(2), 2), memory: mem,ofset: ofsetVal}; // Parse binary to decimal
      }
    }
  }
  return 'Unknown';
}

function Label(value) {
  if(labels.has(value)) {
    return (labels.get(value));
  } else 
  return convert(value).value;
}

function colour(value) {
  value=value.slice(1);
  for (let rule of valueRegex) {
    const match = value.match(rule.regex);
    
    if (match) {
      if (rule.type === 'number-hex') {
        return parseInt(value, 16); // Parse hex to decimal
      } else if (rule.type === 'number-dec') {
        return  parseInt(value, 10); // Parse decimal
      } else if (rule.type === 'number-bin') {
        return parseInt(value.slice(2), 2); // Parse binary to decimal
      }
    }
  }
  return 0;
}

const symbols = [
  'lda', 'ldx', 'ldy', 'sta', 'stx', 'sty',
  'adc', 'sbc', 'cmp', 'cpx', 'cpy', 'inc',
  'inx', 'iny', 'dec', 'dex', 'dey', 'bcc',
  'bcs', 'beq', 'bmi', 'bne', 'bpl', 'jmp',
  'jsr', 'rts', 'pha', 'pla', 'tax', 'tay',
  'txa', 'tya', 'wrt', 'dsp', 'key'
];

const actions = new Map([
  ['lda', (value,valueB) => Instuctions.push({op: 0, ...convert(LabelConvert(value),valueB)})],
  ['ldx', (value,valueB) => Instuctions.push({op: 1, ...convert(value,valueB)})],
  ['ldy', (value,valueB) => Instuctions.push({op: 2, ...convert(value,valueB)})],
  ['sta', (value,valueB) => Instuctions.push({op: 3, ...convert(value,valueB)})],
  ['stx', (value,valueB) => Instuctions.push({op: 4, ...convert(value,valueB)})],
  ['sty', (value,valueB) => Instuctions.push({op: 5, ...convert(value,valueB)})],
  ['adc', (value,valueB) => Instuctions.push({op: 6, ...convert(value,valueB)})],
  ['sbc', (value,valueB) => Instuctions.push({op: 7, ...convert(value,valueB)})],
  ['cmp', (value,valueB) => Instuctions.push({op: 8, ...convert(value,valueB)})],
  ['cpx', (value,valueB) => Instuctions.push({op: 9, ...convert(value,valueB)})],
  ['cpy', (value,valueB) => Instuctions.push({op: 10, ...convert(value,valueB)})],
  ['inc', (value,valueB) => Instuctions.push({op: 11, ...convert(value,valueB)})],
  ['inx', () => Instuctions.push({op: 12})],
  ['iny', () => Instuctions.push({op: 13})],
  ['dec', (value,valueB) => Instuctions.push({op: 14, ...convert(value,valueB)})],
  ['dex', () => Instuctions.push({op: 15})],
  ['dey', () => Instuctions.push({op: 16})],
  ['bcc', (value) => Instuctions.push({op: 17, value: Label(value),label:true})],
  ['bcs', (value) => Instuctions.push({op: 18, value: Label(value),label:true})],
  ['beq', (value) => Instuctions.push({op: 19, value: Label(value),label:true})],
  ['bmi', (value) => Instuctions.push({op: 20, value: Label(value),label:true})],
  ['bne', (value) => Instuctions.push({op: 21, value: Label(value),label:true})],
  ['bpl', (value) => Instuctions.push({op: 22, value: Label(value),label:true})],
  ['jmp', (value) => Instuctions.push({op: 23, value: Label(value),label:true})],
  ['jsr', (value) => Instuctions.push({op: 24, value: Label(value),label:true})],
  ['rts', () => Instuctions.push({op: 25})],
  ['pha', () => Instuctions.push({op: 26})],
  ['pla', () => Instuctions.push({op: 27})],
  ['tax', () => Instuctions.push({op: 28})],
  ['tay', () => Instuctions.push({op: 29})],
  ['txa', () => Instuctions.push({op: 30})],
  ['tya', () => Instuctions.push({op: 31})],
  ['wrt', (value,valueB,valueC) => Instuctions.push({op: 32, ...convert(valueB,valueC), col:colour(value)})],
  ['dsp', (value,valueB,valueC) => Instuctions.push({op: 33, ...convert(valueB,valueC), col:colour(value)})],
  ['key', () => Instuctions.push({op: 34})]

]);

 


document.getElementById("compile").addEventListener("click", Compile);




