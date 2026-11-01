export interface WorkScreen {
  src: string
  title: string
  alt: string
  description: string
  points: string[]
}

// 저장소에 남아 있는 실제 개발 화면 캡처. 서비스 성과나 최신 운영 상태를 뜻하지 않는다.
export const workScreens: Record<string, WorkScreen[]> = {
   'team-agent': [
    { src: '/images/work/team-main.png', title: '에이전트 목록과 운영 상태', alt: 'TeamAgent 에이전트 목록: 유형, 연결 데이터, 우선순위와 활성 상태를 함께 표시한 개발 화면', description: '목록에서 에이전트의 목적과 연결 데이터를 확인하고, 활성 상태와 설정 진입점을 함께 살펴볼 수 있습니다.', points: ['목적별 에이전트 목록', '유형·연결 데이터 표시', '우선순위와 활성 상태'] },
    { src: '/images/work/team-settings.png', title: '참고할 지식을 데이터셋으로 구성', alt: 'TeamAgent RAG 데이터셋 생성 화면: 기본 정보 입력, 문서 선택과 구축 시작 버튼', description: '데이터셋 이름과 설명을 입력하고 참고 문서를 선택하는 화면입니다. 저장 후 나중에 구축하거나 바로 구축을 시작하는 선택지를 나눴습니다.', points: ['기본 정보와 버전 입력', '참고 문서 검색·선택', '저장과 구축 시작 구분'] },
  ],
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
