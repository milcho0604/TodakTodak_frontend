<template>
    <div class="d-flex flex-column align-center" style="align-items: center;">
      <v-col class="inter-bold title" style="text-align: center;">
        <img src="@/assets/community.png" width="50px" /> 의사 Q&A 등록
      </v-col>
  
      <div class="search" style="display: flex; align-items: center; margin: 10px 0; justify-content: center;">
        <input
          type="text"
          v-model="searchQuery"
          class="title-input"
          :placeholder="titlePlaceholder"
          @focus="clearPlaceholder('title')"
          @blur="restorePlaceholder('title')"
          style="flex: 1; text-align: center; height: 40px; min-width: 300px; max-width: 770px;"
        />
      </div>
  
      <div class="search" style="display: flex; flex-direction: column; align-items: center; margin: 10px 0; justify-content: center;">
        <div style="position: relative; width: 100%; max-width: 770px;">
          <textarea
            v-model="contentQuery"
            class="content-input"
            :placeholder="contentPlaceholder"
            @focus="clearPlaceholder('content')"
            @blur="restorePlaceholder('content')"
            style="flex: 1; text-align: center; height: 300px; min-width: 300px; max-width: 770px; padding-bottom: 40px;"
          ></textarea>
          <label class="upload-btn" style="position: absolute; left: 10px; bottom: 10px;">
            <input type="file" @change="onFileChange" accept="image/png, image/jpeg" />
            <v-icon small>mdi-paperclip</v-icon>
          </label>
        </div>
      </div>
  
      <div v-if="fileError" style="color: red; font-size: 14px; margin-top: 10px;">사용할 수 없는 파일입니다</div>
  
      <div v-if="imagePreview" style="margin-top: 10px;">
        <img :src="imagePreview" alt="미리보기" style="max-width: 100px; max-height: 100px; border-radius: 4px; margin-top: 10px;" />
      </div>
  
      <v-btn class="search-button" @click="save" style="text-align: center; padding: 0; margin-top: 20px; margin-bottom: 20px;">
        <v-icon small>mdi-pencil-outline</v-icon> 저장하기
      </v-btn>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        searchQuery: '',
        contentQuery: '',
        titlePlaceholder: '제목을 입력해주세요',
        contentPlaceholder: '내용을 입력해주세요',
        selectedFile: null,
        fileError: false,
        imagePreview: null,
      };
    },
    methods: {
        async save() {
    if (!this.searchQuery) {
        alert("제목을 입력해주세요.");
        return;
    }
    if (!this.contentQuery) {
        alert("내용을 입력해주세요.");
        return;
    }

    const formData = new FormData();
    formData.append('title', this.searchQuery);
    formData.append('content', this.contentQuery);

    // 파일이 존재할 때만 추가
    if (this.selectedFile) {
        formData.append('postImage', this.selectedFile);
    }

    // 추가: 입력값 확인
    console.log('Title:', this.searchQuery);
    console.log('Content:', this.contentQuery);
    console.log('File:', this.selectedFile);

    // FormData 내용 확인
    formData.forEach((value, key) => {
        console.log(key, value);
    });

    try {
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/community-service/post/create`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log("저장 완료!", response.data);
        alert('게시글이 저장되었습니다.');
        this.$router.back();
    } catch (error) {
        console.error("저장 실패!", error);
    }
},

      clearPlaceholder(type) {
        if (type === 'title') {
          this.titlePlaceholder = '';
        } else if (type === 'content') {
          this.contentPlaceholder = '';
        }
      },
      restorePlaceholder(type) {
        if (type === 'title' && !this.searchQuery) {
          this.titlePlaceholder = '제목을 입력해주세요';
        } else if (type === 'content' && !this.contentQuery) {
          this.contentPlaceholder = '내용을 입력해주세요';
        }
      },
      onFileChange(event) {
        const file = event.target.files[0];
        if (file) {
          const validExtensions = ['image/png', 'image/jpeg', 'image/jpg'];
          if (!validExtensions.includes(file.type)) {
            this.fileError = true;
            this.selectedFile = null;
            this.imagePreview = null;
          } else {
            this.fileError = false;
            this.selectedFile = file;
            const reader = new FileReader();
            reader.onload = (e) => {
              this.imagePreview = e.target.result;
            };
            reader.readAsDataURL(file);
          }
        } else {
          this.fileError = false;
          this.imagePreview = null;
        }
      },
    },
  };
  </script>
  
  
  <style scoped>
  .upload-btn {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #f0f0f0;
    cursor: pointer;
    position: relative;
  }
  
  .upload-btn input[type="file"] {
    display: none;
  }
  
  .upload-btn v-icon {
    font-size: 24px;
  }
  
  .search {
    min-width: 300px;
    max-width: 700px;
  }
  
  .title-input,
  .content-input {
    flex: 1;
    text-align: center;
    min-width: 300px;
    max-width: 770px;
    width: 100%;
    border: none !important;
    border-bottom: 1px solid #ccc;
    border-radius: 0;
    outline: none;
    box-shadow: none;
  }
  
  .content-input {
    height: 300px;
    border: none;
  }
  </style>
  