# library_project

Skills : React, Node js, MySQL


frontend 현재 현황
app => themeContext에서 BookStoreThemeProvider로 ThemeContext.Provider, ThemeProvider, GlobalStyle로 전역에 뿌려줌 

header => hooks/useCategory.ts 에서 훅으로 저장시킨 category값을 받아오고 여기선 => category.api.ts => http.ts(backend)랑 연결 시켜줌 httpClient로 받아옴 정보
header는 받아온 category값으로 사용해주고 로그인 페이지로 가는 버튼 만들어줌

Signup page / Login page / ResetPassword page
useForm 사용해줬고 만들어뒀던 Button, InputText, Title 컴포넌트들 사용

Auth.api.ts에서 signup, resetRequest, resetPassword 만들어뒀던 함수 사용
login엔 따로 token값 넣어주기

// 2월 23까지 결과값