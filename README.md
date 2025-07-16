## node.js 를 직접 설치 하여 daily 로 크롤링 ㄱㄱㄱ

## 설치 가이드
- https://velog.io/@ljs923/Node.js-%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C-%EB%B0%8F-%EC%84%A4%EC%B9%98%ED%95%98%EA%B8%B0

## 1. 필요한 크롤러 lib 를 다운 받아야 하니 의존성 설치 부터
- npm install

## 2. 다음 명령어 실행
- npm run crawl

수동으로 json 데이터가 root 디렉토리 data <- 폴더에 쌓였다면, 매일 정해진 시간에 돌릴 수 있도록 cron 설정

## 3. 의존성 설치 필요
- npm install node-cron

