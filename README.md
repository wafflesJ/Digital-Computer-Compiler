# Digital Logic Simulation Computer Compilier 
An compilier for a computer built in Sebastian Lague's digital logic simulation with a build in editor.
This is a fork of my origanal [6502 Emulator](https://github.com/wafflesJ/6502-Emulator) but modified to output binary for my computer inside of the simulation. I plan to update the emulator to work with this version but as this is still in developement the emulator is currently disabled.
The link to the compilier is [here](https://wafflesj.github.io/Digital-Computer-Compiler/)

- 256 Bytes Memory
- A, X and Y Registers
- Compiled Binary output
  
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
|------------|-------|--------|-------------|
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
| cmp        | Yes   |11000110 00000000 followed by cmp value (+00000001 if mem)| Compare accumulator with value  |
| cpx        | Yes   |00100110 00000000 followed by cmp value (+00000001 if mem)| Compare X register with value  |
| cpy        | Yes   |10100110 00000000 followed by cmp value (+00000001 if mem)| Compare Y register with value  |
| inc        | Yes   |10000000+address| Increment the value at the memory location by 1  |
| inx        | No    |10000010 01000000| Increment the X register by 1  |
| iny        | No    |10000010 00100000| Increment the Y register by 1  |
| dec        | Yes   |01000010+address| Decrement the value at the memory location by 1  |
| dex        | No    |01000010 01000000 | Decrement the X register by 1  |
| dey        | No    |00000000 00100000 | Decrement the Y register by 1  |
| bcc        | Yes   |10001010 00010000 followed by line| Branch if carry is clear  |
| bcs        | Yes   |00001010 00010000 followed by line| Branch if carry is set  |
| beq        | Yes   |00101010 00010000 followed by line| Branch if zero flag is set  |
| bmi        | Yes   |11001010 00010000 followed by line| Branch if negative flag is set  |
| bne        | Yes   |10101010 00010000 followed by line| Branch if zero flag is clear  |
| bpl        | Yes   |11001010 00010000 followed by line| Branch if negative flag is clear  |
| jmp        | Yes   |00000010 00010000 followed by line| Jump to a specified address  |
| jsr        | Yes   |00000010 00001000 followed by current line then jmp| Jump to a subroutine  |
| rts        | No    |00000010 00010000 followed by 00000000 00001000| Return from subroutine  |
| pha        | No    |01000010 00001000| Push accumulator onto the stack  |
| pla        | No    |01100010 00001000| Pull accumulator from the stack  |
| tax        | No    |11000010 01000000| Transfer accumulator to X register  |
| tay        | No    |11000010 00100000| Transfer accumulator to Y register  |
| txa        | No    |00100010 10000000| Transfer X register to accumulator  |
| tya        | No    |10100010 10000000| Transfer Y register to accumulator  |
| wrt        | Yes   |000000+2 bit location+8 bit address followed by 12 bits of data| Output directly |
# Notes:
- Some instructions have been removed such as interupts or bitwise operations
- There are lots of operations possible that do not have an instruction for them such as pushing data directly to the stack without the A register `00000010 0000100`
