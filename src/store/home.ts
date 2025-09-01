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
  const paihang = ref<any>({
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


  // ----- API -----
  const getConfig = async () => {
    const res = await post('/app-api/ajax/getConfig', {})
    if (res.code === 0) {
      // const data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'))
      const data = res.data
      showAd.value = data.showAd
      nottitle.value = data.popupContent
      showDarksideAd.value = data.showDarksideAd
      showMeAd.value = data.showMeAd
      showPaihangAd.value = data.showPaihangAd
      showPlayAd.value = data.showPlayAd
      showRandomAd.value = data.showRandomAd
      showSonType.value = data.showSonType
      showSquareAd.value = data.showSquareAd
      showSwiperAd.value = data.showSwiperAd
    }
  }

const getAdlist = (list: any[]) => {
  if (!list || !list.length || !randomad.value || !randomad.value.length) return list;

  const result: any[] = [...list]; // 拷贝原数组
  const interval = 6; // 每隔 6 条插入广告
  let insertIndex = 0;

  const ads = randomad.value;
  const adCount = ads.length;

  while (insertIndex <= result.length) {
    let ad;
    if (adCount === 1) {
      ad = ads[0]; // 只有一个广告，永远使用它
    } else {
      const randIdx = Math.floor(Math.random() * adCount); // 多个广告随机
      ad = ads[randIdx];
    }

    result.splice(insertIndex, 0, ad);

    insertIndex += interval + 1; // 下次插入位置
  }

  return result;
};

const getAdOtlist = (list: any[]) => {
  if (!list || !list.length || !randomad.value || !randomad.value.length) return list;

  const result: any[] = [...list]; // 拷贝原数组
  const interval = 9; // 每隔 9 条插入广告
  let insertIndex = 9; // 从索引 9 开始插入

  const ads = randomad.value;
  const adCount = ads.length;

  while (insertIndex <= result.length) {
    let ad;
    if (adCount === 1) {
      ad = ads[0]; // 只有一个广告
    } else {
      const randIdx = Math.floor(Math.random() * adCount); // 多个广告随机
      ad = ads[randIdx];
    }

    result.splice(insertIndex, 0, ad);

    insertIndex += interval + 1; // 下次插入位置
  }

  return result;
};



  const getGuangGao = async () => {
    const res = await post('/app-api/ajax/guanggao', {})
    if (res.code === 0) {
      const data = res.data
      randomad.value = data.randomad
        .filter((item: any) => item.status === 1)
        .map((item: any) => ({ ...item, adtype: 'ad' }));
      indexPopupAd.value = data.indexPopupAd?.filter((item: any) => item.type === 1) || [];
      play.value = data.play?.filter((item: any) => item.status === 1) || [];
      banner.value = data.banner?.filter((item: any) => item.status === 1) || [];
      user.value = data.user?.filter((item: any) => item.status === 1) || [];
      squaread.value = data.squaread?.filter((item: any) => item.status === 1) || [];
      darksidead.value = data.darksidead?.filter((item: any) => item.status === 1) || [];
      fenlei.value = data.fenlei
      paihang.value = data.paihang
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

  const onGetplay =  () => {
     const data = {showAd:showAd.value ,squaread:squaread.value}
     return data;
  }


  const getData = async () => {
   
    const res = await post('/app-api/cartoon/listIndex', {})
    if (res.code === 0) {
      const data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'))
       rankList.value =data.rankList
      // rankList.value = insertAds(data.rankList, randomad.value)
      typelist.value=[...data.typeList[0].cartoonInfoList,...data.typeList[1].cartoonInfoList,...data.typeList[2].cartoonInfoList,...data.typeList[3].cartoonInfoList].slice(0,-1);
    }
  }

  const getLikeData = async () => {
    const res = await post('/app-api/cartoon/listIndexLike', { currentPage: currentPage.value })
    if (res.code === 0) {
      const data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'))
      console.log(randomad.value ,"广告");
      likeList.value = getAdlist(data.distinctNameList)
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
              likeList.value = getAdlist([...likeList.value,...data.distinctNameList])
            // likeList.value.push(
            //   ...insertAdsPaginated(data.distinctNameList, randomad.value, likeList.value.length)
            // );
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
          
          const data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'));
            console.log(data, "分类返回2222222222222");

          if (data.list.length > 0) {
            // likeList.value.push(
            //   ...insertAdsPaginated(data.list, randomad.value, likeList.value.length)
            // );
            likeList.value = getAdlist([...likeList.value,...data.list])
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
      await getTagList()
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
    user,
    squaread,
    play,
    fenlei,
    paihang,
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
    onGetplay,

    // 方法
    getConfig,
    getGuangGao,
    getTagList,
    getData,
    getLikeData,
    loadMore,
    initHome,
    getAdOtlist
  }
})
