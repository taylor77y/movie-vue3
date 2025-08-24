<template>
    <div class="codelist">
        <div class="header">
            <div @click="onBack()"><van-icon name="arrow-left" color="white" size="22" /></div>
            <div class="tit"> 邀请人列表 </div>
            <div style="width: 22px;"></div>
        </div>
        <div class="list" ref="listContainer" @scroll="onScroll">
            <div class="item" v-for="(item) in list" :key="item.id">
                <div class="left">
                    <div>
                        <img :src="item.memberAvatar ? item.memberAvatar : avatar"
                            style="width: 50px;height: 50px;border-radius: 50px;" />
                    </div>
                    <div class="left-m">
                        <div>用户姓名：{{ item.memberNichen }}</div>
                        <div class="time">邀请时间：{{ item.createTime }}</div>
                    </div>
                </div>
                <div class="fl">福利+1天</div>
            </div>
            <div v-if="loading" class="loading">加载中...</div>
            <div v-if="noMore" class="no-more">没有更多了</div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import { post } from '@/utils/request'
import AES from '@/utils/aes1.js'
import { showSuccessToast } from "vant";
import { onMounted, ref } from "vue";
import avatar from "@/assets/my/avatar.png"
const router = useRouter()
const list = ref<any>([])
const currentPage = ref<any>(1)
const userinfo = ref<any>()
const loading = ref(false);
const noMore = ref(false);
const listContainer = ref<HTMLElement | null>(null);
const onBack = () => {
    router.back()
}

const onGetData = async () => {
    if (loading.value || noMore.value) return;

    loading.value = true;
    try {
        const res = await post('/renren-api/api/member/listInvitePaging', {
            currentPage: currentPage.value,
            parentId: userinfo.value.memberCode,
        });

        if (res.code === 0) {
            const dataList = res.data.list;
            if (dataList.length < 10) {
                noMore.value = true; // 没有更多数据了
            }
            list.value = [...list.value, ...dataList];
            currentPage.value++;
        }
    } finally {
        loading.value = false;
    }
};
// 滚动事件
const onScroll = async (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 10) {
        await onGetData(); // 到底部就加载下一页
    }
};

onMounted(async () => {
    const memberInfoStr = localStorage.getItem('memberInfo')
    if (memberInfoStr) {
        const data: any = JSON.parse(memberInfoStr)
        userinfo.value = data
        await onGetData()
    }
})
</script>
<style lang="less" scoped>
.codelist {
    height: 100vh;
    overflow: hidden;
    color: var(--text-color);
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

    .list {
        height: calc(100vh - 50px);
        overflow: auto;
        display: flex;
        flex-direction: column;

        .item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #ccc;
            padding-bottom: 10px;
            padding-top: 10px;

            .left {
                display: flex;

                .left-m {
                    height: 50px;
                    margin-left: 10px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;

                    .time {
                        font-size: 12px;
                    }
                }
            }

            .fl {
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: end;
                color: var(--primary-color);
            }
        }
    }

    .loading,
    .no-more {
        text-align: center;
        padding: 10px 0;
        color: var(--primary-color);
    }
}
</style>