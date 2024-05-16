// 管理聊天记录和发音错误相关数据
import { ref, reactive } from 'vue';
import { defineStore } from 'pinia';

export const useScenesInfoStore = defineStore('scenesChat', () => {
    const scenesIndex = ref(-1) // 用户所选择场景的索引

    // 聊天记录state(仅句子内容) ==== 用 sentenceDetail.sentence 代替
    const userContent = reactive([])
    const teacherContent = reactive([])

    // 用户和教师消息的气泡框（不存储任何信息，仅用于更新气泡框）
    const user_popovers = reactive([])
    const teacher_popovers = reactive([])

    // 当前被点击的句子在userChatContent中的索引
    const clickedIndex = ref(-1)

    const sentencesDetail = reactive([]) // 存用户句子的所有分数相关的详细信息
	
	//55改，存当前教师和用户各自读到第几句
	const teacherBubble = ref(0)
	const studentBubble = ref(0)

    // 发音评估情况state

    return {
		scenesIndex,
        userContent,
        teacherContent,
        user_popovers,
        teacher_popovers,
        clickedIndex,
        sentencesDetail,
		teacherBubble,
		studentBubble,
    }
})