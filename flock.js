// Class Flock wich contains a list of flocks
class Flock {
    constructor() {
        this.boids = []; // An array that constains all the boids in the Flock
    }

    addBoid(boid){
        this.boids.push(boid);
    }

    run(){
        this.boids.forEach((boid) => boid.run(this.boids));
    }

    render(){
        this.boids.forEach((boid) => boid.render());
    }
}