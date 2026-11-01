export interface WorkStep { title: string; body: string; evidence: string[] }
export interface WorkStory {
  slug: string; name: string; kind: string; subtitle: string; intro: string;
  why: string[]; stack: string[]; approach: string; steps: WorkStep[];
  decision: string; role: string; scope: string; image?: string;
  link?: { label: string; url: string };
}
// 공개용 설명만 유지한다. 내부 문서와 비공개 저장소 링크는 노출하지 않는다.
export const workStories: WorkStory[] = [
  {
    slug: 'proposal-agent', name: '제안서 에이전트', kind: '문서 업무 AI',
    subtitle: '기획부터 화면 설계, 개발까지 직접 만든 제안서 도구',
    intro: 'RFP 분석부터 중점 선택, 스토리와 목차 작성까지 돕는 도구입니다. 기획, 화면 설계와 개발을 직접 맡고 있습니다.',
    why: [
      '제안서를 준비할 때는 많은 자료를 읽는 것만큼, 그 안에서 무엇을 중요하게 봐야 하는지 판단하는 일이 어렵습니다. 고객의 상황과 평가기준을 함께 살펴보고 무엇을 강조할지 결정해야 합니다.',
      'RFP에서 요구사항과 평가기준을 확인하고, 제안에서 강조할 내용을 골라 스토리와 목차를 작성합니다.',
      'AI가 제시한 내용을 그대로 받아들이기보다 원문 근거를 확인하고 직접 수정하며 제안을 완성할 수 있는 도구를 목표로 합니다.',
    ],
    stack: ['Vue', 'Vite', 'ispark-ui'],
    approach: '자료 검토, 중점 선택, 스토리 편집을 단계로 나누고 분석 내용 옆에서 근거를 확인할 수 있도록 구성합니다. AI의 제안과 사용자의 판단이 함께 남는 흐름입니다.',
    steps: [
      { title: '자료 검토 화면 구성', body: 'RFP와 분석 내용을 함께 살펴보고 요구사항과 평가기준을 검토하는 화면을 구성했습니다.', evidence: ['RFP 원문', '요구사항', '평가기준'] },
      { title: '중점과 근거 연결', body: '중점 후보의 제목과 설명을 읽고 관련 근거를 확인하며 방향을 선택하도록 구성했습니다.', evidence: ['중점 후보', '근거 확인', '선택·수정'] },
      { title: '스토리 검토와 편집', body: '선택한 방향을 바탕으로 스토리를 검토하고 사용자가 내용을 수정하는 작업 화면을 구성했습니다.', evidence: ['스토리 구성', '직접 편집', '작업 저장'] },
    ],
    decision: '분석 결과 옆에서 원문 근거를 확인하고, AI가 제안한 내용을 직접 수정할 수 있도록 설계했습니다.',
    role: '문제 정의, 단계별 기획, 프롬프트 검토, UI/UX 디자인과 Vue·ispark-ui 기반 개발을 1인으로 진행하고 있습니다.',
    scope: '개발 중인 프로젝트로, 현재 구현한 화면과 설계 과정을 소개합니다.',
  },
  {
    slug: 'team-agent', name: 'TeamAgent', kind: 'AI 에이전트 플랫폼',
    subtitle: '업무에 맞는 에이전트를 구성하는 플랫폼',
    intro: '업무에 맞는 AI 에이전트를 만들고 관리하는 서비스입니다. 사용할 모델과 참고 자료, 답변 지침을 설정할 수 있습니다.',
    why: [
      'AI를 업무에 활용하려면 질문을 입력하는 것 외에도 준비할 것이 있습니다. 어떤 모델을 쓸지, 어떤 자료를 참고하게 할지, 어떤 역할과 기준으로 답하게 할지를 정해야 합니다.',
      'TeamAgent는 이런 설정을 묶어 업무에 맞는 에이전트를 만들고 관리하는 플랫폼입니다. 목적에 따라 구성한 에이전트를 다시 찾아 사용하고 수정할 수 있도록 합니다.',
      '프론트엔드에서는 복잡한 설정을 사용자가 이해할 수 있는 흐름으로 연결하는 데 초점을 맞췄습니다.',
    ],
    stack: ['Nuxt', 'Vue', 'TypeScript'],
    approach: '목록에서 에이전트를 선택하면 설정 패널이 열립니다. 화면 상태, 저장과 조회 요청을 분리하고 같은 흐름 안에서 수정할 수 있도록 구성했습니다.',
    steps: [
      { title: '설정 항목 정리', body: '에이전트 이름, 사용할 모델, 연결 데이터와 지침 등 설정에 필요한 항목을 구분했습니다.', evidence: ['모델 선택', '연결 데이터', '에이전트 지침'] },
      { title: '목록과 설정 화면 연결', body: '카드 목록에서 상세 설정을 열고, 새 에이전트를 추가하거나 기존 설정을 저장하는 흐름을 구성했습니다.', evidence: ['카드 목록', '설정 패널', '저장·조회'] },
      { title: '관리 기능 연결', body: '활성 상태 변경, 삭제, 드래그 순서 변경을 API와 연결해 목록에서 관리하도록 했습니다.', evidence: ['활성 상태', '순서 변경', '삭제'] },
    ],
    decision: '설정할 때마다 다른 화면으로 이동하지 않고, 목록과 설정을 하나의 작업 흐름으로 연결했습니다.',
    role: '에이전트 관리 화면과 상태 관리, API 연결을 포함한 프론트엔드 구현.',
    scope: '에이전트 관리 화면을 중심으로 구현 내용을 소개합니다.',
  },
  {
    slug: 'taskflow', name: 'TaskFlow', kind: '개인 업무·생활 관리 도구',
    subtitle: '프로젝트부터 일정·식단·메모·예약까지, 나만의 비서',
    intro: '프로젝트와 할 일은 물론 일정, 식단, 메모, 예약까지 한곳에서 관리하는 개인 비서 서비스입니다. 업무와 일상에 흩어진 기록을 모아 하루를 정리할 수 있도록 만들었습니다.',
    why: [
      '프로젝트의 할 일, 개인 일정, 식단과 메모, 예약 정보를 따로 관리하다 보면 하루에 확인해야 할 것들이 여러 곳으로 흩어집니다.',
      'TaskFlow는 업무와 일상의 기록을 한곳에 모아 관리하는 나만의 비서입니다. 프로젝트 관리부터 일정·식단·메모·예약까지 필요한 기능을 함께 담았습니다.',
      '해야 할 일과 기억할 내용을 한곳에서 확인할 수 있도록, 개인의 업무와 생활을 함께 관리하는 흐름에 초점을 맞췄습니다.',
    ],
    stack: ['Vue', 'TypeScript', 'ispark-ui', 'Express', 'Prisma', 'PostgreSQL'],
    approach: '홈에서는 프로젝트 진행 현황과 오늘 할 일·일정을 한눈에 확인하고, 프로젝트에 들어가면 개별 이슈를 자세히 관리하는 흐름입니다. 일정·식단·메모·예약도 같은 서비스에서 관리해 업무와 생활의 기록을 함께 정리합니다.',
    steps: [
      { title: '대시보드에서 하루 시작', body: '진행 중인 프로젝트 수와 할 일 완료 현황, 오늘 할 일과 일정을 모아 지금 챙길 내용을 확인합니다.', evidence: ['프로젝트 현황', '오늘 할 일', '오늘의 일정'] },
      { title: '프로젝트별 이슈 관리', body: '이슈의 상태·구분·우선순위·담당자를 표로 확인하고, 검색과 정렬로 필요한 작업을 찾습니다.', evidence: ['이슈 검색', '우선순위', '담당자'] },
      { title: '일정과 예약 관리', body: '개인 일정과 예약을 관리하고, 캘린더에서 선택한 날짜의 일정을 확인하거나 추가합니다.', evidence: ['월별 캘린더', '날짜별 일정', '예약 관리'] },
      { title: '식단과 메모 기록', body: '식단과 메모도 함께 관리해 업무 외에 일상에서 챙겨야 할 내용까지 한곳에 남깁니다.', evidence: ['식단 관리', '메모', '생활 기록'] },
    ],
    decision: '업무용 할 일과 개인 생활의 기록을 따로 흩어두지 않고, 나에게 필요한 정보를 한곳에서 관리할 수 있도록 구성했습니다.',
    role: '프론트엔드·백엔드·데이터베이스 설계와 구현.',
    scope: '프로젝트·일정·식단·메모·예약 관리와 이를 연결하는 화면, API, 데이터 저장까지 직접 구현한 프로젝트입니다.',
    image: '/images/work/taskflow-dashboard.png',
    link: { label: 'GitHub에서 보기', url: 'https://github.com/box3101/taskflow' },
  },
]
const storyOrder = ['proposal-agent', 'taskflow', 'team-agent']
workStories.sort((a, b) => storyOrder.indexOf(a.slug) - storyOrder.indexOf(b.slug))
export const siSlugs = new Set(['sgate-okr-solution', 'incheon-city', 'samsung-sdi-gsop', 'korean-bank-evaluation', 'yeonsu-library-website', 'incheon-jung-gu-edu', 'g4b-business-support', 'ict-ksa-system'])
