var fondoJuego;
var nave;
var cursores;
var balas;
var tiempoBala = 0;
var botonDisparo;
var enemigos;
var juego = new Phaser.Game(370, 550, Phaser.CANVAS, 'bloque_juego');
var puntos = 0;
var puntosText;
var estadoPrincipal = {
  preload: function() {
    juego.load.image('fondo', 'img/space.png');
    juego.load.image('personaje', 'img/nave.png');
    juego.load.image('laser', 'img/laser.png');
    juego.load.image('enemigo', 'img/pajaro2.png');
    juego.load.audio('disparo', 'audio/disparo.wav');
    juego.load.audio('explosion', 'audio/explosion.wav');
  },

  create: function() {
    fondoJuego = juego.add.tileSprite(0, 0, 370, 550, 'fondo');

    nave = juego.add.sprite(juego.width / 2, 500, 'personaje');
    nave.anchor.setTo(0.5);

    cursores = juego.input.keyboard.createCursorKeys();
    botonDisparo = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    balas = juego.add.group();
    balas.enableBody = true;
    balas.physicsBodyType = Phaser.Physics.ARCADE;
    balas.createMultiple(20, 'laser');
    balas.setAll('anchor.x', 0.5);
    balas.setAll('anchor.y', 1);
    balas.setAll('outOfBoundsKill', true);
    balas.setAll('checkWorldBounds', true);

    enemigos = juego.add.group();
    enemigos.enableBody = true;
    enemigos.physicsBodyType = Phaser.Physics.ARCADE;

    //crear enemigos y mostrarlos en pantalla
    for (var y = 0; y < 6; y++) {
      for (var x = 0; x < 7; x++) {
        var enemigo = enemigos.create(x * 40, y * 20, 'enemigo');
        enemigo.anchor.setTo(0.5);
      }
    }
    enemigos.x = 50;
    enemigos.y = 30;
    var animacion = juego.add.tween(enemigos).to({ x: 100 }, 1000, Phaser.Easing.Linear.None,
      true, 0, 1000, true);

    puntosText = juego.add.text(10, 530, 'Puntos: 0', { font: '16px Arial', fill: '#ffffff' });
	nombreText = juego.add.text(juego.width - 10, juego.height - 10, 'Diego Alonso Miñano Lavado', { font: '16px Arial', fill: '#ffffff' });
    nombreText.anchor.setTo(1, 0.5); 
    juego.sound.add('disparo');
    juego.sound.add('explosion');
  },

  update: function() {
    //animamos el juego
    if (cursores.right.isDown) {
      nave.position.x += 3;
    } else if (cursores.left.isDown) {
      nave.position.x -= 3;
    }

    if (botonDisparo.isDown && juego.time.now > tiempoBala) {
      var bala = balas.getFirstExists(false);
      if (bala) {
        bala.reset(nave.x, nave.y);
        bala.body.velocity.y = -300;
        tiempoBala = juego.time.now + 100;
        juego.sound.play('disparo');
      }
    }

    fondoJuego.tilePosition.y += 1; // Mueve el fondo hacia abajo

    juego.physics.arcade.overlap(balas, enemigos, colision, null, this);
}
};

function colision(bala, enemigo) {
bala.kill();
enemigo.kill();
puntos += 100;
puntosText.text = 'Puntos: ' + puntos;

juego.sound.play('explosion');

if (enemigos.countLiving() === 0) {
  var ganasteText = juego.add.text(juego.world.centerX, juego.world.centerY, 'GANASTE', {
	font: '32px Arial',
	fill: '#ffffff'
  });
  ganasteText.anchor.setTo(0.5);

  juego.time.events.add(Phaser.Timer.SECOND * 5, reiniciarJuego, this);
}
}

function reiniciarJuego() {
juego.state.start('principal');
puntos = 0;
}

juego.state.add('principal', estadoPrincipal);
juego.state.start('principal');
