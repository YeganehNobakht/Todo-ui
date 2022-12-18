const url = "http://localhost:9095/"
export const getAll = async () => {
    try {
        const response = await fetch(url+"all");
        const data = response.json();
        return data;
    } catch (e) {
        console.log(e.message)
    }
}
export const create = async (data) => {
    try {
        const responsePromis = await fetch(url+"create",{
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
        });
    } catch (e) {
        console.log(e.message)
    }
}
export const deleteById = async (id) => {
    console.log(id);
    try {
        await fetch(url+`delete/${id}`,{
            method: "DELETE"
        });
    } catch (e) {
        console.log(e.message)
    }
}
export const editById = async (data) => {
    try {
        await fetch(url+`update`,{
            method: "PUT",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
        });
    } catch (e) {
        console.log(e.message)
    }
}