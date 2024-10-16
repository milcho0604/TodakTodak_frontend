<template>
    <v-app>
      <v-container class="text-center">
        <v-spacer></v-spacer>
        <v-row justify="center">
          <v-col cols="12" md="8">
            <div class="d-flex align-center">
              <v-col>
                <h2 class="inter-bold" style="text-align: center;">
                  <img src="@/assets/community.png" width="50px" /> 의사 Q&A
                </h2>
              </v-col>
            </div>
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12">
            <v-row justify="center">
              <v-col
                v-for="post in postList"
                :key="post.id"
                class="d-flex justify-center"
                cols="12"
              >
              <v-card @click="goToPost(post.id)" class="card" style="cursor: pointer; border: 1px solid #D2D2D2; background-color: #FCFCFC; padding: 16px; max-width: 770px; min-width: 300px; width: 100%; box-shadow: none;">
                <v-row>
                  <v-col cols="8" class="d-flex flex-column justify-center"> <!-- 텍스트 영역 -->
                    <v-card-title class="text-left">
                      {{ post.title }}
                    </v-card-title>
                    <v-card-text class="text-left">
                      {{ post.content }}
                    </v-card-text>
                    <v-card-text class="text-left">
                      <v-icon small class="icon">mdi-heart</v-icon>{{ post.likeCount }} · 댓글 {{ post.comments || 0 }} · 조회수 {{ post.viewCount }} · {{ post.createdTimeAt.slice(0, 10) }}
                    </v-card-text>
                  </v-col>
                  <v-col cols="4" class="d-flex align-center justify-center"> <!-- 이미지 영역 -->
                    <div class="image-container" style="width: 150px; height: 150px; overflow: hidden; position: relative;">
                      <template v-if="post.postImgUrl">
                        <v-avatar class="ma-5" style="height: 130px; width: 130px; border-radius: 20px; overflow: hidden;">
                            <v-img
                                :src="post.postImgUrl"
                                alt="게시글 이미지"
                                style="object-fit: cover; width: 100%; height: 100%; border-radius: 20px;"/>
                        </v-avatar>
                      </template>
                    </div>
                  </v-col>
                </v-row>
              </v-card>     
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row justify="center" class="pagination">
          <span @click="prevPage" :disabled="currentPage === 1" class="d-flex align-center action-link">
            <v-icon small>mdi-arrow-left-thin</v-icon>&nbsp;Previous&nbsp;&nbsp;
          </span>
          <span v-for="page in totalPages" :key="page" @click="goToPage(page)" 
                class="page-number" :class="{ active: currentPage === page, 'hover-link': currentPage !== page }">
            &nbsp;{{ page }}&nbsp;
          </span>
          <span @click="nextPage" :disabled="currentPage === totalPages" 
                class="d-flex align-center action-link">
            &nbsp;&nbsp;Next&nbsp;<v-icon small>mdi-arrow-right-thin</v-icon>
          </span>
        </v-row>
      </v-container>
    </v-app>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        postList: [],
        currentPage: 1,
        itemsPerPage: 5,
        totalPosts: 0,
      };
    },
    mounted() {
      this.fetchPosts();
    },
    methods: {
      async fetchPosts() {
        try {
          const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/community-service/post/my/list`);
          if (response.data.status_code === 200) {
            this.postList = response.data.result.content.map(post => ({
              id: post.id,
              title: post.title,
              content: post.content,
              likeCount: post.likeCount,
              viewCount: post.viewCount || 0,
              createdTimeAt: post.createdTimeAt,
              postImgUrl: post.postImgUrl
            }));
            this.totalPosts = response.data.result.totalElements;
            this.updatePaginatedPosts();
          }
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      },
      updatePaginatedPosts() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        this.postList = this.postList.slice(start, start + this.itemsPerPage);
      },
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
          this.updatePaginatedPosts();
        }
      },
      prevPage() {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.updatePaginatedPosts();
        }
      },
      goToPage(page) {
        this.currentPage = page;
        this.updatePaginatedPosts();
      },
      goToPost(postId) {
        this.$router.push(`/post/${postId}`);
      },
    },
    computed: {
      totalPages() {
        return Math.ceil(this.totalPosts / this.itemsPerPage);
      },
    },
  };
  </script>
  
  <style scoped>
  .icon {
    font-size: 16px;
    margin-right: 5px;
  }
  
  .pagination {
    margin-top: 20px;
    display: flex;
    align-items: center;
  }
  
  .page-number {
    margin: 0 5px;
    cursor: pointer;
  }
  
  .page-number.active {
    font-weight: bold;
    text-decoration: underline;
  }
  
  .action-link {
    color: #757575;
    cursor: pointer;
    transition: color 0.3s;
  }
  
  .action-link:hover {
    color: black;
  }
  </style>
  