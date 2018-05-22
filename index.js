var ideaForm = document.querySelector('#idea-form');
var titleInput = document.querySelector('#title-input');
var bodyInput = document.querySelector('#body-input');
var ideaSubmit = document.querySelector('#idea-submit');
var searchInput = document.querySelector('#search-input');
var ideaList = document.querySelector('#idea-list');
var deleteButton = document.querySelector('#idea-button');

ideasArray = JSON.parse(localStorage.getItem('Ideas')) || [];

displayIdeas(ideasArray);

function Idea(id, title, body, quality) {
  this.id = id;
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
ideaList.addEventListener('click', upVote);
ideaList.addEventListener('click', downVote);
ideaList.addEventListener('keyup', function(e) {
  contentEditable(e, 'H2');
  contentEditable(e, 'P');
});

ideaList.addEventListener('keydown', function(e) {
  if (e.keyCode === 13) {
    saveContentEdit(e);
  }
});

ideaList.addEventListener('focusout', function(e) {
  saveContentEdit(e);
});

searchInput.addEventListener('keyup', search);

function addIdea() {
  var id = randomHash();
  var title = titleInput.value;
  var body = bodyInput.value;
  var quality = 'swill';
  var ideaObject = new Idea(id, title, body, quality);
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
      <div class="article-header">
        <h2 contenteditable="true" class="idea-title">${array[i].title}</h2>
        <img src="./images/delete.svg" alt="delete icon" id="delete-button">
      </div>
      <p contenteditable="true">${array[i].body}</p>
      <div class="quality">
        <img src="./images/upvote.svg" alt="upvote icon" id="up-vote">
        <img src="./images/downvote.svg" alt="downvot icon" id="down-vote">
        <p>quality: ${array[i].quality}</p>
      </div>
    `;
    ideaList.prepend(ideaElement);
  }
}

function removeIdea(e) {
  if (e.target.id === 'delete-button') {
    ideasArray.splice(e.target.parentElement.dataset.index, 1);
    localStorage.setItem('Ideas', JSON.stringify(ideasArray));
    displayIdeas(ideasArray);
  }
}

// function buttonHover(e) {
//   if (e.target.id === 'delete-button') {
//     e.target.setAttribute('src', "./images/delete.svg")
//   }
// }
// ideaList.addEventListener('mouseover', buttonHover)

function upVote(e) {
  if (e.target.id === 'up-vote') {
    var index = e.target.parentElement.dataset.index;
    if (ideasArray[index].quality === 'swill') {
      ideasArray[index].quality = 'plausible';
    } else if (ideasArray[index].quality === 'plausible') {
      ideasArray[index].quality = 'genius';
    }
    localStorage.setItem('Ideas', JSON.stringify(ideasArray));
    displayIdeas(ideasArray);
  }
}

function downVote(e) {
  if (e.target.id === 'down-vote') {
    var index = e.target.parentElement.dataset.index;
    if (ideasArray[index].quality === 'genius') {
      ideasArray[index].quality = 'plausible';
    } else if (ideasArray[index].quality === 'plausible') {
      ideasArray[index].quality = 'swill';
    }
    localStorage.setItem('Ideas', JSON.stringify(ideasArray));
    displayIdeas(ideasArray);
  }
}

var editIndex;

function contentEditable(e, nodeName) {
  if (e.target.nodeName === nodeName) {
    editIndex = e.target.parentElement.dataset.index;
  }
}

function saveContentEdit(e) {
  if (e.target.nodeName === 'H2') {
    if (e.target.innerText !== ideasArray[editIndex].title) {
      ideasArray[editIndex].title = e.target.innerText;
    }
    localStorage.setItem('Ideas', JSON.stringify(ideasArray));
    displayIdeas(ideasArray);
  } else if (e.target.nodeName === 'P') {
    if (e.target.innerText !== ideasArray[editIndex].body) {
      ideasArray[editIndex].body = e.target.innerText;
    }
    localStorage.setItem('Ideas', JSON.stringify(ideasArray));
    displayIdeas(ideasArray);
  }
}

function randomHash() {
  var date = Date.now();
  var random = Math.floor(Math.random() * 10000);
  return date + random;
}

function search() {
  var searchMatchesArray = ideasArray.filter(function(idea) {
    return textMatch(idea.title) || textMatch(idea.body)
  })
  displayIdeas(searchMatchesArray);
}

function textMatch(property) {
  return property.substr(0, searchInput.value.length).toLowerCase() === searchInput.value.substr(0, searchInput.value.length).toLowerCase();
}
  

