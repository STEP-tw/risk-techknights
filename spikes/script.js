let svg = document.getElementById("mySvg");
let worldDiv = document.createElement("div");
for (let territoryPath in territoriesPath) {
  let pathTag = `<a id="${territoryPath}" onclick="changeColor()"> 
	<path d="${territoriesPath[territoryPath]}"></path></a>`;
  worldDiv.append(pathTag);
}
svg.innerHTML = "<text x=500 y=150>Prince</text>";
svg.innerHTML += worldDiv.innerText;

const changeColor = function() {
  console.log("called");
};

const addText = function(path) {
  let territoryName = path.parentElement.id;
  let name = document.createElementNS("http://www.w3.org/2000/svg", "text");
  let xCoordinate = territoriesCoordinates[territoryName].x;
  let yCoordinate = territoriesCoordinates[territoryName].y;
  name.setAttribute("transform", `translate(${xCoordinate} ${yCoordinate})`);
  name.style.fill = "green";
  name.style.textAnchor = "middle";
  name.textContent = path.parentElement.id.replace(/_/g, " ");
  name.setAttribute("font-size", "8");
  path.parentNode.insertBefore(name, path.nextSibling);
  yCoordinate = yCoordinate + 10;
  let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("transform", `translate(${xCoordinate} ${yCoordinate})`);
  text.textContent = "10";
  text.setAttribute("font-size", "8");
  text.style.textAnchor = "middle";
  path.parentNode.insertBefore(text, path.nextSibling);
  let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("transform", `translate(${xCoordinate} ${yCoordinate})`);
  circle.setAttribute("r", 8);
  circle.style.fill = "grey";
  path.parentNode.insertBefore(circle, path.nextSibling);
};

let paths = document.querySelectorAll("path");
paths.forEach(path => {
  addText(path);
});
