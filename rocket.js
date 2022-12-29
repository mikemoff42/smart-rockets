class Rocket {
  constructor(newGenes) {
    this.pos = createVector(width/2,height);
    this.vel = createVector(0,-0.5);
    this.acc = createVector();
    this.dist = Infinity;
    this.arrived = false;
    this.arrivedTime = dna;
    this.crashedTime = dna;
    this.genes = [];
    this.heading = 0;
    this.index =0;
    this.fitnessScore =0;
    
    if(!newGenes){
      for(let i=0;i<dna;i++){
        this.genes[i]=p5.Vector.random2D();
        this.genes[i].setMag(Mag);
      }
    } else{
      for(let i=0;i<dna;i++){
        this.genes[i] = newGenes[i]
      }
    }
    this.crashed = false;
      
  }
  setFitness(){
    let d=0,landed=0,crashtime=0;
    if (this.crashed)
      d = 1/(dist(this.pos.x,this.pos.y,target.x,target.y)) * 1000;
    else
      d = 3/(dist(this.pos.x,this.pos.y,target.x,target.y)) * 1000;
    crashtime = (this.crashedTime/dna) * 10;
    if (this.arrived){
      landed = 1000;
      landed+= (1 - (this.arrivedTime/dna))*200;
    }
    this.fitnessScore = d+landed+crashtime;
    
  }
  applyForce(force){
    this.acc.add(force);
  }
  update() {
    if(count<dna && !this.arrived && !this.crashed){
      this.applyForce(this.genes[count]);
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);
    } else if (this.arrived || this.crashed)
      this.vel.mult(0);
    
    this.checkCrash();
  }
  show() {
    if(!this.arrived || !this.crashed){
      this.heading = this.vel.heading();
    }
    rectMode(CENTER);
    push();
    translate(this.pos.x,this.pos.y);
    rotate(this.heading);
    //rect(0,0,50,8);
    image(head, 0, 0, 8, 8);
    pop();
  }
  
  checkCrash(){
    let d = dist(this.pos.x,this.pos.y,target.x,target.y);
    if (d < targetRadius && !this.arrived){
      this.heading = this.vel.heading();
      this.arrived = true;
      this.arrivedTime = count;
    }
    if(this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height && !this.crashed){
      this.crashed = true;
      this.crashedTime = count;
    }
    
    // for(let i=0;i<lineE.length;i++){
    //   if(this.pos.x > lineB[i].x && this.pos.x < lineE[i].x && this.pos.y > lineB[i].y - 8 && this.pos.y < lineB[i].y +8 && !this.crashed)
    //     this.crashed = true;
    //     this.crashedTime = count;
    // }
    
    
    for(let i=0;i<lineE.length;i++) {
      let t = p5.Vector.sub(lineB[i],lineE[i]);
      let a = t.y/t.x;
      let b = lineB[i].y - a * lineB[i].x;
      let c = a * this.pos.x + b - 5;
      let d = a * this.pos.x + b + 5;
      let y = this.pos.y;
      let x = this.pos.x;
      
      if (lineB[i].x < lineE[i].x){
        if (y > c && y < d && !this.crashed && x > lineB[i].x && x < lineE[i].x) {
          this.crashed = true;
          this.crashedTime = count;
        }
      } else if (y > c && y < d && !this.crashed && x < lineB[i].x && x > lineE[i].x) {
          this.crashed = true;
          this.crashedTime = count;
        }
    }
  }
}