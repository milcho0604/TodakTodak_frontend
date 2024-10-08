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
          <v-list-item-title class="text-subtitle-1" style="font-weight: bold; font-size: 20px !important;">{{ postDetail.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ formatDate(postDetail.createdTimeAt) }}</v-list-item-subtitle>
        </v-divider>

        <v-col class="d-flex justify-end" style="flex-grow: 1;">
          <span @click="edit" class="d-flex align-center action-link mr-2">
            <v-icon small>mdi-pencil</v-icon>
            수정
          </span>
          <span @click="deletePost" class="d-flex align-center action-link">
            <v-icon small>mdi-delete</v-icon>
            삭제
          </span>
        </v-col>
      </div>

      <v-row class="mb-5 no-margin">
        <v-col cols="12" md="12">
          <v-card flat class="pa-0">
            <v-card-text>
              <div>
                <v-list-item-title class="text-subtitle-1" style="font-weight: bold; font-size: 20px !important;">{{ postDetail.title }}</v-list-item-title>
                <v-list-item-subtitle style="font-size:17px;">{{ postDetail.content }}</v-list-item-subtitle>
              </div>
            </v-card-text>
            <div class="image-container">
              <v-img v-if="postDetail.postImgUrl" :src="postDetail.postImgUrl" alt="게시글 이미지" class="mb-3 rounded" />
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-col class="d-flex justify" style="flex-grow: 1;">
        <span @click="like" class="d-flex align-center action-link mr-2">
          <v-icon small>mdi-heart-outline</v-icon> &nbsp; 좋아요 {{ postDetail.likeCount }}  · 
        </span>
        <span @click="showCommentTextarea = !showCommentTextarea" class="d-flex align-center action-link mr-2">
          <v-icon small>mdi-comment-outline</v-icon> &nbsp; 댓글 {{ postDetail.comments.length }} ·
        </span>
        <span class="d-flex align-center action-link">
          &nbsp;<v-icon small>mdi-eye-outline</v-icon> &nbsp; 조회수 {{ postDetail.viewCount }}   
        </span>
      </v-col>

      <v-divider></v-divider>

      <v-row v-if="showCommentTextarea" class="mt-3">
        <v-col cols="12">
          <v-form @submit.prevent="submitPostComment">
            <v-textarea
              v-model="newPostComment"
              label="댓글을 작성해주세요"
              outlined
              required
            ></v-textarea>
            <span 
              @click="submitPostComment" 
              class="d-flex align-center action-link mr-2" 
              style="cursor: pointer;"
            >
              <v-icon small>mdi-comment-outline</v-icon>&nbsp; 댓글 작성
            </span>
          </v-form>
        </v-col>
      </v-row>

      <v-row>
        <v-divider></v-divider>

        <v-col cols="12">
          <h4 class="text-h6 font-weight-bold">댓글</h4>
          <v-list>
            <v-list-item v-for="comment in postDetail.comments" :key="comment.id" class="py-2">
              <v-card :style="{ backgroundColor: comment.memberEmail === currentUserEmail ? '#F9F9F9' : '#ECF2FE' }" class="mb-2" outlined>
                <v-card-text>
                  <div class="d-flex justify-space-between align-center">
                    <div style="flex: 9;">
                      <div class="comment-text">
                        <v-list-item-title class="text-subtitle-1" style="font-weight: bold; font-size: 20px !important;">{{ comment.name }}</v-list-item-title>
                        <v-list-item-subtitle style="font-size:18px;">{{ comment.content }}</v-list-item-subtitle>
                        <v-list-item-subtitle>{{ formatDate(comment.createdTimeAt) }}</v-list-item-subtitle>
                      </div>
                    </div>
                    <div style="flex: 1;" class="d-flex align-center">
                      <span @click="openReportModal('comment', comment)" class="d-flex align-center action-link mr-2">
                        <v-icon>mdi-alert-circle-outline</v-icon>
                      </span>
                      <span @click="deleteComment(comment)" class="d-flex align-center action-link">
                        <v-icon small>mdi-delete</v-icon>
                      </span>
                    </div>
                  </div>
                </v-card-text>

                <v-card-actions>
                  <span @click="comment.showTextarea = !comment.showTextarea" class="d-flex align-center action-link mr-2">
                    <v-icon small>mdi-comment-outline</v-icon>&nbsp;댓글달기
                  </span>
                </v-card-actions>

                <v-form v-if="comment.showTextarea" @submit.prevent="submitComment(comment)">
                  <v-textarea
                    v-model="comment.newComment"
                    :label="comment.parentId ? getParentComment(comment.parentId).content : '대댓글을 작성해주세요'"
                    outlined
                    required
                  ></v-textarea>
                  <span 
                    @click="submitComment(comment)" 
                    class="d-flex align-center action-link mr-2" 
                    style="cursor: pointer;"
                  >
                    <v-icon small>mdi-comment-outline</v-icon> &nbsp; 대댓글 작성
                  </span>
                </v-form>
              </v-card>

              <!-- 대댓글 표시 -->
              <v-list v-if="comment.replies && comment.replies.length" class="ml-4">
                <v-list-item v-for="reply in comment.replies" :key="reply.id">
                  <v-card class="mb-2 enlarged-reply-card" outlined>
                    <v-card-text>
                      <div class="comment-text">
                        <v-list-item-title class="text-subtitle-1">{{ reply.name }}</v-list-item-title>
                        <v-list-item-subtitle>{{ reply.content }}</v-list-item-subtitle>
                        <v-list-item-subtitle>{{ formatDate(reply.createdTimeAt) }}</v-list-item-subtitle>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-list-item>
              </v-list>
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
      currentUserEmail: 'your-email@example.com',
      newPostComment: '',
      showCommentTextarea: false,
    };
  },
  created() {
    this.fetchPostDetail();
  },
  methods: {
    edit() {
      this.$router.push(`/update/${this.postDetail.id}`);
    },
    like() {
      axios.post(`${process.env.VUE_APP_API_BASE_URL}/community-service/post/detail/like/${this.postDetail.id}`);
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

    // 댓글 및 대댓글 초기화
    this.postDetail.comments.forEach(comment => {
      comment.showTextarea = false;  // this.$set 대신 이렇게 사용
      comment.newComment = '';        // this.$set 대신 이렇게 사용
      comment.replies = [];           // this.$set 대신 이렇게 사용
    });

    // 대댓글 구조화
    this.postDetail.comments.forEach(comment => {
      if (comment.parentId) {
        const parentComment = this.postDetail.comments.find(c => c.id === comment.parentId);
        if (parentComment) {
          parentComment.replies.push(comment);
        }
      }
    });

    // 부모 댓글만 필터링하고 정렬
    this.postDetail.comments = this.postDetail.comments.filter(comment => !comment.parentId);
    this.postDetail.comments.sort((a, b) => new Date(a.createdTimeAt) - new Date(b.createdTimeAt));

  } catch (error) {
    console.error("게시글 정보를 불러오는 중 오류가 발생했습니다.", error);
    this.error = error.response ? error.response.data.message : '게시글 정보를 불러오는 중 오류가 발생했습니다.';
  }
},
    async submitPostComment() {
      const postId = this.$route.params.id;
      try {
        await axios.post(`${process.env.VUE_APP_API_BASE_URL}/community-service/comment/create`, {
          content: this.newPostComment,
          postId: postId,
          parentId: null,
        });
        this.newPostComment = '';
        this.showCommentTextarea = false;
        this.fetchPostDetail();
      } catch (error) {
        this.error = '댓글 등록에 실패했습니다.';
      }
    },
    async submitComment(comment) {
      const postId = this.$route.params.id;

      try {
        await axios.post(`${process.env.VUE_APP_API_BASE_URL}/community-service/comment/create`, {
          content: comment.newComment,
          postId: postId,
          parentId: comment.id, // 대댓글을 위한 부모 댓글 ID
        });
        comment.newComment = '';
        this.fetchPostDetail();
      } catch (error) {
        this.error = '댓글 등록에 실패했습니다.';
      }
    },
    async deleteComment(comment) {
      const confirmed = confirm("댓글을 정말 삭제하시겠습니까?");
      if (confirmed) {
        try {
          await axios.post(`${process.env.VUE_APP_API_BASE_URL}/community-service/comment/delete/${comment.id}`);
          this.fetchPostDetail(); // 삭제 후 게시글 상세 다시 가져오기
        } catch (error) {
          console.error("댓글 삭제에 실패했습니다.", error);
          this.error = '댓글 삭제에 실패했습니다.';
        }
      }
    },
    getParentComment(parentId) {
    return this.postDetail.comments.find(comment => comment.id === parentId);
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

.enlarged-reply-card {
  padding: 16px;
  margin: 8px 0;
  background-color: #f9f9f9;
}
</style>
