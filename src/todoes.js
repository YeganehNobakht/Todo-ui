import { getAll, create } from "./api.js";

const todosContainer = document.querySelector("#todos-container");
const DEFAULT_PAGE_SIZE = 5;
let items;

const page = pageUrl()
getAllTodoes(page)

async function getAllTodoes (page)  {
    
    items = await getAll()

    todosContainer.innerHTML = "";
    let pageItems = frontEndPagination(items, page)
    pageItems.forEach(todo => {
        if (todo) addToDom(todo);
    })
    createPagination(items.length, page)
}


function addToDom(todo) {
    const html = `
      <div class="todolist" id="${todo.id}">
        <div class="title-reaction">
          <div class="title-date">
            <div class="todo-title">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked">
                <label for="title${todo.id}">${todo.title}</label>
            </div>
            <p class="dueDate">${todo.dueDate}</p>
          </div>
          <div class="edit-delete">
            <i class="fa-solid fa-pen px-2" id="edit">edit</i>
            <i class="fa-solid fa-trash delete " >delete</i>
          </div>
        </div>
        <p class="description">${todo.description}</p>
      </div>
          `;
    todosContainer.insertAdjacentHTML("beforeend", html);
}






function historyPushState(pageNumber){
    if (history.pushState) {
        let newurl =
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?page=" +
            pageNumber;
        window.history.pushState({ path: newurl }, "", newurl);
    }
}

// when page is refreshed
function pageUrl() {
    let pageNumber;
    const savedPage = localStorage.getItem("pageNumber");
    if (savedPage) {
        pageNumber = savedPage;
    } else {
        pageNumber = 1;
        localStorage.setItem("pageNumber", pageNumber)
    }
    historyPushState(pageNumber)

    return pageNumber;
}

// Pagination
function createPagination(todosNo, currentPage) {
    const pageCount = Math.ceil(todosNo / DEFAULT_PAGE_SIZE);
    let lis = "";
    for (let i = 1; i <= pageCount; i++) {
        lis += `<li class="page-item ${i === Number(currentPage) ? "active" : ""
            }"><a href="todos.html?page=${i}" class="page-link">${i}</a></li>`;
    }
    document.querySelector("ul.pagination").innerHTML = lis;
}
function frontEndPagination(items, page) {
    let subItems = [];
    for (let i = 0; i < items.length; i += DEFAULT_PAGE_SIZE) {
        let temp = [];
        for (let j = i; j < i + DEFAULT_PAGE_SIZE; j++) {
            temp.push(items[j]);
        }
        subItems.push(temp);
    }
    console.log("sub", page);
    return subItems[page - 1];
}

document.querySelector("ul.pagination").addEventListener("click", (e) => {
    e.preventDefault();
    const currentPage = Number(e.target.innerText);
    // set current page to local storage
    localStorage.setItem("pageNumber", `${currentPage}`);

    const lis = document.querySelectorAll(".page-item");
    lis.forEach((li) => li.classList.remove("active"));
    // if (e.composedPath()[0].classList.contains("page-link")) {
        e.target.closest("li").classList.add("active");
        historyPushState(e.target.innerHTML)
    // }
    getAllTodoes(currentPage);
});

document.getElementById("edit").addEventListener("click",(e)=>{
    e.target.classList.add(` data-toggle="modal" data-target="#exampleModal"`)
})