<template>
    <div class="mask">
        <div class="header">
            <div ></div>
            <div class="tit">暗网</div>
            <div ></div>
        </div>
        <div class="mask-list">
            <div v-for="(item,index) in list" :key="item.id" class="mask-item">
                <div  class="mask-title">
                     <div class="flex">
                        <img src="./../assets/kl.png" style="width: 16px;height: 16px;" />
                        <div class="ditname">{{ item.dictName }}</div>
                     </div>
                    <div class="flex" @click="onGo(item,index)">
                        <div>查看更多</div>
                        <van-icon name="arrow" />
                    </div>
                </div>
                <div class="mask-li">
                    <PbCateInfoItem @goVideo="handleGoVideo" v-for="(i, index) in item.relationMovies" :key="item.id" :item="i" :index="index"
          @error="onImgError"  title="暗网"></PbCateInfoItem>
                </div>
                <div class="change-bt">
                    <div class="c-left" @click="onGo(item,index)">查看更多</div>
                      <div class="c-right" @click="onRef(item,index)"><van-icon name="replay" :class="{ spinning: loadingIndex === index }"  /> 换一批</div>
                </div>
            </div>
            <div style="height: 50px;"></div>
        </div>
    </div>
    </template>
<script lang="ts" setup>
import { onMounted,ref } from 'vue'
import { post } from '@/utils/request'
import AES from '@/utils/aes1.js'
import PbCateInfoItem from "@/components/PbCateInfoItem.vue"
import { useRouter } from "vue-router";
const router = useRouter()
const list = ref<any>([])
const loadingIndex = ref<any>('')
const onGetData = async()=>{
     const res = await post('/app-api/cartoon/selectSubjectByName', {
      dictName: '暗网',
      type: 0
    })
    if(res.code === 0){
       const data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'))
       console.log(data,"data");
       list.value = data
    }
}
const handleGoVideo=()=>{

}
const onImgError=()=>{
    
}
const onGo=async(item:any,index:any)=>{
    router.push({
        path:'/sreinfo',
        query:{
            type:item.pid,
            sonType:item.dictCode,
            searchStr:'',
            title:'暗网'
        }
    })
}
const onRef=async(item:any,index:any)=>{
       loadingIndex.value = index;
     const res = await post('/app-api/cartoon/changeBatch', {
        currentPage:1,
      dictName: item.dictName,
      type:item.dictCode
    })
    if(res.code === 0){
       const data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'))
       console.log(data,"data");
       list.value[index].relationMovies = data
    }
       loadingIndex.value = '';
}
onMounted(async()=>{
    await onGetData()
})
</script>
<style lang="less" scoped>
.mask{
    height: 100vh;
    padding: 10px;
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 10px;

        .tit {
            font-weight: bold;
        }
    }
    .mask-list{
        height: calc(100vh - 50px);
         overflow: auto;
        .mask-item{
             
               .mask-title{
                margin-bottom: 10px;
                display: flex;
                justify-content: space-between;
                .flex{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    line-height: 25px;
                    font-size: 13px;
                    .ditname{
                        color: var(--primary-color);
                        color: rgb(255, 150, 12);
                        font-size: 16px;
                        margin-left: 10px;
                    }
                }
        }  
        }
        .change-bt{
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
            .c-left{
               display: flex;
                justify-content: center;
                align-items: center;
                width: 48%;
                height: 32px;
                border-radius: 20px;
                font-size: 16px;
                padding-left: 6px;
                background: linear-gradient(rgb(255, 190, 0) 0%, rgb(255, 150, 12) 104.01%);
                color: black;
                font-weight: bold;
            }
            .c-right{
                display: flex;
                justify-content: center;
                align-items: center;
                width: 48%;
                height: 32px;
                border-radius: 20px;
                font-size: 16px;
                padding-left: 6px;
                background: linear-gradient(rgb(255, 190, 0) 0%, rgb(255, 150, 12) 104.01%);
                 color: black;
                   font-weight: bold;
            }
        }
     
    }
    .mask-li{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
}
.spinning {
  animation: spin 0.2s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>