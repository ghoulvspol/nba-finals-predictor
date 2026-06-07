/**
 * i18n - 中英文切换系统
 * 使用 data-i18n 属性标记需要翻译的元素
 */

const I18N = {
  // 当前语言
  currentLang: 'en',

  // 翻译字典
  translations: {
    en: {
      // Navigation
      'nav.brand': 'NBA Finals 2026',
      'nav.overview': 'Series Overview',
      'nav.predictions': 'Predictions',
      'nav.players': 'Players',
      'nav.simulator': 'Simulator',

      // Footer
      'footer.desc': '2026 NBA Finals Predictor — Data-driven predictions using Elo ratings, team statistics, and Monte Carlo simulation',
      'footer.series': 'Spurs vs Knicks • Series: Knicks lead 2-0',

      // Index - Hero
      'hero.badge': '2026 NBA Finals',
      'hero.title': 'Spurs vs Knicks',
      'hero.format': 'Best of 7 • 2-3-2 Format',
      'hero.spurs_name': 'San Antonio Spurs',
      'hero.knicks_name': 'New York Knicks',
      'hero.west': 'West',
      'hero.east': 'East',
      'hero.status.next': 'Next: Game',
      'hero.status.must_win': 'Spurs must win to stay alive',
      'hero.status.clinch': 'Knicks can clinch in Game',

      // Index - Win Probability
      'prob.title': 'Series Win Probability',
      'prob.badge': 'Monte Carlo (10,000 sims)',
      'prob.spurs': 'Spurs',
      'prob.knicks': 'Knicks',
      'prob.most_likely': 'Most Likely Outcome',
      'prob.avg_games': 'Average Games',

      // Index - Completed Games
      'completed.title': 'Completed Games',
      'completed.subtitle': 'Results from Games 1-2 at Frost Bank Center',
      'completed.performances': 'Key Performances',

      // Index - Predictions
      'pred.title': 'Upcoming Game Predictions',
      'pred.subtitle': 'AI-powered predictions for remaining games',
      'pred.score': 'Predicted Score',

      // Index - Stats
      'stats.title': 'Statistical Comparison',
      'stats.subtitle': 'Regular season and playoff performance metrics',

      // Index - Outcomes
      'outcomes.title': 'Series Outcome Distribution',
      'outcomes.subtitle': 'Probability of each possible series result',

      // Index - Key Factors
      'factors.title': 'Key Series Factors',
      'factors.spurs_title': 'Spurs Advantages',
      'factors.knicks_title': 'Knicks Advantages',
      'factors.spurs_1': '🏆 5-0 all-time in NBA Finals (never lost)',
      'factors.spurs_2': '🛡️ Victor Wembanyama: 3.8 BPG, elite rim protection',
      'factors.spurs_3': '⚡ De\'Aaron Fox speed can exploit Knicks in transition',
      'factors.spurs_4': '🏠 Home court: Games 1, 2, 6, 7 at Frost Bank Center',
      'factors.spurs_5': '😤 Nothing to lose mentality at 0-2',
      'factors.knicks_1': '📊 Lead series 2-0 (94.3% of teams win from here)',
      'factors.knicks_2': '🎯 Jalen Brunson: 27.5 PPG, 8.2 APG, Finals MVP favorite',
      'factors.knicks_3': '🔒 OG Anunoby elite defense on Wembanyama',
      'factors.knicks_4': '💪 Better net rating (+11.1 vs +7.7)',
      'factors.knicks_5': '🏠 3 straight home games at MSG (Games 3, 4, 5)',
      'factors.historical': 'Historical Context:',
      'factors.historical_text': 'Teams trailing 0-2 in the NBA Finals have come back to win only 5.7% of the time (6 out of 105 series). However, the Spurs are historically perfect in Finals appearances (5-0), and the 2-3-2 format means they must now win at MSG before returning home for Games 6-7.',

      // Index - Methodology
      'method.title': 'Prediction Methodology',
      'method.subtitle': 'How our AI model generates predictions',
      'method.overview_title': 'Model Overview',
      'method.overview_desc': 'Our prediction model combines three complementary approaches to generate accurate game and series predictions.',
      'method.elo_title': 'Elo Rating System',
      'method.elo_desc': 'Each team has a dynamic Elo rating that updates based on game results. The Elo difference is converted to win probability using the logistic function.',
      'method.elo_formula': 'Formula:',
      'method.elo_formula_text': 'P(win) = 1 / (1 + 10^(-elo_diff / 400))',
      'method.elo_home': 'Home court adds ~100 Elo points (~3-4% win probability boost)',
      'method.elo_playoff': 'Playoff bonus: +50 Elo points for series advancement',
      'method.stats_title': 'Team Statistics Model',
      'method.stats_desc': 'A composite strength score is calculated from multiple team statistics, each weighted by predictive power.',
      'method.monte_title': 'Monte Carlo Simulation',
      'method.monte_desc': '10,000 simulations of the remaining series, each using per-game probabilities. This gives us the full distribution of possible outcomes.',
      'method.monte_features': 'Accounts for series dynamics:',
      'method.monte_desperation': 'Desperation factor (elimination games)',
      'method.monte_momentum': 'Momentum (win/loss streaks)',
      'method.monte_closeout': 'Close-out pressure',
      'method.weights_title': 'Factor Weights',
      'method.weight_factor': 'Factor',
      'method.weight_pct': 'Weight',
      'method.weight_desc': 'Description',
      'method.w_elo': 'Elo Rating Difference',
      'method.w_elo_pct': '40%',
      'method.w_elo_desc': 'Base win probability from team ratings',
      'method.w_home': 'Home Court Advantage',
      'method.w_home_pct': '15%',
      'method.w_home_desc': '~100 Elo points for home team',
      'method.w_off': 'Offensive Efficiency',
      'method.w_off_pct': '15%',
      'method.w_off_desc': 'Points per 100 possessions',
      'method.w_def': 'Defensive Efficiency',
      'method.w_def_pct': '12%',
      'method.w_def_desc': 'Opponent points per 100 possessions',
      'method.w_net': 'Net Rating',
      'method.w_net_pct': '8%',
      'method.w_net_desc': 'Offensive minus defensive rating',
      'method.w_schedule': 'Schedule Factors',
      'method.w_schedule_pct': '5%',
      'method.w_schedule_desc': 'Rest days, back-to-backs, travel',
      'method.w_history': 'Historical Factors',
      'method.w_history_pct': '5%',
      'method.w_history_desc': 'Finals experience, comeback rates',
      'method.total': 'Total',
      'method.total_pct': '100%',

      // Predictions page
      'pred_page.title': 'Game Predictions',
      'pred_page.subtitle': 'AI-powered predictions for each remaining game in the 2026 NBA Finals',
      'pred_page.current_state': 'Current Series State',
      'pred_page.knicks_lead': 'Knicks lead 2-0',
      'pred_page.history': 'History:',
      'pred_page.history_text': 'Teams trailing 0-2 in the Finals have come back only 5.7% of the time. The 2-3-2 format now sends the series to MSG for three straight games (Games 3-5).',
      'pred_page.remaining': 'Remaining Game Predictions',
      'pred_page.home': 'Home',
      'pred_page.away': 'Away',
      'pred_page.predicted_score': 'Predicted Final Score',
      'pred_page.key_factors': 'Key Factors',
      'pred_page.scenario': 'Scenario Analysis',
      'pred_page.scenario_subtitle': 'How Game 3 outcome affects the rest of the series',
      'pred_page.method_title': 'Prediction Methodology',
      'pred_page.method_elo_title': '📊 Elo Rating System',
      'pred_page.method_elo_desc': 'Each team has an Elo rating that updates based on game results. Home court adds ~100 Elo points (roughly 3-4% win probability). Playoff experience and historical Finals success are factored in.',
      'pred_page.method_stats_title': '📈 Team Statistics',
      'pred_page.method_stats_desc': 'Offensive and defensive efficiency ratings, pace, shooting percentages, and rebounding rates are combined into a composite strength score. Weighted toward recent performance.',
      'pred_page.method_monte_title': '🎲 Monte Carlo Simulation',
      'pred_page.method_monte_desc': '10,000 simulations of the remaining series, each using the per-game probabilities. Accounts for series dynamics like desperation, momentum, and close-out pressure.',

      // Players page
      'players.title': 'Player Matchups',
      'players.subtitle': 'Key player comparisons and matchup analysis for the 2026 NBA Finals',
      'players.head_to_head': 'Head-to-Head Matchups',
      'players.position_breakdown': 'Position-by-position breakdown with edge analysis',
      'players.spurs_edge': 'Spurs Edge',
      'players.knicks_edge': 'Knicks Edge',
      'players.even': 'Even',
      'players.spurs_roster': 'San Antonio Spurs',
      'players.knicks_roster': 'New York Knicks',
      'players.star_compare': 'Star Player Comparison',
      'players.star_subtitle': 'Wembanyama vs Brunson - Franchise cornerstones',

      // Simulator page
      'sim.title': 'Series Simulator',
      'sim.subtitle': 'Monte Carlo simulation of the remaining 2026 NBA Finals series',
      'sim.spurs_win': 'Spurs Win Series',
      'sim.knicks_win': 'Knicks Win Series',
      'sim.based_on': 'Based on 10,000 simulations',
      'sim.summary': 'Simulation Summary',
      'sim.runs': '10,000 runs',
      'sim.most_likely': 'Most Likely Outcome',
      'sim.spurs_knicks': 'Spurs-Knicks',
      'sim.avg_length': 'Average Series Length',
      'sim.games': 'games',
      'sim.current_state': 'Current Series State',
      'sim.knicks_lead': 'Knicks lead',
      'sim.by_game': 'Series Probability by Game',
      'sim.per_game': 'Per-game win probability',
      'sim.distribution': 'Outcome Distribution',
      'sim.all_results': 'All possible series results',
      'sim.series_result': 'Series Result',
      'sim.spurs_wins': 'Spurs Wins',
      'sim.knicks_wins': 'Knicks Wins',
      'sim.probability': 'Probability',
      'sim.winner': 'Winner',
      'sim.how_it_works': 'How the Simulation Works',
      'sim.monte_title': '🔢 Monte Carlo Method',
      'sim.monte_desc': 'We simulate the remaining series 10,000 times. In each simulation, every game is decided by a random number compared to the predicted win probability. This gives us a distribution of all possible outcomes.',
      'sim.dynamic_title': '📊 Dynamic Probabilities',
      'sim.dynamic_desc': 'Win probabilities change based on series state. A team facing elimination gets a "desperation boost." A team trying to close out may feel additional pressure. Home court advantage is factored in.',
      'sim.multifactor_title': '⚖️ Multi-Factor Model',
      'sim.multifactor_desc': 'Each game prediction combines Elo ratings, team offensive/defensive efficiency, home court advantage, series momentum, historical data, and desperation factors.',
      'sim.confidence_title': '📈 Statistical Confidence',
      'sim.confidence_desc': 'With 10,000 simulations, the results have high statistical confidence. The most likely outcome and probability distribution are reliable indicators of the series trajectory.',
      'sim.note': 'Note:',
      'sim.note_text': 'This simulation uses the 2-3-2 Finals format where Games 1-2, 6-7 are in San Antonio and Games 3-5 are in New York. The Spurs\' historical perfection in Finals (5-0) is factored in as a small adjustment, though the 0-2 deficit makes their path extremely difficult.',

      // Common
      'common.game': 'Game',
      'common.vs': 'vs',
      'common.spurs': 'Spurs',
      'common.knicks': 'Knicks',
    },

    zh: {
      // 导航
      'nav.brand': 'NBA 总决赛 2026',
      'nav.overview': '系列赛概览',
      'nav.predictions': '比赛预测',
      'nav.players': '球员数据',
      'nav.simulator': '模拟器',

      // 页脚
      'footer.desc': '2026 NBA 总决赛预测器 — 基于 Elo 评分、球队统计和蒙特卡洛模拟的数据驱动预测',
      'footer.series': '马刺 vs 尼克斯 • 系列赛: 尼克斯 2-0 领先',

      // 首页 - 英雄区
      'hero.badge': '2026 NBA 总决赛',
      'hero.title': '马刺 vs 尼克斯',
      'hero.format': '七场四胜 • 2-3-2 赛制',
      'hero.spurs_name': '圣安东尼奥马刺',
      'hero.knicks_name': '纽约尼克斯',
      'hero.west': '西部',
      'hero.east': '东部',
      'hero.status.next': '下一场: 第',
      'hero.status.must_win': '场 • 马刺必须获胜才能延续系列赛',
      'hero.status.clinch': '尼克斯可在第',
      'hero.status.clinch_end': '场夺冠',

      // 首页 - 胜率
      'prob.title': '系列赛夺冠概率',
      'prob.badge': '蒙特卡洛模拟 (10,000 次)',
      'prob.spurs': '马刺',
      'prob.knicks': '尼克斯',
      'prob.most_likely': '最可能结果',
      'prob.avg_games': '平均比赛场次',

      // 首页 - 已完成比赛
      'completed.title': '已完成比赛',
      'completed.subtitle': '弗罗斯特银行中心 第1-2场比赛结果',
      'completed.performances': '关键表现',

      // 首页 - 预测
      'pred.title': '接下来的比赛预测',
      'pred.subtitle': 'AI 驱动的剩余比赛预测',
      'pred.score': '预测比分',

      // 首页 - 统计
      'stats.title': '数据对比',
      'stats.subtitle': '常规赛和季后赛表现指标',

      // 首页 - 结果分布
      'outcomes.title': '系列赛结果分布',
      'outcomes.subtitle': '每种可能系列赛结果的概率',

      // 首页 - 关键因素
      'factors.title': '系列赛关键因素',
      'factors.spurs_title': '马刺优势',
      'factors.knicks_title': '尼克斯优势',
      'factors.spurs_1': '🏆 总决赛历史战绩 5-0（从未输过）',
      'factors.spurs_2': '🛡️ 维克托·文班亚马：场均 3.8 次盖帽，顶级护框能力',
      'factors.spurs_3': '⚡ 德阿隆·福克斯速度可利用转换进攻',
      'factors.spurs_4': '🏠 主场优势：第1、2、6、7场在弗罗斯特银行中心',
      'factors.spurs_5': '😤 0-2 落后无压力，放手一搏',
      'factors.knicks_1': '📊 系列赛 2-0 领先（94.3% 的球队从此局面获胜）',
      'factors.knicks_2': '🎯 杰伦·布伦森：27.5 分、8.2 助攻，总决赛MVP热门',
      'factors.knicks_3': '🔒 OG·阿奴诺比对文班亚马的顶级防守',
      'factors.knicks_4': '💪 更好的净效率值（+11.1 vs +7.7）',
      'factors.knicks_5': '🏠 连续 3 场主场在麦迪逊广场花园（第3、4、5场）',
      'factors.historical': '历史背景：',
      'factors.historical_text': 'NBA 总决赛中 0-2 落后的球队逆转概率仅为 5.7%（105 次中仅 6 次成功）。但马刺在总决赛中保持完美战绩（5-0），且 2-3-2 赛制下他们需要在麦迪逊广场花园赢球，然后回到主场打第6-7场。',

      // 首页 - 方法论
      'method.title': '预测方法论',
      'method.subtitle': '我们的 AI 模型如何生成预测',
      'method.overview_title': '模型概述',
      'method.overview_desc': '我们的预测模型结合了三种互补方法来生成准确的比赛和系列赛预测。',
      'method.elo_title': 'Elo 评分系统',
      'method.elo_desc': '每支球队拥有动态 Elo 评分，根据比赛结果更新。Elo 分差通过逻辑函数转换为胜率。',
      'method.elo_formula': '计算公式：',
      'method.elo_formula_text': 'P(胜) = 1 / (1 + 10^(-elo_diff / 400))',
      'method.elo_home': '主场优势约 +100 Elo 分（约 3-4% 胜率提升）',
      'method.elo_playoff': '季后赛加成：晋级球队 +50 Elo 分',
      'method.stats_title': '球队统计模型',
      'method.stats_desc': '综合多维度球队统计数据计算强度得分，每项指标按预测能力加权。',
      'method.monte_title': '蒙特卡洛模拟',
      'method.monte_desc': '对剩余系列赛进行 10,000 次模拟，每次使用单场比赛胜率。这给出了所有可能结果的完整分布。',
      'method.monte_features': '考虑系列赛动态因素：',
      'method.monte_desperation': '背水一战因素（淘汰赛）',
      'method.monte_momentum': '势头（连胜/连败）',
      'method.monte_closeout': '终结压力',
      'method.weights_title': '因素权重表',
      'method.weight_factor': '因素',
      'method.weight_pct': '权重',
      'method.weight_desc': '说明',
      'method.w_elo': 'Elo 评分差',
      'method.w_elo_pct': '40%',
      'method.w_elo_desc': '基于球队评分的基础胜率',
      'method.w_home': '主场优势',
      'method.w_home_pct': '15%',
      'method.w_home_desc': '主场球队约 +100 Elo 分',
      'method.w_off': '进攻效率',
      'method.w_off_pct': '15%',
      'method.w_off_desc': '每100回合得分',
      'method.w_def': '防守效率',
      'method.w_def_pct': '12%',
      'method.w_def_desc': '对手每100回合得分',
      'method.w_net': '净效率',
      'method.w_net_pct': '8%',
      'method.w_net_desc': '进攻效率减防守效率',
      'method.w_schedule': '赛程因素',
      'method.w_schedule_pct': '5%',
      'method.w_schedule_desc': '休息天数、背靠背、旅途',
      'method.w_history': '历史因素',
      'method.w_history_pct': '5%',
      'method.w_history_desc': '总决赛经验、逆转概率',
      'method.total': '合计',
      'method.total_pct': '100%',

      // 预测页
      'pred_page.title': '比赛预测',
      'pred_page.subtitle': '2026 NBA 总决赛每场比赛的 AI 预测',
      'pred_page.current_state': '当前系列赛状态',
      'pred_page.knicks_lead': '尼克斯 2-0 领先',
      'pred_page.history': '历史数据：',
      'pred_page.history_text': '总决赛中 0-2 落后的球队逆转概率仅为 5.7%。2-3-2 赛制下，系列赛将移师麦迪逊广场花园连续三场（第3-5场）。',
      'pred_page.remaining': '剩余比赛预测',
      'pred_page.home': '主场',
      'pred_page.away': '客场',
      'pred_page.predicted_score': '预测最终比分',
      'pred_page.key_factors': '关键因素',
      'pred_page.scenario': '情景分析',
      'pred_page.scenario_subtitle': '第3场比赛结果如何影响后续系列赛',
      'pred_page.method_title': '预测方法论',
      'pred_page.method_elo_title': '📊 Elo 评分系统',
      'pred_page.method_elo_desc': '每支球队拥有根据比赛结果更新的 Elo 评分。主场优势约 +100 Elo 分（约 3-4% 胜率）。季后赛经验和历史总决赛成绩也会纳入计算。',
      'pred_page.method_stats_title': '📈 球队统计',
      'pred_page.method_stats_desc': '进攻和防守效率评分、比赛节奏、投篮命中率和篮板率综合为一个强度得分，侧重近期表现。',
      'pred_page.method_monte_title': '🎲 蒙特卡洛模拟',
      'pred_page.method_monte_desc': '对剩余系列赛进行 10,000 次模拟，每次使用单场比赛胜率。考虑系列赛动态因素如背水一战、势头和终结压力。',

      // 球员页
      'players.title': '球员对位',
      'players.subtitle': '2026 NBA 总决赛关键球员对比和对位分析',
      'players.head_to_head': '正面交锋对位',
      'players.position_breakdown': '逐位置分析与优势评估',
      'players.spurs_edge': '马刺优势',
      'players.knicks_edge': '尼克斯优势',
      'players.even': '势均力敌',
      'players.spurs_roster': '圣安东尼奥马刺',
      'players.knicks_roster': '纽约尼克斯',
      'players.star_compare': '球星对比',
      'players.star_subtitle': '文班亚马 vs 布伦森 - 球队基石',

      // 模拟器页
      'sim.title': '系列赛模拟器',
      'sim.subtitle': '2026 NBA 总决赛剩余系列赛的蒙特卡洛模拟',
      'sim.spurs_win': '马刺赢得系列赛',
      'sim.knicks_win': '尼克斯赢得系列赛',
      'sim.based_on': '基于 10,000 次模拟',
      'sim.summary': '模拟摘要',
      'sim.runs': '10,000 次',
      'sim.most_likely': '最可能结果',
      'sim.spurs_knicks': '马刺-尼克斯',
      'sim.avg_length': '平均系列赛场次',
      'sim.games': '场',
      'sim.current_state': '当前系列赛状态',
      'sim.knicks_lead': '尼克斯领先',
      'sim.by_game': '逐场比赛胜率',
      'sim.per_game': '单场胜率',
      'sim.distribution': '结果分布',
      'sim.all_results': '所有可能的系列赛结果',
      'sim.series_result': '系列赛结果',
      'sim.spurs_wins': '马刺胜场',
      'sim.knicks_wins': '尼克斯胜场',
      'sim.probability': '概率',
      'sim.winner': '获胜方',
      'sim.how_it_works': '模拟原理',
      'sim.monte_title': '🔢 蒙特卡洛方法',
      'sim.monte_desc': '我们将剩余系列赛模拟 10,000 次。每次模拟中，每场比赛由随机数与预测胜率比较决定。这给出了所有可能结果的分布。',
      'sim.dynamic_title': '📊 动态概率',
      'sim.dynamic_desc': '胜率根据系列赛状态变化。面临淘汰的球队获得"背水一战加成"。试图终结系列赛的球队可能承受额外压力。主场优势也会纳入计算。',
      'sim.multifactor_title': '⚖️ 多因素模型',
      'sim.multifactor_desc': '每场比赛预测综合 Elo 评分、球队攻防效率、主场优势、系列赛势头、历史数据和背水一战因素。',
      'sim.confidence_title': '📈 统计置信度',
      'sim.confidence_desc': '10,000 次模拟的结果具有高统计置信度。最可能结果和概率分布是系列赛走向的可靠指标。',
      'sim.note': '说明：',
      'sim.note_text': '本模拟使用 2-3-2 总决赛赛制，第1-2、6-7场在圣安东尼奥，第3-5场在纽约。马刺在总决赛中的历史完美战绩（5-0）作为小幅调整因素，但 0-2 落后的局面使他们的夺冠之路极其艰难。',

      // 通用
      'common.game': '第',
      'common.vs': '对',
      'common.spurs': '马刺',
      'common.knicks': '尼克斯',
    },
  },

  /**
   * 初始化 i18n 系统
   */
  init() {
    // 从 localStorage 读取语言偏好，或根据浏览器语言判断
    const saved = localStorage.getItem('nba-finals-lang');
    if (saved && (saved === 'zh' || saved === 'en')) {
      this.currentLang = saved;
    } else {
      // 检测浏览器语言
      const browserLang = navigator.language || navigator.userLanguage || 'en';
      this.currentLang = browserLang.startsWith('zh') ? 'zh' : 'en';
    }

    this.applyTranslations();
    this.updateToggle();
  },

  /**
   * 切换语言
   */
  toggle() {
    this.currentLang = this.currentLang === 'en' ? 'zh' : 'en';
    localStorage.setItem('nba-finals-lang', this.currentLang);
    this.applyTranslations();
    this.updateToggle();
  },

  /**
   * 应用翻译到所有带 data-i18n 属性的元素
   */
  applyTranslations() {
    const dict = this.translations[this.currentLang];
    if (!dict) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        el.textContent = dict[key];
      }
    });

    // 处理 placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key] !== undefined) {
        el.placeholder = dict[key];
      }
    });

    // 更新 html lang 属性
    document.documentElement.lang = this.currentLang === 'zh' ? 'zh-CN' : 'en';
  },

  /**
   * 更新切换按钮显示
   */
  updateToggle() {
    const btn = document.getElementById('lang-toggle');
    if (btn) {
      btn.textContent = this.currentLang === 'en' ? '中' : 'EN';
      btn.title = this.currentLang === 'en' ? '切换到中文' : 'Switch to English';
    }
  },

  /**
   * 获取翻译文本
   */
  t(key) {
    const dict = this.translations[this.currentLang];
    return dict[key] || key;
  },
};
