<template>
  <div class="videoinfo" ref="videoRef" v-if="videoInfo.cartoonName">
    <div
      style="height: 50px;display: flex;align-items: center;justify-content: space-between;position: relative;z-index: 9999;width: 100%;">
      <div class="backicon" @click="onBack()"><van-icon name="arrow-left" color="#FFFFFF" size="22" /></div>
      <div class="ellipsis">{{ videoInfo.cartoonName }}</div>
      <div style="width: 22px;"></div>
    </div>
    <div ref="PlayVideo" class="video-container"></div>
    <div class="introduce">
      {{ videoInfo.cartoonIntroduce }}
    </div>
    <div class="list">
      <div class="item" @click="onSelect()">
        <img src="/videoinfo/x.svg" class="item-img" />
        <div class="tit">选集</div>
      </div>
      <div class="item" @click="onShare()">
        <img src="/videoinfo/shar.svg" class="item-img" />
        <div class="tit">分享</div>
      </div>
      <div class="item" @click="onLike()">
        <img :src="isLiked ? likedIcon1 : likedIcon" class="item-img" />
        <div class="tit" :class="{ 'active': isLiked }">{{ videoInfo.cartoonHot }}</div>
      </div>
      <div class="item" @click="onSave()">
        <img :src="isSaved ? star1 : star" class="item-img" />
        <div class="tit" :class="{ 'active': isSaved }">加入收藏</div>
      </div>
    </div>

    <div v-if="store.showAd" style="width: 100%;padding: 0 10px;margin-top: 10px;">
      <AD :list="[...store.squaread]"></AD>
    </div>
    <div style="padding: 0 10px;display: flex;
    flex-direction: column; ">
      <div class="title-header">
        <div class="left">
          <div class="line"></div>
          <div class="text">最新更新</div>
        </div>
        <div class="right">
          <div class="r-text">查看更多</div><van-icon name="arrow" />
        </div>
      </div>
      <div class="ranklist">
        <div v-for="(item, index) in recommend" class="cartoon-item">
          <div v-show="!loadedMap[item.cartoonCode]" :class="['skeleton-item', { 'full-width': index === 0 }]">
            <div class="skeleton-img">
              <van-loading type="spinner" />
            </div>
              <div class="skeleton-text">{{ item.cartoonName }}</div>
          </div>
          <CartoonItem v-show="loadedMap[item.cartoonCode]" @goVideo="handleGoVideo" :key="item.id" :item="item"
            title="最新更新" :index="index" :cartoon-name="item.cartoonName" @error="onImgError"
            @imgLoaded="handleImgLoaded" />
        </div>
      </div>

    </div>
    <!-- 底部弹出 -->
    <van-popup round v-model:show="showBottom" position="bottom" :style="{ height: '30%' }">
      <div class="pop-bottom">
        <div class="title">付费影视</div>
        <div class="line linetop" @click="onBuy()">购买本集2金币</div>
        <div class="line" @click="onVip()">购买VIP</div>
        <div @click="onCancel()">取消</div>
      </div>
    </van-popup>
    <van-popup v-model:show="showCenter" round
      :style="{ backgroundColor: '#272727', width: '85%', padding: '10px 10px 30px 10px', }">
      <div style="position: relative;z-index: 9999;">
        <div style="display: flex;align-items: end;justify-content: end;"><van-icon name="cross"
            @click="showCenter = false" size="22" /></div>
        <div class="share-card">
          <div class="header">
            <div class="logo">91PORN</div>
            <div style="margin-left: 10px;display: flex;flex-direction: column;">
              <div class="platform-name">91PORN</div>
              <div class="platform-name">最大成人视频平台</div>
            </div>
          </div>
          <div class="video-preview">
            <div style="position: relative;">
              <img :src="videoInfo.cartoonImage" class="preview-img" />
              <div class="overlay">
                <div class="views" style="display: flex;align-items: center;">
                  <img src="/videoinfo/view.png" style="width: 14px;height: 17px;" />{{
                    videoInfo.cartoonHot }}万
                </div>
                <div class="duration">{{ videoInfo.vodDuration }}</div>
              </div>
            </div>
            <div class="video-title">{{ videoInfo.cartoonName }}</div>
          </div>

          <div class="invite-section">
            <div style="width: 50%;">
              <div class="qr-container">
                <img :src="qrCodeUrl" alt="二维码" v-if="qrCodeUrl" class="qr-image" />
              </div>
            </div>
            <div style="margin-left: 10px;width: 50%;">
              <div class="invite-code-label">邀请码 {{ memberinfo.memberCode }}</div>
              <div class="invite-desc">每邀请1人送1天会员</div>
              <div class="addres">{{ url }}
              </div>
            </div>
          </div>

          <div class="qr-section">
            <div class="actions">
              <button class="copy-btn" @click="copyQRCodeLink()">复制链接</button>
              <button class="save-btn" @click="downloadQRCode()">保存图片</button>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
    <!-- 底部弹出 -->
    <van-popup v-model:show="showSelect" closeable position="bottom"
      :style="{ height: '30%', backgroundColor: '#333' }">
      <div v-for="(item, index) in srcList" :key="index" class="srclit">
        <div class="srtitle">{{ item.channel }}</div>
        <div class="srbtn" @click="onPlay(item, index)">{{ item.urlList[0].name }}</div>
      </div>
    </van-popup>

  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, onUnmounted, computed, watchEffect, nextTick, onBeforeMount, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showLoadingToast, closeToast, showFailToast, showSuccessToast } from 'vant'
import { post } from '@/utils/request'
import { useHomeStore } from '@/store/home'
import CartoonItem from "@/components/CartoonItem.vue"
import AES from "@/utils/aes1.js"

const likedIcon1 = '/videoinfo/dianz1.svg';
const likedIcon = '/videoinfo/dianz.svg';
const star1 = '/videoinfo/star1.svg';
const star = '/videoinfo/star.svg';
const placeholder = '/Image/pl.png';


import QRCode from 'qrcode'
import { copyText } from '@lxf2513/vue3-clipboard';
import moment from 'moment'
import AD from "@/components/Ad.vue"
const videoRef = ref<HTMLDivElement | null>(null)
const url = ref<any>('')
const store = useHomeStore()
const moveId = ref<any>(0)
const islookok = ref<any>(false)
const memberinfo = ref<any>({
  memberCode:0
})
const scrollTop = () => {
  if (videoRef.value) {
    videoRef.value.scrollTop = 0  // 滚动到顶部
  }
}
const qrCodeUrl = ref<any>('')
const route = useRoute()
const router = useRouter()
const showBottom = ref(false)
const showCenter = ref(false)
const showSelect = ref(false)
// refs
const dp = ref<any>(null)
const PlayVideo = ref<any>(null)
const hls = ref<any>(null)

// 数据
const videoInfo = ref<any>({ cartoonIntroduce: '' })
const srcList = ref<any>([])
const recommend = ref<any>([])
const danmuList = ref<any>([])
const config = ref<any>({})
let currentVideoId: string | null = null;
// 假设 localStorage 里保存了已点赞的视频 id
// 喜欢的视频列表
const likedVideos = ref<number[]>(JSON.parse(localStorage.getItem('likedVideos') || '[]'))
// 收藏的视频列表
const savedVideos = ref<number[]>(JSON.parse(localStorage.getItem('savedVideos') || '[]'))

// 当前视频是否已喜欢
const isLiked = computed(() => {
  return videoInfo.value?.cartoonCode ? likedVideos.value.includes(videoInfo.value.cartoonCode) : false
})

// 当前视频是否已收藏
const isSaved = computed(() => {
  if (!videoInfo.value) return false
  return savedVideos.value.some((v: any) => v.cartoonCode === videoInfo.value.cartoonCode)
})

// 喜欢/取消喜欢
const onLike = async () => {
  if (!videoInfo.value) return
  const code = videoInfo.value.cartoonCode
  const index = likedVideos.value.indexOf(code)
  if (index === -1) {
    likedVideos.value.push(code)
    // 调用接口收藏
    const res = await post('/renren-api/api/member/like', {
      collectAuthor: videoInfo.value.cartoonAuthor,
      collectCode: videoInfo.value.cartoonCode,
      collectDuration: videoInfo.value.vodDuration,
      collectHot: videoInfo.value.cartoonHot,
      collectImage: videoInfo.value.cartoonImage,
      collectName: videoInfo.value.cartoonName,
      collectType: videoInfo.value.sonDictCode,
      sortNum: videoInfo.value.dictCode,
      type: 2
    })

    if (res.code === 0) {
      const data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'))
      // 不显示提示
      showSuccessToast('点赞成功')
    }
  } else {
    likedVideos.value.splice(index, 1)
  }
  localStorage.setItem('likedVideos', JSON.stringify(likedVideos.value))
}

// 收藏/取消收藏
const onSave = async () => {
  if (!videoInfo.value) return

  const index = savedVideos.value.findIndex((v: any) => v.cartoonCode === videoInfo.value.cartoonCode)

  if (index === -1) {
    // 添加整个对象
    savedVideos.value.push({ ...videoInfo.value })

    // 调用接口收藏
    const res = await post('/renren-api/api/member/like', {
      collectAuthor: videoInfo.value.cartoonAuthor,
      collectCode: videoInfo.value.cartoonCode,
      collectDuration: videoInfo.value.vodDuration,
      collectHot: videoInfo.value.cartoonHot,
      collectImage: videoInfo.value.cartoonImage,
      collectName: videoInfo.value.cartoonName,
      collectType: videoInfo.value.sonDictCode,
      sortNum: videoInfo.value.dictCode,
      type: 2
    })

    if (res.code === 0) {
      const data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'))
      console.log("收藏成功", data)
      showSuccessToast('收藏成功')
    }

  } else {
    // 取消收藏
    savedVideos.value.splice(index, 1)
    showSuccessToast('已取消收藏')
  }

  // 更新 localStorage
  localStorage.setItem('savedVideos', JSON.stringify(savedVideos.value))
}
const onGetSavelit = async () => {
  const res = await post('/renren-api/api/member/getCollectList', {})
  if (res.code === 0) {
    const data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'))
    // 不显示提示
    console.log('收藏list', data);
  }
}
const onCancel = () => {
  router.back()
}
const onVip = () => {
  router.push({
    path: '/vip'
  })
}
const onPlay = (item: any, index: any) => {
  moveId.value = index
  const url = item.urlList[0].url;
  if (!dp.value) return;
  // 清理旧 Hls
  if (dp.value.hlsInstance) {
    try {
      dp.value.hlsInstance.stopLoad?.();
      dp.value.hlsInstance.detachMedia?.();
      dp.value.hlsInstance.destroy?.();
    } catch (e) { }
    dp.value.hlsInstance = null;
  }

  // 切换 video 配置
  dp.value.switchVideo({
    url,
    type: "customHls",
    pic: item.cover || "",
  });

  // 重新挂载 Hls
  const customHls = dp.value.options.video.customType?.customHls;
  if (typeof customHls === "function") {
    customHls(dp.value.video, dp.value);
  }

  // 恢复声音
  dp.value.video.muted = false;
  onSelect();
  // 播放
  dp.value.play().catch((err: any) => {
    console.warn("播放被阻止:", err);
  });
};


// 图片错误占位
const onImgError = (event: any) => {
  event.target.src = placeholder
}

const onShare = () => {
  showCenter.value = !showCenter.value
}
const onSelect = () => {
  showSelect.value = !showSelect.value
}
const loadedMap = reactive<any>({
})
// 初始化
const handleImgLoaded = ({
  title,
  index,
  time,
  id
}: {
  title: string
  index: number
  time: number,
  id: any
}) => {
  loadedMap[id] = true
}

// ----- API -----
const onGetConfig = async () => {
  const res = await post('/app-api/ajax/getConfig', {})
  if (res.code === 0) {
    const data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'))
    config.value = data
  }
}

const onLookOk = async (id: any) => {
  if (!srcList.value.length) return
  const res = await post('/app-api/cartoon/lookOk', { cartoonCode: id * 1, moviesInfoId: srcList.value[0].urlList[0].id * 1 })
  if (res.code === 0) {
    if (res.data === true) {
      islookok.value = res.data
    }
  }
}

const onGetVideoInfo = async (id: any) => {
  const res = await post('/app-api/cartoon/getVideoDetail', { index: 0, vid: id })
  if (res.code === 0) {
    const data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'))
    videoInfo.value = data.videoInfo
    recommend.value = data.recommend
    srcList.value = data.srcList
    danmuList.value = data.danmuList
    addToHistory(videoInfo.value)
    await onGetConfig()
    await onLookOk(id)
    const origin = new URL(srcList.value[0].urlList[0].url).origin
    if (!document.querySelector(`link[rel="preconnect"][href="${origin}"]`)) {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = origin
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    }
    nextTick(async () => {
      await onCreatedVideo()
      showCenter.value = false
    })
  }
}

const addToHistory = (video: any) => {
  const key = 'videoHistory'
  // 获取本地历史
  let history: any[] = JSON.parse(localStorage.getItem(key) || '[]')

  // 如果已存在该视频，先移除
  history = history.filter(item => item.cartoonCode !== video.cartoonCode)

  // 添加到开头
  history.unshift(video)

  // 保存到 localStorage
  localStorage.setItem(key, JSON.stringify(history))

  // 可选：限制历史记录条数，比如最多 50 条
  if (history.length > 50) {
    history = history.slice(0, 50)
    localStorage.setItem(key, JSON.stringify(history))
  }
}
// ----- 创建播放器 -----
// ----- 创建播放器 -----
const onCreatedVideo =async  () => {
  if (!PlayVideo.value || !srcList.value.length) return;
    const DPlayer = (await import('dplayer')).default;
  const Hls = (await import('hls.js')).default;
  // 销毁旧播放器和 HLS
  dp.value?.destroy();
  dp.value = null;
  if (hls.value) {
    try {
      hls.value.off(Hls.Events.ERROR);
      hls.value.detachMedia();
      hls.value.destroy();
    } catch (e) {
      console.warn("HLS destroy error:", e);
    }
    hls.value = null;
  }

  const videoUrl = srcList.value[0].urlList[0].url;

  // MP4 提前预加载元数据
  if (!Hls.isSupported() && videoUrl.endsWith(".mp4")) {
    const tempVideo = document.createElement("video");
    tempVideo.preload = "metadata";
    tempVideo.src = videoUrl;
    tempVideo.muted = true;
    tempVideo.playsInline = true;
    tempVideo.play().catch(() => { });
  }

  // 创建 DPlayer
  dp.value = new DPlayer({
    container: PlayVideo.value,
    autoplay: true,
    theme: "#FF960C",
    loop: true,
    lang: "zh-cn",
    video: {
      url: videoUrl,
      pic: videoInfo.value.cartoonImage,
      type: "customHls",
      playsinline: true,
      muted: true,
      controls: false,
      customType: {
        customHls: (video: HTMLVideoElement, player: any) => {
          // ✅ Safari / iOS 原生 HLS
          if (video.canPlayType("application/vnd.apple.mpegurl") && videoUrl.endsWith(".m3u8")) {
            video.src = videoUrl;
            video.playsInline = true;
            video.muted = true;
            video.preload = "auto";
            video.addEventListener("loadedmetadata", () => {
              video.play().catch(() => {
                video.addEventListener("click", () => video.play(), { once: true });
              });
              setupTimeUpdate(video);
            });
            return;
          }

          // ✅ 其他浏览器走 hls.js
          if (Hls.isSupported() && videoUrl.endsWith(".m3u8")) {
            hls.value = new Hls({
              autoStartLoad: true,
              startPosition: 0,
              lowLatencyMode: true,
              maxBufferLength: 1,       // 尽快首帧
              maxMaxBufferLength: 2,
              liveSyncDuration: 1,
              liveMaxLatencyDuration: 3,
              enableWorker: true,
            });

            hls.value.loadSource(videoUrl);
            hls.value.attachMedia(video);

            // ✅ 立即强制开始拉流，避免延迟
            hls.value.startLoad(0);

            hls.value.on(Hls.Events.MANIFEST_PARSED, () => {
              video.play().catch(() => {
                video.addEventListener("click", () => video.play(), { once: true });
              });
              setupTimeUpdate(video);
            });

            let retryCount = 0;
            hls.value.on(Hls.Events.ERROR, (event, data) => {
              if (data.fatal) {
                switch (data.type) {
                  case Hls.ErrorTypes.NETWORK_ERROR:
                    if (retryCount < 3) {
                      retryCount++;
                      console.warn("尝试恢复网络错误，次数：", retryCount);
                      hls.value?.startLoad(0);
                    } else hls.value?.destroy();
                    break;
                  case Hls.ErrorTypes.MEDIA_ERROR:
                    hls.value?.recoverMediaError();
                    break;
                  default:
                    hls.value?.destroy();
                    break;
                }
              }
            });

            player.hlsInstance = hls.value;
          } else {
            // ✅ MP4 或不支持 HLS 的情况
            video.src = videoUrl;
            video.playsInline = true;
            video.muted = true;
            video.preload = "auto";
            video.addEventListener("loadedmetadata", () => {
              video.play().catch(() => {
                video.addEventListener("click", () => video.play(), { once: true });
              });
              setupTimeUpdate(video);
            });
          }
        }
      }
    }
  });
};

// ----- 试看限制 -----
const setupTimeUpdate = (video: HTMLVideoElement) => {
  video.addEventListener("timeupdate", () => {
    const vipdata = getVipStatus();
    if (!vipdata.isVip || vipdata.memberVip <= 0) {
      if (islookok.value) {
        // 已购买过不限制
      } else {
        if (video.currentTime >= config.value.shikan) {
          video.pause();
          video.currentTime = config.value.shikan;
          video.controls = false;
          showBottom.value = true;
          video.addEventListener("play", () => {
            if (video.currentTime >= config.value.shikan) {
              video.pause();
              showBottom.value = true;
            }
          });
        }
      }
    }
  });
};

const copyQRCodeLink = async () => {
  let text = url.value
  copyText(text, undefined, (success, event) => {
    if (success) {
      showSuccessToast('复制成功');
    } else {
      showFailToast('复制失败');
    }
  });
}
const downloadQRCode = () => {
  if (!qrCodeUrl.value) return
  const a = document.createElement('a')
  a.href = qrCodeUrl.value
  a.download = '视频分享好友.png'
  a.click()
}
// 监听 route.query.id 变化，只在真正变化时加载视频
watchEffect(() => {
  const newId = route.query.id as string;
  if (newId && newId !== currentVideoId) {
    currentVideoId = newId;
    onGetVideoInfo(currentVideoId);
  }
});
const onBack = () => {
  router.back()
}


const handleGoVideo = (item: any) => {
  console.log('即将跳转', item.cartoonCode)
  router.push({
    path: '/videoinfo',
    query: { id: item.cartoonCode }
  }).catch(err => console.warn(err))
  scrollTop();
}

const onBuy = async () => {
  const data = {
    cartoonCode:
      videoInfo.value.cartoonCode * 1,
    moviesInfoId
      : srcList.value[0].urlList[moveId.value].id * 1,
    type: 0
  }
  const res = await post('/app-api/cartoon/buy', { ...data })
  console.log(res, "res");
  if (res.code === 0) {
    const data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'))
    showSuccessToast(data)
    await onGetConfig()
    await onLookOk(videoInfo.value.cartoonCode * 1)
    nextTick(async () => {

      await onCreatedVideo()
      showBottom.value = false
    })
  } else {
    router.push({
        path: '/pay'
      })
  }

}
const onGetUserInfo = async () => {
  // 1. 先尝试从 localStorage 获取
  const cached = localStorage.getItem('memberInfo')
  if (cached) {
    try {
      const data = JSON.parse(cached)
      console.log('本地缓存用户信息', data)
      memberinfo.value = data
      return data
    } catch (e) {
      console.error('解析本地缓存出错', e)
      // 如果解析出错，继续请求接口
    }
  }
  // 2. 如果没有缓存，或者缓存解析失败，则请求接口
  try {
    const res = await post('/app-api/member/getEntityByCode', {})
    if (res.code === 0) {
      // 假设 res.data 是加密后的字符串
      const data = AES.decrypt(res.data, 'asdasdsadasdasds', { iv: '5245847584125485' }).toString(AES.enc.Utf8)
      console.log('用户详情', data)
      memberinfo.value = data
      // 3. 存入 localStorage，下次直接使用
      localStorage.setItem('memberInfo', JSON.stringify(data))
      return data
    } else {
      console.error('接口返回错误', res)
    }
  } catch (err) {
    console.error('获取用户信息失败', err)
  }
}


function getVipStatus() {
  const now = moment() // 当前时间
  const vipStart = moment(memberinfo.value.vipDate, 'YYYY-MM-DD HH:mm:ss') // 解析 vipDate

  if (!vipStart.isValid()) {
    console.warn('vipDate 无效', memberinfo.value.vipDate)
    return {
      memberVip: memberinfo.value.memberVip,
      isVip: false,
      vipEndDate: null,
      remainingDays: 0
    }
  }
  const vipEnd = vipStart.clone().add(memberinfo.value.vipPeriod, 'days') // VIP 到期时间
  const isVip = memberinfo.value.memberVip > 0 && now.isBefore(vipEnd)
  const remainingDays = isVip ? vipEnd.diff(now, 'days') : 0
  return {
    memberVip: memberinfo.value.memberVip,
    isVip,
    vipEndDate: vipEnd.format('YYYY-MM-DD HH:mm:ss'),
    remainingDays
  }
}

const onBindCode = async (parentId: any) => {
  const res = await post('/renren-api/api/member/bindInviteCode', {
    parentId: parentId
  })
  if (res.code = !0) {
    // showFailToast(res.msg)
  }
}

onBeforeMount(async () => {
  const id: any = route.query.id
  if (!id) {
    let second = 3
    const toast = showLoadingToast({ duration: 0, forbidClick: true, message: `${second} 秒后退出,无携带参数` })
    const timer = setInterval(() => {
      second--
      if (second > 0) toast.message = `${second} 秒后退出,无携带参数`
      else { clearInterval(timer); closeToast(); router.back() }
    }, 1000)
  } else {
    await onGetUserInfo()
    await onGetVideoInfo(id)
  }

}),
  // ----- 生命周期 -----
  onMounted(async () => {
    const share: any = route.query.share
    if (share) {
      await onBindCode(share)
    }
    try {
      const text = window.location.href + '&' + `share=${memberinfo.value.memberCode}`
      url.value = text
      qrCodeUrl.value = await QRCode.toDataURL(text, {
        width: 108,   // 二维码宽度
        margin: 1,
        padding: 2,
        color: {
          dark: '#000000',  // 二维码颜色
          light: '#ffffff'  // 背景颜色
        }
      })
      console.log(qrCodeUrl.value, "qrCodeUrl.value")
    } catch (err) {
      console.error(err)
    }
    // await onGetSavelit()
    await nextTick(); // 等待 DOM 渲染
    // 强制滚动到顶部

  })

onUnmounted(() => {
  if (dp.value) { dp.value.destroy(); dp.value = null }
  if (hls.value) {
    hls.value.detachMedia();
    hls.value.destroy();
    hls.value = null;
  }
})

defineOptions({
  name: 'VideoInfo'
})
</script>


<style lang="less" scoped>
.videoinfo {
  height: 100vh;
  overflow: auto;
  box-sizing: border-box;

  .backicon {
    background-color: rgba(0, 0, 0, .5);
    width: 30px;
    height: 30px;
    border-radius: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .video-container {
    width: 100%;
    height: 200px;
    background-color: black;
    position: relative;
    /* 必须有定位 */
    z-index: 1;
    /* 保证低于弹窗 */
    transform: translateZ(0);
    /* 强制 GPU 图层 */
  }

  .introduce {
    margin-top: 10px;
    font-size: 12px;
    padding: 0 10px;
  }

  .list {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-top: 15px;

    .item {
      display: flex;
      align-items: center;
      flex-direction: column;

      .item-img {
        width: 16px;
        height: 16px;
      }

      .tit {
        padding-top: 5px;
        font-size: 12px;
      }

      .active {
        color: var(--primary-color);
      }
    }
  }
}

.pop-bottom {
  color: black;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  >div {
    height: 23%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: bold;
  }

  .linetop {
    border-top: 1px solid #e5e5e5;
  }

  .line {
    border-bottom: 1px solid #e5e5e5;
  }

  .title {
    color: var(--primary-color);
  }
}

.share-card {
  background-color: #272727;

  .header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .logo {
      width: 49px;
      height: 49px;
      background-color: #ffa208;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: eryaxindahei;
      font-size: 11px;
      font-weight: 700;
      color: #000;
      padding: 5px;
    }

    .platform-name {
      font-size: 14px;
    }
  }

  .video-preview {
    display: flex;
    flex-direction: column;
    background-color: #FFFFFF1A;

  }

  .preview-img {
    width: 100%;
    height: 150px;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
  }

  .overlay {
    position: absolute;
    bottom: 10px;
    left: 10px;
    right: 10px;
    display: flex;
    justify-content: space-between;
    color: #fff;
    font-family: PingFang SC;
    font-weight: 400;
    font-style: Medium;
    font-size: 12px;
    line-height: 14px;
    letter-spacing: 0;
  }

  .video-title {
    font-size: 12px;
    color: white;
    background: hsla(0, 0%, 100%, .10196078431372549);
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    text-align: center;
    line-height: 35px;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }

  .invite-section {
    margin-top: 10px;
    text-align: center;
    display: flex;
  }

  .invite-code-label {
    text-align: left;
    font-family: PingFang SC;
    font-weight: 700;
    font-size: 18px;
    color: #fff;
  }

  .invite-desc {
    padding: 5px 0;
    text-align: left;
    font-family: PingFang SC;
    font-weight: 700;
    color: #999;
  }

  .addres {
    color: #666;
    font-size: 12px;
    text-align: left;
    word-wrap: break-word;
    word-break: break-word;
    white-space: normal
      /* 默认行为，允许自动换行 */
    ;
  }
}

.actions {
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
}

.copy-btn {
  width: 43%;
  height: 39px;
  background-color: #999;
  border: none;
  color: black;
  border-radius: 39px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.save-btn {
  width: 43%;
  height: 39px;
  background-color: #fc0;
  border: none;
  color: black;
  font-weight: bold;
  border-radius: 39px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.srclit {
  display: flex;
  flex-direction: column;
  padding: 10px;

  .srtitle {
    color: var(--primary-color);
    font-weight: bold;
  }

  .srtitle::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -2px;
    /* 距离文字底部的距离，可以自己调 */
    width: 100%;
    height: 2px;
    /* 下划线粗细 */
    background-color: var(--primary-color);
    border-radius: 2px;
    /* 下划线圆角，可选 */
    font-size: 18px;
  }

  .srbtn {
    background-color: var(--primary-color);
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-color);
    width: 20%;
    font-weight: bold;
    font-size: 18px;
  }
}

.ranklist {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.ellipsis {
  width: 150px;
  /* 固定宽度 */
  white-space: nowrap;
  /* 不换行 */
  overflow: hidden;
  /* 超出隐藏 */
  text-overflow: ellipsis;
  /* 显示省略号 */
}

.cartoon-item {
  width: 48%;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}
</style>
