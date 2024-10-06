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

          <v-row class="header-row">
            <v-col cols="3" class="text-left">
              <select class="select" v-model="sortOrder">
                <option value="popular">인기 순</option>
                <option value="view">조회 순</option>
                <option value="recent">최신 순</option>
              </select>
            </v-col>
            <v-col>
              <div class="search">
                <input type="text" v-model="searchQuery" class="search-input" placeholder="검색...">
                <span>🔍</span>
              </div>
            </v-col>
          </v-row>

          <br>
          <v-row justify="center">
            <v-col cols="12">
              <div v-for="(post, index) in sortedPostList" :key="index">
                <v-card class="custom-card" @click="goToPost(post.id)" style="cursor: pointer;">
                  <div class="d-flex" style="height: auto;">
                    <div style="flex: 7; padding-right: 10px;">
                      <v-card-title class="text-left">{{ post.question }}</v-card-title>
                      <v-card-text class="text-left">{{ post.answer }}</v-card-text>
                      <div class="d-flex align-left">
                        <div style="flex: 1; padding-left: 10px;">
                          <v-img
                            :src="require('@/assets/like.png')"
                            alt="Like Icon"
                            height="20px"
                            class="mb-0"
                          ></v-img>
                        </div>
                        <div style="flex: 9; padding-left: 0px; text-align: left;">
                          {{ post.likes }} · 댓글 {{ post.comments }} · 조회수 {{ post.views }}
                        </div>
                      </div>
                    </div>
                    <div style="flex: 3; display: flex; align-items: center; justify-content: center;">
                      <v-img
                        :src="post.image"
                        alt="Post Image"
                        height="100px"
                        class="mb-0"
                      ></v-img>
                    </div>
                  </div>
                </v-card>
                <br>
              </div>
            </v-col>
          </v-row>
          
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      sortOrder: "popular",
      searchQuery: "",
      postList: [
        {
          id:1,
          question: "모기 아닌거 같은데 이 자국 뭘까요1",
          answer: "딱히 가렵다고도 안하고 팔뚝에는 이렇게 모여서 물려 있고 다른덴 몇군데 이래요. 이게 뭐 진드..",
          likes: 7,
          comments: 3,
          views: 31,
          image: "https://todak-file.s3.amazonaws.com/d278dfb1-9275-41ad-8b86-f7a0a904892b_IMG_8641.JPG",
        },
        {
          id:2,
          question: "모기 아닌거 같은데 이 자국 뭘까요2",
          answer: "딱히 가렵다고도 안하고 팔뚝에는 이렇게 모여서 물려 있고 다른덴 몇군데 이래요. 이게 뭐 진드..",
          likes: 10,
          comments: 20,
          views: 11,
          image: "https://todak-file.s3.amazonaws.com/d278dfb1-9275-41ad-8b86-f7a0a904892b_IMG_8641.JPG",
        },
        {
          id:3,
          question: "모기 아닌거 같은데 이 자국 뭘까요3",
          answer: "딱히 가렵다고도 안하고 팔뚝에는 이렇게 모여서 물려 있고 다른덴 몇군데 이래요. 이게 뭐 진드..",
          likes: 3,
          comments: 3,
          views: 3,
          image: "https://todak-file.s3.amazonaws.com/d278dfb1-9275-41ad-8b86-f7a0a904892b_IMG_8641.JPG",
        },
        
      ]
    };
  },
  methods: {
    goToPost(id) {
      this.$router.push(`/post/${id}`);
    }
  },
  computed: {
    sortedPostList() {
      const query = this.searchQuery.toLowerCase();
      return this.postList.filter(post => 
        post.question.toLowerCase().includes(query) || 
        post.answer.toLowerCase().includes(query)
      ).sort((a, b) => {
        if (this.sortOrder === 'popular') {
          return b.likes - a.likes; // 좋아요 수 기준으로 정렬
        } else if (this.sortOrder === 'view') {
          return b.views - a.views; // 조회수 기준으로 정렬
        } else {
          return b.id - a.id;
        }
      });
    }
  }
};
</script>

<style>
.title {
  text-align: left;
  font-size: 20px;
}

.header-row {
  width: 700px;
  margin: 0 auto;
}

.custom-card {
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box; /* 패딩과 보더를 포함하여 너비를 계산 */
}

.select {
  background-color: transparent;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 8px;
  font-size: 15px;
  width: 100%;
  outline: none;
  cursor: pointer;
  text-align: center;
}

.search {
  border-radius: 10px;
  background-color: #EEEEEE;
  width: 400px;
  padding: 8px 5px;
}

.search-input {
  width: calc(100% - 30px);
}

.search-input:focus {
  outline: none;
}
</style>