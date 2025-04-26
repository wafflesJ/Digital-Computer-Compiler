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
| Instruction | Takes Value |Bits| Description |
|------------|-------|-------------|
| nop        | No    |0000000010| Does nothing |
| lda        | Yes   |000001001?| Load a value into the accumulator  |
| ldx        | Yes   |000000101?| Load a value into the X register  |
| ldy        | Yes   |000000011?| Load a value into the Y register  |
| sta        | Yes   |0010000010| Store the accumulator value in memory |
| stx        | Yes   |0001000010| Store the X register value in memory  |
| sty        | Yes   |0000100010| Store the Y register value in memory  |
| adc        | Yes   |0010000000| Add a value to the accumulator with the carry  |
| sbc        | Yes   |0000000000| Subtract a value from the accumulator with the carry|
| and        | Yes   |0000000000| Perform a bitwise AND on the accumulator  |
| ora        | Yes   |0000000000| Perform a bitwise OR on the accumulator  |
| eor        | Yes   |0000000000| Perform a bitwise XOR on the accumulator  |
| cmp        | Yes   |0000000000| Compare accumulator with value  |
| cpx        | Yes   |0000000000| Compare X register with value  |
| cpy        | Yes   |0000000000| Compare Y register with value  |
| bit        | Yes   |0000000000| Test bits in a memory location against the accumulator  |
| inc        | Yes   |0000000000| Increment the value at the memory location by 1  |
| inx        | No    |0000000000| Increment the X register by 1  |
| iny        | No    |0000000000| Increment the Y register by 1  |
| dec        | Yes   |0000000000| Decrement the value at the memory location by 1  |
| dex        | No    |0000000000| Decrement the X register by 1  |
| dey        | No    |0000000000| Decrement the Y register by 1  |
| bcc        | Yes   |0000000000| Branch if carry is clear  |
| bcs        | Yes   |0000000000| Branch if carry is set  |
| beq        | Yes   |0000000000| Branch if zero flag is set  |
| bmi        | Yes   |0000000000| Branch if negative flag is set  |
| bne        | Yes   |0000000000| Branch if zero flag is clear  |
| bpl        | Yes   |0000000000| Branch if negative flag is clear  |
| bvc        | Yes   |0000000000| Branch if overflow flag is clear  |
| bvs        | Yes   |0000000000| Branch if overflow flag is set  |
| jmp        | Yes   |0000000000| Jump to a specified address  |
| jsr        | Yes   |0000000000| Jump to a subroutine  |
| rts        | No    |0000000000| Return from subroutine  |
| pha        | No    |0000000000| Push accumulator onto the stack  |
| php        | No    |0000000000| Push processor status onto the stack  |
| pla        | No    |0000000000| Pull accumulator from the stack  |
| plp        | No    |0000000000| Pull processor status from the stack  |
| tax        | No    |0000000000| Transfer accumulator to X register  |
| tay        | No    |0000000000| Transfer accumulator to Y register  |
| txa        | No    |0000000000| Transfer X register to accumulator  |
| tya        | No    |0000000000| Transfer Y register to accumulator  |
| tsx        | No    |0000000000| Transfer stack pointer to X register  |
| txs        | No    |0000000000| Transfer X register to stack pointer  |
| rol        | No    |0000000000| Rotate bits left   |
| ror        | No    |0000000000| Rotate bits right |
| lsr        | No    |0000000000| Logical shift right  |
| lsl        | No    |0000000000| Logical shift left  |
| wrt        | Yes   |0000000000| Output directly |
| wrb        | Yes   |0000000000| Output to the screen buffer |
| dsb        | No    |0000000000| Display buffer |
| clb        | No    |0000000000| Clear screen buffer |
| cls        | No    |0000000000| Clear screen |
| ssb        | No    |0000000000| Set screen to buffer |
# Notes:
- Some instructions may be broken or not function the same as the 6502
- Some instructions are missing I have removed some instructions like `rti` (Return Interupt) becuase they no longer have purpose in the emulator, others just havn't been implemented yet
- Registers and memory can hold values far greater than 256(Max byte size) but byte based instructions treat the values like a byte rotates are mostly effected
- The clock speed may be set to any value but values over 10 Million may cause your browser to severly lag or crash, becuase of this a warning is givin every time a value beyond this is set
