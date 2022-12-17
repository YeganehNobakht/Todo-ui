import { getAll, create } from "./api.js";
const dueDate = document.getElementById("dueDate")
const form = document.getElementById("my_form")

// create new todo
form.onsubmit = (e) => {
    e.preventDefault();
    const formData = gatherFormData(e)
    create(formData);
}

function gatherFormData(e){
    const { title, description, dueDate } = e.target;
    return {
        title : title.value,
        description : description.value,
        dueDate : dueDate.value,
        createdDate: new Date().toLocaleDateString("zh-Hans-CN").replaceAll("/","-")
    }
}