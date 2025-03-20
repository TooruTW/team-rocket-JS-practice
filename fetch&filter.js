
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



// getData().then(data => console.log(data))


// 各學歷人數
// 邏輯：做一個educationCount這個func會用getData()取得原始資料，
// 取得資料後對原始，創建一個空的Map()將原始資料每一個的educatin取出放入其中，
// 若Map中原本沒有的話則創建一個新的name 將value設為1，若有則取得之前的value然後＋１
// 最後再把資料排程指定的object形式
// 學到的東西：Object.fromEntries(Map) 可以把Map直接變成object的格式 
// 也有助於之後取資料可以直接obj.attribute
// 反過來得話可用Object.entries(obj) 
// 這會讓obj變成一個二維陣列 讓他可以被for遍歷
// 在放進去new Map()就會是Ｍap格式了
function educationCount(){
    let result = getData().then(data => {
        // 創建Map
        const educationMap = new Map()
        // 處理資料
        data.forEach(item => {
            const education = item.education
            if(!educationMap.has(education)){
            // 新增key
                educationMap.set(education, 1)
            }else{
            // 增加val
                const prevValue = educationMap.get(education)
                educationMap.set(education,(prevValue + 1))
            }
        })
        // Map 轉 Obj
        let ans = Object.fromEntries(educationMap)
        return ans
    })
    result.then(data => console.log(data))
}
educationCount()