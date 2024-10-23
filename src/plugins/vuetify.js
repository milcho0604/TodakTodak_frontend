// import 'vuetify/styles';
// import { createVuetify } from 'vuetify';
// import * as components from 'vuetify/components';
// import * as directives from 'vuetify/directives';
// import { mdi } from 'vuetify/iconsets/mdi';
// import 'vuetify/dist/vuetify.min.css'; // CSS 추가

// export default createVuetify({
//   components,
//   directives,
//   icons: {
//     defaultSet: 'mdi',
//     sets: {
//       mdi,
//     },
//   },
// });
/* eslint-disable no-unused-vars */
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components'; // 모든 컴포넌트 가져오기
import * as directives from 'vuetify/directives';
import { mdi } from 'vuetify/iconsets/mdi';
import 'vuetify/dist/vuetify.min.css'; // CSS 추가
import { VTimePicker } from 'vuetify/labs/VTimePicker';

export default createVuetify({
  components: {
    ...components, // 모든 컴포넌트를 포함
    VTimePicker, // VTimePicker도 포함
  },
  directives,
  icons: {
    defaultSet: 'mdi',
    sets: {
      mdi,
    },
  },
});

