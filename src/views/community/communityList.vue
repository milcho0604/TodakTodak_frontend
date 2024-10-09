<template>
  <v-app>
    <v-container class="text-center">
      <v-row justify="center">
        <v-col cols="12" sm="8">
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
          <br><br>
          <div class="searchBox">
            <v-row class="header-row" align="center" style="flex-grow: 0;">
              <v-col style="padding: 10px; flex: 0 0 150px; display: flex; justify-content: center;">
                <select class="select" v-model="sortOrder" style="text-align: center;">
                  <option value="popular">인기 순</option>
                  <option value="view">조회 순</option>
                  <option value="recent">최신 순</option>
                </select>
              </v-col>              
              <v-col style="padding: 10px; flex: 1;">
                <div class="search">
                  <input type="text" v-model="searchQuery" class="search-input" placeholder="검색...">
                  <span>🔍</span>
                </div>
              </v-col>
              <v-col class="text-left" style="padding: 10px; flex: 0 0 120px;">
                <v-btn class="search-button" style="width: 100%; height: 40px; text-align: left;">
                  <v-icon small>mdi-pencil-outline</v-icon> 글작성
                </v-btn>
              </v-col>                         
            </v-row>
          </div>                   
          <br>
          <v-row justify="center">
            <v-col cols="12">
              <div v-for="(post, index) in paginatedPostList" :key="index">
                <v-card class="custom-card" elevation="0" @click="goToPost(post.id)" style="cursor: pointer; border: 1px solid #D2D2D2; padding: 16px;">
                  <v-row>
                    <v-col cols="9" class="text-left" style="padding: 10px;">
                      <div class="d-flex" style="height: auto;">
                        <div style="flex: 1; padding-right: 10px;">
                          <v-card-title class="text-left" style="font-size: 18px; display: flex; justify-content: space-between;">
                            <span>{{ post.title }}</span>
                            <span style="font-size: 14px; color: #6A6A6A;">{{ post.createdTimeAt.slice(0, 10) }}</span>
                          </v-card-title>                          
                          <v-card-text class="text-left post-content" style="margin: 0; font-size: 18px;">{{ post.content }}</v-card-text>
                          <div class="d-flex align-left">
                            <div style="flex: 9; padding-left: 0px; text-align: left;">
                              <div class="d-flex align-left">
                                <div style="flex: 1; padding-left: 10px; display: flex; align-items: center; color: #6A6A6A; margin: 0px;">
                                  <v-icon small class="icon">mdi-heart</v-icon>
                                  <span class="like-text">{{ post.likeCount }} · 댓글 {{ post.comments }} · 조회수 {{ post.viewCount }}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>                        
                      </div>
                    </v-col>
                    <v-col cols="3" class="text-left" style="padding: 10px; display: flex; align-items: center; justify-content: center;">
                      <v-img
                        :src="require('@/assets/community.png')"
                        alt="Post Image"
                        height="80%"
                        class="mb-0"
                        style="object-fit: cover;"
                      ></v-img>
                    </v-col>
                  </v-row>
                </v-card>
                <br>
              </div>
            </v-col>
          </v-row>          
          <v-row justify="center" class="pagination">
            <span @click="prevPage" :disabled="currentPage === 1" class="d-flex align-center action-link" :class="{ 'active-link': currentPage > 1 }">
              <v-icon small>mdi-arrow-left-thin</v-icon>&nbsp;Previous&nbsp;&nbsp;
            </span>
            <span v-for="page in totalPages" :key="page" @click="goToPage(page)" class="page-number" :class="{ active: currentPage === page, 'hover-link': currentPage !== page }">&nbsp;{{ page }}&nbsp;</span>
            <span @click="nextPage" :disabled="currentPage === totalPages" class="d-flex align-center action-link" :class="{ 'active-link': currentPage < totalPages }">
              &nbsp;&nbsp;Next&nbsp;<v-icon small>mdi-arrow-right-thin</v-icon>
            </span>            
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      sortOrder: "popular",
      searchQuery: "",
      postList: [],
      currentPage: 1,
      itemsPerPage: 5,
    };
  },
  mounted() {
    this.fetchPosts();
  },
  methods: {
    async fetchPosts() {
      try {
        const response = await axios.get('http://localhost:8080/community-service/post/list');
        if (response.data.status_code === 200) {
          const posts = response.data.result.content.map(post => ({
            id: post.id,
            title: post.title,
            content: post.content,
            viewCount: post.viewCount || 0,
            createdTimeAt: post.createdTimeAt,
          }));

          const likeCounts = await Promise.all(posts.map(post => 
            axios.get(`http://localhost:8080/community-service/post/detail/${post.id}/likes`)
              .then(likeResponse => likeResponse.data.likeCount || 0)
              .catch(() => 0)
          ));

          this.postList = posts.map((post, index) => ({
            ...post,
            likeCount: likeCounts[index],
          }));
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    },

    goToPost(id) {
      this.$router.push(`/post/${id}`);
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
  },
  computed: {
    sortedPostList() {
      const query = this.searchQuery.toLowerCase();
      return this.postList.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.content.toLowerCase().includes(query)
      ).sort((a, b) => {
        if (this.sortOrder === 'popular') {
          return b.likeCount - a.likeCount;
        } else if (this.sortOrder === 'view') {
          return b.viewCount - a.viewCount;
        } else {
          return b.id - a.id;
        }
      });
    },

    paginatedPostList() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.sortedPostList.slice(start, start + this.itemsPerPage);
    },

    totalPages() {
      return Math.ceil(this.sortedPostList.length / this.itemsPerPage);
    },
  },
};
</script>

<style>
.title {
  text-align: left;
  font-size: 20px;
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
  max-width: 580px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box; /* 패딩과 보더를 포함하여 너비를 계산 */
  background-color: #FCFCFC; /* 배경색 변경 */
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
  max-width: 300px; /* 최대 너비 설정 */
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
  border-radius: 20px !important; /* 둥근 모서리 */
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
  max-width: 400px;
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

.pagination {
  margin-top: 20px;
  display: flex;
  align-items: center;
}
</style>
