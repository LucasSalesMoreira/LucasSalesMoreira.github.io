const canvas = document.querySelector('canvas')
const context = canvas.getContext("2d")

canvas.width = 1600
canvas.height = 700

let jumpIntervalId = null
let velocityIntervalId = null
let gravityAvailable = false
let velocity = 4
const MAX_VELOCITY = 26
const MAX_COLISIONS = 3
let playerLoadCompleted = false
let cloudLoadCompleted = false

const song = new Audio('./audio/mixkit-game-level-music-689.wav')

canvas.addEventListener('click', () => {
    song.play()

    if (jumpIntervalId == null && !gravityAvailable) {
        gravityAvailable = false
        jumpIntervalId = setInterval(() => {
            player.y -= 2
        }, 5)
    }

    setTimeout(() => {
        clearInterval(jumpIntervalId)
        jumpIntervalId = null
        gravityAvailable = true
    }, 500)
})

const player = {
    x: 400,
    y: canvas.height - 165,
    w: 100,
    h: 200,
    isLiving: true,
    colisionsNumber: 0,
    images: [],
    imageIndex: 0,
    render: () => {
        context.drawImage(player.images[player.imageIndex], player.x, player.y, player.w, player.h)
        console.log(player.imageIndex)
        if (player.imageIndex === 9) {
            player.imageIndex = 0
        } else {
            player.imageIndex ++    
        }
    }    
}

const obstacle = {
    x: canvas.width,
    y: canvas.height - 50,
    w: 50,
    h: 50
}

const cloud = {
    x: canvas.width,
    y: -80,
    w: 600,
    h: 400,
    speed: 1,
    image: null,
    render: () => {
        context.drawImage(cloud.image, cloud.x, cloud.y, cloud.w, cloud.h)
        context.drawImage(cloud.image, cloud.x + 500, cloud.y, cloud.w, cloud.h)
        context.drawImage(cloud.image, cloud.x + 800, cloud.y, cloud.w, cloud.h)
        context.drawImage(cloud.image, cloud.x + 1000, cloud.y, cloud.w, cloud.h)
        
        context.drawImage(cloud.image, cloud.x, cloud.y, cloud.w, cloud.h)
        context.drawImage(cloud.image, cloud.x + 1300, cloud.y, cloud.w, cloud.h)
        context.drawImage(cloud.image, cloud.x + 1600, cloud.y, cloud.w, cloud.h)
        context.drawImage(cloud.image, cloud.x + 1900, cloud.y, cloud.w, cloud.h)

        context.drawImage(cloud.image, cloud.x, cloud.y, cloud.w, cloud.h)
        context.drawImage(cloud.image, cloud.x + 2300, cloud.y, cloud.w, cloud.h)
        context.drawImage(cloud.image, cloud.x + 2600, cloud.y, cloud.w, cloud.h)
        context.drawImage(cloud.image, cloud.x + 2800, cloud.y, cloud.w, cloud.h)

        if (cloud.x < canvas.width - 5000) {
            cloud.x = canvas.width
        } else {
            cloud.x -= cloud.speed
        }
    }
}

const loadPlayerImages = () => {
    const framesNumber = 10
    for (let i = 1; i <= framesNumber; i ++) {
        let image = new Image() 
        image.onload = () => {
            player.images.push(image)
            if (player.images.length === framesNumber) {
                playerLoadCompleted = true
                console.log(player.images.map((item) => item.src))
            }
        }
        image.src = `./img/frame_${i}.png`
    }
}

const loadCloudImage = () => {
    let image = new Image() 
    image.onload = () => {
        cloud.image = image
        cloudLoadCompleted = true
    }
    image.src = './img/cloud_2.png'
}

const renderObstacle = () => {
    context.fillStyle = '#000'
    context.fillRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h)
    if (obstacle.x >= obstacle.w * (- 1)) {
        obstacle.x -= 1 * velocity
    } else {
        obstacle.x = canvas.width
        obstacle.h = Math.floor(Math.random() * 100) + 5
        obstacle.y = canvas.height - obstacle.h
    }
}

const addGravity = () => {
    if ((player.y < canvas.height - 165) && gravityAvailable) {
        player.y += 10
    } else {
        gravityAvailable = false
    }
}

const startTimer = () => {
    velocityIntervalId = setInterval(() => {
        if (velocity < MAX_VELOCITY) {
            velocity += 2
        }
    }, 5000)

    setTimeout(() => {
        clearInterval(velocityIntervalId)
        alert('Fim do jogo')
    }, 60000 * 10)
}

const verifyColision = () => {
    let margin = -40
    if (obstacle.x < player.x + player.w + margin
        && obstacle.x + obstacle.w + margin > player.x 
        && obstacle.y < player.y + player.h + margin 
        && obstacle.y + obstacle.h + margin > player.y) {
            player.isLiving = false
            player.colisionsNumber += 1
            if (player.colisionsNumber <= MAX_COLISIONS) {
                setTimeout(() => {
                    obstacle.x = canvas.width
                    player.isLiving = true
                }, 1000)
            } else {
                alert('Game Over!!')
                location.reload()
            }
    }
}

const clear = () => {
    context.fillStyle = '#d43226'
    context.fillRect(0, 0, canvas.width, canvas.height)
}

const renderLoop = () => {
    const label = document.getElementById('colision-label')
    label.style.color = '#e6cecc'    
    label.innerHTML = `Número de colisões: ${player.colisionsNumber} / ${MAX_COLISIONS}<br/>Velocidade: ${velocity}`

    if (player.isLiving && playerLoadCompleted && cloudLoadCompleted) {
        clear()
        cloud.render()
        player.render()    
        addGravity()
        renderObstacle()
        verifyColision()
    }
    requestAnimationFrame(renderLoop)
}

const run = () => {
    startTimer()
    renderLoop()
}

loadCloudImage()
loadPlayerImages()

const btPlayGame = document.getElementById('bt-play')
btPlayGame.style.fontSize = '50px'
btPlayGame.style.padding = '50px'
btPlayGame.style.borderRadius = '30px'
btPlayGame.setAttribute('disabled', '')
btPlayGame.innerText = 'Carregando...'
setTimeout(() => {
    btPlayGame.innerHTML = 'PLAY GAME'
    btPlayGame.removeAttribute("disabled")    
}, 5000)

btPlayGame.addEventListener('click', () => {
    btPlayGame.style.visibility = 'hidden'
    song.play()
    run()
})