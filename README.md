# 6502-Emulator
An emulator for a modified 6502 assembly with a build in compiler and editor.
Despite having to compile code before running this 6502 Emulator in still interpreted, the compiler takes the raw text input and converts it into data for the interpreter.  
The link to the emulator is [here](https://wafflesj.github.io/6502-Emulator/)

- 64K Memory Addresses
- A, X and Y Registers
- 52 OpCodes
- Text Output
  
**NOTE: All codes are saved to a universal database, please do not delete or ruin others code**  
# Instructions and Syntax:
All instructions begin with an mnemonic, a 3-letter code such as - `lda`  
After each mnemonic, depending on the type will be followed by a value, either an immediate, repsented by the `$` prefix or a memory address, represented by the `#$` prefix. Values can be is decimal, hex `0x` or binary `0b`.  
Instructions which have a value that can be an immediate or memory adress may also be followed by `X` or `Y`, at runtime their value will be ofset by the corresponding register  
**Example Code:**  
```
lda $0x50    ;Loads 80 into A register
ldx $4       ;Loads 4 into X register
sta #$0x2 X  ;Stores A(50) at memory address 6, 4+X(2)
```
**Other Syntax:**  
To load data directly into memory on load type the `$` prefix followed by a memory address, `=` and then you data, separated by spaces. This will load the data into memory starting at the specified address, each value or charactor(for strings) will be loaded into a separate location  
**Example Code:**  
```
$2 = 5 8 "Hi"
```
The value 5 is stored at address 2, 8 at address 3, 72(H in ASCII) at 4, and 105(i in ASCII) at 5  
**Labels:**  
Labels are writen startign with `.` , ending with `:` and are one world. Jump Instructions can used them as a replacement for the line number. Along with values direcly put into memory labels do not get executed and therefor do not count as a line when giving a jump instruction a line value. Jump instructions include: `jmp` `beq` `bne` `bcc` `bcs` `bmi` `mne` `bvc` `bvc` and `jsr`.  
**Example Code:**  
```
.loop:   ;This is a label
inx      ;Increment X register
cmx $12  ;Compare X register to 12
bne loop ;Continue to loop until X equals 12
```
**Constant Memory Addresses:**   
- 0x100 though 0x1FF are the stack, they may be used but it isn't recomened
- 0xFC though 0xFF store current key inputs in ASCII
# Full Instruction Set:
| Instruction | Takes Value | Description |
|------------|-------|-------------|
| nop        | No    | Does nothing |
| lda        | Yes   | Load a value into the accumulator  |
| ldx        | Yes   | Load a value into the X register  |
| ldy        | Yes   | Load a value into the Y register  |
| sta        | Yes   | Store the accumulator value in memory ( |
| stx        | Yes   | Store the X register value in memory  |
| sty        | Yes   | Store the Y register value in memory  |
| adc        | Yes   | Add a value to the accumulator with the carry  |
| sbc        | Yes   | Subtract a value from the accumulator with the carry|
| and        | Yes   | Perform a bitwise AND on the accumulator  |
| ora        | Yes   | Perform a bitwise OR on the accumulator  |
| eor        | Yes   | Perform a bitwise XOR on the accumulator  |
| cmp        | Yes   | Compare accumulator with value  |
| cpx        | Yes   | Compare X register with value  |
| cpy        | Yes   | Compare Y register with value  |
| bit        | Yes   | Test bits in a memory location against the accumulator  |
| inc        | Yes   | Increment the value at the memory location by 1  |
| inx        | No    | Increment the X register by 1  |
| iny        | No    | Increment the Y register by 1  |
| dec        | Yes   | Decrement the value at the memory location by 1  |
| dex        | No    | Decrement the X register by 1  |
| dey        | No    | Decrement the Y register by 1  |
| bcc        | Yes   | Branch if carry is clear  |
| bcs        | Yes   | Branch if carry is set  |
| beq        | Yes   | Branch if zero flag is set  |
| bmi        | Yes   | Branch if negative flag is set  |
| bne        | Yes   | Branch if zero flag is clear  |
| bpl        | Yes   | Branch if negative flag is clear  |
| bvc        | Yes   | Branch if overflow flag is clear  |
| bvs        | Yes   | Branch if overflow flag is set  |
| jmp        | Yes   | Jump to a specified address  |
| jsr        | Yes   | Jump to a subroutine  |
| rts        | No    | Return from subroutine  |
| pha        | No    | Push accumulator onto the stack  |
| php        | No    | Push processor status onto the stack  |
| pla        | No    | Pull accumulator from the stack  |
| plp        | No    | Pull processor status from the stack  |
| tax        | No    | Transfer accumulator to X register  |
| tay        | No    | Transfer accumulator to Y register  |
| txa        | No    | Transfer X register to accumulator  |
| tya        | No    | Transfer Y register to accumulator  |
| tsx        | No    | Transfer stack pointer to X register  |
| txs        | No    | Transfer X register to stack pointer  |
| rol        | No    | Rotate bits left   |
| ror        | No    | Rotate bits right |
| lsr        | No    | Logical shift right  |
| lsl        | No    | Logical shift left  |
| wrt        | Yes   | Output directly |
| wrb        | Yes   | Output to the screen buffer |
| dsb        | No    | Display buffer |
| clb        | No    | Clear screen buffer |
| cls        | No    | Clear screen |
| ssb        | No    | Set screen to buffer |
# Notes:
- Some instructions may be broken or not function the same as the 6502
- Some instructions are missing I have removed some instructions like `rti` (Return Interupt) becuase they no longer have purpose in the emulator, others just havn't been implemented yet
- Registers and memory can hold values far greater than 256(Max byte size) but byte based instructions treat the values like a byte rotates are mostly effected
- The clock speed may be set to any value but values over 10 Million may cause your browser to severly lag or crash, becuase of this a warning is givin every time a value beyond this is set
