export interface WorkScreen {
  src: string
  title: string
  alt: string
  description: string
  points: string[]
}

// 저장소에 남아 있는 실제 개발 화면 캡처. 서비스 성과나 최신 운영 상태를 뜻하지 않는다.
export const workScreens: Record<string, WorkScreen[]> = {
  'team-agent': [],
  'proposal-agent': [],
  taskflow: [
    {
      src: '/images/work/taskflow-main.png',
      title: '일정과 작업을 날짜별로 확인',
      alt: 'TaskFlow의 데스크톱 캘린더 화면. Todo·Issue 필터, 월 이동, 선택 날짜의 일정 영역이 표시되어 있다.',
      description: '월 단위 탐색과 선택 날짜의 작업 영역을 연결했습니다. 작업 유형 필터와 일정 추가 버튼을 함께 배치한 실제 개발 화면입니다.',
      points: ['Todo·Issue 표시 필터', '이전·다음 달과 오늘 이동', '선택 날짜의 일정 확인·추가'],
    },
  ],
}
