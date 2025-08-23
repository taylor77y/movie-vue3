import { defineStore } from 'pinia'
import { ref } from 'vue'
import { post } from '@/utils/request'
import AES from '@/utils/aes1.js'

export const useHomeStore = defineStore('home', () => {
  // ----- 数据 -----
  const rankList = ref<any[]>([])
  const typelist = ref<any[]>([])
  const likeList = ref<any[]>([])
  const value = ref('')
  const tags = ref<any[]>([])
  const loading = ref(false)
  const noMore = ref(false)
  const currentPage = ref(1)
  const scrollTop = ref(0) // 保存 scroll 位置
  const randomad = ref<any[]>([])
  const banner = ref<any[]>([])
  const nottitle = ref('')
  const activeTag = ref(0)

  let initialized = false

  // ----- 工具方法 -----
  const insertAds = <T>(list: T[], ads: T[]): T[] => {
    const insertIndexes = [1, 3, 5, 7, 9]
    if (!ads || ads.length === 0) return list
    let offset = 0
    insertIndexes.forEach((pos, i) => {
      const index = Math.min(pos + offset, list.length)
      const adItem = ads[i % ads.length]
      list.splice(index, 0, { ...(adItem as T) })
      offset++
    })
    return list
  }

  // ----- API -----
  const getConfig = async () => {
    const res = await post('/app-api/ajax/getConfig', {})
    if (res.code === 0) {
      const data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'))
      nottitle.value = data.popupContent
    }
  }

  const getGuangGao = async () => {
    const res = await post('/app-api/ajax/guanggao', {})
    if (res.code === 0) {
      const data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'))
      randomad.value = data.randomad.map((item: any) => ({ ...item, adtype: 'ad' }))
      banner.value = data.banner
    }
  }

  const getTagList = async () => {
    const res = await post('/app-api/cartoon/listLeftType', {})
    if (res.code === 0) {
      tags.value = res.data
      tags.value.unshift({ dictCode: 0, dictName: '首页' })
    }
  }

  const getData = async () => {
    const res = await post('/app-api/cartoon/listIndex', {})
    if (res.code === 0) {
      const data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'))
      rankList.value = insertAds(data.rankList, randomad.value)
      typelist.value = insertAds(data.typeList.flatMap((item: any) => item.cartoonInfoList), randomad.value)
    }
  }

  const getLikeData = async () => {
    const res = await post('/app-api/cartoon/listIndexLike', { currentPage: currentPage.value })
    if (res.code === 0) {
      const data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'))
      likeList.value = insertAds(data.distinctNameList, randomad.value)
    }
  }
  const loadMore = async () => {
  if (loading.value || noMore.value) return

  currentPage.value++
  loading.value = true

  try {
    let res, data
    if (activeTag.value === 0) {
      res = await post('/app-api/cartoon/listIndexLike', { currentPage: currentPage.value })
      if (res.code === 0) {
        data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'))
        if (data.distinctNameList.length > 0) {
          likeList.value.push(...insertAds(data.distinctNameList, randomad.value))
        } else {
          noMore.value = true
        }
      }
    } else {
      res = await post('/app-api/cartoon/listPaging', {
        currentPage: currentPage.value,
        type: "全部",
        typeCode: activeTag.value
      })
      if (res.code === 0) {
        data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'))
        if (data.list.length > 0) {
          likeList.value.push(...insertAds(data.list, randomad.value))
        } else {
          noMore.value = true
        }
      }
    }
  } finally {
    loading.value = false
  }
}


  // ----- 初始化方法 -----
  const initHome = async () => {
    console.log(123);
    
    if (!initialized) {
      await getConfig()
      await getGuangGao()
      await getTagList()
      await getData()
      await getLikeData()
      initialized = true
    }
  }

  return {
    // 数据
    rankList,
    typelist,
    likeList,
    value,
    tags,
    loading,
    noMore,
    currentPage,
    scrollTop,
    randomad,
    banner,
    nottitle,
    activeTag,
    initialized,

    // 方法
    insertAds,
    getConfig,
    getGuangGao,
    getTagList,
    getData,
    getLikeData,
    loadMore,
    initHome
  }
})
