var ideaForm = document.querySelector('#idea-form');
var titleInput = document.querySelector('#title-input');
var bodyInput = document.querySelector('#body-input');
var ideaSubmit = document.querySelector('#idea-submit');
var searchForm = document.querySelector('#search-form');
var searchInput = document.querySelector('#search-input');
var ideaList = document.querySelector('#idea-list');
var deleteButton = document.querySelector('#idea-button');
var alertArticle = document.querySelector('#alert');

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
  setContentEditTarget(e, 'H2');
  setContentEditTarget(e, 'P');
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
  if (title.length === 0 && body.length === 0) {
    alertArticle.innerHTML = `<p>Ooooops!!! Looks like you need some inputs!</p>`;
    return;
  } else if (title.length === 0) {
    alertArticle.innerHTML = `<p>Ooooops!!! Looks like you need a title!</p>`;
    return;
  } else if (body.length === 0) {
    alertArticle.innerHTML = `<p>Ooooops!!! Looks like you left out a body!</p>`;
    return;
  }
  alertArticle.innerHTML = '';
  var ideaObject = new Idea(id, title, body, quality);
  ideasArray.push(ideaObject);
  renderIdeaHTML(ideaObject, ideasArray.length - 1);
  localStorage.setItem('Ideas', JSON.stringify(ideasArray));
}

function displayIdeas(array) {
  ideaList.innerHTML = '';
  array.forEach(function(idea, i) {
    renderIdeaHTML(idea, i);
  });
}

function renderIdeaHTML(object, i) {
  var ideaElement = document.createElement('article');
  ideaElement.setAttribute('class', 'idea-element');
  ideaElement.setAttribute('data-index', i);
  ideaElement.innerHTML = `
      <header class="article-header">
        <h2 contenteditable="true" class="idea-title">${object.title}</h2>
        <button id="delete-button" class="icon delete-button"></button>
      </header>
      <p contenteditable="true" class="idea-body">${object.body}</p>
      <div class="quality">
        <button class="icon up-vote" id="up-vote"></button>
        <button class="icon down-vote" id="down-vote"></button>
        <p>quality: ${object.quality}</p>
      </div>
    `;
  ideaList.prepend(ideaElement);
}

function removeIdea(e) {
  if (e.target.id === 'delete-button') {
    var confirmResponse = confirm('Are you sure you want to delete this item?');
    if (confirmResponse) {
      var index = e.target.parentElement.parentElement.dataset.index;
      ideasArray.splice(index, 1);
      localStorage.setItem('Ideas', JSON.stringify(ideasArray));
      e.target.parentElement.parentElement.remove();
    }
  }
}

function upVote(e) {
  if (e.target.id === 'up-vote') {
    var index = e.target.parentElement.parentElement.dataset.index;
    var idea = ideasArray[index];
    if (idea.quality === 'swill') {
      idea.quality = 'plausible';
    } else if (idea.quality === 'plausible') {
      idea.quality = 'genius';
    }
    localStorage.setItem('Ideas', JSON.stringify(ideasArray));
    displayIdeas(ideasArray);
    searchForm.reset();
  }
}

function downVote(e) {
  if (e.target.id === 'down-vote') {
    var index = e.target.parentElement.parentElement.dataset.index;
    var idea = ideasArray[index];
    if (idea.quality === 'genius') {
      idea.quality = 'plausible';
    } else if (idea.quality === 'plausible') {
      idea.quality = 'swill';
    }
    localStorage.setItem('Ideas', JSON.stringify(ideasArray));
    displayIdeas(ideasArray);
    searchForm.reset();
  }
}

var editTitleIndex;
var editBodyIndex;

function setContentEditTarget(e, nodeName) {
  if (e.target.nodeName === nodeName) {
    editTitleIndex = e.target.parentElement.parentElement.dataset.index;
    editBodyIndex = e.target.parentElement.dataset.index;
  }
}

function saveContentEdit(e) {
  if (e.target.nodeName === 'H2') {
    if (e.target.innerText !== ideasArray[editTitleIndex].title) {
      ideasArray[editTitleIndex].title = e.target.innerText;
      localStorage.setItem('Ideas', JSON.stringify(ideasArray));
      displayIdeas(ideasArray);
    }
  } else if (e.target.nodeName === 'P') {
    if (e.target.innerText !== ideasArray[editBodyIndex].body) {
      ideasArray[editBodyIndex].body = e.target.innerText;
      localStorage.setItem('Ideas', JSON.stringify(ideasArray));
      displayIdeas(ideasArray);
    }
  }
}

function randomHash() {
  var date = Date.now();
  var random = Math.floor(Math.random() * 10000);
  return date + random;
}

function search() {
  var searchMatchesArray = ideasArray.filter(function(idea) {
    return textMatch(idea.title) || textMatch(idea.body);
  });
  displayIdeas(searchMatchesArray);
}

function textMatch(property) {
  return (
    property.substr(0, searchInput.value.length).toLowerCase() ===
    searchInput.value.substr(0, searchInput.value.length).toLowerCase()
  );
}
