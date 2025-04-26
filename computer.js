//HTML
const runURL="https://static.thenounproject.com/png/4622109-200.png";
const stopURL="https://static.thenounproject.com/png/7319850-200.png";
const playURL="https://static.thenounproject.com/png/739107-200.png";
const pauseURL="https://static.thenounproject.com/png/7490378-200.png";
const Output = document.getElementById("output");
function setStop(reset) {
  if(reset) {
    document.getElementById("tog").src=stopURL;
    document.getElementById("run").className="button-stop";
    document.getElementById("run").title="Stop Program"
  }
  document.getElementById("togB").src=pauseURL;
  document.getElementById("pause").title="Pause Program"
}
function setRun(reset) {
  if(reset) {
    document.getElementById("togB").src=pauseURL;
    document.getElementById("tog").src=runURL;
    document.getElementById("run").className="button-run";
    document.getElementById("run").title="Run Program"
  } else
  document.getElementById("togB").src=playURL;
  document.getElementById("pause").title="Unpause Program"
}


let Keys = [{val:0,alt:null},{val:0,alt:null},{val:0,alt:null},{val:0,alt:null},{val:0,alt:null},{val:0,alt:null},{val:0,alt:null},{val:0,alt:null},{val:0,alt:null},{val:0,alt:null},{val:0,alt:null},{val:0,alt:null}];
document.addEventListener("keydown", (event) => {
  const key= event.key;
  for(let i=0;i<12;i++) if(Keys[i].alt==event.code||event.key=="Shift") return; 
  for(let i=0;i<12;i++) {
    if(Keys[i].val==0) {
      Keys[i].val=key.charCodeAt(0);
      Keys[i].alt=event.code;
      if(i<=3)MEMORY[0x00FC+i] = key.charCodeAt(0);
      break;
    }
  }
});
document.addEventListener("keyup", (event) => {
  const key= event.key;
  for(let i=0;i<12;i++) {
    if(Keys[i].alt==event.code) {
      Keys[i].val=0;
      Keys[i].alt=null;
      MEMORY[0x00FC+i] = 0;
      for(i=i;i<11;i++) {
        Keys[i].val=Keys[i+1].val;
        Keys[i].alt=Keys[i+1].alt;
        if(i<=3)MEMORY[0x00FC+i] = Keys[i+1].val==null?"": Keys[i+1].val;
        Keys[i+1].val=0;
        Keys[i+1].alt=null;
        if(i<=2)MEMORY[0x00FC+i+1] = 0;
      }
      break;
    }
  }
});
//Run Program


import {Instuctions,MemSet} from './compiler.js';
import {speed} from './page.js';

let line =0;
let A = 0;
let X = 0;
let Y = 0;
let stackPointer =0xFF;
//flags
let PS = 0b0000;//Carry Zero Negative Overflow

const MEMORY = new Array(0x10000).fill(0); // 64KB memory

let buffer = "";

function pushToStack(value) {
    MEMORY[0x100 + stackPointer] = value; 
    stackPointer--;  // Decrement stack pointer
    if(stackPointer<0) stackPointer=0;
}

// Helper function to pop a value from the stack
function popFromStack() {
    stackPointer++;  // Increment stack pointer
    if(stackPointer>0x1FF) stackPointer=0x1FF;
    return MEMORY[0x0100 + stackPointer];  // Pop value from stack
    
  
}

let intervalId;

let running=false;
let stopped=true;

function Run (reset) {
  if(reset||!stopped) {
    if(reset&&!running&&!stopped) {
      //stop while pause
      stopped=true;
      setRun(true);
      return;
    }
    running=!running;
    if(running) {
     if(reset) {
       A=0;
       X=0;
       Y=0;
       buffer="";
       MEMORY.fill(0);
       Keys = [{val:0,alt:null},{val:0,alt:null},{val:0,alt:null},{val:0,alt:null},{val:0,alt:null},{val:0,alt:null},{val:0,alt:null},{val:0,alt:null},{val:0,alt:null},{val:0,alt:null},{val:0,alt:null},{val:0,alt:null}];
       MEMORY[0xFC] ="";
       MEMORY[0xFD] ="";
       MEMORY[0xFE] ="";
       MEMORY[0xFF] ="";
       MemSet.forEach((val) => {
         let index=val.address;
         val.value.forEach((byte) => {
           MEMORY[index]=byte;
           index++;
         });
       });
       Output.innerHTML="";
       stackPointer=0xFF;
       PS=0b0000;
       line = 0;
       stopped=false;
      } 
      setStop(reset);
      intervalId=setInterval(Step,clamp(1000/speed,1,1000));
    } else {
     setRun(reset);
     clearInterval(intervalId);
     if(reset) stopped=true;
   }
  }
}

function Step() {
  const steps =Math.ceil(speed/1000);
  for(let i=0; i<steps;i++) {
    //console.log("Line: "+line);
    const Instuction =Instuctions[line];
    if(Instuction !== undefined) {
      actions[Instuction.op](Instuction.value,Instuction.memory,Instuction.ofset);
    } else {
      Run(true);
      Output.innerHTML+="\n\nError: Line "+(line+1);
    }
    line++;
  }
}


function clamp(num, lower, upper) {
    return Math.min(Math.max(num, lower), upper);
}
//Actions

const actions = {
    0: () => {
      // no op: 
    },
    1: (value,memory,ofset) => {
      if(ofset==="X") value+=X;
      if(ofset==="Y") value+=Y;
      if(memory) {
        A=MEMORY[value];
      } else A=value;
      //lda 
    },
    2: (value,memory,ofset) => {
      if(ofset==="X") value+=X;
      if(ofset==="Y") value+=Y;
      if(memory) {
        X=MEMORY[value];
      } else X=value;
      // ldx: Load a value into the X register (LDX)
    },
    3: (value,memory,ofset) => {
      if(ofset==="X") value+=X;
      if(ofset==="Y") value+=Y;
      if(memory) {
        Y=MEMORY[value];
      } else Y=value;
      // ldy: Load a value into the Y register (LDY)
    },
    4: (value,memory,ofset) => {
      if(ofset==="X") value+=X;
      if(ofset==="Y") value+=Y;
      MEMORY[value]=A;
      // sta: Store the accumulator value in memory (STA)
    },
    5: (value,memory,ofset) => {
      if(ofset==="X") value+=X;
      if(ofset==="Y") value+=Y;
      MEMORY[value]=X;
      // stx: Store the X register value in memory (STX)
    },
    6: (value,memory,ofset) => {
      if(ofset==="X") value+=X;
      if(ofset==="Y") value+=Y;
      MEMORY[value]=Y;
      // sty: Store the Y register value in memory (STY)
    },
    7: (value,memory,ofset) => {
      if(ofset==="X") value+=X;
      if(ofset==="Y") value+=Y;
      if(memory) {
        A+=MEMORY[value];
      } else A+=value;
      // adc: Add a value to the accumulator with the carry (ADC)
    },
    8: (value,memory,ofset) => {
      if(memory) {
        A-=MEMORY[value];
      } else A-=value;
      // sbc: Subtract a value from the accumulator with the carry (SBC)
    },
    9: (value,memory,ofset) => {
      if(ofset==="X") value+=X;
      if(ofset==="Y") value+=Y;
      if(memory) {
        A&=MEMORY[value];
      } else A&=value;
      // and: Perform a bitwise AND on the accumulator (AND)
    },
    10: (value,memory,ofset) => {
      if(ofset==="X") value+=X;
      if(ofset==="Y") value+=Y;
      if(memory,ofset) {
        A|=MEMORY[value];
      } else A|=value;
      // ora: Perform a bitwise OR on the accumulator (ORA)
    },
    11: (value,memory,ofset) => {
      if(ofset==="X") value+=X;
      if(ofset==="Y") value+=Y;
      if(memory) {
        A^=MEMORY[value];
      } else A^=value;
      // eor: Perform a bitwise XOR on the accumulator (EOR)
    },
    12: (value,memory,ofset) => {
      if(ofset==="X") value+=X;
      if(ofset==="Y") value+=Y;
      let val = memory ? MEMORY[value] :value;
      if(val<A) {
        PS = 0b1000;
      } else if(val==A) {
        PS = 0b0100;
      } else { // (val>A)
        PS = 0b0010;
      } 
      
      // cmp: Compare accumulator with value (CMP)
    },
    13: (value,memory,ofset) => {
      if(ofset==="Y") value+=Y;
      const val = memory ? MEMORY[value] :value;
      if(val<X) {
        PS = 0b1000;
      } else if(val==X) {
        PS = 0b0100;
      } else { // (val>X)
        PS = 0b0010;
      } 
      // cpx: Compare X register with value (CPX)
    },
    14: (value,memory,ofset) => {
      if(ofset==="X") value+=X;
      const val = memory ? MEMORY[value] :value;
      if(val<Y) {
        PS = 0b1000;
      } else if(val==Y) {
        PS = 0b0100;
      } else { // (val>Y)
        PS = 0b0010;
      } 
      console.log(PS.toString(2));
      // cpy: Compare Y register with value (CPY)
    },
    15: (value,memory,ofset) => {
      if(ofset==="X") value+=X;
      if(ofset==="Y") value+=Y;
      const val = memory ? MEMORY[value] :value;
      PS &= 0b1011;
      if((A&val)==0) PS = 0b0100;
      // bit: Test bits in a memory location against the accumulator (BIT)
    },
    16: (value,memory,ofset) => {
      if(ofset==="X") value+=X;
      if(ofset==="Y") value+=Y;
      MEMORY[value]++;
      // inc: Increment the value at the memory location by 1 (INC)
    },
    17: () => {
      X++;
      // inx: Increment the X register by 1 (INX)
    },
    18: () => {
      Y++;
      // iny: Increment the Y register by 1 (INY)
    },
    19: (value,memory,ofset) => {
      if(ofset==="X") value+=X;
      if(ofset==="Y") value+=Y;
      MEMORY[value]--;
      // dec: Decrement the value at the memory location by 1 (DEC)
    },
    20: () => {
      X--;
      // dex: Decrement the X register by 1 (DEX)
    },
    21: () => {
      Y--;
      // dey: Decrement the Y register by 1 (DEY)
    },
    22: (value) => {
      if((PS&0b1000)==0b0000) {
        line=value;
      }
      // bcc: Branch if carry is clear (BCC)
    },
    23: (value) => {
      if((PS&0b1000)==0b1000) {
        line=value;
      }
      // bcs: Branch if carry is set (BCS)
    },
    24: (value) => {
      if((PS&0b0100)==0b0100) {
        line=value;
      }
      // beq: Branch if zero flag is set (BEQ)
    },
    25: (value) => {
      if((PS&0b0010)==0b0010) {
        line=value;
      }
      // bmi: Branch if negative flag is set (BMI)
    },
    26: (value) => {
      if((PS&0b0100)==0b0000) {
        line=value;
      }
      // bne: Branch if zero flag is clear (BNE)
    },
    27: (value) => {
      if((PS&0b0010)==0b0000) {
        line=value;
      }
      // bpl: Branch if negative flag is clear (BPL)
    },
    28: (value) => {
      if((PS&0b0001)==0b0000) {
        line=value;
      }
      // bvc: Branch if overflow flag is clear (BVC)
    },
    29: (value) => {
      if((PS&0b0001)==0b0001) {
        line=value;
      }
      // bvs: Branch if overflow flag is set (BVS)
    },
    30: (value) => {
      line=value;
      // jmp: Jump to a specified address (JMP)
    },
    31: (value) => {
      pushToStack(line);
      line=value;
      // jsr: Jump to a subroutine (JSR)
    },
    32: () => {
      line=popFromStack();
      // rts: Return from subroutine (RTS)
    },
    33: () => {
      pushToStack(A);
      // pha: Push accumulator onto the stack (PHA)
    },
    34: () => {
      pushToStack(PS);
      // php: Push processor status onto the stack (PHP)
    },
    35: () => {
      A=popFromStack();
      // pla: Pull accumulator from the stack (PLA)
    },
    36: () => {
      PS=popFromStack();
      // plp: Pull processor status from the stack (PLP)
    },
    37: () => {
      X=A;
      // tax: Transfer accumulator to X register (TAX)
    },
    38: () => {
      Y=A;
      // tay: Transfer accumulator to Y register (TAY)
    },
    39: () => {
      A=X;
      // txa: Transfer X register to accumulator (TXA)
    },
    40: () => {
      A=Y;
      // tya: Transfer Y register to accumulator (TYA)
    },
    41: () => {
      X=stackPointer;
      // tsx: Transfer stack pointer to X register (TSX)
    },
    42: () => {
      stackPointer=X;
      // txs: Transfer X register to stack pointer (TXS)
    },
     43: (value,memory,ofset) => {
       if(ofset==="X") value+=X;
       if(ofset==="Y") value+=Y;
       Output.innerHTML+=String.fromCharCode(memory ? MEMORY[value] :value);
       Output.scrollTop = Output.scrollHeight;
      // wrt: write direct
    },
     44: (value,memory,ofset) => {
      if(ofset==="X") value+=X;
      if(ofset==="Y") value+=Y;
      buffer+=String.fromCharCode(memory ? MEMORY[value] :value);
      // wrb: write buffer
    },
     45: () => {
       Output.innerHTML+=buffer;
       Output.scrollTop = Output.scrollHeight;
      // dsb: display buffer
    },
     46: () => {
      buffer="";
      // clb: clear buffer
    },
     47: () => {
      Output.innerHTML="";
      // cls: clear screen
    },
    48: () => {
      Output.innerHTML=buffer;
      Output.scrollTop = Output.scrollHeight;
      // ssb: set screen buffer
    },
    49: () => {
      
      PS ^= (A & 0x80)>> 4;    // Get the MSB (most significant bit)
      A = ((A << 1) | ((PS&0b1000)>>3)) & 0xFF; // Shift left, then wrap MSB to LSB
      // rol rotate left
    },
     50: () => {
      PS &= 0b0111;
      PS |= (A & 0x01) << 3;    // Get the LSB (Least Significant Bit)
               // The carry bit before the shift
      A = ((A >> 1) | (((PS & 0b1000) >> 3)<<7)) & 0xFF; // Shift right, then wrap LSB to MSB
    }, 
    51: () => {
      PS &= 0b0111;
      PS |= ((A>>7)&1);
      A>>>=1;
      // lsl: logic shift left
    },
    52: () => {
      PS &= 0b0111;
      PS |= (A&1);
      A<<=1;
      // lsr: logic shift right
    },
};


  
  
  
  

document.getElementById("run").addEventListener("click", () => Run(true));
document.getElementById("pause").addEventListener("click", () => Run(false));



