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
    console.log(data);
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