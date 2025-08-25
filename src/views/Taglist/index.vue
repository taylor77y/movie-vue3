<template>
    <div class="tag">
        <div class="header">
            <div @click="onBack()"><van-icon name="arrow-left" color="white" size="22" /></div>
            <div class="tit"></div>
            <div></div>
        </div>
        <div class="flex"> <van-search v-model="val" placeholder="搜索"
                style="margin-right: 10px;background-color: #333333;width: 85%;" />
            <div class="ons" @click="onSreach()">搜索</div>
        </div>

        <!-- 左右布局 -->
        <div class="content">
            <!-- 左侧列表 -->
            <div class="left-list">
                <div v-for="(item, index) in typeList" :key="index" class="left-item"
                    :class="{ active: activeIndex === index }" @click="onChange(index)">
                    {{ item.dictName }}
                </div>
            </div>

            <!-- 右侧列表 -->
            <div class="right-panel">
                <div class="dictname">{{ typeList[activeIndex]?.dictName }}</div>
                <div class="right-list">
                    <div v-for="(item, index) in childList" :key="index" class="right-item"
                        :class="{ active: activeMinIndex === index }" @click="onChangeMin(index)">
                        {{ item.dictName }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import { post } from '@/utils/request'
import { onMounted, ref } from "vue";

// 数据
const typeList = ref<any>([]);
const childList = ref<any>([]);
const activeIndex = ref<any>(0);
const activeMinIndex = ref<any>(0);
const dictCode = ref<any>("");
const searchValue = ref<any>("");


const val = ref<any>('')
const router = useRouter()

const onBack = () => {
    router.back()
}
// 方法
const onChange = (index: any) => {
    activeIndex.value = index;
    childList.value = typeList.value[index].child;
};
const onChangeMin = (index: any) => {
    activeMinIndex.value = index;
    // 假设 $openWin 是全局挂载的方法
      const query = {
        sonType: childList.value[activeMinIndex.value].dictCode,
        type: typeList.value[activeIndex.value].dictCode,
        searchStr: val.value,
        title: typeList.value[activeIndex.value].dictName
    }
    router.push({
        path: '/sreinfo',
        query: {
            ...query
        }
    })

};
const onSreach = () => {
      const query = {
        sonType: '',
        type: '',
        searchStr: val.value,
        title: ''
    }
    router.push({
        path: '/sreinfo',
        query: {
            ...query
        }
    })
}


const onGetTag = async () => {
    const res = await post('/app-api/cartoon/listLeftType', {
        dictCode: "", dictLevel: 1
    })
    if (res.code === 0) {
        console.log(res.data, "data");
        typeList.value = res.data;
        childList.value = res.data[0]?.child ?? [];
    }
}
onMounted(async () => {
    await onGetTag()
})
</script>
<style lang="less" scoped>
.tag {
    height: 100vh;
    padding: 10px;
    overflow: hidden;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 10px;

        .tit {
            font-weight: bold;
        }
    }

    .flex {
        display: flex;
        align-items: center;

        .ons {
            background: linear-gradient(180deg, #FFBE00 0%, #FF960C 100%);
            color: black;
            width: 15%;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 20px;
            font-size: 14px;
            padding: 2px 8px;
        }
    }

    /* 内容区域 左右布局 */
    .content {
        display: flex;
        height: calc(100vh - 80px);
        margin-top: 10px;
        overflow: auto;
    }

    /* 左侧列表 */
    .left-list {
        width: 24%;
        background-color: var(--bg-color);
        color: white;
        height: calc(100vh - 80px);
        overflow: auto;
    }

    .left-item.active {
        width: 100%;
        height: 30px;
        border-radius: 4px;
        text-align: center;
        background: linear-gradient(360deg, #ff960c 0%, #febc01 103.12%);
        padding: 5px;
        font-family: "PingFang SC";
        font-weight: bold;
        font-size: 16px;
        line-height: 16px;
        color: white;
    }

    .left-item {
        width: 100%;
        border-radius: 4px;
        text-align: center;
        background: var(--br-color);
        padding: 5px 10px;
        font-family: "PingFang SC";
        font-weight: bold;
        font-size: 16px;
        color: var(--text-color);
        margin-bottom: 10px;
    }

    .dictname {
        padding: 0 10px;
        color: var(--text-color);
        font-size: 16px;
        height: 32px;
        line-height: 32px;
    }

    .right-panel {
        width: 76%;
    }

    /* 右侧列表 */
    .right-list {
        display: flex;
        align-items: center;
        justify-content: start;
        flex-wrap: wrap;
        background-color: var(--bg-color);
        padding: 0 10px;
        width: 100%;
    }

    .right-item.active {
        min-width: 30%;
        margin-right: 3%;
        height: 32px;
        background: linear-gradient(360deg, #ff960c 0%, #febc01 103.12%);
        color: black;
        border-radius: 8px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 5px;
    }

    .right-item {
        min-width: 30%;
        margin-right: 3%;
        height: 32px;
        background-color: var(--br-color);
        color: var(--text-color);
        border-radius: 8px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 5px;
    }

    .search-btn {
        margin-left: 10px;
        padding: 0 15px;
        height: 35px;
        line-height: 35px;
        border-radius: 5px;
        background: linear-gradient(360deg, #ff960c 0%, #febc01 103.12%);
        color: #fff;
        font-size: 14px;
        text-align: center;
    }

}

/deep/ .van-search {
    padding: 0px;
    background: #333333;
    border-radius: 6px;

    .van-search__content {
        background: #333333 !important;
    }

    .van-field__control {
        color: var(--text-color);
    }
}
</style>