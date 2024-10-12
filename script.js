window.addEventListener('DOMContentLoaded', () => {

  const $canv = document.getElementById('particle');

  // Create a universe
  const fireworks = new FireworksUniverseThingy($canv);

  // Start render loop
  fireworks.start();

  $canv.addEventListener('click', e => {

    // The coordinates of the click
    const coords = {};

    coords.x = e.pageX ||
    e.originalEvent.touches[0].pageX ||
    e.originalEvent.changedTouches[0].pageX || 0;
    coords.y = e.pageY ||
    e.originalEvent.touches[0].pageY ||
    e.originalEvent.changedTouches[0].pageY || 0;

    const speedMagnitude = 700;

    // Add a new particle source
    fireworks.addSource({

      // The gravity of the source
      gravity: 0.2,

      // The lower limit for the random velocity
      minVel: { x: -speedMagnitude, y: -speedMagnitude },
      // The upper limit for the random velocity
      maxVel: { x: speedMagnitude, y: speedMagnitude },

      // The source position
      position: {
        x: coords.x,
        y: coords.y } });


  });

  // Add a source at the bottom
  fireworks.addSource({
    gravity: 0.05,
    minVel: { x: -200, y: -400 },
    maxVel: { x: 200, y: -1000 },
    position: {
      x: window.innerWidth / 2,
      y: window.innerHeight } });


});



const getRandomNum = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);


class Particle {
  constructor(config) {
    this.position = config.position || { x: 0, y: 0 };
    this.velocity = config.velocity || { x: 0, y: 0 };
    this.size = config.size == undefined ? 10 : config.size;

    this.opacity = config.opacity || 1;

    this.color = [];
  }}



class ParticleSource {

  constructor(config) {

    this._minVel = config.minVel;
    this._maxVel = config.maxVel;
    this._position = config.position;
    this.gravity = config.gravity || .1;

    this.particles = [];
  }

  generateParticle() {

    this.particles.push(

    new Particle({

      // Initial position of the particle
      position: Object.assign({}, this._position),

      // Initial velocity(Randomly generated)
      velocity: {

        x: getRandomNum(this._minVel.x, this._maxVel.x) / 100,

        y: getRandomNum(this._minVel.y, this._maxVel.y) / 100 },


      // Random particle size
      size: getRandomNum(0, 200) / 100 }));


  }}





class FireworksUniverseThingy {

  constructor($canvas, dimens) {

    this._$canvas = $canvas;
    this._dimens = dimens || {};

    this._sources = [];

    this._resizeHandler = this._resizeHandler.bind(this);
    this._calcLoop = this._calcLoop.bind(this);
    this._renderLoop = this._renderLoop.bind(this);

    this._init();
  }

  _init() {

    // Window resize
    this._resizeHandler();
    window.addEventListener('resize', this._resizeHandler);

    this._ctx = this._$canvas.getContext('2d');
  }

  _resizeHandler() {

    this._$canvas.width = this._dimens.width = window.innerWidth;
    this._$canvas.height = this._dimens.height = window.innerHeight;
  }

  addSource(config) {

    this._sources.push(
    new ParticleSource(
    Object.assign(
    {
      dimens: this._dimens },
    config)));



  }

  start() {
    window.requestAnimationFrame(this._renderLoop);
    window.requestAnimationFrame(this._calcLoop);
  }


  // Update current state
  _calcLoop() {

    this._sources.forEach(source => {

      for (let i = 0; i < 5; i++)
      source.generateParticle();

      source.particles.forEach((particle, i) => {

        if (particle.opacity <= 0.1)
        source.particles.splice(i, 1);

        particle.position.x += particle.velocity.x;

        particle.position.y += particle.velocity.y;

        particle.velocity.y += source.gravity;

        particle.opacity -= 0.01;

        // particle.color[0]= getRandomNum(0, 255);
        particle.color[1] = getRandomNum(0, 255);
        particle.color[2] = getRandomNum(0, 255);
      });
    });

    window.requestAnimationFrame(this._renderLoop);
  }
  // Apply current state to canvas
  _renderLoop() {

    this._ctx.clearRect(0, 0, this._dimens.width, this._dimens.height);

    this._sources.forEach(source => {

      source.particles.forEach(particle => {

        this._ctx.beginPath();

        this._ctx.arc(particle.position.x, particle.position.y, particle.size, 0, 2 * Math.PI);

        this._ctx.fillStyle =
        `rgba( 255, ${particle.color[1]}, ${particle.color[2]}, ${particle.opacity})`;

        this._ctx.fill();
      });
    });

    window.requestAnimationFrame(this._calcLoop);
  }}