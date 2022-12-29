const dna=400;
const Mag=0.12
let rockets=[];
let totalRockets = 250;
let count;
let generation;
let target;
let Child;
let targetRadius;
let lineX1,lineX2,lineY;
let head,ship;
let maxFitness,minFitness;

let tempRockets;

let linecounter=0;
let lineComplete=true;
let lineB=[];
let lineE=[];
let resetSim=false;


function setup() {
  createCanvas(600, 600);
  targetRadius = width/25;
  resetButton();
  Reset();

}

function draw() {
  background(0);
  
  setTarget();
  showRockets();
  showCount();
  regenRockets();

}
function resetButton(){
  resetsim = createButton('Reset');
  resetsim.mousePressed(clearBlockers);
  resetsim.size(width/10);
  resetsim.position(width - width/10,0);
}
function clearBlockers(){
  lineB=[];
  lineE=[];
  linecounter=0;
  Reset();
}

function Reset(){
  for (let i=0;i<totalRockets;i++){
    rockets[i] = new Rocket();
    rockets[i].index = i;
  }
  generation=1;
  count=0;
}

function regenRockets(){
    if (count > dna){
      for(let i=0;i<rockets.length;i++){
        rockets[i].setFitness();
        // let d;
        // if (rockets[i].arrived) rockets[i].dist=0.5 + (10/rockets[i].arrivedTime);
        // else {
        //   d=dist(rockets[i].pos.x,rockets[i].pos.y,target.x,target.y);
        //   rockets[i].dist = 4/d - (1-(rockets[i].crashedTime/dna))/100;
        // }
        // if(rockets[i].dist < 0) console.log("neg");
      }
      tempRockets = [];
      for (let i=0;i<rockets.length;i++){
        for (let j=0;j<rockets[i].fitnessScore;j++){
          let t = new Rocket(rockets[i].genes);
          t.index = i;
          tempRockets.push(t);
        }
      }
      console.log(tempRockets.length);
      for (let i=0;i<totalRockets;i++){
        let mom = random(tempRockets);
        let dad = random(tempRockets);
        let breakWhile=0;
        while (mom.index == dad.index && breakWhile < 10000){
          dad = random(tempRockets);
          breakWhile++;
          if(breakWhile>9999) console.log('no parents');
        }
        
        Child = [];
        for (let k=0;k<dna;k++){
          if (k%2 == 0) Child[k] = mom.genes[k];
          else Child[k] = dad.genes[k];
        }
        for (let k=0;k<dna;k++){
          if(random() < 0.02){
            Child[k]=p5.Vector.random2D();
            Child[k].setMag(Mag);
          }
        }
        rockets[i] = new Rocket(Child);
        rockets[i].index = i;
      }
      count=0;
      tempRockets = [];
      
  }
}

function showRockets(){  
  for (let i=0;i<rockets.length;i++) {
    rockets[i].update();
    rockets[i].show();
  }  
  // for (let i=rockets.length-1;i>=0;i--) {
  //   if (rockets[i].crashed){
  //     rockets.splice(i,1);
  //   }
  // }  
}

function showCount(){
  count++;
  textAlign(LEFT,BOTTOM);
  textSize(width*0.04);
  noStroke();
  fill(255);
  text(count,0,height);
  
  if (count > dna)
    generation++;
  textAlign(LEFT,TOP);
  text('Gen: '+generation,0,0);
}

function setTarget(){
  target = createVector(width/2,height*0.1);
  //circle(target.x,target.y,targetRadius);
  imageMode(CENTER);
  image(ship, target.x,target.y, targetRadius*2, targetRadius*1.5);
  stroke(255,0,0,150);
  createBlockers();

}
function createBlockers(){
  // lineX1=[];
  // lineX2=[];
  // lineY=[];
  // lineX1[0] = width/4;
  // lineX2[0] = width*0.75;
  // lineY[0] = height*0.65;
  
  for (let i=0;i<lineE.length;i++){
    line(lineB[i].x,lineB[i].y,lineE[i].x,lineE[i].y);
  }
  if(!lineComplete) line(lineB[linecounter].x,lineB[linecounter].y,mouseX,mouseY);
  if(resetSim){
    resetSim=false;
    Reset();
  }
}

function mousePressed(){
  if(!(mouseX<0 || mouseX > width || mouseY<0 || mouseY>height)){
    lineB[linecounter] = createVector(mouseX,mouseY);
    lineComplete = false;
  }
  
}
function mouseReleased(){
  if(!(mouseX<0 || mouseX > width || mouseY<0 || mouseY>height)){
    if (abs(lineB[linecounter].x - mouseX) > 5){
      lineE[linecounter] = createVector(mouseX,mouseY);
      lineComplete=true;
      resetSim=true;
      linecounter++;
    } else
      lineComplete = true;
  }
}

function preload(){
  head = loadImage("head.png");
  ship = loadImage("ship.png");
}