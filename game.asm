lda $136
dsp $0x0F0 #$136
.loop:
tay
key
cmp $1
beq A
cmp $23
beq W
cmp $4
beq D
cmp $19
beq S
tya
.doneDir:
dsp $0 #$0 X
tax
dsp $0x0F0 #$0 X
jmp loop
.A:
tya
sbc $1
jmp doneDir
.W:
tya
adc $16
jmp doneDir
.D:
tya
adc $1
jmp doneDir
.S:
tya
sbc $16
jmp doneDir
