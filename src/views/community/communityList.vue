<template>
  <v-app>
    <v-container class="text-center">
      <v-spacer :style="{ height: '50px' }"></v-spacer>
      <v-row justify="center">
        <v-col cols="12" md="8">
          <div class="d-flex align-center">
            
            <v-col ><h2 class="inter-bold" style="text-align: center;"><img src="@/assets/community.png" width="50px"/>의사 Q&A</h2></v-col>
          </div>
          <br><br>
          <div class="searchBox">
            <v-row class="header-row" align="center" style="flex-grow: 0; justify-content: flex-start;">
              <v-col cols="4" style="padding: 10px; flex: 0 0 150px; display: flex; justify-content: center;">
                <select class="select" v-model="sortOrder" @change="sortPosts" style="text-align: center;">
                  <option value="popular">인기 순</option>
                  <option value="views">조회 순</option>
                  <option value="latest">최신 순</option>
                </select>
              </v-col>
              <v-col  cols="5.5"  style="padding: 10px; flex: 1; display: flex; justify-content: center;">
                <div class="search" style="display: flex; align-items: center; margin-right: 10px;">
                  <input type="text" v-model="searchQuery" class="search-input" placeholder="검색..." style="flex-grow: 1;">
                  <span>🔍</span>
                </div>
              </v-col>
              <v-col cols="2.5" class="text-left" style="padding: 10px; flex: 0 0 120px; display: flex; justify-content: center;">
                <v-btn class="search-button" style="width: 100%; height: 40px; text-align: left;" @click="goToCreatePost">
                  <v-icon small>mdi-pencil-outline</v-icon> 글작성
                </v-btn>
              </v-col>
            </v-row>
          </div>                        
          <br>
          <v-row justify="center">
            <v-col cols="12">
              <v-list>
                <v-list-item-group>
                  <v-list-item v-for="post in postList" :key="post.id">
                    <v-card class="custom-card" elevation="0" @click="goToPost(post.id)" style="cursor: pointer; border: 1px solid #D2D2D2; padding: 16px;">
                      <v-row>
                        <v-col cols="9" class="text-left" style="padding: 10px;">
                          <div class="d-flex" style="height: auto;">
                            <div style="flex: 1; padding-right: 10px;">
                              <v-card-title class="text-left" style="font-size: 18px; display: flex; justify-content: space-between;">
                                <span>{{ post.title }}</span>
                              </v-card-title>
                              <v-card-text class="text-left post-content" style="margin: 0; font-size: 18px;">{{ post.content }}</v-card-text>
                              <div class="d-flex align-left">
                                <div style="flex: 9; padding-left: 0px; text-align: left;">
                                  <div class="d-flex align-left">
                                    <div style="flex: 1; padding-left: 10px; display: flex; align-items: center; color: #6A6A6A; margin: 0px;">
                                      <v-icon small class="icon">mdi-heart</v-icon>
                                      <span class="like-text">{{ post.likeCount }} · 댓글 {{ post.comments }} · 조회수 {{ post.viewCount }} {{ post.createdTimeAt.slice(0, 10) }}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </v-col>
                        <v-col cols="3" class="text-left" style="padding: 10px; display: flex; align-items: center; justify-content: center;">
                          <div class="image-container" style=" width : 100%; height: 100px; overflow: hidden; position: relative;">
                            <template v-if="post.postImgUrl">
                              <v-img
                                :src="post.postImgUrl"   
                                alt="게시글 이미지"
                                style="object-fit: cover; position: absolute; top: 50%; left: 50%; width: 100%; height: 100%; transform: translate(-50%, -50%);"
                              />
                            </template>
                          </div>
                        </v-col>                        
                      </v-row>
                    </v-card>
                  </v-list-item>
                </v-list-item-group>                
              </v-list>              
            </v-col>
          </v-row>          
          <v-row justify="center" class="pagination">
            <span @click="prevPage" :disabled="currentPage === 1" class="d-flex align-center action-link">
              <v-icon small>mdi-arrow-left-thin</v-icon>&nbsp;Previous&nbsp;&nbsp;
            </span>
            <span v-for="page in Math.ceil(totalPosts / itemsPerPage)" :key="page" @click="goToPage(page)" 
                  class="page-number" :class="{ active: currentPage === page, 'hover-link': currentPage !== page }">
              &nbsp;{{ page }}&nbsp;
            </span>
            <span @click="nextPage" :disabled="currentPage === Math.ceil(totalPosts / itemsPerPage)" 
                  class="d-flex align-center action-link">
              &nbsp;&nbsp;Next&nbsp;<v-icon small>mdi-arrow-right-thin</v-icon>
            </span>            
          </v-row>          
        </v-col>
      </v-row>
      <v-spacer :style="{ height: '50px' }"></v-spacer>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      sortOrder: "latest",
      searchQuery: "",
      postList: [],
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
  },
  methods: {
    async fetchPosts() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/community-service/post/list`, {
          params: {
            size: 100
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
      } else if (this.sortOrder === "views") {
        this.postList.sort((a, b) => b.viewCount - a.viewCount);
      }
    },

    updatePaginatedPosts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      this.postList = this.postList.slice(start, start + this.itemsPerPage);
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchPosts(this.currentPage); // 페이지 전환 시 데이터 새로 고침
      }
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchPosts(this.currentPage);
      }
    },

    goToPage(page) {
      this.currentPage = page;
      this.fetchPosts(this.currentPage);
    },

    goToPost(id) {
      this.$router.push(`/post/${id}`);
    },
    goToCreatePost() {
    this.$router.push('/post/create');
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
.title {
  text-align: left;
  font-size: 30px;
}

.icon {
  font-size: 16px; /* 아이콘 크기 */
  margin-right: 5px; /* 아이콘과 텍스트 간의 간격 */
}

.like-text {
  font-size: 16px; /* 텍스트 크기 */
}


.header-row {
  display: flex;
  align-items: center; /* 세로 정렬 */
  width: 100%; /* 최대 너비를 100%로 설정 */
}

.custom-card {
  max-width: 770px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box; /* 패딩과 보더를 포함하여 너비를 계산 */
  background-color: #FCFCFC; /* 배경색 변경 */
  border-radius: 10px;
}

.searchBox {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%; /* 전체 너비를 차지 */
}

.select {
  width: 150px; /* 고정된 너비 */
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 8px;
  font-size: 15px;
  outline: none;
  cursor: pointer;
  flex-shrink: 0; /* 축소되지 않도록 설정 */
}

.search {
  flex: 1; /* 검색창이 가능한 공간을 모두 차지하도록 설정 */
  max-width: 500px; /* 최대 너비 설정 */
  min-width: 150px; /* 최소 너비 설정 */
  margin-right: 10px; /* 글 작성 버튼과의 간격 설정 */
  border-radius: 10px;
  background-color: #EEEEEE;
  display: flex;
  align-items: center;
  padding: 8px 5px;
}

.search-input {
  flex: 1; /* 비율에 따라 너비를 조정 */
  border: none;
  background: transparent;
  outline: none; /* 포커스 시 윤곽선 제거 */
}

.search-button {
  flex-shrink: 0; /* 글 작성 버튼이 줄어들지 않도록 설정 */
  width: 120px; /* 고정된 너비 */
  background-color: #E6EEFE !important;
  color: #00499E !important;
  border-radius: 10px !important; /* 둥근 모서리 */
  padding: 10px !important; /* 패딩 */
  box-shadow: none !important; /* 그림자 없애기 */
  font-weight: bold !important; /* 글자 굵게 */
}

.write-button:hover {
  background-color: #f0f0f0; /* 호버 효과 */
}

.search-input:focus {
  outline: none;
}

.post-content {
  overflow: hidden;         /* 넘치는 내용 숨기기 */
  white-space: nowrap;      /* 텍스트가 줄 바꿈되지 않도록 설정 */
  text-overflow: ellipsis;  /* 넘치는 텍스트를 "..."으로 표시 */
  max-width: 300px;
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
  color: #757575; /* 기본 색상 */
  cursor: pointer; /* 마우스 커서 변경 */
  transition: color 0.3s; /* 부드러운 전환 효과 */
}

.action-link:hover {
  color: black; /* 마우스를 올렸을 때 색상 */
}

.page-number {
  color: #757575; /* 기본 색상 */
  cursor: pointer; /* 마우스 커서 변경 */
  transition: color 0.3s; /* 부드러운 전환 효과 */
}

.page-number:hover {
  color: black; /* 마우스를 올렸을 때 색상 */
}

.page-number.active {
  color: black; /* 현재 페이지 색상 */
}

.disabled {
  pointer-events: none;
  opacity: 0.5; /* 클릭 불가능한 상태를 시각적으로 표시 */
}

</style>



