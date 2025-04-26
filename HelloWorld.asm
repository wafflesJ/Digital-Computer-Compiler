$0 = "Hello, World!"
.loop:
wrt #$0 X
lda #$0 X
cmp $0
beq end
inx
jmp loop
.end:
jmp end
