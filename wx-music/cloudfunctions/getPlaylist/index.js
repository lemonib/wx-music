// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const rp = require('request-promise')
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  // 取数据,一次最多只能取 100 条
  // const list = await db.collection('playlist').get()
  const countResult = db.collection('playlist').get()
  // 获取多于100 条需要分步获取
  const total = countResult.total
  // 一次取多少条 最多100
  const MaxLimit = 100
  // 需要取几次
  const batchTimes = Math.ceil(total / MaxLimit)
  // 
  const task = []
  for (let i = 0; i < batchTimes; i++) {
    let promise = await db.collection('playlist').skip(i * MaxLimit).limit(MaxLimit).get()
    task.push(promise)
  }
  let list = {
    data: []
  }

  if(task.length>0){
    list = (await Promise.all(task)).reduce((acc,cur)=>{
      return {
        data : acc.data.concat(cur.data)
      }
    })
  }

  const wxContext = cloud.getWXContext()
  let result = await rp('http://120.26.187.68:4000/personalized').then((res) => {
    return JSON.parse(res).result
  })

  console.log('看看我'+ result)
  
  // 去重
  const newData = []
  for (let i = 0; i < result.length; i++) {
    let flag = true
    for (let j = 0; list.data.length; j++) {
      if (result[i].id === list.data[j].id) {
        flag = false
        break
      }
    }
    if (flag) {
      newData.push(result[i])
    }
  }
  // 数据库添加操作
  for (let i = 0; i < result.length; i++) {
    await db.collection('playlist').add({
      data: {
        ...newData[i],
        createTime: db.serverDate(),
      }
    }).then((res) => {
      console.log('插入成功')
    }).catch((res) => {
      console.error('插入失败')
    })
  }
  return {
    result
  }
}