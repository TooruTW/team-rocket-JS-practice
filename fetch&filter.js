
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
// 新學到的酷東西：Object.fromEntries(Map) 可以把Map直接變成object的格式 
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
        return educationMap
    })
    result.then(data => console.log(data))
}
// educationCount()


// 工作區域佔比
// 與統計教育程度的方式一樣將公司位置製作成map，
// 接著以data.length當作總數計算各自位置的百分比，
// 在轉換成obj格式
// 新學到的酷東西：Intl.NumberFormat("地區",{樣式}).format(欲修改的內容)
// 這是 JavaScript 內建的國際化工具，用來格式化數字、日期、時間等。

function percentageOfCompanyArea(){
    let result = getData().then(data => {
        // 創建Map
        const comapnyAreaMap = new Map()
        // 處理資料
        data.forEach(item => {
            const comapnyArea = item.company.area
            if(!comapnyAreaMap.has(comapnyArea)){
            // 新增key
                comapnyAreaMap.set(comapnyArea, 1)
            }else{
            // 增加val
                const prevValue = comapnyAreaMap.get(comapnyArea)
                comapnyAreaMap.set(comapnyArea,(prevValue + 1))
            }
        })
        // 轉換單位
        const totalNum = data.length;
        comapnyAreaMap.forEach((val,key)=>{
            const prev = val
            let formatedNum = new Intl.NumberFormat('zh-TW', {style: 'percent'}).format(prev / totalNum)
            comapnyAreaMap.set(key, formatedNum)
        })

        // Map 轉 Obj
        let ans = Object.fromEntries(comapnyAreaMap)
        return ans
    })
    result.then(data => console.log(data))
}

// percentageOfCompanyArea()


// 平均薪資滿意度
// 將參數轉換符合陣列的格式，
// 接著將符合條件的資料夾總進object中，
// 再將obj中的總分和人數相除取得平均分數
function averageSalaryScore(range = "26~30"){
    let param = `${range} 歲`
    const result = getData().then(data=>{
        let ans = {}
        data.forEach(item=>{
            if(item.age === param){
                ans.count = ( ans.count || 0 ) + 1 ;
                ans.total = ( ans.total || 0) + Number(item.company.salary_score);
            }
        })
        console.log({ average: Math.floor(ans.total / ans.count)})
    })
}

// averageSalaryScore("46~50")

// 製作一個紀錄有寫跟沒寫的變數，紀錄完成後根據答案的格式還傳內容
function hasIndustryMsg(){
    const response = getData().then( data => {
        let ansArr = [0,0];
        data.forEach(item=>{
            item.company.industry_message === ""? ansArr[1] += 1 : ansArr[0] +=1
        })
        return [`有寫${ansArr[0]}人`,{no:`沒寫${ansArr[1]}人`}]
    })
    return response
}

// hasIndustryMsg().then(data => console.log(data))

// 工作環境種類：
// 先製作出一個包含所有產業每個產業的val是另一個obj 這個obj記錄工作環境的種類數量
// 在幫所有數字加上單位

function workPlace(){
    const response = getData().then(data => {
        let ans = {}
        data.forEach(item => {
            // 產業
            const obj = ans[item.company.industry] = { ...ans[item.company.industry] }
            // 工作環境數量
            obj[item.company.work] = (obj[item.company.work] || 0) + 1

        })
        // 加上單位
        Object.entries(ans).forEach(([industry , works])=>{
            console.log(works)
            Object.entries(works).forEach(([work , count])=>{
                works[work] = count + "間"
            })
        })
        console.log(ans)
    })
}

// workPlace()
// 概念與workplace一樣，只是在遍歷過程中加上更多動作
function saticfation(){
    const response = getData().then(data => {
        let ans = {}
        // 獲得總數
        data.forEach(({job , gender , age , education , major , firstJob , works , company},index)=>{
            let obj = ans[company.industry] = {...ans[company.industry]}
            if(gender === "男性"){
                obj["男性比例"] = (obj["男性比例"] || 0 ) + 1
                obj["男性產業滿意度"] = (obj["男性產業滿意度"] || 0) + Number(company.score)
            }else {
                obj["女性比例"] = (obj["女性比例"] || 0 ) + 1
                obj["女性產業滿意度"] = (obj["女性產業滿意度"] || 0) + Number(company.score)
            }
        })
        // 加上單位跟算平均值
        Object.entries(ans).forEach(([industry,state]) => {
           const prev = {...state}
           if(prev["男性比例"] && prev["女性比例"]){
            state["男性比例"] = Math.floor(Number(prev["男性比例"]) / (Number(prev["男性比例"]) + Number(prev["女性比例"])) * 100 )+ "%"
            state["女性比例"] = Math.floor(Number(prev["女性比例"]) / (Number(prev["男性比例"]) + Number(prev["女性比例"])) * 100 )+ "%"
            state["男性產業滿意度"] = Math.floor(prev["男性產業滿意度"] / Number(prev["男性比例"])) + "分"
            state["女性產業滿意度"] = Math.floor(prev["女性產業滿意度"] / Number(prev["女性比例"])) + "分"
        }else{
            if(prev["男性比例"]){
                state["男性比例"] = "100%"
                state["男性產業滿意度"] = Math.floor(prev["男性產業滿意度"] / Number(prev["男性比例"])) + "分"
            }else{
                state["女性比例"] = "100%"
                state["女性產業滿意度"] = Math.floor(prev["女性產業滿意度"] / Number(prev["女性比例"])) + "分"
            }
           }
        })
        return ans
    })
    return response
}
saticfation().then(data => console.log(data))