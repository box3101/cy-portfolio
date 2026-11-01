export interface WorkScreen {
  src: string
  title: string
  alt: string
  description: string
  points: string[]
  caption?: string
}

// 저장소에 남아 있는 실제 개발 화면 캡처. 서비스 성과나 최신 운영 상태를 뜻하지 않는다.
export const workScreens: Record<string, WorkScreen[]> = {
   'team-agent': [
    { src: '/images/work/team-main.png', title: '에이전트 목록과 운영 상태', alt: 'TeamAgent 에이전트 목록: 유형, 연결 데이터, 우선순위와 활성 상태를 함께 표시한 개발 화면', description: '목록에서 에이전트의 목적과 연결 데이터를 확인하고, 활성 상태와 설정 진입점을 함께 살펴볼 수 있습니다.', points: ['목적별 에이전트 목록', '유형·연결 데이터 표시', '우선순위와 활성 상태'] },
    { src: '/images/work/team-settings.png', title: '참고할 지식을 데이터셋으로 구성', alt: 'TeamAgent RAG 데이터셋 생성 화면: 기본 정보 입력, 문서 선택과 구축 시작 버튼', description: '데이터셋 이름과 설명을 입력하고 참고 문서를 선택하는 화면입니다. 저장 후 나중에 구축하거나 바로 구축을 시작하는 선택지를 나눴습니다.', points: ['기본 정보와 버전 입력', '참고 문서 검색·선택', '저장과 구축 시작 구분'] },
  ],
  'proposal-agent': [
    { src: '/images/work/proposal-main.png', title: '제안 프로젝트 시작 화면', alt: '제안서 에이전트의 프로젝트 목록과 새 제안 만들기 화면', description: '새 제안을 만들거나 최근에 작업한 프로젝트를 이어서 여는 첫 화면입니다.', points: ['새 제안 만들기', '최근 작업 이어가기', '프로젝트 검색과 진행 상태 확인'] },
  ],
  taskflow: [
    {
      src: '/images/work/taskflow-dashboard.png',
      caption: '개발 화면 캡처 · 개인 항목 일부 삭제',
      title: '오늘 챙겨야 할 일을 한눈에',
      alt: 'TaskFlow 홈 대시보드. 진행 중인 프로젝트, 할 일 완료 현황, 오늘 할 일과 오늘의 일정을 함께 보여준다.',
      description: '홈에서 진행 중인 프로젝트와 할 일 완료 현황을 먼저 확인합니다. 프로젝트 목록, 오늘 할 일, 오늘의 일정을 나란히 배치해 업무와 개인 일상을 함께 살펴볼 수 있도록 구성했습니다.',
      points: ['진행 중인 프로젝트와 완료 현황', '오늘 할 일과 마감 정보', '오늘의 일정과 기능별 바로가기'],
    },
    {
      src: '/images/work/taskflow-issues.png',
      title: '프로젝트 이슈를 상태와 우선순위로 정리',
      alt: 'TaskFlow 프로젝트 이슈 목록. 상태, 구분, 번호, 제목, 우선순위, 경과일과 담당자를 표로 표시한다.',
      description: '프로젝트별 이슈를 검색하고 상태, 오류·개선 구분, 우선순위와 담당자를 함께 확인합니다. 오래된 컨펌 이슈는 접어두고 필요할 때 펼쳐 보며, 엑셀 붙여넣기로 이슈를 입력할 수 있습니다.',
      points: ['검색·필터와 열별 정렬', '상태·우선순위·담당자 확인', '오래된 컨펌 이슈 접기와 엑셀 붙여넣기'],
    },
  ],
}
