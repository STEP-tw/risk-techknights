let svg = document.getElementById('mySvg');
let worldDiv = document.createElement('div');
for (let territoryPath in territoriesPath) {
  let pathTag = `<a id="${territoryPath}" onclick="changeColor()"> 
    <path d="${territoriesPath[territoryPath]}"></path></a>`;
  worldDiv.append(pathTag);
}
a = worldDiv.innerText;


let lineDivs = document.createElement('div');
Object.keys(seaLine).forEach(line => {
  let line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line1.id = line;
  line1.setAttributeNS("http://www.w3.org/2000/svg", "x1", seaLine[line].x1);
  line1.setAttributeNS("http://www.w3.org/2000/svg", "x2", seaLine[line].x2);
  line1.setAttributeNS("http://www.w3.org/2000/svg", "y1", seaLine[line].y1);
  line1.setAttributeNS("http://www.w3.org/2000/svg", "y2", seaLine[line].y2);
  lineDivs.append(line1);
});
svg.innerHTML = lineDivs.innerHTML + a;

i=1;
const changeColor = function () {
  let x = +event.target.parentElement.childNodes[3].textContent;
x++;
event.target.parentElement.childNodes[3].textContent = x;
  if(i%2 == 0){
  event.target.style.fill = "#ff0000"
  }
  else {
  event.target.style.fill = "forestgreen"
  }
  i++;
}

const addText = function (p) {
  let territoryName = p.parentElement.id;
  let t = document.createElementNS("http://www.w3.org/2000/svg", "text");
  let x = territoriesCoordinates[territoryName].x;
  let y = territoriesCoordinates[territoryName].y;
  t.setAttribute("transform", "translate(" + x + " " + y + ")");
  t.style.fill = "brown";
  t.style.textAnchor = "middle";
  t.textContent = p.parentElement.id.replace(/_/g, ' ');
  t.setAttribute("font-size", "8");

  p.parentNode.insertBefore(t, p.nextSibling);
  
  y = y + 12
  let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("transform", "translate(" + x + " " + y + ")");
  text.textContent = '5';
  text.setAttribute("font-size", "8");
  text.style.textAnchor = "middle";
  p.parentNode.insertBefore(text, p.nextSibling);
  
  y = y-2.5
  let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("transform", "translate(" + x + " " + y + ")");
  circle.setAttribute('r', 8);
  circle.style.fill = "white";
  p.parentNode.insertBefore(circle, p.nextSibling);
}
let paths = document.querySelectorAll("path");
paths.forEach((x) => { addText(x) }); 