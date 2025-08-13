# 🎬 Video to GIF Converter

브라우저에서 직접 MP4 비디오를 GIF로 변환하는 React 웹 애플리케이션입니다.

## ✨ 특징

- 🚀 **브라우저에서 직접 변환**: 파일을 서버에 업로드할 필요 없이 로컬에서 처리
- 🎯 **FFmpeg.wasm 사용**: 강력한 FFmpeg을 WebAssembly로 브라우저에서 실행
- 📊 **실시간 진행률**: 변환 진행 상황을 실시간으로 확인
- 🎨 **모던한 UI**: 아름답고 직관적인 사용자 인터페이스
- 📱 **반응형 디자인**: 모바일과 데스크톱 모두에서 최적화된 경험
- ⚡ **최적화된 GIF**: 고품질 GIF를 효율적인 파일 크기로 생성

## 🛠️ 기술 스택

- **React 18** + TypeScript
- **FFmpeg.wasm** - 브라우저에서 비디오 처리
- **CSS3** - 그라디언트와 glassmorphism 디자인
- **WebAssembly** - 고성능 브라우저 내 처리

## 🚀 시작하기

### 사전 요구사항

- Node.js 16.x 이상
- npm 또는 yarn

### 설치 및 실행

1. 프로젝트 클론
```bash
git clone <repository-url>
cd video-to-gif
```

2. 의존성 설치
```bash
npm install
```

3. 개발 서버 시작
```bash
npm start
```

4. 브라우저에서 `http://localhost:3000` 접속

## 📖 사용법

1. **변환기 로드**: "변환기 로드하기" 버튼을 클릭하여 FFmpeg을 초기화합니다.
2. **파일 선택**: "비디오 파일 선택" 버튼을 클릭하여 MP4 파일을 선택합니다.
3. **변환 시작**: "GIF로 변환" 버튼을 클릭하여 변환을 시작합니다.
4. **진행률 확인**: 실시간으로 변환 진행률을 확인할 수 있습니다.
5. **다운로드**: 변환이 완료되면 "GIF 다운로드" 버튼으로 결과를 다운로드합니다.

## ⚙️ 변환 설정

현재 다음과 같은 최적화된 설정으로 GIF를 생성합니다:

- **프레임레이트**: 10 FPS
- **해상도**: 가로 480px (비율 유지)
- **색상**: 최대 256색상 팔레트
- **압축**: Lanczos 필터링 + Bayer 디더링

## 🌐 배포

### GitHub Pages 배포

1. 프로젝트를 GitHub에 푸시
2. 배포 명령 실행:
```bash
npm run deploy
```
3. 몇 분 후 `https://[username].github.io/[repository-name]`에서 확인

> **참고**: 첫 배포 후 GitHub 저장소 Settings > Pages에서 gh-pages 브랜치가 선택되어 있는지 확인하세요.

### Netlify 배포

1. 프로젝트를 GitHub에 푸시
2. Netlify에서 새 사이트 생성
3. GitHub 저장소 연결
4. 빌드 설정:
   - Build command: `npm run build`
   - Publish directory: `build`
5. _headers 파일을 build 폴더에 복사하도록 설정

### Vercel 배포

```bash
npm install -g vercel
vercel --prod
```

## 🛡️ 브라우저 호환성

- **Chrome 67+** (권장)
- **Firefox 79+**
- **Safari 15.2+**
- **Edge 79+**

> **참고**: FFmpeg.wasm은 SharedArrayBuffer를 사용하므로 HTTPS 환경에서만 작동합니다.

## 📝 라이선스

MIT License

## 🤝 기여하기

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🔧 문제 해결

### FFmpeg 로딩 실패
- HTTPS 환경에서 실행 중인지 확인
- 브라우저의 SharedArrayBuffer 지원 확인
- 네트워크 연결 상태 확인

### 변환 실패
- 파일이 유효한 비디오 형식인지 확인
- 파일 크기가 너무 크지 않은지 확인 (권장: 100MB 이하)
- 브라우저 콘솔에서 에러 메시지 확인

### 성능 문제
- 대용량 파일의 경우 변환 시간이 길어질 수 있습니다
- 브라우저의 다른 탭을 닫아 메모리를 확보하세요
- 최신 브라우저 사용을 권장합니다

---

Made with ❤️ and React