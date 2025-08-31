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
  const fenlei = ref<any>({
    img: ''
  })
  const showAd = ref<any>(false)
  const darksidead = ref<any[]>([])
  const squaread = ref<any[]>([])
  const play = ref<any[]>([])
  const showDarksideAd = ref(false);
  const showMeAd = ref(false);
  const showPaihangAd = ref(false);
  const showPlayAd = ref(false);
  const showRandomAd = ref(false);
  const showSonType = ref(false);
  const showSquareAd = ref(false);
  const showSwiperAd = ref(false);
  const indexPopupAd = ref<any>({
  })
  const user = ref<any[]>([])
  const banner = ref<any[]>([])
  const nottitle = ref('')
  const activeTag = ref(0)

  let initialized = false
 const insertAdsOther = <T>(list: T[], ads: T[], interval = 6, startIndex = 0): T[] => {
    if (!ads || ads.length === 0) return list;

    let result: T[] = [];
    let usedIndexes: number[] = [];

    const getRandomAd = (): T => {
      // 随机取广告
      let idx = Math.floor(Math.random() * ads.length);
      // 避免连续重复（可选）
      while (usedIndexes.length && idx === usedIndexes[usedIndexes.length]) {
        idx = Math.floor(Math.random() * ads.length);
      }
      usedIndexes.push(idx);
      return { ...(ads[idx] as T) };
    };

    list.forEach((item, i) => {
      result.push(item);

      // ✅ 从 startIndex 开始，每隔 interval 插广告
      if (i >= startIndex && (i - startIndex) % interval === 0) {
        result.push(getRandomAd());
      }
    });

    return result;
  };

  // ----- 工具方法 -----
  const insertAds = <T>(list: T[], ads: T[], interval = 6, startIndex = 0): T[] => {
    if (!ads || ads.length === 0) return list;

    let result: T[] = [];
    let usedIndexes: number[] = [];

    const getRandomAd = (): T => {
      // 随机取广告
      let idx = Math.floor(Math.random() * ads.length);
      // 避免连续重复（可选）
      while (usedIndexes.length && idx === usedIndexes[usedIndexes.length]) {
        idx = Math.floor(Math.random() * ads.length);
      }
      usedIndexes.push(idx);
      return { ...(ads[idx] as T) };
    };

    list.forEach((item, i) => {
      result.push(item);

      // ✅ 从 startIndex 开始，每隔 interval 插广告
      if (i >= startIndex && (i - startIndex) % interval === 0) {
        result.push(getRandomAd());
      }
    });

    return result;
  };



// 分页式插入广告：广告插入位置基于全局列表长度，而不是当前页
const insertAdsPaginated = <T>(
  list: T[],
  ads: T[],
  currentTotal: number, // 已有的总长度（分页追加时很关键）
  interval = 6,
  startIndex = 1
): T[] => {
  if (!ads || ads.length === 0) return list;

  const result: T[] = [];
  let adIndex = 0;

  list.forEach((item, i) => {
    const globalIndex = currentTotal + i; // 当前元素在全局中的索引
    result.push(item);

    // 从 startIndex 开始，每隔 interval 插广告
    if (globalIndex >= startIndex && (globalIndex - startIndex) % interval === 0) {
      const adItem = ads[adIndex % ads.length];
      result.push({ ...(adItem as T) });
      adIndex++;
    }
  });

  return result;
};



  // ----- API -----
  const getConfig = async () => {
    const res = await post('/app-api/ajax/getConfig', {})
    if (res.code === 0) {
      // const data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'))
      const data = res.data
      console.log(data, "data配置配置配置配置配置");
      showAd.value = data.showAd
      nottitle.value = data.popupContent
      showDarksideAd.value = data.showDarksideAd
      showMeAd.value = data.showMeAd
      showPaihangAd.value = data.showPaihangAd
      showPlayAd.value = data.showPlayAd
      showPaihangAd.value = data.showPaihangAd
      showPlayAd.value = data.showPlayAd
      showRandomAd.value = data.showRandomAd
      showSonType.value = data.showSonType
      showSquareAd.value = data.showSquareAd
      showSwiperAd.value = data.showSwiperAd
    }
  }

  const getGuangGao = async () => {
    const res = await post('/app-api/ajax/guanggao', {})
    if (res.code === 0) {
      const data = res.data
      randomad.value = data.randomad
        .filter((item: any) => item.status === 1)
        .map((item: any) => ({ ...item, adtype: 'ad' }));
      indexPopupAd.value = data.indexPopupAd?.filter((item: any) => item.status === 1) || [];
      play.value = data.play?.filter((item: any) => item.status === 1) || [];
      banner.value = data.banner?.filter((item: any) => item.status === 1) || [];
      user.value = data.user?.filter((item: any) => item.status === 1) || [];
      squaread.value = data.squaread?.filter((item: any) => item.status === 1) || [];
      darksidead.value = data.darksidead?.filter((item: any) => item.status === 1) || [];
      fenlei.value = data.fenlei
      console.log(data, "广告广告广告广告广告");
    }
  }

  const getTagList = async () => {
    const res = await post('/app-api/cartoon/listLeftType', {})
    if (res.code === 0) {
      const data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'))
      tags.value = data
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
  if (loading.value || noMore.value) return;

  currentPage.value++;
  loading.value = true;

  try {
    let res, data;
    if (activeTag.value === 0) {
      res = await post('/app-api/cartoon/listIndexLike', { currentPage: currentPage.value });
      if (res.code === 0) {
        data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'));
        if (data.distinctNameList.length > 0) {
          likeList.value.push(
            ...insertAdsPaginated(data.distinctNameList, randomad.value, likeList.value.length)
          );
        } else {
          noMore.value = true;
        }
      }
    } else {
      res = await post('/app-api/cartoon/listPaging', {
        currentPage: currentPage.value,
        type: "全部",
        typeCode: activeTag.value,
      });
      if (res.code === 0) {
        data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'));
        if (data.list.length > 0) {
          likeList.value.push(
            ...insertAdsPaginated(data.list, randomad.value, likeList.value.length)
          );
        } else {
          noMore.value = true;
        }
      }
    }
  } finally {
    loading.value = false;
  }
};



  // ----- 初始化方法 -----
  const initHome = async () => {
    if (!initialized) {
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
    indexPopupAd,
    nottitle,
    activeTag,
    initialized,
    user,
    squaread,
    play,
    darksidead,
    showAd,
    showDarksideAd,
    showMeAd,
    showPaihangAd,
    showPlayAd,
    showRandomAd,
    showSonType,
    showSquareAd,
    showSwiperAd,

    // 方法
    insertAds,
    getConfig,
    getGuangGao,
    getTagList,
    getData,
    getLikeData,
    loadMore,
    initHome,
    insertAdsOther
  }
})
