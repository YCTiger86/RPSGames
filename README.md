# K리그1 2026 시즌 전체 경기 기록 웹 페이지

K리그1 2026 시즌 전체 경기 기록(일정/결과/라운드/점수)을 한 화면에서 조회하는 웹 페이지입니다.

## 포함 기능
- 시즌 전체 경기 목록 테이블
- 팀명/라운드/경기 상태(예정/진행중/종료) 필터
- 자동 새로고침(15분 간격) + 수동 새로고침
- 경기 수 요약(전체/종료/예정/진행중)
- 데이터 갱신 시각 표시

## 실행
```bash
npm install
npm run dev
```
브라우저: `http://localhost:4173`

## 데이터 자동 업데이트
`npm run update:data`는 외부 JSON/API 데이터를 받아 `public/data/kleague1-2026.json`으로 변환 저장합니다.

```bash
DATA_SOURCE_URL="https://example.com/kleague1-2026.json" npm run update:data
```

입력 데이터는 최소 `matches` 배열을 포함해야 하며, 아래 필드 형태를 지원합니다.
- `kickoff` 또는 `utcDate`
- `round` 또는 `matchday`
- `homeTeam` / `awayTeam` (문자열 또는 `{ name }` 객체)
- `score.fullTime.home`, `score.fullTime.away` 또는 `homeScore`, `awayScore`
- `venue`, `status`

## GitHub Actions 자동화
`.github/workflows/update-kleague-data.yml`이 매일 UTC 00:10에 실행되어 데이터 파일을 업데이트하고 변경 시 커밋/푸시합니다.

> 실제 운영 시 `DATA_SOURCE_URL`를 Repository Secret으로 등록하세요.
