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
After each mnemonic, depending on the type will be followed by a value, either an immediate, repsented by the `$` prefix, a memory address, represented by the `#$` prefix or a constant data, represented by the `##$`. Values can be is decimal, hex `0x` or binary `0b`.  
Instructions which have a value that can be an constant or memory address may also be followed by `X` or `Y`, at runtime their value will be ofset by the corresponding register's value  
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
| lda        | Yes   |11010000+data| Load a value into the accumulator from const |
| lda        | Yes   |01100000+address| Load a value into the accumulator from address |
| ldx        | Yes   |00110000+data| Load a value into X from const |
| ldx        | Yes   |11100000+address| Load a value into X from address |
| ldy        | Yes   |10110000+data| Load a value into Y from const |
| ldy        | Yes   |00010000+address| Load a value into Y from address |
| sta        | Yes   |11000000+address| Store the accumulator value in memory |
| stx        | Yes   |00100000+address| Store the X register value in memory  |
| sty        | Yes   |10100000+address| Store the Y register value in memory  |
| adc        | Yes   |01110000+data| Add a value to the accumulator with the carry const data |
| adc        | Yes   |10010000+address| Add a value to the accumulator with the carry memory data |
| sbc        | Yes   |11110000+data| Subtract a value from the accumulator with the carry const data|
| sbc        | Yes   |0101+address| Subtract a value from the accumulator with the carry memory data|
| cmp        | Yes   |00000000| Compare accumulator with value  |
| cpx        | Yes   |00000000| Compare X register with value  |
| cpy        | Yes   |00000000| Compare Y register with value  |
| inc        | Yes   |00000000| Increment the value at the memory location by 1  |
| inx        | No    |00000000| Increment the X register by 1  |
| iny        | No    |00000000| Increment the Y register by 1  |
| dec        | Yes   |00000000| Decrement the value at the memory location by 1  |
| dex        | No    |00000000| Decrement the X register by 1  |
| dey        | No    |00000000| Decrement the Y register by 1  |
| bcc        | Yes   |00000000| Branch if carry is clear  |
| bcs        | Yes   |00000000| Branch if carry is set  |
| beq        | Yes   |00000000| Branch if zero flag is set  |
| bmi        | Yes   |00000000| Branch if negative flag is set  |
| bne        | Yes   |00000000| Branch if zero flag is clear  |
| bpl        | Yes   |00000000| Branch if negative flag is clear  |
| jmp        | Yes   |00000000| Jump to a specified address  |
| jsr        | Yes   |00000000| Jump to a subroutine  |
| rts        | No    |00000000| Return from subroutine  |
| pha        | No    |00000000| Push accumulator onto the stack  |
| pla        | No    |00000000| Pull accumulator from the stack  |
| tax        | No    |00000000| Transfer accumulator to X register  |
| tay        | No    |00000000| Transfer accumulator to Y register  |
| txa        | No    |00000000| Transfer X register to accumulator  |
| tya        | No    |00000000| Transfer Y register to accumulator  |
| wrt        | Yes   |00000000| Output directly |
# Notes:
- Some instructions may be broken or not function the same as the 6502
- Some instructions are missing I have removed some instructions like `rti` (Return Interupt) becuase they no longer have purpose in the emulator, others just havn't been implemented yet
- Registers and memory can hold values far greater than 256(Max byte size) but byte based instructions treat the values like a byte rotates are mostly effected
- The clock speed may be set to any value but values over 10 Million may cause your browser to severly lag or crash, becuase of this a warning is givin every time a value beyond this is set
