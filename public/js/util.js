const POST_REQUEST = "POST";
const EMPTY_STRING = "";

const setElementCssClass = (element, className) =>
  (element.className = className);

const setElementInnerHTML = (element, text) => (element.innerHTML = text);

const setElementInnerText = (element, text) => (element.innerText = text);

const getElementInnerText = (document, element) => {
  if (document.getElementById(element)) {
    return document.getElementById(element).innerText;
  }
  return EMPTY_STRING;
};

const appendChildren = (parent, children) =>
  children.forEach(child => parent.appendChild(child));

const createView = document => document.createElement("div");

const parseCookies = function(cookie) {
  const cookies = {};
  if (cookie) {
    cookie.split("; ").forEach(element => {
      const [name, value] = element.split("=");
      cookies[name] = value;
    });
  }
  return cookies;
};

const sendPostRequest = data => {
  return {
    method: POST_REQUEST,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  };
};


const setElementName = (element, text) => (element.setAttribute("name", text));

const getElementName = (document, element) => {
 if (document.getElementById(element)) {
   return document.getElementById(element).attributes.name.value;
 }
 return EMPTY_STRING;
};