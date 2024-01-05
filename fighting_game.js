const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7


const background = new sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './image/background/L1.png',
    scale: 3.2
})

const tree = new sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './image/background/L2.png',
    scale: 2
})

const fronttree = new sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './image/background/L3.png',
    scale: 3.2
})

const road = new sprite({
    position: {
        x: 0,
        y: 500
    },
    imageSrc: './image/background/road.png',
    scale: .25
})


const fence1 = new sprite({
    position: {
        x: 70,
        y: 445
    },
    imageSrc: './image/background/fence_1.png',
    scale: 3.8
})

const fence2 = new sprite({
    position: {
        x: 355,
        y: 445
    },

    imageSrc: './image/background/fence_1.png',
    scale: 3.8
})

const shop = new sprite({
    position: {
        x: 650,
        y: 138
    },
    imageSrc: './image/background/shop.png',
    scale: 3,
    frameMax: 6,
    frameCurrent: 1
})
const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './image/background/Idle.png',
    frameMax: 8,
    scale: 2.8,
    offset: { x: 215, y: 158 },
    sprites: {
        idle: {
            imageSrc: './image/background/Idle.png',
            frameMax: 8
        },
        run: {
            imageSrc: './image/background/Run.png',
            frameMax: 8
        },
        jump: {
            imageSrc: './image/background/Jump.png',
            frameMax: 2
        },
        fall: {
            imageSrc: './image/background/Fall.png',
            frameMax: 2
        },
        attack1: {
            imageSrc: './image/background/Attack1.png',
            frameMax: 6
        },
        takeHit: {
            imageSrc: './image/background/Take Hit.png',
            frameMax: 4
        },
        death: {
            imageSrc: './image/background/Death.png',
            frameMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 200,
        height: 50
    }
})

const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './image/background/kenji/Idle.png',
    frameMax: 4,
    scale: 2.8,
    offset: { x: 215, y: 158 },
    sprites: {
        idle: {
            imageSrc: './image/background/kenji/Idle.png',
            frameMax: 4
        },
        run: {
            imageSrc: './image/background/kenji/Run.png',
            frameMax: 8
        },
        jump: {
            imageSrc: './image/background/kenji/Jump.png',
            frameMax: 2
        },
        fall: {
            imageSrc: './image/background/kenji/Fall.png',
            frameMax: 2
        },
        attack1: {
            imageSrc: './image/background/kenji/Attack1.png',
            frameMax: 4
        },
        takeHit: {
            imageSrc: './image/background/kenji/Take hit.png',
            frameMax: 3
        },
        death: {
            imageSrc: './image/background/kenji/Death.png',
            frameMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}


decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = "black"
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    fronttree.update()
    fence1.update()
    fence2.update()
    shop.update()
    player.update()
    enemy.update()
    road.update()


    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movement
    if (keys.a.pressed && player.lastkey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastkey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    // player jumping

    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    // enemy movement

    if (keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    if (rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking && player.frameCurrent === 4) {
        enemy.takeHit()
        player.isAttacking = false
        if (player.health < 100) { player.health += 10 }
        document.querySelector('#enemy-health').style.width = enemy.health + '%'
        document.querySelector('#player-health').style.width = player.health + '%'
    }

    if (player.isAttacking && player.frameCurrent === 4) {
        player.isAttacking = false
    }

    if (rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking && enemy.frameCurrent === 2) {
        player.takeHit()
        enemy.isAttacking = false

        if (enemy.health < 100) { enemy.health += 10 }
        document.querySelector('#player-health').style.width = player.health + '%'
        document.querySelector('#enemy-health').style.width = enemy.health + '%'
    }

    if (enemy.isAttacking && enemy.frameCurrent === 2) {
        enemy.isAttacking = false
    }

    if (player.health === 0 || enemy.health === 0) {
        determineWinner({ player, enemy, timerId })
    }
}

animate()

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            player.lastkey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastkey = 'a'
            break
        case 'w':
            player.velocity.y = -20
            break

        case ' ':
            player.attack()
            break

        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastkey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastkey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -20
            break
        case 'ArrowDown':
            enemy.attack()
            break
    }
    console.log(event.key)
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'w':
            keys.w.pressed = false
            break

        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            break
        case 'ArrowDown':
            keys.ArrowDown.pressed = false
            break

    }
    console.log(event.key)
})