const setElementClass = (element, className) => element.className = className;

const setElementInnerHTML = (element, text) => element.innerHTML = text;

const setElementInnerText = (element, text) => element.innerText = text;

const getElementInnerText = (document, element) => {
  if (document.getElementById(element)) {
    return document.getElementById(element).innerText;
  }
  return EMPTY_STRING;
};

const appendChildren = (parent, children) =>
  children.forEach(child => parent.appendChild(child));

const createElement = (document, elementType) => document.createElement(elementType);

const parseCookies = function (cookie) {
  const cookies = {};
  if (cookie) {
    cookie.split('; ').forEach(element => {
      const [name, value] = element.split('=');
      cookies[name] = value;
    });
  }
  return cookies;
};

const sendPostRequest = data => {
  return {
    method: POST_REQUEST,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };
};

const setElementName = (element, text) => (element.setAttribute('name', text));

const getElementName = (document, element) => {
  if (document.getElementById(element)) {
    return document.getElementById(element).attributes.name.value;
  }
  return EMPTY_STRING;
};

const reverseSort = function (list) {
  return list.sort().reverse();
}

const hideElement = element => element.style.display = DISPLAY_NONE;

const setElementDisplay = (element, property) => element.style.display = property;