$100 = $3     ;Snake
$103 = $5 $50 ; ~75KHz
$105 = $2
$106 = ">"
$107 = "<^>v"
$115 = "Game Over!"
$126 = "Score: "
$53 = $1 $2 $3
$114 = $73
$136 = "Press To Begin"
ldx $136
jsr Print
ssb
ldx $0
.randBegin:
adc $1
and $0b11111111
cpx #$0xFC
beq randBegin
sta #$112
.main:
jsr draw
lda $50
.inputLoop:
pha
jsr getInput
pla
sbc $1
cmp $0
bne inputLoop
jsr updatePos
jmp main
.random:
lda #$112        ; Load the current value
rol
eor $0b00101110
and $0b11111111
rol
eor $0b10101101
and $0b11111111
rol
eor $0b11001010
and $0b11111111
sta #$112
rts
.getInput:
lda #$0xFC ;input
ldy $0
cmp "a"
beq setDir
ldy $1
cmp "w"
beq setDir
ldy $2
cmp "d"
beq setDir
ldy $3
cmp "s"
beq setDir
.doneInput:
rts
.setDir:
sty #$105
ldx #$107 Y
stx #$106
jmp doneInput
.updatePos:
lda #$104 ;head y
ldx #$103 ;head x
ldy #$105 ;direction
cpy $0
beq moveLeft
cpy $1
beq moveUp
cpy $2
beq moveRight
jmp moveDown
.doneMove:
sta #$104 ;head y
stx #$103 ;head x
stx #$102
adc #$102 ;combine x with y
cpx $10 ;outside right
beq end ;if not less (equal)
cpx $0
bmi end ;less then 0
tax
cpx #$114 ;compare to apple
beq eat
.doneEat:
ldy #$0 X
cpy $0
bcs end ;hit body
ldy #$100 ;length
sty #$0 X
rts
.moveLeft:
dex
jmp doneMove
.moveUp:
sbc $10
jmp doneMove
.moveRight:
inx
jmp doneMove
.moveDown:
adc $10
jmp doneMove
.eat:
inc #$100
stx #$113
jsr random
.mod:
sbc $99
cmp $99
bcs mod
adc $99
cmp $99
bcc skip
sbc $99
.skip:
sta $114
ldx #$113
jmp doneEat
.draw:
ldx $126
jsr Print
lda #$100 ;length
sbc $3
ldx $0
.subLoop:
cmp $9
bcc endSub
sbc $10
inx
jmp subLoop
.endSub:
adc $0x30
sta #$134
stx #$135
lda #$135
adc $0x30
sta #$135
wrb #$135
wrb #$134
wrb $10
wrb "+"
jsr line
wrb $10dw
wrb "|"
lda $0 ;y
ldx $0 ;x
.pixle:
cmp $100
beq return
sta #$101 ; save y
lda #$101
stx #$102 ;save x 
adc #$102 ; combine y with x
tax ; move index to X reg
ldy #$100 ;set check val
cpy #$0 X ; check map at index(X)
beq wrtHead
cpx #$114 ; check map at apple
beq wrtApple
ldy $0 ;set check val
cpy #$0 X ; check map at index(X)
bne wrtBody
wrb " "
nop
nop
nop
.doneWRT:
wrb " "
ldx #$102 ;restore x
lda #$101 ;restore y
inx
cpx $10 ;if x 10
beq shiftY
jmp pixle ;loop
.return:
jsr line
ssb
clb
rts
.shiftY:
adc $10
ldx $0
wrb "|"
wrb $10
wrb "|"
jmp pixle ; return loop
.wrtBody:
wrb "~"
dec #$0 X
jmp doneWRT
.wrtApple:
wrb "@"
jmp doneWRT
.wrtHead:
wrb #$106
dec #$0 X
jmp doneWRT
.line:
ldx $10
.lineLoop:
wrb "-"
wrb "-"
dex
cpx $0
bne lineLoop
wrb "+"
rts
.Print:
wrb #$0 X
lda #$0 X
cmp $0
beq returnSub
inx
jmp Print
.returnSub:
rts
.end:
clb
wrb $10
wrb $10
ldx $115
jsr Print
dsb
.endL:
jmp endL
