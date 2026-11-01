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
    slug: 'taskflow', name: 'TaskFlow', kind: '업무 관리 도구',
    subtitle: '디자인 시스템을 실제 제품에 적용한 작업',
    intro: '직접 만든 UI 컴포넌트로 작업 관리 화면을 구성하고, 서버와 데이터베이스까지 연결했습니다.',
    why: [
      '디자인 시스템의 컴포넌트가 실제 제품 안에서도 잘 작동하는지 확인하고 싶었습니다. 예제에서 보기 좋은 것과 여러 기능이 연결된 서비스에서 쓰기 편한 것은 다르기 때문입니다.',
      '그 적용 대상으로 선택한 것이 작업 관리 도구 TaskFlow입니다. 작업과 진행 상태를 관리하는 화면에 ispark-ui를 적용했습니다.',
      '재사용 가능한 UI를 만드는 경험에서 한 걸음 더 나아가, 그 UI로 서버와 데이터가 연결된 제품을 구성하는 경험을 쌓았습니다.',
    ],
    stack: ['Vue', 'TypeScript', 'ispark-ui', 'Express', 'Prisma', 'PostgreSQL'],
    approach: 'Vue와 ispark-ui로 화면을 구성하고, Express API와 Prisma를 통해 PostgreSQL의 데이터를 다루는 구조입니다. JWT 인증을 사용합니다.',
    steps: [
      { title: '작업 관리 화면 구성', body: '작업을 정리하고 진행 상태를 확인하는 화면을 재사용 가능한 컴포넌트로 구성했습니다.', evidence: ['작업 목록', '진행 상태', '입력 화면'] },
      { title: '서버와 데이터 연결', body: '프론트엔드에서 API를 호출하고 서버에서 데이터를 저장·조회하도록 연결했습니다.', evidence: ['Express API', 'Prisma', 'PostgreSQL'] },
      { title: '제품에 UI 적용', body: '입력, 버튼, 모달 등 공통 UI를 제품의 실제 화면에 적용했습니다.', evidence: ['ispark-ui', '공통 스타일', '제품 화면'] },
    ],
    decision: '컴포넌트 예제를 넘어, 화면과 서버·데이터가 연결된 제품 안에서 디자인 시스템을 사용했습니다.',
    role: '프론트엔드·백엔드·데이터베이스 설계와 구현.',
    scope: '작업 관리 화면부터 API와 데이터 저장까지 직접 구현한 프로젝트입니다.',
    image: '/images/pt-taskflow.svg',
    link: { label: 'GitHub에서 보기', url: 'https://github.com/box3101/taskflow' },
  },
]
export const siSlugs = new Set(['sgate-okr-solution', 'incheon-city', 'samsung-sdi-gsop', 'korean-bank-evaluation', 'yeonsu-library-website', 'incheon-jung-gu-edu', 'g4b-business-support', 'ict-ksa-system'])
