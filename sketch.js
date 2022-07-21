/*
** Flocking
* Cristian Rojas Cardenas, April 2022
* Algorithm based on the P5 implementation.
* See the example here: 
* https://p5js.org/examples/simulate-flocking.html
* 
* The algorithm generates a flock of boids that interact in a wraparound area predefined.
* The boids are generated with a random magnitude and direction of velocity.
* Each boid can sense the positioning of the other boids and change his behavior accordingly.
* The boid’s behavior is defined under the next rules:
*
*       - Separation:   Steer to avoid colliding with your neighbors.
*                       For each boid check for nearby boids and calculate the force to apply as 
*                       the weighted average of all the vectors that steers it away from the others.
*
*       - Alignment:    Steer in the same direction as your neighbors.
*                       For every nearby boid in the system, apply a force towards the average
*                       heading of neighbours in a given distance.
*
*       - Cohesion:     Steer towards the center of your neighbors (stay with the group).
*                       For the average location (i.e. center) of all nearby boids, apply a force 
*                       towards that location.
*
*
* In this example, we start by defining the grid in the setup function.
* Then, the initial state of the cells is defined by the random function or user 
* modification of the map.
* The generate function updates the grid through the rules every timestep (frame). 
*/

let play = true;
let width;
let height;
let flock;

// Settings, values used in the algorithm execution
let settings = { 
  Play: function(){ play=true; },
  Pause: function(){ play=false; },
  Reset: function(){ init() },
  n: 50,
  Sep: 1,
  Alig: .5, 
  Coh: .5,
};

function gui(){
    // Adding the GUI menu
    var gui = new dat.GUI();
    gui.width = 150;
    gui.add(settings,'Play');
    gui.add(settings,'Pause');
    gui.add(settings,'Reset');
    gui.add(settings, 'n', 1, 200).onChange((value) => setFlocks(value));
    gui.add(settings,'Sep', 0, 1).step(0.1);
    gui.add(settings,'Alig', 0, 1).step(0.1);
    gui.add(settings,'Coh', 0, 1).step(0.1);
};

function setup() {
    gui();
    createCanvas(720, 400);
    width = this.width;
    height = this.height;    

    // Initialize the env
    init();

}

function init(){
    
    flock = new Flock();
    // Add an initial set of boids into the system
    for (let i = 0; i < 50; i++) {
        let boid = new Boid(width/2, height/2);
        flock.addBoid(boid);
    }
}

function draw(){
    background(255);
    frameRate(60);

    // External borders
    stroke(0);
    fill(255);
    rect(0, 0, width, height);
    
    // Executes the flock behaviour
    if (play) flock.run();
    // Render the flock
    flock.render();
    
}

function setFlocks(new_lenght){
    if(new_lenght > flock.boids.length){
        for (let i = 0; i < new_lenght - flock.boids.length; i++) {
            x = Math.floor(Math.random() * width);
            y = Math.floor(Math.random() * height);
            flock.addBoid(new Boid(x, y));
        }
    }else
        flock.boids = flock.boids.slice(0, new_lenght);
}