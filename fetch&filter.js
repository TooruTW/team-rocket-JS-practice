
const url = "https://raw.githubusercontent.com/hexschool/2021-ui-frontend-job/master/frontend_data.json"
async function getData() {
    try {
        const response = await fetch(url)
        const data = await response.json()
        return data
    } catch (error) {
        console.error(error)
    }
}



getData().then(data => console.log(data))