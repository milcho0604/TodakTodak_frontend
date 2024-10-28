<template>
    <v-app>
      <v-container class="text-center">
        <v-spacer></v-spacer>
        <v-row justify="center">
          <v-col cols="12" md="8">
            <div class="d-flex align-center">
              <v-col>
                <h2 class="inter-bold" style="text-align: center; color: #00499E;">
                  <img src="@/assets/community.png" width="50px" /> 의사 Q&A
                </h2>
              </v-col>
            </div>
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12">
            <v-row justify="center">
              <v-col
                v-for="post in displayedPosts"
                :key="post.id"
                class="d-flex justify-center"
                cols="12"
              >
              <v-card
  @click="goToPost(post.id)"
  class="card"
  style="cursor: pointer; border: 1px solid #D2D2D2; background-color: #FCFCFC; padding: 16px; max-width: 700px; min-width: 300px; width: 100%; height: 140px; box-shadow: none;">
  <v-row>
    <v-col cols="9" class="d-flex flex-column justify-center">
      <v-card-title class="text-left">
        {{ post.title }}
      </v-card-title>
      <v-card-text class="text-left mb-0" style="margin-top: -5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
        {{ post.content }}
      </v-card-text>      
      <v-card-text class="text-left mb-0" style="margin-top: -30px;"> 
        <v-icon small class="icon">mdi-heart</v-icon>
        {{ post.likeCount }} · 댓글 {{ post.comments || 0 }} · 조회수 {{ post.viewCount }} · {{ post.createdTimeAt.slice(0, 10) }}
      </v-card-text>
    </v-col>
    <v-col cols="3" class="d-flex align-center justify-center" style="margin-bottom: -20px;">
      <div class="image-container d-flex align-center justify-center" style="width: 120px; height: 150px; overflow: hidden; position: relative; margin-top: -22px; margin-right: -40px;">
        <template v-if="post.postImgUrl">
          <v-avatar class="ma-5" style="height: 110px; width: 110px; border-radius: 20px; overflow: hidden;">
            <v-img
              :src="post.postImgUrl"
              alt="게시글 이미지"
              style="object-fit: cover; width: 100%; height: 100%; border-radius: 20px;" />
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
    <MyPageSideBar />
  </template>
  
  <script>
  import axios from 'axios';
  import MyPageSideBar from '@/components/sidebar/MyPageSideBar.vue';
  
  export default {
    components:{
      MyPageSideBar,
    },
    data() {
      return {
        sortOrder: "latest",
        searchQuery: "",
        postList: [],
        displayedPosts: [], // 현재 페이지에 표시할 게시물 목록
        currentPage: 1,
        itemsPerPage: 5,
        totalPosts: 0,
      };
    },
    mounted() {
      this.fetchPosts();
    },
    watch: {
      sortOrder() {
        this.sortPosts(); // sortOrder가 변경될 때마다 sortPosts 호출
        this.updatePaginatedPosts(); // 페이지네이션 업데이트
      },
      currentPage() {
        this.updatePaginatedPosts(); // currentPage가 변경될 때마다 업데이트
      },
    },
    methods: {
      async fetchPosts() {
        try {
          const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/community-service/post/my/list`, {
            params: {
              size: 100 // 전체 게시물 목록을 가져오기 위한 파라미터
            }
          });
  
          if (response.data.status_code === 200) {
            const posts = response.data.result.content.map(post => ({
              id: post.id,
              title: post.title,
              content: post.content,
              viewCount: post.viewCount || 0,
              createdTimeAt: post.createdTimeAt,
              postImgUrl: post.postImgUrl
            }));
  
            // likeCounts를 비동기로 처리
            const likeCounts = await Promise.all(posts.map(post =>
              axios.get(`${process.env.VUE_APP_API_BASE_URL}/community-service/post/detail/${post.id}/likes`)
                .then(likeResponse => likeResponse.data.likeCount || 0)
                .catch(() => 0)
            ));
  
            // posts와 likeCounts를 결합
            this.postList = posts.map((post, index) => ({
              ...post,
              likeCount: likeCounts[index],
            }));
  
            this.totalPosts = response.data.result.totalElements; // 전체 게시글 수
  
            // 정렬
            this.sortPosts();
  
            // 페이지네이션
            this.updatePaginatedPosts();
          }
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      },
      sortPosts() {
        if (this.sortOrder === "popular") {
          this.postList.sort((a, b) => b.viewCount - a.viewCount);
        } else if (this.sortOrder === "latest") {
          this.postList.sort((a, b) => new Date(b.createdTimeAt) - new Date(a.createdTimeAt));
        }
      },
      updatePaginatedPosts() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        this.displayedPosts = this.postList.slice(start, start + this.itemsPerPage);
      },
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
        }
      },
      prevPage() {
        if (this.currentPage > 1) {
          this.currentPage--;
        }
      },
      goToPage(page) {
        this.currentPage = page;
      },
      goToPost(id) {
        this.$router.push(`/post/${id}`);
      },
      goToCreatePost() {
        this.$router.push('/post/Create');
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
  