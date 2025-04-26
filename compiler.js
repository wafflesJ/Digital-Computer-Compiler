export const Instuctions = [];
let count=0;
let labels = new Map();
export let MemSet = [];

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
          actions.get(words[0])(words[1],words[2]);
        }
      } 
    }
    
  }
}


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
    return (labels.get(value) - 1).toString();
  } else 
  return convert(value).value-1;
}
function LabelConvert(value) {
  if(labels.has(value)) {
    return (labels.get(value) - 1);
  } else 
  return value;
}
const actions = new Map([
  ['nop', () => Instuctions.push({op: 0})], // no op: Does nothing (NOP)
  ['lda', (value,valueB) => Instuctions.push({op: 1, ...convert(LabelConvert(value),valueB)})], // lda: Load a value into the accumulator (LDA)
  ['ldx', (value,valueB) => Instuctions.push({op: 2, ...convert(LabelConvert(value),valueB)})], // ldx: Load a value into the X register (LDX)
  ['ldy', (value,valueB) => Instuctions.push({op: 3, ...convert(LabelConvert(value),valueB)})], // ldy: Load a value into the Y register (LDY)
  ['sta', (value,valueB) => Instuctions.push({op: 4, ...convert(value,valueB)})], // sta: Store the accumulator value in memory (STA)
  ['stx', (value,valueB) => Instuctions.push({op: 5, ...convert(value,valueB)})], // stx: Store the X register value in memory (STX)
  ['sty', (value,valueB) => Instuctions.push({op: 6, ...convert(value,valueB)})], // sty: Store the Y register value in memory (STY)
  ['adc', (value,valueB) => Instuctions.push({op: 7, ...convert(value,valueB)})], // adc: Add a value to the accumulator with the carry (ADC)
  ['sbc', (value,valueB) => Instuctions.push({op: 8, ...convert(value,valueB)})], // sbc: Subtract a value from the accumulator with the carry (SBC)
  ['and', (value,valueB) => Instuctions.push({op: 9, ...convert(value,valueB)})], // and: Perform a bitwise AND on the accumulator (AND)
  ['ora', (value,valueB) => Instuctions.push({op: 10, ...convert(value,valueB)})], // ora: Perform a bitwise OR on the accumulator (ORA)
  ['eor', (value,valueB) => Instuctions.push({op: 11, ...convert(value,valueB)})], // eor: Perform a bitwise XOR on the accumulator (EOR)
  ['cmp', (value,valueB) => Instuctions.push({op: 12, ...convert(value,valueB)})], // cmp: Compare accumulator with value (CMP)
  ['cpx', (value,valueB) => Instuctions.push({op: 13, ...convert(value,valueB)})], // cpx: Compare X register with value (CPX)
  ['cpy', (value,valueB) => Instuctions.push({op: 14, ...convert(value,valueB)})], // cpy: Compare Y register with value (CPY)
  ['bit', (value,valueB) => Instuctions.push({op: 15, ...convert(value,valueB)})], // bit: Test bits in a memory location against the accumulator (BIT)
  ['inc', (value,valueB) => Instuctions.push({op: 16, ...convert(value,valueB)})], // inc: Increment the value at the memory location by 1 (INC)
  ['inx', () => Instuctions.push({op: 17})], // inx: Increment the X register by 1 (INX)
  ['iny', () => Instuctions.push({op: 18})], // iny: Increment the Y register by 1 (INY)
  ['dec', (value,valueB) => Instuctions.push({op: 19, ...convert(value,valueB)})], // dec: Decrement the value at the memory location by 1 (DEC)
  ['dex', () => Instuctions.push({op: 20})], // dex: Decrement the X register by 1 (DEX)
  ['dey', () => Instuctions.push({op: 21})], // dey: Decrement the Y register by 1 (DEY)
  ['bcc', (value) => Instuctions.push({op: 22, value: Label(value)})], // bcc: Branch if carry is clear (BCC)
  ['bcs', (value) => Instuctions.push({op: 23, value: Label(value)})], // bcs: Branch if carry is set (BCS)
  ['beq', (value) => Instuctions.push({op: 24, value: Label(value)})], // beq: Branch if zero flag is set (BEQ)
  ['bmi', (value) => Instuctions.push({op: 25, value: Label(value)})], // bmi: Branch if negative flag is set (BMI)
  ['bne', (value) => Instuctions.push({op: 26, value: Label(value)})], // bne: Branch if zero flag is clear (BNE)
  ['bpl', (value) => Instuctions.push({op: 27, value: Label(value)})], // bpl: Branch if negative flag is clear (BPL)
  ['bvc', (value) => Instuctions.push({op: 28, value: Label(value)})], // bvc: Branch if overflow flag is clear (BVC)
  ['bvs', (value) => Instuctions.push({op: 29, value: Label(value)})], // bvs: Branch if overflow flag is set (BVS)
  ['jmp', (value) => Instuctions.push({op: 30, value: Label(value)})], // jmp: Jump to a specified address (JMP)
  ['jsr', (value) => Instuctions.push({op: 31, value: Label(value)})], // jsr: Jump to a subroutine (JSR)
  ['rts', () => Instuctions.push({op: 32})], // rts: Return from subroutine (RTS)
  ['pha', () => Instuctions.push({op: 33})], // pha: Push accumulator onto the stack (PHA)
  ['php', () => Instuctions.push({op: 34})], // php: Push processor status onto the stack (PHP)
  ['pla', () => Instuctions.push({op: 35})], // pla: Pull accumulator from the stack (PLA)
  ['plp', () => Instuctions.push({op: 36})], // plp: Pull processor status from the stack (PLP)
  ['tax', () => Instuctions.push({op: 37})], // tax: Transfer accumulator to X register (TAX)
  ['tay', () => Instuctions.push({op: 38})], // tay: Transfer accumulator to Y register (TAY)
  ['txa', () => Instuctions.push({op: 39})], // txa: Transfer X register to accumulator (TXA)
  ['tya', () => Instuctions.push({op: 40})], // tya: Transfer Y register to accumulator (TYA)
  ['tsx', () => Instuctions.push({op: 41})], // tsx: Transfer stack pointer to X register (TSX)
  ['txs', () => Instuctions.push({op: 42})], // txs: Transfer X register to stack pointer (TXS)
  ['rol', () => Instuctions.push({op: 49})], // rol: rotate left
  ['ror', () => Instuctions.push({op: 50})], // rol: rotate right
  ['lsl', () => Instuctions.push({op: 51})], // rol: logic shift right
  ['lsr', () => Instuctions.push({op: 52})], // rol: logic shift left
  //end of 6502, new
  ['wrt', (value,valueB) => Instuctions.push({op: 43, ...convert(value,valueB)})], //output direct
  ['wrb', (value,valueB) => Instuctions.push({op: 44, ...convert(value,valueB)})], //output buffer
  ['dsb', () => Instuctions.push({op: 45})], //display buffer
  ['clb', () => Instuctions.push({op: 46})], //clear screen buffer
  ['cls', () => Instuctions.push({op: 47})], //clear screen
  ['ssb', () => Instuctions.push({op: 48})], //set screen buffer


]);



document.getElementById("compile").addEventListener("click", Compile);




