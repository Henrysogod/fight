const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const backgroundurl = './resources/background/background.png';

canvas.width = 1024
canvas.height = 576

c.clearRect(0, 0, canvas.width, canvas.height)

const gravity = 0.2

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  width: "1024px",
  height: "586px",
  imageSrc: backgroundurl,
  scale: 3.25
})

const shop = new Sprite({
  position: {
    x: 600,
    y: 128
  },
  width: "1024px",
  height: "586px",
  imageSrc: './resources/decorations/shop_anim.png',
  scale: 2.75,
  framesMax: 6
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
  imageSrc: './samuraiMack/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157
  },
  sprites: {
    idle: {
      imageSrc: './samuraiMack/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './samuraiMack/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './samuraiMack/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './samuraiMack/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './samuraiMack/Attack1.png',
      framesMax: 6
    },
    takeHit: {
      imageSrc: './samuraiMack/Take Hit.png',
      framesMax: 4
    }
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50
    },
    width: 160,
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
    x: -50,
    y: 0
  },
  imageSrc: './kenji/Idle.png',
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167
  },
  sprites: {
    idle: {
      imageSrc: './kenji/Idle.png',
      framesMax: 4
    },
    run: {
      imageSrc: './kenji/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './kenji/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './kenji/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './kenji/Attack1.png',
      framesMax: 6
    },
    takeHit: {
      imageSrc: './kenji/Take hit.png',
      framesMax: 3
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

console.log(player)

const keys = {

  player: { up: 'w', left: 'a', right: 'd' },
  enemy: { up: 'ArrowUp', left: 'ArrowLeft', right: 'ArrowRight' },


  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}
let lastKey



decreseTimer()

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  shop.update()
  c.fillStyle = 'gray'
  c.fillRect(0, 478, canvas.width, 100)
  c.fillStyle = 'rgba(255, 255, 255, 0.15)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()
  
  player.velocity.x = 0
  enemy.velocity.x = 0

  //player movement
  
  if (keys.a.pressed && lastKey === 'a') {
    player.velocity.x = -5
    player.switchSprite('run')
  } else if (keys.d.pressed && lastKey === 'd') {
    player.velocity.x = 5
    player.switchSprite('run')
  } else {
    player.switchSprite('idle')
  }
  //jumping
  if (player.velocity.y < 0) {
    player.switchSprite('jump')
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall')
  }

  //enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -5
    enemy.switchSprite('run')
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 5
    enemy.switchSprite('run')
  } else {
    enemy.switchSprite('idle')
  }
  //jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump')
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall')
  }

  //detect for collision & enemy gets hit
  if (rectanglarCollision({
    rectangle1: player,
    rectangle2: enemy
  }) &&
    player.isAttacking && player.framesCurrent === 4
    ) {
    enemy.takeHit()
    player.isAttacking = false
    
    gsap.so('#playerHeath', {
      width: player.health + '%'
    })
  }

  //if player misses
  if (player.isAttacking && player.framesCurrent === 4){
    player.isAttacking = false
  }

  if (rectanglarCollision({
    rectangle1: enemy,
    rectangle2: player
  }) &&
    enemy.isAttacking && enemy.framesCurrent === 2
    ) {
      player.takeHit()
    enemy.isAttacking = false
    
    document.querySelector('#playerHealth').style.width = player.health + '%'
  }

  //if enemy misses
  if (enemy.isAttacking && enemy.framesCurrent === 2){
    enemy.isAttacking = false
  }

  //end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determindWinner({ player, enemy, timerId })
  }
}

animate()



window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case keys.player.right:
      keys.d.pressed = true
      lastKey = 'd'
      break;
    case 'a':
      keys.a.pressed = true
      lastKey = 'a'
      break;
    case 'w':
      player.velocity.y = -10
      break;
    case ' ':
      player.attack()
      player.isAttacking = true
      break;

    case 'ArrowRight':
      keys.ArrowRight.pressed = true
      enemy.lastKey = 'ArrowRight'
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
      enemy.lastKey = 'ArrowLeft'
      break;
    case 'ArrowUp':
      enemy.velocity.y = -10
      break;
    case 'ArrowDown':
      enemy.attack()
      enemy.isAttacking = true
      break
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break;
    case 'a':
      keys.a.pressed = false
      break;
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break;
  }
})
