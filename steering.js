/*
TODO:
-add new path elements (neighbors) to work in this class
-implement dijkstras

*/

var cnt = 0;
class Boid {
	constructor() {
		//vectors rooted @ (0, 0)
		this.position = createVector(60, 80);
		this.velocity = p5.Vector.random2D();
		//speed at which boids move
		this.velocity.setMag(random(2, 4));
		this.acceleration = createVector();
		//limit boid vector alignment / magnitude
		this.maxForce = 1;
		//set speed limit
		this.maxSpeed = 4;
		//false - rand  / true - follow mouse
		this.randOrFollow = 'random';
	}

	ifAtEdge(){
		if(this.position.x > width){
			this.position.x = 0;
		}
		else if(this.position.x < 0){
			this.position.x = width;
		}

		if(this.position.y > height){
			this.position.y = 0;
		}
		else if(this.position.y < 0){
			this.position.y = width;
		}
	}

	show(boidType){
		//bee
		if(boidType == 'Bee'){
			strokeWeight(10);
			stroke(255, 255, 0);
			point(this.position.x, this.position.y);

			//Adds velocity line to bee in order to view direction
			strokeWeight(2);
			stroke(255, 0, 0);
			line(this.position.x, this.position.y, 
				this.position.x + this.velocity.x*10, 
				this.position.y + this.velocity.y*10);
		}
		//Triangle
		else{
			
			let triangleSize = 12;

	        let x = this.position.x;
	        let y = this.position.y;
	        fill(51);
	        stroke(255);
	        push();
	        translate(x, y);
	        rotate(this.velocity.heading() - radians(90));
	        triangle(
	          0,
	          0,
	          triangleSize,
	          0,
	          triangleSize / 2,
	          triangleSize * 1.2
	        );
	        pop();
	    }

	}

	update() {
		this.position.add(this.velocity);
		this.velocity.add(this.acceleration);
		this.velocity.limit(this.maxSpeed);
		this.acceleration.mult(0);
	}

	avg(fellowBoids, vectorType){
		var inRange = 0;			//Flag to check if any boids were in the range at all
		//grab average velocity
		var avgVel = createVector();
		for(let i = 0; i < fellowBoids.length; i++){
			let distance = dist(
							this.position.x,
							this.position.y,
							fellowBoids[i].position.x,
							fellowBoids[i].position.y)
			//if in radius of 100 from boid
			if(this != fellowBoids[i] && (distance <= 50)){
				if(vectorType == 'cohesion'){
					avgVel.add(fellowBoids[i].position);
				}
				else if(vectorType == 'separation'){
					//vector pointing from other to me
					let differenceVector = p5.Vector.sub(this.position, fellowBoids[i].position);
					//have difference be inversely proportional to differenceVector
					differenceVector.div(distance * distance);
					avgVel.add(differenceVector);
					inRange++;
				}
				else if(vectorType == 'alignment'){
					avgVel.add(fellowBoids[i].velocity);
				}
				inRange++;
			}
		}

		if(inRange > 0){
			avgVel.div(inRange);

			if(vectorType == 'cohesion'){
				avgVel.sub(this.position);
			}

			avgVel.setMag(this.maxSpeed);
			avgVel.sub(this.velocity);
			avgVel.limit(this.maxForce);

		}
		return avgVel;
	}

	flock(fellowBoids, path, pointPath, neighbors){
		if(this.randOrFollow == 'random'){
			this.acceleration.mult(0);
			let alignment = this.avg(fellowBoids, 'alignment');
			let cohesion = this.avg(fellowBoids, 'cohesion');
			let separation = this.avg(fellowBoids, 'separation');
			//Since mass =1 then A = F/1
			this.acceleration.add(separation);
			this.acceleration.add(alignment);
			this.acceleration.add(cohesion);
		}
		else if(this.randOrFollow == 'pathInOrderOld'){
			//TODO: If within ~15 of the flower then move onto the next

			//follow points (start w/ first in list of pointPath)
			let pointLocation = path.pointPath
			let tmpPoint = createVector(pointLocation[cnt][0], pointLocation[cnt][1])
			let distance = dist(
							this.position.x,
							this.position.y,
							pointLocation[cnt][0],
							pointLocation[cnt][1])

			//if it's close enough to the flower
			if(distance <= 10){
				cnt++;
				if(cnt > pointLocation.length - 1)
					cnt = 0;
			}

			let direction = p5.Vector.sub(tmpPoint, this.position);
			direction.normalize();
			direction.mult(0.5);
			this.acceleration = direction;

			let alignment = this.avg(fellowBoids, 'alignment');
			let cohesion = this.avg(fellowBoids, 'cohesion');
			let separation = this.avg(fellowBoids, 'separation');
			//Since mass =1 then A = F/1
			this.acceleration.add(separation);
			this.acceleration.add(alignment);
		}
		//Default to this when press 'Go Bees'
		else if(this.randOrFollow == 'pathInOrder'){
			
			//var path = dijkstras(pointPath, neighbors, fellowBoids);
		}

	}

	dijkstras(){
		
	}
}