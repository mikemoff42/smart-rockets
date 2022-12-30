const dna=500;
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
  createCanvas(900, 900);
  targetRadius = width/25;
  resetButton();
  Reset();

}

function draw() {
  background(0);
  drawOutline();
  setTarget();
  showRockets();
  showCount();
  regenRockets();
}

function drawOutline(){
  stroke(255,0,0);
  strokeWeight(width/150);
  line(0,0,width,0);
  line(0,0,0,height);
  line(0,height,width,height);
  line(width,0,width,height);
}
function resetButton(){
  resetsim = createButton('Reset');
  resetsim.mousePressed(clearBlockers);
  resetsim.size(width/10);
  resetsim.position(width - width/10,0);
  
  restartGen = createButton('Reset Gen');
  restartGen.mousePressed(restartGeneration);
  restartGen.size(width/10);
  restartGen.position(width - width/10,width-width/40);
}
function restartGeneration(){
  Reset();
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
      let maxF =0;
      let minT =dna;
      for(let i=0;i<rockets.length;i++){
        rockets[i].setFitness();
        if (rockets[i].fitnessScore > maxF) maxF = rockets[i].fitnessScore;
        if (rockets[i].arrivedTime < minT) minT = rockets[i].arrivedTime;

      }
      console.log('Max Fitness: '+ maxF);
      console.log('Best time: '+ minT);
      
      tempRockets = [];
      for (let i=0;i<rockets.length;i++){
        if (rockets[i].fitnessScore == maxF) rockets[i].fitnessScore+=200;
        for (let j=0;j<rockets[i].fitnessScore;j++){
          let t = new Rocket(rockets[i].genes);
          t.index = i;
          tempRockets.push(t);
        }
      }
      console.log(tempRockets.length);
      
      let tempS=0;
      for (let i=0;i<totalRockets;i++){
        let mom = random(tempRockets);
        let dad = random(tempRockets);
        let breakWhile=0;
        while (mom.index == dad.index && breakWhile < 10000){
          dad = random(tempRockets);
          breakWhile++;
          if (breakWhile>tempS) tempS = breakWhile;
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
      console.log("max loops: " + tempS);
      count=0;
      tempRockets = [];
      
  }
}

function showRockets(){  
  for (let i=0;i<rockets.length;i++) {
    rockets[i].update();
    rockets[i].show();
  }
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
  imageMode(CENTER);
  image(ship, target.x,target.y, targetRadius*2, targetRadius*1.25);
  stroke(255,0,0,150);
  createBlockers();

}
function createBlockers(){
  strokeWeight(width/90);
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
      //resetSim=true;
      linecounter++;
    } else
      lineComplete = true;
  }
}

function preload(){
  head = loadImage("head.png");
  ship = loadImage("ship.png");
}