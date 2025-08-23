<template>
  <div class="videoinfo">
    <div ref="PlayVideo" class="video-container"></div>
    <div class="introduce">
      {{ videoInfo.cartoonIntroduce }}
    </div>
    <div class="list">
      <div class="item">
        <img src="./../../assets/videoinfo/x.svg" class="item-img" />
        <div class="tit">选集</div>
      </div>
      <div class="item" @click="onShare()">
        <img src="./../../assets/videoinfo/shar.svg" class="item-img" />
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
    <!-- 底部弹出 -->
    <van-popup round v-model:show="showBottom" position="bottom" :style="{ height: '30%' }">
      <div class="pop-bottom">
        <div class="title">付费影视</div>
        <div class="line linetop">购买本集2金币</div>
        <div class="line">购买VIP</div>
        <div>取消</div>
      </div>
    </van-popup>
    <van-popup v-model:show="showCenter" round
      :style="{ backgroundColor: '#272727', width: '85%', padding: '10px 10px 30px 10px', }">
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
                <img src="./../../assets/videoinfo/view.png" style="width: 14px;height: 17px;" />{{
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
            <div class="invite-code-label">邀请码 {{ 12321 }}</div>
            <div class="invite-desc">每邀请1人送1天会员</div>
            <div class="addres">https://xdv5i7kq.com/#/pages/cartoon/cartoon-player?cartoonCode=30906&shareCode=91796</div>
          </div>
        </div>

        <div class="qr-section">
          <div class="actions">
            <button class="copy-btn" @click="copyQRCodeLink()">复制链接</button>
            <button class="save-btn" @click="downloadQRCode()">保存图片</button>
          </div>
        </div>

      </div>
    </van-popup>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, onUnmounted, onActivated, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showLoadingToast, closeToast, showFailToast,showSuccessToast } from 'vant'
import { post } from '@/utils/request'
import AES from "@/utils/aes1.js"
import DPlayer from 'dplayer'
import Hls from 'hls.js'
import likedIcon1 from '@/assets/videoinfo/dianz1.svg'
import likedIcon from '@/assets/videoinfo/dianz.svg'
import star1 from '@/assets/videoinfo/star1.svg'
import star from '@/assets/videoinfo/star.svg'
import QRCode from 'qrcode'
import { copyText } from '@lxf2513/vue3-clipboard';
const qrCodeUrl = ref<any>('')
const route = useRoute()
const router = useRouter()
const showBottom = ref(false)
const showCenter = ref(false)

// refs
const dp = ref<DPlayer | null>(null)
const PlayVideo = ref<HTMLDivElement | null>(null)
const hls = ref<any>(null)

// 数据
const videoInfo = ref<any>({ cartoonIntroduce: '' })
const srcList = ref<any>([])
const recommend = ref<any>([])
const danmuList = ref<any>([])
const config = ref<any>({})
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
  return videoInfo.value?.cartoonCode ? savedVideos.value.includes(videoInfo.value.cartoonCode) : false
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
  const code = videoInfo.value.cartoonCode
  const index = savedVideos.value.indexOf(code)
  if (index === -1) {
    savedVideos.value.push(code)
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
      console.log("收藏成功", data);
      showSuccessToast('收藏成功')
      //  await onGetSavelit()
    }
  } else {
    savedVideos.value.splice(index, 1)
  }
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

const onShare = () => {
  showCenter.value = !showCenter.value
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
  const res = await post('/app-api/cartoon/lookOk', { cartoonCode: id, moviesInfoId: srcList.value[0].urlList[0].id })
  if (res.code === 0) {
    const data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'))
    console.log(data, "onLookOk");
  }
}

const onGetVideoInfo = async (id: string | number) => {
  const res = await post('/app-api/cartoon/getVideoDetail', { index: 0, vid: id })
  if (res.code === 0) {
    const data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'))
    videoInfo.value = data.videoInfo
    recommend.value = data.recommend
    srcList.value = data.srcList
    danmuList.value = data.danmuList
    onCreatedVideo()
    await onLookOk(id)
    await onGetConfig()
  }
}

// ----- 创建播放器 -----
const onCreatedVideo = () => {
  if (!PlayVideo.value || !srcList.value.length) return
  if (dp.value) dp.value.destroy()
  if (hls.value) hls.value.destroy()

  dp.value = new DPlayer({
    container: PlayVideo.value,
    autoplay: true,
    theme: "#FF960C",
    loop: true,
    lang: "zh-cn",
    video: {
      url: srcList.value[0].urlList[0].url,
      pic: videoInfo.value.cartoonImage,
      type: "customHls",
      customType: {
        customHls: (video: HTMLVideoElement, player: any) => {
          if (Hls.isSupported()) {
            hls.value = new Hls()
            hls.value.loadSource(player.options.video.url)
            hls.value.attachMedia(video)
            video.muted = true
            hls.value.on(Hls.Events.MANIFEST_PARSED, () => {
              video.play().catch(() => {
                video.addEventListener("click", () => video.play(), { once: true })
              })
              setupTimeUpdate(video)
            })
            player.hlsInstance = hls.value
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = player.options.video.url
            video.addEventListener("loadedmetadata", () => {
              video.play()
              setupTimeUpdate(video)
            })
          } else {
            alert("当前浏览器不支持 HLS")
          }
        }
      }
    }
  })
}

const setupTimeUpdate = (video: HTMLVideoElement) => {
  video.addEventListener("timeupdate", () => {
    if (video.currentTime >= config.value.shikan) {
      video.pause()
      video.currentTime = config.value.shikan
      video.controls = false
      showBottom.value = true
      video.addEventListener("play", () => {
        if (video.currentTime >= config.value.shikan) {
          video.pause()
          showBottom.value = true
        }
      })
    }
  })
}
const copyQRCodeLink = async() => {
  let text ="123132123123123"
  copyText(text, undefined, (success, event) => {
    if (success) {
      showSuccessToast('复制成功');
    } else {
      showFailToast('复制失败');
    }
  });
}
const downloadQRCode= ()=>{
   if (!qrCodeUrl.value) return
  const a = document.createElement('a')
  a.href = qrCodeUrl.value
  a.download = 'qrcode.png'
  a.click()
}
// ----- 生命周期 -----
let initialized = false
onMounted(async () => {
 try {
  const text = 'https://www.example.com'
  qrCodeUrl.value = await QRCode.toDataURL(text, {
    width: 108,   // 二维码宽度
    margin: 1,    
    padding:2,
    color: {
      dark: '#000000',  // 二维码颜色
      light: '#ffffff'  // 背景颜色
    }
  })
  console.log(qrCodeUrl.value, "qrCodeUrl.value")
} catch (err) {
  console.error(err)
}
  const id: any = route.query.id
  if (!id) {
    let second = 3
    const toast = showLoadingToast({ duration: 0, forbidClick: true, message: `${second} 秒后退出,无携带参数` })
    const timer = setInterval(() => {
      second--
      if (second > 0) toast.message = `${second} 秒后退出,无携带参数`
      else { clearInterval(timer); closeToast(); router.back() }
    }, 1000)
  } else if (!initialized) {
    await onGetVideoInfo(id)
    initialized = true
  }
  await onGetSavelit()
})

// KeepAlive 缓存激活时触发
onActivated(async () => {
  const id: any = route.query.id
  if (!videoInfo.value.cartoonIntroduce && id) {
    await onGetVideoInfo(id)
  }
})

onUnmounted(() => {
  if (dp.value) { dp.value.destroy(); dp.value = null }
  if (hls.value) { hls.value.destroy(); hls.value = null }
})

defineOptions({
  name: 'VideoInfo'
})
</script>


<style lang="less" scoped>
.videoinfo {
  height: 100dvh;

  .video-container {
    width: 100%;
    height: 200px;
    background-color: black;
  }

  .introduce {
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
    display: flex
;
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
    display: flex
;
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
</style>
