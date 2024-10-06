<template>
  <v-container class="mt-5">
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center">
          <v-img
            :src="require('@/assets/community.png')"
            alt="Community Icon"
            height="50px"
            class="mb-0"
            style="margin-right: 0;"
          ></v-img>
          <v-col class="inter-bold title">의사 Q&A</v-col>
        </div>
      </v-col>
    </v-row>

    <v-card class="pa-5" v-if="postDetail">
      <div class="d-flex justify-space-between align-center mb-3">
        <v-divider>
          <h4 class="text-h6">{{ postDetail.memberEmail }}</h4>
        </v-divider>

        <v-col class="d-flex justify-end" style="flex-grow: 1;">
          <span @click="edit" class="d-flex align-center action-link mr-2">
            <img
              :src="require('@/assets/pencil.png')"
              alt="Edit Icon"
              height="20px"
              class="mr-1"
            />
            수정
          </span>
          <span @click="deletePost" class="d-flex align-center action-link">
            <img
              :src="require('@/assets/delete.png')"
              alt="Delete Icon"
              height="20px"
              class="mr-1"
            />
            삭제
          </span>
        </v-col>
      </div>

      <v-row class="mb-5">
        <v-col cols="12" md="12">
          <v-card flat>
            <v-card-text>
              <div>
                {{ postDetail.title }} 
                <br><p>{{ postDetail.content }}</p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <div class="image-container">
        <v-img v-if="postDetail.postImgUrl" :src="postDetail.postImgUrl" alt="게시글 이미지" class="mb-3 rounded center-image" />
      </div>

      <v-row>
        <v-divider></v-divider>
        <v-col cols="12">
          <h4 class="text-h6 font-weight-bold">댓글</h4>
          <v-list>
            <v-list-item v-for="comment in postDetail.comments" :key="comment.id" class="py-2">
              <v-card :style="{ backgroundColor: comment.parentId ? '#898787' : (comment.memberEmail === currentUserEmail ? '#F9F9F9' : '#ECF2FE') }" class="mb-2" outlined>
                <v-card-text>
                  <div class="d-flex justify-space-between align-center">
                    <div style="flex: 9;">
                      <div class="comment-text">
                        <v-list-item-title class="text-subtitle-1">{{ comment.doctorEmail }}</v-list-item-title>
                        <v-list-item-subtitle>{{ comment.content }} - {{ formatDate(comment.createdTime) }}</v-list-item-subtitle>
                      </div>
                    </div>
                    <div style="flex: 1;">
                      <v-img
                        :src="require('@/assets/report.png')"
                        alt="Report Icon"
                        height="20px"
                        class="cursor-pointer"
                        @click="openReportModal('comment', comment)"
                      ></v-img>
                    </div>
                  </div>
                </v-card-text>

                <v-card-actions>
                  <span @click="comment.showTextarea = !comment.showTextarea" class="d-flex align-center action-link mr-2">
                    <img
                      :src="require('@/assets/comment.png')"
                      alt="Comment Icon"
                      height="20px"
                    />
                    댓글달기
                  </span>
                </v-card-actions>

                <v-form v-if="comment.showTextarea" @submit.prevent="submitComment(comment)">
                  <v-textarea
                    v-model="comment.newComment"
                    label="댓글달기"
                    outlined
                    required
                  ></v-textarea>
                  
                  <span 
                    @click="submitComment(comment)" 
                    class="d-flex align-center action-link"
                    style="cursor: pointer; display: inline-block; padding: 10px; color: #898787; border-radius: 5px; text-align: center; margin-top: 10px;"
                  >
                    <img
                      :src="require('@/assets/pencil.png')"
                      alt="Comment Icon"
                      height="20px"
                      class="mr-1"
                    />
                    저장
                  </span>
                </v-form>

                <!-- 대댓글 표시 -->
                <v-list v-if="comment.replies && comment.replies.length">
                  <v-list-item v-for="reply in comment.replies" :key="reply.id">
                    <v-card :style="{ backgroundColor: '#898787' }" class="mb-2" outlined>
                      <v-card-text>
                        <div class="comment-text">
                          <v-list-item-title class="text-subtitle-1">{{ reply.doctorEmail }}</v-list-item-title>
                          <v-list-item-subtitle>{{ reply.content }} - {{ formatDate(reply.createdTime) }}</v-list-item-subtitle>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-card>

    <v-alert type="error" v-if="error">{{ error }}</v-alert>
    <ReportCreate v-if="showReportModal" :postId="reportData.postId" :commentId="reportData.commentId" @close="closeReportModal" />
  </v-container>
</template>

<script>
import axios from 'axios';
import ReportCreate from '@/views/report/ReportCreate.vue';

export default {
  components: {
    ReportCreate,
  },
  data() {
    return {
      postDetail: null,
      error: null,
      showReportModal: false,
      reportData: {},
      currentUserEmail: 'your-email@example.com', // 현재 사용자 이메일 (실제 이메일로 설정)
    };
  },
  created() {
    this.fetchPostDetail();
  },
  methods: {
    edit() {
      this.$router.push(`/update/${this.postDetail.id}`);
    },
    deletePost() {
      const confirmed = confirm("게시글을 정말 삭제하시겠습니까?");
      if (confirmed) {
        axios.delete(`${process.env.VUE_APP_API_BASE_URL}/post/delete/${this.postDetail.id}`)
          .then(() => {
            this.$router.push('/community/list');
          })
          .catch(error => {
            console.error("게시글 삭제에 실패했습니다.", error);
            this.error = '게시글 삭제에 실패했습니다.';
          });
      }
    },
    async fetchPostDetail() {
      const postId = this.$route.params.id;
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/community-service/post/detail/${postId}`);
        this.postDetail = response.data.result;

        // 댓글에 대댓글을 추가하기 위한 로직
        this.postDetail.comments.forEach(comment => {
          this.$set(comment, 'showTextarea', false);
          this.$set(comment, 'newComment', '');
          this.$set(comment, 'replies', []); // 대댓글 배열 초기화
        });

        // 대댓글을 댓글 객체에 추가하는 로직
        this.postDetail.comments.forEach(comment => {
          if (comment.parentId) {
            const parentComment = this.postDetail.comments.find(c => c.id === comment.parentId);
            if (parentComment) {
              parentComment.replies.push(comment); // 부모 댓글의 replies에 대댓글 추가
            }
          }
        });
      } catch (error) {
        this.error = error.response ? error.response.data.message : '게시글 정보를 불러오는 중 오류가 발생했습니다.';
      }
    },
    async submitComment(comment) {
      const postId = this.$route.params.id;
      const parentId = comment.id; // 대댓글을 작성할 부모 댓글 ID

      try {
        await axios.post(`${process.env.VUE_APP_API_BASE_URL}/community-service/comment/create`, {
          doctorEmail: this.currentUserEmail, // 현재 사용자 이메일
          content: comment.newComment,
          postId: postId,
          parentId: parentId // 부모 댓글 ID
        });
        comment.newComment = ''; // 댓글 작성 후 텍스트 필드 초기화
        this.fetchPostDetail(); // 댓글 작성 후 게시글 상세 다시 가져오기
      } catch (error) {
        this.error = '댓글 등록에 실패했습니다.';
      }
    },
    formatDate(date) {
      if (!date) return '';
      const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
      return new Date(date).toLocaleDateString('ko-KR', options);
    },
    openReportModal(type, comment = null) {
      this.reportData = {
        postId: this.postDetail.id,
        commentId: comment ? comment.id : null,
      };
      this.showReportModal = true;
    },
    closeReportModal() {
      this.showReportModal = false;
    },
  },
};
</script>

<style scoped>
.v-container {
  max-width: 900px;
  margin: 0 auto;
}

.text-body-1 {
  font-size: 1rem;
  line-height: 1.5;
  color: #000000;
}

.action-link {
  cursor: pointer;
  color: #6A6A6A; 
}

.action-link:hover {
  color: #0D47A1; 
}

h4.text-h6 {
  color: #6A6A6A;
}

h2.text-h5 {
  color: #333;
}

.v-btn {
  font-weight: bold;
  border-radius: 0;
  min-width: 100px;
}

.image-container {
  display: flex;
  justify-content: center; 
  align-items: center; 
}

.center-image {
  max-width: 60%;
  height: auto;
}

.btn_solid {
  background-color: #ffdb69 !important;
  color: rgb(255, 255, 255);
  border-radius: 8px;
}

.btn_board_option {
  display: block;
  padding: 5px 10px;
  color: #ffffff;
  text-decoration: none;
  background-color: #f27885;
  border-radius: 8px;
}
</style>
