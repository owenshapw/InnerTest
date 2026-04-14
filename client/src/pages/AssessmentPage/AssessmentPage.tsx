import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { logger } from '@lark-apaas/client-toolkit/logger';

// 境界状态类型
 type LevelStatus = 'inactive' | 'awakened' | 'stabilized';

// 用户类型
 type UserType = 'steady' | 'awakened_unstable' | 'cognitive_ahead' | 'unaware';

interface ILevel {
  name: string;
  description: string;
  suggestion: string;
  avatar: string;
}

interface IQuestion {
  id: number;
  text: string;
  levelIndex: number; // 0-9 对应10个境界
}

interface IOption {
  value: 'A' | 'B' | 'C';
  label: string;
  score: number;
}

interface IAnswer {
  questionId: number;
  optionValue: 'A' | 'B' | 'C';
  score: number;
}

// 评估结果
interface IEvaluationResult {
  currentLevel: number; // 0-9，当前站稳的境界索引
  reachedLevel: number; // 0-9，已触达的最高境界索引
  blockLevel: number | null; // 0-9，卡点境界索引，null 表示无卡点（已达最高境界）
  needConsolidate: boolean; // 是否需要在当前境界继续修炼
  levelScores: number[]; // 每个境界的得分 0-6
  levelStatuses: LevelStatus[]; // 每个境界的状态
  faultLevel: number | null; // 断层位置
  userType: UserType; // 用户类型
}

const OPTIONS: IOption[] = [
  { value: 'A', label: '高度符合', score: 2 },
  { value: 'B', label: '部分符合', score: 1 },
  { value: 'C', label: '不太符合', score: 0 }
];

const LEVELS: ILevel[] = [
  {
    name: "蓦然回首",
    description: "你正处在世俗成功的倦怠期，渐渐发现外在成就无法填补内心的空缺。虽仍在迷雾之中，却已生出向内探索、寻找内心山峰的渴望。",
    suggestion: "从每天5分钟的静坐开始，尝试只是观察自己的呼吸，不评判、不控制，只是与当下的自己同在。",
    avatar: "https://miaoda.feishu.cn/aily/api/v1/files/static/e63c4e62c4834ed389c419ca5e6a7999_ve_miaoda"
  },
  {
    name: "本我觉醒",
    description: "你开始觉醒，不断叩问「我是谁」。不愿再被标签定义，挣脱外界强加的角色与期待，寻找不依附于任何人的内在力量，从恐惧中重新掌握生命的方向盘。",
    suggestion: "写下那些外界强加给你的「应该」清单，诚实地问问自己：哪些是我真正想要的？",
    avatar: "https://miaoda.feishu.cn/aily/api/v1/files/static/0097a17d067b43f9bc232acd1b6d4224_ve_miaoda"
  },
  {
    name: "热望驱动",
    description: "你听见灵魂深处的声音，找回属于自己的热望。那件让你满心欢喜的事，如灯塔穿破迷雾，为你照亮前行的方向。",
    suggestion: "留意那些让你忘记时间流逝的时刻，那是你灵魂深处热望的线索。尝试为它腾出更多空间。",
    avatar: "https://miaoda.feishu.cn/aily/api/v1/files/static/19e6e88e4c1e442194e51e4a81e200dd_ve_miaoda"
  },
  {
    name: "波澜不惊",
    description: "你能觉察自动浮现的念头，接纳情绪而不被情绪裹挟，大幅减少内耗。逐步重塑稳定自洽的心智模式，以信念转化情绪，获得内心的安宁与笃定。",
    suggestion: "练习「觉察-暂停-选择」：当情绪升起时，先觉察它的存在，暂停自动化反应，有意识地选择如何回应。",
    avatar: "https://miaoda.feishu.cn/aily/api/v1/files/static/e11053b6f1fa47dbb32d1f0f604467fb_ve_miaoda"
  },
  {
    name: "心无所住",
    description: "你真正懂得放下，不再认同限制性信念。通过重写内在剧本，释放长久压抑的生命力，让身心变得轻盈、舒展、自在。",
    suggestion: "尝试重写你的「内在剧本」。当「我不够好」的声音出现时，温柔地告诉自己：那只是一个旧故事。",
    avatar: "https://miaoda.feishu.cn/aily/api/v1/files/static/2a855952e7214876b48f37a1b6f774ff_ve_miaoda"
  },
  {
    name: "拥抱未知",
    description: "你愿意拥抱未知，在变化中保持觉知。放下头脑的算计与控制，信任更大的场域，让直觉引领行动，随顺而不盲从。",
    suggestion: "在不确定性中保持觉知与流动。放下大脑的过度计算，让直觉引领一小步，信任生命自会展开。",
    avatar: "https://miaoda.feishu.cn/aily/api/v1/files/static/a44f76ed566c4551941ad732821d5ce4_ve_miaoda"
  },
  {
    name: "知行合一",
    description: "你以成长思维行走世间，让内心愿景落地为踏实行动。进入创造状态，看见生命的无限可能，以开放实验的心态持续探索、不断更新。",
    suggestion: "将内在愿景转化为具体而踏实的行动。每周设定一个小目标，持续积累，稳步前行。",
    avatar: "https://miaoda.feishu.cn/aily/api/v1/files/static/64b264dba9a6461c8a64ba7d5352f2f1_ve_miaoda"
  },
  {
    name: "上善若水",
    description: "你践行如水的智慧，包容而有力量，温和亦有边界。在关系中保持清醒与善意，成人达己，在滋养他人的同时实现自身的圆满。",
    suggestion: "探索「水的美德」——滋养万物而不争。在关系中保持觉知，通过成人达己，实现共同繁荣。",
    avatar: "https://miaoda.feishu.cn/aily/api/v1/files/static/93f52bbecbd6464280e6695162a5ed42_ve_miaoda"
  },
  {
    name: "引领共创",
    description: "你相信奇迹源于共创，善于以心连接他人，构建彼此支持、共同生长的生态，在协作中创造新的可能。",
    suggestion: "有意识地构建共创的生态系统。寻找同频的伙伴，通过深度连接与碰撞，共同创造更大可能。",
    avatar: "https://miaoda.feishu.cn/aily/api/v1/files/static/6aabebedfb1746e5aef0df26561ad4b8_ve_miaoda"
  },
  {
    name: "照亮生命",
    description: "你全然绽放自己，也真诚服务他人。成功不再只是个人成就，而是成为一道光，温柔照亮更多生命，让世界因你的存在而更温暖。",
    suggestion: "持续精进自己的内在修为，同时以你的生命状态去影响更多走在觉醒路上的人。",
    avatar: "https://miaoda.feishu.cn/aily/api/v1/files/static/0f06a2a15c3242f0984961994017649d_ve_miaoda"
  }
];

// 30道题目，每境界3题
const QUESTIONS: IQuestion[] = [
  // 第一组：蓦然回首 (0-2)
  { id: 1, text: "我似乎觉得外在成功并没有让我真正满足", levelIndex: 0 },
  { id: 2, text: "我会时不时停下来思考'我到底在追求什么'", levelIndex: 0 },
  { id: 3, text: "我不想总是在努力满足他人的期待", levelIndex: 0 },
  // 第二组：本我觉醒 (3-5)
  { id: 4, text: "我经常问自己'我是谁'", levelIndex: 1 },
  { id: 5, text: "我不太愿意再被标签定义（职业、身份等）", levelIndex: 1 },
  { id: 6, text: "我开始减少迎合他人的行为", levelIndex: 1 },
  // 第三组：热望驱动 (6-8)
  { id: 7, text: "我知道什么事情会让我真正兴奋", levelIndex: 2 },
  { id: 8, text: "我有一件让我持续投入的热爱", levelIndex: 2 },
  { id: 9, text: "我能感受到内在有一股稳定的动力", levelIndex: 2 },
  // 第四组：波澜不惊 (9-11)
  { id: 10, text: "我能觉察到自己的情绪变化", levelIndex: 3 },
  { id: 11, text: "我不容易被情绪完全带走", levelIndex: 3 },
  { id: 12, text: "我能较快从负面情绪中恢复", levelIndex: 3 },
  // 第五组：心无所住 (12-14)
  { id: 13, text: "我不再那么执着'我必须更好'", levelIndex: 4 },
  { id: 14, text: "我对自己充满信心", levelIndex: 4 },
  { id: 15, text: "我感觉自己越来越轻松自在", levelIndex: 4 },
  // 第六组：拥抱未知 (15-17)
  { id: 16, text: "面对不确定，我不再那么焦虑", levelIndex: 5 },
  { id: 17, text: "我愿意跟随直觉做决定", levelIndex: 5 },
  { id: 18, text: "我享受与未知共舞的过程", levelIndex: 5 },
  // 第七组：知行合一 (18-20)
  { id: 19, text: "我能把想法逐步转化为行动", levelIndex: 6 },
  { id: 20, text: "我觉得行动比思考重要", levelIndex: 6 },
  { id: 21, text: "生活就是实验，我总是大胆试错", levelIndex: 6 },
  // 第八组：上善若水 (21-23)
  { id: 22, text: "我在关系中既温和也有边界", levelIndex: 7 },
  { id: 23, text: "我不赞同狼性，我觉得协作比竞争重要", levelIndex: 7 },
  { id: 24, text: "我为别人的成功感到开心", levelIndex: 7 },
  // 第九组：引领共创 (24-26)
  { id: 25, text: "我会主动连接他人一起创造价值", levelIndex: 8 },
  { id: 26, text: "我积极参与社群活动", levelIndex: 8 },
  { id: 27, text: "和他人讨论常常比我自己思考更容易产生创意", levelIndex: 8 },
  // 第十组：照亮生命 (28-30)
  { id: 28, text: "我希望自己的存在能对他人产生积极影响", levelIndex: 9 },
  { id: 29, text: "我最大的成就感是点亮他人", levelIndex: 9 },
  { id: 30, text: "我致力于让这个社会变得更美好", levelIndex: 9 }
];

// 用户类型文案
const USER_TYPE_MESSAGES: Record<UserType, string> = {
  steady: "你正在稳稳走在自己的路上。",
  awakened_unstable: "你已经醒来，但还没站稳。",
  cognitive_ahead: "你的认知走在了行动前面。",
  unaware: "你还在第一座山的路上。"
};

const STORAGE_KEYS = {
  answers: '__global_inner_mountain_answers_v5',
  currentQuestion: '__global_inner_mountain_current_question_v5',
  evaluationResult: '__global_inner_mountain_evaluation_v5',
  currentView: '__global_inner_mountain_current_view_v5'
};

type ViewType = 'intro' | 'question' | 'result';

// 评估函数
function evaluate(answers: IAnswer[]): IEvaluationResult {
  // 初始化每个境界的得分
  const levelScores: number[] = new Array(10).fill(0);

  // 累加每个境界的得分
  answers.forEach(answer => {
    const question = QUESTIONS.find(q => q.id === answer.questionId);
    if (question) {
      levelScores[question.levelIndex] += answer.score;
    }
  });

  // 计算每个境界的状态
  const levelStatuses: LevelStatus[] = levelScores.map(score => {
    if (score <= 2) return 'inactive';
    if (score <= 4) return 'awakened';
    return 'stabilized';
  });

  // 1. 当前境界（连续稳定 >=5）
  let currentLevel = -1;
  for (let i = 0; i < 10; i++) {
    if (levelScores[i] >= 5) {
      currentLevel = i;
    } else {
      break;
    }
  }

  // 2. 已触达境界（最高 >=3）
  let reachedLevel = -1;
  for (let i = 0; i < 10; i++) {
    if (levelScores[i] >= 3) {
      reachedLevel = i;
    }
  }

  // 3. 断层检测（某层 <=2 且后面有 >=4）
  let faultLevel: number | null = null;
  for (let i = 1; i < 9; i++) {
    if (levelScores[i] <= 2 && levelScores[i + 1] >= 4) {
      faultLevel = i;
      break;
    }
  }

  // 如果有断层，当前境界 = 断层前一层
  if (faultLevel !== null) {
    currentLevel = faultLevel - 1;
  }

  // 标准化 currentLevel（-1 变成 0，表示在第0境界探索中）
  const normalizedCurrentLevel = Math.max(0, currentLevel);
  
  // 4. 卡点境界
  let blockLevel: number | null = normalizedCurrentLevel + 1;
  
  if (faultLevel !== null) {
    blockLevel = faultLevel;
  }
  
  // 如果已经达到最高境界，没有卡点
  if (normalizedCurrentLevel >= 9) {
    blockLevel = null;
  } else if (blockLevel !== null) {
    blockLevel = Math.min(blockLevel, 9);
  }
  
  // 检查当前境界是否已稳定（score >= 5）
  // 如果当前境界未稳定，建议在当前境界继续修炼
  const needConsolidate = levelScores[normalizedCurrentLevel] < 5;
  
  // 如果需要继续修炼当前境界，调整 blockLevel
  if (needConsolidate) {
    blockLevel = normalizedCurrentLevel;
  }

  // 5. 用户类型判定
  let userType: UserType = 'steady';

  // 未觉察型：前3层都低
  if (levelScores[0] <= 2 && levelScores[1] <= 2 && levelScores[2] <= 2) {
    userType = 'unaware';
  }
  // 认知超前型：高层有分，中层偏低
  else if (levelScores[5] >= 3 && levelScores[2] <= 3 && levelScores[3] <= 3) {
    userType = 'cognitive_ahead';
  }
  // 觉醒未稳型：2-4层高，但4-5层掉下去
  else if (levelScores[1] >= 3 && levelScores[2] >= 3 && levelScores[3] <= 3) {
    userType = 'awakened_unstable';
  }
  // 稳步成长型：分数逐层递增，几乎无断层
  else if (!faultLevel) {
    userType = 'steady';
  }

  const result = {
    currentLevel: normalizedCurrentLevel,
    reachedLevel: Math.max(0, reachedLevel),
    blockLevel,
    needConsolidate,
    levelScores,
    levelStatuses,
    faultLevel,
    userType
  };
  
  logger.info('[Debug] evaluate result:', result);
  return result;
}

const AssessmentPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<IAnswer[]>([]);
  const [evaluationResult, setEvaluationResult] = useState<IEvaluationResult | null>(null);

  useEffect(() => {
    try {
      const savedView = localStorage.getItem(STORAGE_KEYS.currentView) as ViewType;
      const savedAnswers = localStorage.getItem(STORAGE_KEYS.answers);
      const savedQuestion = localStorage.getItem(STORAGE_KEYS.currentQuestion);
      const savedEvaluation = localStorage.getItem(STORAGE_KEYS.evaluationResult);

      if (savedView) setCurrentView(savedView);
      if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
      if (savedQuestion) setCurrentQuestion(parseInt(savedQuestion));
      if (savedEvaluation) setEvaluationResult(JSON.parse(savedEvaluation));
    } catch (e) {
      // localStorage 不可用
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.currentView, currentView);
      localStorage.setItem(STORAGE_KEYS.answers, JSON.stringify(answers));
      localStorage.setItem(STORAGE_KEYS.currentQuestion, currentQuestion.toString());
      if (evaluationResult) {
        localStorage.setItem(STORAGE_KEYS.evaluationResult, JSON.stringify(evaluationResult));
      }
    } catch (e) {
      // localStorage 不可用
    }
  }, [currentView, answers, currentQuestion, evaluationResult]);

  const startAssessment = () => {
    setCurrentView('question');
    setCurrentQuestion(0);
    setAnswers([]);
    setEvaluationResult(null);
  };

  const handleAnswer = (option: IOption) => {
    const currentQ = QUESTIONS[currentQuestion];
    const newAnswer: IAnswer = {
      questionId: currentQ.id,
      optionValue: option.value,
      score: option.score
    };

    const updatedAnswers = answers.filter(a => a.questionId !== currentQ.id);
    updatedAnswers.push(newAnswer);
    setAnswers(updatedAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 完成答题，计算结果
      const result = evaluate(updatedAnswers);
      setEvaluationResult(result);
      setCurrentView('result');
    }
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const restartAssessment = () => {
    setCurrentView('intro');
    setCurrentQuestion(0);
    setAnswers([]);
    setEvaluationResult(null);
  };

  const getCurrentAnswer = (): IAnswer | undefined => {
    const currentQ = QUESTIONS[currentQuestion];
    return answers.find(a => a.questionId === currentQ.id);
  };

  // 获取当前题目所属的境界名称
  const getCurrentLevelName = () => {
    const currentQ = QUESTIONS[currentQuestion];
    return LEVELS[currentQ.levelIndex].name;
  };

  const renderIntroView = () => (
    <div className="w-full flex flex-col items-center text-center min-h-screen py-12 px-6">
      {/* Logo */}
      <img
        src="https://miaoda.feishu.cn/aily/api/v1/feisuda/attachments/0a8be637-7d1e-4913-ae43-205994e484d1/raw"
        alt="Inner Mountain"
        className="w-32 h-32 md:w-40 md:h-40 mb-10"
      />

      {/* 标题区域 */}
      <h1 className="text-2xl md:text-3xl font-semibold text-stone-800 mb-2">
        Inner Mountain
      </h1>
      <p className="text-lg text-stone-500 mb-4">
        内在状态测评
      </p>

      {/* 简介文字 */}
      <p className="text-sm text-stone-400 leading-relaxed mb-auto max-w-xs">
        30道题目，帮助你了解自己当前的内在状态、已触达的境界，以及限制你前进的卡点。
      </p>

      {/* CTA按钮 */}
      <button
        onClick={startAssessment}
        className="px-8 py-3 bg-stone-700 text-white text-sm font-medium rounded-full hover:bg-stone-600 transition-colors duration-200 mb-36"
      >
        开始测评
      </button>
    </div>
  );

  const renderQuestionView = () => {
    const currentQ = QUESTIONS[currentQuestion];
    const levelName = getCurrentLevelName();

    return (
      <div className="w-full max-w-xl mx-auto pt-16 pb-10 md:pt-24 md:pb-16">
        {/* 进度条 */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-stone-400">
              问题 {currentQuestion + 1} / {QUESTIONS.length}
            </span>
            <span className="text-xs text-stone-300">
              {levelName}
            </span>
          </div>
          <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* 问题卡片 */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 md:p-8 mb-6">
          <p className="text-lg md:text-xl text-stone-800 leading-relaxed mb-8">
            {currentQ.text}
          </p>

          <div className="space-y-3">
            {OPTIONS.map((option) => {
              const currentAnswer = getCurrentAnswer();
              const isSelected = currentAnswer?.optionValue === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option)}
                  className={`
                    w-full p-4 text-center text-base transition-all duration-200 rounded-xl border
                    ${isSelected
                      ? 'bg-primary text-primary-foreground border-primary shadow-md'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-primary/40 hover:bg-primary/[0.02]'
                    }
                  `}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 上一题按钮 */}
        <div className="flex items-center">
          {currentQuestion > 0 && (
            <button
              onClick={goToPrevious}
              className="flex items-center gap-2 px-4 py-2 text-sm text-stone-400 hover:text-stone-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              上一题
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderResultView = () => {
    if (!evaluationResult) return null;

    const { currentLevel, reachedLevel, blockLevel, faultLevel, needConsolidate, levelScores } = evaluationResult;
    const currentLevelData = LEVELS[currentLevel];
    const reachedLevelData = LEVELS[reachedLevel];
    const blockLevelData = blockLevel !== null ? LEVELS[blockLevel] : null;
    
    // 调试信息
    logger.info('[Debug] levelScores:', levelScores);
    logger.info('[Debug] currentLevel:', { currentLevel: currentLevel, arg1: 'reachedLevel:', reachedLevel: reachedLevel, arg3: 'blockLevel:', blockLevel: blockLevel });

    return (
      <div className="w-full max-w-2xl mx-auto py-12 md:py-20 px-3 md:px-6 flex flex-col items-center min-h-[calc(100vh-4rem)] justify-center">
        {/* 主视觉区 - 头像 + 当前境界 */}
        <div className="text-center mb-12">
          <img
            src={currentLevelData.avatar}
            alt={currentLevelData.name}
            className="w-[100px] h-[100px] md:w-[140px] md:h-[140px] rounded-full object-cover mx-auto mb-5"
          />
          <h2 className="text-xl md:text-2xl font-semibold text-stone-800 mb-2">
            {currentLevelData.name}
          </h2>
          <p className="text-sm text-stone-400">
            第{currentLevel + 1}境界
          </p>
        </div>

        {/* 解读卡片 */}
        <div className="w-full bg-white rounded-2xl border border-stone-100 p-6 md:p-8 mb-12">
          <p className="text-sm text-stone-600 leading-relaxed mb-6">
            {currentLevelData.description}
          </p>

          {/* 卡点与建议 */}
          <div className="border-t border-stone-100 pt-6">
            {blockLevel === null ? (
              // 已达最高境界
              <p className="text-sm text-stone-600 leading-relaxed">
                建议：向内探索永无止境，持续精进自己的内在修为，同时以你的生命状态去影响更多走在觉醒路上的人。
              </p>
            ) : faultLevel !== null ? (
              // 有断层
              <>
                <p className="text-sm text-accent leading-relaxed mb-4">
                  你已经看见第{reachedLevel + 1}境界·{reachedLevelData.name}的可能，但基础还未整合。你需要突破第{faultLevel + 1}境界·「{LEVELS[faultLevel].name}」这一层。
                </p>
                <p className="text-sm text-stone-600 leading-relaxed">
                  建议：{LEVELS[faultLevel].suggestion}
                </p>
              </>
            ) : needConsolidate ? (
              // 需要在当前境界继续修炼
              blockLevel === 0 ? (
                // 第0境界都未稳定
                <>
                  <p className="text-sm text-stone-600 leading-relaxed mb-4">
                    你仍在迷雾中探索，尚未真正进入第1境界。
                  </p>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    建议：{LEVELS[0].suggestion}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-stone-600 leading-relaxed mb-4">
                    你仍需在第{blockLevel + 1}境界·「{LEVELS[blockLevel].name}」这一层继续精进。
                  </p>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    建议：{LEVELS[blockLevel].suggestion}
                  </p>
                </>
              )
            ) : (
              // 正常卡点（当前境界+1）
              <>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  你要抵达的下一个境界是第{blockLevel + 1}境界·「{LEVELS[blockLevel].name}」这一层。
                </p>
                <p className="text-sm text-stone-600 leading-relaxed">
                  建议：{LEVELS[blockLevel].suggestion}
                </p>
              </>
            )}
          </div>
        </div>

        {/* 重新测评按钮 */}
        <button
          onClick={restartAssessment}
          className="px-8 py-3 bg-stone-700 text-white text-sm font-medium rounded-full hover:bg-stone-600 transition-colors duration-200"
        >
          重新测评
        </button>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-8 md:px-12">
        {currentView === 'intro' && renderIntroView()}
        {currentView === 'question' && renderQuestionView()}
        {currentView === 'result' && renderResultView()}
      </div>
    </div>
  );
};

export default AssessmentPage;
