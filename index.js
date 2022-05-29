//resize canvas
const canvas=document.querySelector('canvas');
const c= canvas.getContext('2d');
 canvas.width=1024 //pixels
 canvas.height=576;

//draw rectangle on the canvas (start position, canvas width, canvas height)
c.fillRect(0,0,canvas.width, canvas.height)

const gravity =0.7
const background= new Sprite({
    position:{
        x:0,
        y:0
    },
    imageSrc:'./img/background.png'
})

const shop= new Sprite({
    position:{
        x:600,
        y:128
    },
    imageSrc:'./img/shop.png',
    scale:2.75,
    framesMax:6
})
const player = new Fighter({
    position:{
    x:0,
    y:0
    },
    velocity:{
    x:0,
    y:0
    },
    offset:{
    x:0,
    y:0
    },
    imageSrc:'./img/samuraiMack/Idle.png',
    framesMax:8,
    scale:2.5,
    offset:{
        x:215,
        y:157 
    },
    sprites:{
        idle:{
            imageSrc:'./img/samuraiMack/Idle.png', 
            framesMax:8,  
        },
        run:{
            imageSrc:'./img/samuraiMack/Run.png', 
            framesMax:8,  
        },
        jump:{
            imageSrc:'./img/samuraiMack/Jump.png', 
            framesMax:2,  
        },
        fall:{
            imageSrc:'./img/samuraiMack/Fall.png', 
            framesMax:2,  
        },
        attack1:{
            imageSrc:'./img/samuraiMack/Attack1.png', 
            framesMax:6,  
        }
    }
})


const enemy =new Fighter({
    position:{
    x:400,
    y:100
    },
    velocity:{
    x:0,
    y:0
    },
    color:'blue',
    offset:{
        x:-50,
        y:0
    }
}) 

console.log(player)
const keys={
    a:{
        pressed:false
    },
    d:{
        pressed:false
    },
    w:{
        pressed:false
    },
    ArrowRight:{
        pressed:false
    },
    ArrowLeft:{
        pressed:false
    },
    ArrowUp:{
        pressed:false
    }
}

decreaseTimer()
function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle='black'
    c.fillRect(0,0,canvas.width, canvas.height)
    background.update()
    shop.update()
    player.update()
   // enemy.update()

    player.velocity.x=0
    enemy.velocity.x=0

    //player movement
    if(keys.a.pressed && player.lastKey ==='a'){
        player.velocity.x=-5 //-5 pixels per frame
        player.switchSprite('run')
    }else if (keys.d.pressed && player.lastKey ==='d'){
        player.velocity.x=5
        player.switchSprite('run')
    }else{
        player.switchSprite('idle')
    }

    //player jumping
    if (player.velocity.y <0){
        player.switchSprite('jump')
    }else if(player.velocity.y>0){
        player.switchSprite('fall')
    }
 
    //enemy movement
    if(keys.ArrowLeft.pressed && enemy.lastKey ==='ArrowLeft'){
        enemy.velocity.x=-5
    }else if (keys.ArrowRight.pressed && enemy.lastKey ==='ArrowRight'){
        enemy.velocity.x=5
    }

    //detect for collision
    if(
        rectangularCollision({
            rectangle1:player,
            rectangle2:enemy
        })
        && player.isAttacking
        ){
        player.isAttacking=false
        enemy.health -=20
        document.querySelector('#enemyHealth').style.width=enemy.health +'%'
    }
    if(
        rectangularCollision({
            rectangle1:enemy,
            rectangle2:player
        })
        && enemy.isAttacking
        ){
        enemy.isAttacking=false
        player.health -=20
        document.querySelector('#playerHealth').style.width=player.health +'%'
    }

    //end game based on health
    if(enemy.health <=0 || player.health <=0){
        determineWinner({player,enemy,timerId})
    }
}

animate()

window.addEventListener('keydown',(event)=>{
    switch(event.key){
        case 'd':
            keys.d.pressed=true
            player.lastKey='d'
            break
        case 'a':
            keys.a.pressed=true
            player.lastKey='a'
            break
        case 'w':
            keys.w.pressed=true
            player.velocity.y=-20
            break
        case ' ':
            player.attack()
            break

        //enemy keys
        case 'ArrowRight':
            keys.ArrowRight.pressed=true
            enemy.lastKey='ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed=true
            enemy.lastKey='ArrowLeft'
            break
        case 'ArrowUp':
            keys.ArrowUp.pressed=true
            enemy.velocity.y=-20
            break
        case 'ArrowDown':
            enemy.isAttacking=true
            break
    }
})

window.addEventListener('keyup',(event)=>{
    switch(event.key){
        case 'd':
            keys.d.pressed=false
            break
        case 'a':
            keys.a.pressed=false
            break
        case 'w':
            keys.w.pressed=false
            lastKey='w'
            break
    }
        //enemy keys
    switch(event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed=false
            break
         case 'ArrowLeft':
            keys.ArrowLeft.pressed=false
            break
        }
})