import { getAll, deleteById, editById } from "./api.js";

const todosContainer = document.querySelector("#todos-container");
const deleteModal = document.querySelector(".delete-modal");
const editModal = document.querySelector(".edit-modal");
const deleteModalBtn = document.querySelector(".delete-modal-btn")
const cancelEditModalBtn = document.querySelector(".cancel-edit-modal-btn")
const editModalBtn = document.querySelector("#edit-modal-btn")
const cancelModalBtn = document.querySelector(".cancel-modal-btn")
const editForm = document.querySelector("#my-edit-form")

const DEFAULT_PAGE_SIZE = 5;
let items;

const page = pageUrl()
getAllTodoes(page)

async function getAllTodoes(page) {

    items = await getAll()
console.log(items);
    todosContainer.innerHTML = "";
    let pageItems = frontEndPagination(items, page)
    console.log(pageItems);
    if (!pageItems) {
        console.log("page",page);
        if(page!=1){
            page = page - 1;
            localStorage.setItem("pageNumber", page);
            pageUrl();
            pageItems = frontEndPagination(items, page)
            addAllItemInPageToDom(pageItems)
        }
    }else{
        addAllItemInPageToDom(pageItems)
    }
    
    createPagination(items.length, page)

}

function addAllItemInPageToDom(pageItems){
    pageItems.forEach(todo => {
        if (todo) addToDom(todo);
    })
}
function addToDom(todo) {
    const html = `
      <div class="todolist" id="${todo.id}">
        <div class="title-reaction">
          <div class="title-date">
            <div class="todo-title">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked">
                <label class="title${todo.id}">${todo.title}</label>
            </div>
            <p class="dueDate">${todo.dueDate}</p>
          </div>
          <div class="d-flex">
            <div class="edit">
                <i class="fa-solid fa-pen px-2" id="edit">edit</i>
            </div>
            <div class="delete">
                <i class="fa-solid fa-trash " >delete</i>
            </div>
          </div>
        </div>
        <p class="description">${todo.description}</p>
      </div>
          `;
    todosContainer.insertAdjacentHTML("beforeend", html);
}






function historyPushState(pageNumber) {
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

// decide delete/edit item
todosContainer.addEventListener("click", (e) => {
    const todoList = e.target.closest(".todolist")
    const id = todoList.id
    const title = todoList.children[0].children[0].children[0].children[1].innerHTML
    const description = todoList.children[1].innerHTML;
    const dueDate = todoList.children[0].children[0].children[1].innerHTML
    const currentPage = window.location.href.split("=")[1];
    if (e.target.closest("div").classList.contains("delete")) {
        deleteModal.style.display = "flex";
        deleteModal.id = id;
        deleteModal.dataset.currentPage = currentPage;
    }
    if (e.target.closest("div").classList.contains("edit")) {
        editModal.style.display = "flex";
        editModal.id = id;
        editModal.dataset.currentPage = currentPage;

        // set default for edit modal
        editModal.querySelector("#title").value = title;
        editModal.querySelector("#description").innerHTML = description;
        editModal.querySelector("#dueDate").defaultValue = dueDate;
    }

})
// click on Yes botton in modal
deleteModalBtn.addEventListener("click", async() => {
    const modalId = deleteModal.id;
    const currentPage = deleteModal.dataset.currentPage;
    await deleteById(id)
    getAllTodoes(currentPage);
    deleteModal.style.display = "none";
});


//   click on No botton in delete modal
cancelModalBtn.addEventListener("click", () => {
    deleteModal.style.display = "none";
});

//   edit item

//   click on edit button in edit modal
editForm.addEventListener("submit", async (e) => {
    e.preventDefault
    const modalId = editModal.id;
    const currentPage = editModal.dataset.currentPage;
    console.log(modalId);
    const todo = gatherFormData(e)
    console.log(todo);
    const todoWithId = { ...todo, id: modalId }
    await editById(todoWithId)
    getAllTodoes(currentPage);
    editModal.style.display = "none";
})
//   click on cancel botton in edit modal
cancelEditModalBtn.addEventListener("click", () => {
    editModal.style.display = "none"
});




function gatherFormData(e) {
    const { title, description, dueDate } = e.target;
    return {
        title: title.value,
        description: description.value,
        dueDate: dueDate.value,
        createdDate: new Date().toLocaleDateString("zh-Hans-CN").replaceAll("/", "-")
    }
}