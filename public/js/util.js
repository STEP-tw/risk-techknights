const setElementInnerHTML = (element, text) => element.innerHTML = text;

const setElementCssClass = (element, className) => element.className = className;

const appendChildren = (parent, children) =>
  children.forEach(child => parent.appendChild(child));

const createView = (document) => document.createElement('div');