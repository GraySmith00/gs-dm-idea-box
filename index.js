var ideaForm = document.querySelector('#idea-form');
var titleInput = document.querySelector('#title-input');
var bodyInput = document.querySelector('#body-input');
var ideaSubmit = document.querySelector('#idea-submit');
var searchInput = document.querySelector('#search-input');
var ideaList = document.querySelector('#idea-list');
var deleteButton = document.querySelector('#idea-button');

ideasArray = JSON.parse(localStorage.getItem('Ideas')) || [];

displayIdeas(ideasArray);

function Idea(title, body, quality) {
  this.title = title;
  this.body = body;
  this.quality = quality || 'swill';
}

ideaForm.addEventListener('submit', function(e) {
  e.preventDefault();
  addIdea();
  this.reset();
});

ideaList.addEventListener('click', removeIdea);

function addIdea() {
  var title = titleInput.value;
  var body = bodyInput.value;
  var quality = 'swill';
  var ideaObject = new Idea(title, body, quality);
  ideasArray.push(ideaObject);

  displayIdeas(ideasArray);
  localStorage.setItem('Ideas', JSON.stringify(ideasArray));
}

function displayIdeas(array) {
  ideaList.innerHTML = '';
  for (var i = 0; i < array.length; i++) {
    var ideaElement = document.createElement('article');
    ideaElement.setAttribute('class', 'idea-element');
    ideaElement.setAttribute('data-index', i);
    ideaElement.innerHTML = `
      <h2>${array[i].title}</h2>
      <img src="./images/delete-hover.svg" alt="delete icon" id="delete-button">
      <p>${array[i].body}</p>
      <img src="./images/upvote.svg" alt="upvote icon">
      <img src="./images/downvote.svg" alt="downvot icon">
      <p>quality: ${array[i].quality}</p>
    `;
    ideaList.prepend(ideaElement);
    console.log(ideasArray);
  }
}

function removeIdea(e) {
  if (e.target.id === 'delete-button') {
    console.log(e.target.parentElement.dataset.index);
    ideasArray.splice(e.target.parentElement.dataset.index, 1);
    localStorage.setItem('Ideas', JSON.stringify(ideasArray));
    displayIdeas(ideasArray);
  }
}
