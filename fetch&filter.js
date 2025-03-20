
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

averageSalaryScore("46~50")