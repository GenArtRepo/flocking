// Class Boid 
class Boid {
    constructor(x, y) {
         //The position is stored in a vector
        this.position = createVector(x, y);
        // It starts heading to a random direction
        this.velocity = createVector(random(-1,1), random(-1,1)); 
        // Null Acelleration
        this.acceleration = createVector(0, 0); 
        // Triangule figure base
        this.base = 10; 
        // Maximun distance of view 
        this.neighbordist = 50;


        this.maxspeed = 3; // Maximum speed
        this.maxforce = 0.05; // Maximum steering force
    }

    // Separation
    // ======================
    // This method checks for nearby boids and calculates the force applied as the weigthed average 
    // of all the vectors that steer away the boid from each of the other boids.
    separate(boids){
        let desiredseparation = 25;
        let steer = createVector(0, 0);
        let count = 0;

        // For every boid in the system, check if it's too close and calculate the steer
        boids.forEach((boid) => {
            // Calculate the distance
            let distance = p5.Vector.dist(this.position, boid.position) 
            if ((distance > 0) && (distance < desiredseparation)) {
                // Calculate vector pointing away from neighbor
                let diff = p5.Vector.sub(this.position, boid.position); 
                diff.normalize();       // Keep just the direction
                diff.div(distance);     // Weight by distance
                steer.add(diff);  
                count++;                // Keep track of how many
            }
        });

        // Average -- divide by how many
        if (count > 0) {
            steer.div(count);
        }

        // As long as the vector is greater than 0
        // Implement Reynolds: Steering = Desired - Velocity
        if (steer.mag() > 0) {
            steer.normalize();
            steer.mult(this.maxspeed);
            steer.sub(this.velocity);
            steer.limit(this.maxforce);
        }

        return steer;
    }


    // Alignment
    // ======================
    // For every nearby boid in the system, calculate the steer  towards the average heading of 
    // neighbours.
    alignment(boids){
        let sum = createVector(0,0);
        let count = 0;
        boids.forEach((boid) => {
            // Calculate the distance
            let distance = p5.Vector.dist(this.position, boid.position);
            if ((distance > 0) && (distance < this.neighbordist)) {
                sum.add(boid.velocity);         // Add the boid vel
                count++;                        // Keep track of how many
            }
        })

         // Implement Reynolds: Steering = Desired - Velocity
        if (count > 0) {
            sum.div(count);
            sum.normalize();
            sum.mult(this.maxspeed);
           
            let steer = p5.Vector.sub(sum, this.velocity);
            steer.limit(this.maxforce);
            return steer;
        } else {
            return createVector(0, 0);
        }
    }

    // Cohesion
    // ======================
    // For the average location (i.e. center) of all nearby boids, calculate steering vector towards 
    // that location
    cohesion(boids){
        let target = createVector(0, 0);   // Start with empty vector to accumulate all locations
        let count = 0;

        boids.forEach((boid) => {
            // Calculate the distance
            let distance = p5.Vector.dist(this.position, boid.position);
            if ((distance > 0) && (distance < this.neighbordist)) {
                target.add(boid.position); // Add location
                count++;
            }
        })

        // Implement Reynolds: Steering = Desired - Velocity
        if (count > 0) {
            target.div(count);
            // A vector pointing from the location to the target
            let desired = p5.Vector.sub(target, this.position);  
            // Normalize desired and scale to maximum speed
            desired.normalize();
            desired.mult(this.maxspeed);
            let steer = p5.Vector.sub(desired, this.velocity);
            steer.limit(this.maxforce);  // Limit to maximum steering force
            return steer;
        } else {
            return createVector(0, 0);
        }
    }

 
    applyForce(force){
        this.acceleration.add(force);  // We could add mass here if we want A = F / M
    }

    computeRules(boids){
        // Rules of flock
        // ======================
        // 1. Separate
        let sep_force = this.separate(boids);
        // 2. Alignment
        let ali_force = this.alignment(boids);
        // 3. Cohesion
        let coh_force = this.cohesion(boids);

        // Arbitrarily weight these forces
        sep_force.mult(settings.Sep);
        ali_force.mult(settings.Alig);
        coh_force.mult(settings.Coh);

        this.applyForce(sep_force);
        this.applyForce(ali_force);
        this.applyForce(coh_force);
    }    

    // Method to update location
    update() {
        this.velocity.add(this.acceleration); // Update velocity
        this.velocity.limit(this.maxspeed);  // Limit speed
        this.position.add(this.velocity); // Update postion
        this.acceleration.mult(0); // Reset accelertion to 0 each cycle
    }

    // Method to Wraparound the enviroment
    borders() {
        if (this.position.x < -this.base)  this.position.x = width + this.base;
        if (this.position.y < -this.base)  this.position.y = height + this.base;
        if (this.position.x > width + this.base) this.position.x = -this.base;
        if (this.position.y > height + this.base) this.position.y = -this.base;
    }
  
    // This function draws a triangule in the direction that the boid is heading
    render(){ 
        fill("#006DAE");
        stroke("#006DAE");
        push();
        translate(this.position.x, this.position.y); // translate the reference axis to the boid position
        rotate(this.velocity.heading()); // rotate the reference axis to the boid direction
        triangle(this.base*3/2, 0, 0, -this.base/2, 0, this.base/2);
        pop();
    }

    run(boids){
        this.computeRules(boids);
        this.update();
        this.borders();
    }
}