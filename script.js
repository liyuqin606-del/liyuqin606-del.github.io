/* English stays readable without JavaScript; translations are local and optional. */
(() => {
  'use strict';

  const chinese = Object.freeze({
    skip: '跳转到正文',
    navLabel: '主导航',
    navResearch: '研究',
    navProjects: '项目',
    navEducation: '教育背景',
    navContact: '联系',
    heroEyebrow: '数学 × 计算机科学',
    heroLine: '理解系统。<br>提出更好的问题。',
    heroIntro: '我是<a href="https://dii.csu.edu.cn/EN/ABOUT/Why_DIICSU/Introduction.htm" target="_blank" rel="noopener noreferrer">中南大学邓迪国际学院（DIICSU）</a>数学与应用数学专业本科生，辅修计算机科学。我的研究关注如何理解与评估学习系统。',
    explore: '了解我的研究',
    geometryAlt: '单叶双曲面的线框图，展示直线如何构成曲面。',
    figureCaption: '从另一种视角理解结构。',
    basedAt: '所在院校',
    institutionShort: '中南大学 · 邓迪国际学院',
    focusLabel: '研究兴趣',
    focusValue: '可靠人工智能与学习系统',
    educationLabel: '教育背景',
    cohort: '本科在读 · 2025年至今',
    researchEyebrow: '01 / 研究',
    researchTitle: '我关注的<em>研究方向。</em>',
    researchIntro: '从语言模型的内部机制，到评估智能体工作可靠性的方法。',
    area1Title: '理解语言模型',
    area1: '我关注模型的内部表征如何影响行为，以及这些关系如何在学习过程中形成。',
    area2Title: '评估人工智能体',
    area2: '探索如何评估智能体的工作、发现其中的失败，并理解独立验证能够提供哪些保证。',
    area3Title: '统计学习与模型分析',
    area3: '我对不确定性、分布偏移与模型适配感兴趣，尝试通过数学分析和可复现实验研究这些问题。',
    profileLink: '查看我的 OpenReview 主页',
    projectsEyebrow: '02 / 开源项目',
    projectsTitle: '让想法<em>成为实现。</em>',
    projectsIntro: '围绕数学、科研与软件开发构建工具和可复现实验。',
    project1: '面向有限序列结构检测的可复现基准，结合最小描述长度评分、蒙特卡洛校准与留出集评估。',
    project1tag: '基准评估 · 可复现性',
    project2: '对照 npm、Python 和 Rust 包元数据与发布归档的命令行工具，生成结构化检查报告与范围明确的维护任务。',
    project2tag: '命令行工具 · 软件发布',
    project3: '面向学术稿件修订的 Codex Skill，结合论断与证据映射、静态保真检查和语义复核。',
    project3tag: '学术写作 · 证据审计',
    educationEyebrow: '03 / 教育背景',
    educationTitle: '以数学<br><em>为基础。</em>',
    educationDate: '2025年至今',
    schoolName: '中南大学',
    schoolDetail: '中南大学邓迪国际学院<br>（DIICSU）',
    major: '数学与应用数学',
    minor: '辅修计算机科学',
    instituteLink: '了解邓迪国际学院',
    contactEyebrow: '04 / 联系',
    contactTitle: '从一次<em>交流</em><br>开始。',
    contactCopy: '欢迎就研究讨论、合作与实习机会联系我。',
    copyEmail: '复制邮箱',
    backTop: '返回顶部'
  });

  function initialize() {
    const english = Object.create(null);
    const bindings = [];
    const bindingAttributes = [
      ['data-i18n', null],
      ['data-i18n-alt', 'alt'],
      ['data-i18n-aria', 'aria-label']
    ];

    // Capture the actual English HTML so future English edits have one source.
    for (const [dataAttribute, targetAttribute] of bindingAttributes) {
      document.querySelectorAll(`[${dataAttribute}]`).forEach((element) => {
        const key = element.getAttribute(dataAttribute);
        const original = targetAttribute === null
          ? element.innerHTML
          : element.getAttribute(targetAttribute) || '';
        if (!Object.hasOwn(english, key)) english[key] = original;
        bindings.push({ element, key, targetAttribute, original });
      });
    }
    Object.freeze(english);

    const keys = [...new Set(bindings.map(({ key }) => key))].sort();
    const missingChinese = keys.filter((key) => !Object.hasOwn(chinese, key));
    const unusedChinese = Object.keys(chinese).filter((key) => !keys.includes(key));
    // Inspectable coverage report; no telemetry or external requests.
    window.homepageI18nCoverage = Object.freeze({
      keys: Object.freeze(keys),
      bindingCount: bindings.length,
      uniqueKeyCount: keys.length,
      missingChinese: Object.freeze(missingChinese),
      unusedChinese: Object.freeze(unusedChinese),
      complete: missingChinese.length === 0
    });

    const toggle = document.querySelector('.language-toggle');
    const copyButtons = [...document.querySelectorAll('[data-copy-email]')];
    const status = document.querySelector('.copy-status');
    const emailLink = document.querySelector('.email-link[href^="mailto:"]');
    const email = emailLink
      ? emailLink.getAttribute('href').slice('mailto:'.length).split('?')[0]
      : '';
    const storageKey = 'yuqin-li-language';
    let language = 'en';
    let copyState = 'idle';
    let copyInProgress = false;

    // Supplement unkeyed decorative labels without changing names or paper titles.
    const supplemental = [
      ['.site-header .wordmark', 'aria-label', 'Yuqin Li，首页'],
      ['.footer .wordmark', 'aria-label', '返回顶部'],
      ['.identity-strip', 'aria-label', '教育与研究背景'],
      ['.project:nth-child(1) .project-top .small-label', null, '01 / PYTHON · 统计学'],
      ['.project:nth-child(2) .project-top .small-label', null, '02 / PYTHON · 开发者工具'],
      ['.project:nth-child(3) .project-top .small-label', null, '03 / 科研工具 · LATEX']
    ].flatMap(([selector, attribute, zh]) => {
      const element = document.querySelector(selector);
      return element ? [{
        element, attribute, zh,
        en: attribute ? element.getAttribute(attribute) : element.innerHTML
      }] : [];
    });

    const metadata = [
      ['meta[name="description"]', 'Yuqin Li — 中南大学邓迪国际学院数学与应用数学专业本科生。研究关注可靠人工智能、智能体评估与学习系统。'],
      ['meta[property="og:title"]', 'Yuqin Li — 数学与可靠人工智能'],
      ['meta[property="og:description"]', '数学、计算与可靠人工智能。中南大学邓迪国际学院 Yuqin Li 的研究与开源项目。']
    ].flatMap(([selector, zh]) => {
      const element = document.querySelector(selector);
      return element ? [{ element, zh, en: element.getAttribute('content') }] : [];
    });
    const englishTitle = document.title;

    function validLanguage(value) {
      return value === 'en' || value === 'zh';
    }

    function requestedLanguage() {
      const parameter = new URLSearchParams(window.location.search).get('lang');
      if (validLanguage(parameter)) return parameter;
      try {
        const stored = window.localStorage.getItem(storageKey);
        if (validLanguage(stored)) return stored;
      } catch (_) {
        // File previews and privacy settings can disable storage.
      }
      return 'en';
    }

    function updateStatus() {
      if (!status) return;
      const messages = language === 'zh' ? {
        idle: '',
        copied: `已复制邮箱：${email}`,
        selected: `自动复制不可用。已选中邮箱 ${email}，请手动复制。`,
        manual: `自动复制不可用，请手动复制邮箱：${email}`,
        missing: '暂时无法读取邮箱，请使用上方的邮箱链接。'
      } : {
        idle: '',
        copied: `Email copied: ${email}`,
        selected: `Automatic copying is unavailable. Email selected: ${email}. Please copy it manually.`,
        manual: `Automatic copying is unavailable. Please copy this email manually: ${email}`,
        missing: 'The email address could not be read. Please use the email link above.'
      };
      status.textContent = messages[copyState] || '';
    }

    function applyLanguage(next, updateUrl = false) {
      language = validLanguage(next) ? next : 'en';
      const dictionary = language === 'zh' ? chinese : english;
      for (const binding of bindings) {
        // Unknown new keys retain their original English copy.
        const value = Object.hasOwn(dictionary, binding.key)
          ? dictionary[binding.key]
          : binding.original;
        if (binding.targetAttribute === null) binding.element.innerHTML = value;
        else binding.element.setAttribute(binding.targetAttribute, value);
      }
      for (const item of supplemental) {
        const value = language === 'zh' ? item.zh : item.en;
        if (item.attribute) item.element.setAttribute(item.attribute, value);
        else item.element.innerHTML = value;
      }
      document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
      if (toggle) {
        toggle.querySelector('.lang-en')?.classList.toggle('active', language === 'en');
        toggle.querySelector('.lang-zh')?.classList.toggle('active', language === 'zh');
        toggle.setAttribute('aria-label', language === 'zh' ? '切换到英文' : 'Switch to Chinese');
        toggle.title = language === 'zh' ? '切换到英文' : 'Switch to Chinese';
      }
      document.title = language === 'zh' ? 'Yuqin Li — 数学与可靠人工智能' : englishTitle;
      for (const item of metadata) item.element.setAttribute('content', language === 'zh' ? item.zh : item.en);
      updateStatus();
      try {
        window.localStorage.setItem(storageKey, language);
      } catch (_) { /* Language still works without persistent storage. */ }
      if (updateUrl) {
        try {
          const url = new URL(window.location.href);
          url.searchParams.set('lang', language);
          // A URL object preserves other parameters and the current section hash.
          window.history.replaceState(window.history.state, '', url);
        } catch (_) { /* Local file previews can disallow history updates. */ }
      }
    }

    function selectEmail() {
      if (!emailLink) return false;
      try {
        const walker = document.createTreeWalker(emailLink, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
          const start = node.textContent.indexOf(email);
          if (start === -1) continue;
          const selection = window.getSelection();
          if (!selection) return false;
          const range = document.createRange();
          range.setStart(node, start);
          range.setEnd(node, start + email.length);
          selection.removeAllRanges();
          selection.addRange(range);
          return selection.toString() === email;
        }
      } catch (_) { /* The status still exposes an address for manual copying. */ }
      return false;
    }

    async function copyEmail() {
      if (copyInProgress) return;
      if (!email) {
        copyState = 'missing';
        updateStatus();
        return;
      }
      copyInProgress = true;
      copyButtons.forEach((button) => button.setAttribute('aria-busy', 'true'));
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(email);
        copyState = 'copied';
      } catch (_) {
        copyState = selectEmail() ? 'selected' : 'manual';
      } finally {
        copyInProgress = false;
        copyButtons.forEach((button) => button.removeAttribute('aria-busy'));
        updateStatus();
      }
    }

    toggle?.addEventListener('click', () => applyLanguage(language === 'en' ? 'zh' : 'en', true));
    copyButtons.forEach((button) => button.addEventListener('click', copyEmail));
    window.addEventListener('popstate', () => applyLanguage(requestedLanguage()));
    const initialLanguage = requestedLanguage();
    applyLanguage(initialLanguage, initialLanguage === 'zh');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
