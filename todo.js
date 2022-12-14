import { showMore, hiddenMore } from './hideUtil.js'

let todoInput = document.querySelector("#todoInput");
let todoList = document.querySelector(".todoList");
let todoListAppend = document.querySelector(".todoList ul");
let btnShowTodo = document.querySelector("#btnShowTodo");

btnShowTodo.addEventListener("click", showTodoList);
function showTodoList(){
  if(todoList.classList.contains('hidden')){
    todoList.classList.remove('hidden');
  }
  else{
    todoList.classList.add('hidden');
  }
}

let todoArr = [];
let localStorage_todoList = localStorage.getItem("todoList");
let numberIdx = 0;
if(localStorage_todoList) {
  let array = JSON.parse(localStorage_todoList);
  array.forEach((todo, i)=>{
    todoArr.push(todo);
    let li = newTodoList(todo[0]);
    if(todo[1] === true) {
      li.childNodes[0].setAttribute("class", "todoList-checkBoxGroup checked");
    }
    todoListAppend.appendChild(li);
  })
}

todoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    let todo = todoInput.value;
    if(todo === "" || todo === null || todo === undefined) { return; }

    let li = newTodoList(todo);
    todoListAppend.appendChild(li);
    todoInput.value = "";

    let arr = [todo, false]; // todo, done?
    todoArr.push(arr);
    localStorage.setItem("todoList", JSON.stringify(todoArr));
  } else if(e.code === "Space") {
    e.preventDefault();
  }
});


let mouseOver;
function newTodoList(todo){
  let li = document.createElement("li");
  li.setAttribute("class", "todoElement");
  li.setAttribute("number", numberIdx++);
  li.addEventListener("mouseover", function(e) { mouseOver = e.currentTarget; showMore(e.currentTarget); });
  li.addEventListener("mouseout", function() { hiddenMore(moreFlag, mouseOver); });

  let group = document.createElement("div");
  group.setAttribute("class", "todoList-checkBoxGroup")

  let checkBtn = document.createElement("button");
  checkBtn.addEventListener("click", function(e) { doneTodo(e.target); });
  checkBtn.setAttribute("class", "checkBox");
  group.appendChild(checkBtn);

  let content = document.createElement("span");
  content.textContent = todo;
  group.appendChild(content);

  li.appendChild(group);

  let moreBtn = document.createElement("button");
  moreBtn.addEventListener('click', function(e) { showMoreTab(e.currentTarget); })
  moreBtn.setAttribute("class", "more hidden");
  moreBtn.textContent = "***";
  li.appendChild(moreBtn);

  let moreTab = document.createElement("div");
  moreTab.setAttribute("class", "moreTab hidden");
  
  let moreTab_edit = document.createElement("div");
  moreTab_edit.addEventListener('click', function(e) { editTodo(e.target); })
  moreTab_edit.textContent = "Edit";
  moreTab.appendChild(moreTab_edit);
  
  let moreTab_delete = document.createElement("div");
  moreTab_delete.addEventListener('click', function(e) { deleteTodo(e.target); })
  moreTab_delete.textContent = "Delete";
  moreTab.appendChild(moreTab_delete);

  moreBtn.appendChild(moreTab);
  
  return li;
}


let moreFlag = false;
function showMoreTab(btn){
  if(!moreFlag){
    moreFlag = btn;
    btn.childNodes[1].classList.remove('hidden');
  }else{
    moreFlag.classList.add('hidden');
    moreFlag.childNodes[1].classList.add('hidden');

    if(moreFlag != btn){
      moreFlag = btn;
      btn.childNodes[1].classList.remove('hidden');
    } else{
      moreFlag = false;
    }
  }
}

function doneTodo(btn){
  let idx = btn.parentNode.parentNode.getAttribute("number");
  if(btn.parentNode.classList.contains('checked')){
    btn.parentNode.classList.remove('checked');
    todoArr[idx][1] = false;
  } else{
    btn.parentNode.classList.add('checked');
    todoArr[idx][1] = true;
  }
  localStorage.setItem("todoList", JSON.stringify(todoArr));
}

function deleteTodo(div){
  let li = div.parentNode.parentNode.parentNode;
  let idx = li.getAttribute("number");
  console.log(idx);
  todoArr.splice(idx, 1);
  li.remove();
  localStorage.setItem("todoList", JSON.stringify(todoArr));
}

function editTodo(div){
  let li = div.parentNode.parentNode.parentNode;
  console.log(div);
  let idx = li.getAttribute("number");

  let tagE = li.childNodes[0].childNodes[1];
  let tagInput = document.createElement('input');
  tagInput.setAttribute("value", tagE.innerHTML);
  tagInput.setAttribute("id", "changeTodoInput");

  li.childNodes[0].replaceChild(tagInput, tagE);
  editListener(idx, tagE, tagInput);
}

function editListener(idx, tagE, tagInput){
  let changeIdx = idx;
  let changeBefore = tagE;
  let changeAfter = tagInput;
  let changeTodoInput = document.querySelector("#changeTodoInput");
  changeTodoInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      let todo = changeTodoInput.value;
      if(todo === "" || todo === null || todo === undefined) { return; }
  
      todoArr[changeIdx][0] = todo;
      changeBefore.innerHTML = todo;
      changeAfter.parentNode.replaceChild(changeBefore, changeAfter);
  
      localStorage.setItem("todoList", JSON.stringify(todoArr));
    } else if(e.code === "Space") {
      e.preventDefault();
    }
  });
}
