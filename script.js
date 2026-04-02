const YEAR_EL = document.getElementById("year");
if (YEAR_EL) YEAR_EL.textContent = String(new Date().getFullYear());

function initTypewriter() {
  const headlineEl = document.getElementById("heroHeadline");
  const aboutEl = document.getElementById("heroAbout");
  const about2El = document.getElementById("heroAbout2");
  if (!headlineEl || !aboutEl || !about2El) return;

  const line1 = "Thinking. Rethinking. Building.";
  const accentWord = "Rethinking.";
  const line2 = aboutEl.textContent.trim();
  const about2Lines = about2El.innerHTML.split(/<br\s*\/?>/i).map(function (s) { return s.trim().replace(/<[^>]+>/g, ""); }).filter(Boolean);
  const about2CharCount = about2Lines.join("").length;
  const totalChars = line1.length + line2.length + about2CharCount;
  const totalDuration = 1.35;
  const startDelay = 0.15;
  const cursorId = "heroTypewriterCursor";

  function addCharSpans(container, text, startIndex, charClass) {
    for (let k = 0; k < text.length; k++) {
      const span = document.createElement("span");
      span.className = charClass;
      span.style.animationDelay = `${startDelay + ((startIndex + k) / totalChars) * totalDuration}s`;
      span.textContent = text[k];
      container.appendChild(span);
    }
    return startIndex + text.length;
  }

  let charIndex = 0;

  const accentStart = line1.indexOf(accentWord);
  const accentEnd = accentStart + accentWord.length;
  const wrap = document.createElement("span");
  wrap.className = "hero__title-line1";
  let i = 0;
  for (; i < accentStart; i++) {
    const span = document.createElement("span");
    span.className = "hero__title-char";
    span.style.animationDelay = `${startDelay + (charIndex / totalChars) * totalDuration}s`;
    span.textContent = line1[i];
    wrap.appendChild(span);
    charIndex++;
  }
  const accentWrap = document.createElement("span");
  accentWrap.className = "hero__title-accent";
  for (; i < accentEnd; i++) {
    const span = document.createElement("span");
    span.className = "hero__title-char";
    span.style.animationDelay = `${startDelay + (charIndex / totalChars) * totalDuration}s`;
    span.textContent = line1[i];
    accentWrap.appendChild(span);
    charIndex++;
  }
  wrap.appendChild(accentWrap);
  for (; i < line1.length; i++) {
    const span = document.createElement("span");
    span.className = "hero__title-char";
    span.style.animationDelay = `${startDelay + (charIndex / totalChars) * totalDuration}s`;
    span.textContent = line1[i];
    wrap.appendChild(span);
    charIndex++;
  }

  const cursor = document.createElement("span");
  cursor.id = cursorId;
  cursor.className = "hero__typewriter-cursor";
  cursor.setAttribute("aria-hidden", "true");

  headlineEl.innerHTML = "";
  headlineEl.appendChild(wrap);

  aboutEl.innerHTML = "";
  addCharSpans(aboutEl, line2, charIndex, "hero__title-char");
  charIndex += line2.length;

  about2El.innerHTML = "";
  for (let L = 0; L < about2Lines.length; L++) {
    if (L > 0) about2El.appendChild(document.createElement("br"));
    charIndex = addCharSpans(about2El, about2Lines[L], charIndex, "hero__title-char");
  }
  about2El.appendChild(cursor);

  aboutEl.style.opacity = "1";
  about2El.style.opacity = "1";

  setTimeout(function () {
    const c = document.getElementById(cursorId);
    if (c) c.classList.add("is-hidden");
  }, (startDelay + totalDuration) * 1000);
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTypewriter);
} else {
  initTypewriter();
}

const topbar = document.getElementById("topbar");
const navToggle = document.querySelector('[data-action="toggleNav"]');

const modal = document.getElementById("caseStudyModal");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");

/** Projects: demo = live app/prototype, caseStudy = Notion or document. Both open in new tab. */
const PROJECTS = [
  {
    id: "hirefeed",
    title: "HireFeed: Hiring Post Discovery",
    category: "AI",
    summary:
      "An agentic system that discovers hiring posts from the open web, extracts structured signals, ranks opportunities, and enables fast, contextual outreach.",
    tags: ["Agentic", "Retrieval", "Ranking"],
    demo: "https://jobpostdiscovery.vercel.app/home",
    caseStudy:
      "https://www.notion.so/HireFeed-Find-Hiring-Posts-32f3bb18cbd980b8986deb19c89d273f?source=copy_link",
  },
  {
    id: "zillow",
    title: "Decision Intelligence for Renters",
    category: "AI",
    summary: "A decision workspace that ranks listings, surfaces tradeoffs, and uses AI to explain what matters and why.",
    tags: ["LLM", "Deterministic", "Tradeoffs"],
    demo: "https://zillow-decision-dashboard-yog2.vercel.app/",
    caseStudy: "https://www.notion.so/PRD-Decision-Tracker-with-Trade-off-Summaries-Zillow-2f43bb18cbd9800285bad7477491ea8e?source=copy_link",
  },
];

function escapeHtml(s) {
  if (!s) return "";
  var div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}

function renderProjectsGrid() {
  var grid = document.getElementById("projectsGrid");
  if (!grid || !PROJECTS.length) return;
  var path = window.location.pathname || "";
  var isHome = path === "" || path === "/" || /index\.html$/i.test(path);
  var list = isHome ? PROJECTS.slice(0, 3) : PROJECTS;
  var html = list.map(function (p) {
    var slug = (p.category || "").toLowerCase().replace(/\s+/g, "-");
    var tags = p.tags && p.tags.length ? p.tags : [p.category];
    var tagsHtml = tags.map(function (tag) {
      return '<span class="pill pill--soft">' + escapeHtml(tag) + "</span>";
    }).join("");
    var caseStudyUrl = p.caseStudy || "#";
    var demoUrl = p.demo || "#";
    var targetAttr = ' target="_blank" rel="noopener noreferrer"';
    var ctasHtml =
      '<a class="card__cta card__cta--primary" href="' + escapeHtml(demoUrl) + '"' + targetAttr + '>View demo →</a>' +
      '<a class="card__cta card__cta--secondary" href="' + escapeHtml(caseStudyUrl) + '"' + targetAttr + '>View case study →</a>';
    return (
      '<article class="card card--project" data-filter="' + escapeHtml(slug) + '">' +
        '<div class="card__top">' +
          '<span class="card__title-link">' + escapeHtml(p.title) + "</span>" +
          '<div class="pill-row">' + tagsHtml + "</div>" +
        "</div>" +
        '<p class="card__summary">' + escapeHtml(p.summary) + "</p>" +
        '<div class="card__ctas">' + ctasHtml + "</div>" +
      "</article>"
    );
  }).join("");
  grid.innerHTML = html;
}

/** Frameworks: category slugs match filter tabs (discovery, decisioning, ai-systems). */
var FRAMEWORKS = [
  {
    title: "FRAMES - Non AI System Design Framework",
    category: "ai-systems",
    description: "A structured approach to designing scalable product systems.",
    steps: ["Frame the problem clearly", "Define requirements and constraints", "Design system architecture and flow", "Evaluate tradeoffs and evolution"],
    link: "/frameworks/frames",
  },
  {
    title: "LLM System Design Framework",
    category: "ai-systems",
    description: "A structured approach to designing LLM-powered systems with context, prompting, and reliable generation.",
    steps: [
      "Define the LLM’s role clearly",
      "Structure inputs and context",
      "Design prompts and generation flow",
      "Ensure reliability, evaluation, and feedback",
    ],
    link: "/frameworks/llm-system-design-framework",
  },
  {
    title: "Analytics Framework",
    category: "ai-systems",
    description: "Measure what matters across product outcomes and AI system performance.",
    steps: [
      "Define success clearly",
      "Track user behavior across the funnel",
      "Measure system and LLM performance",
      "Evaluate impact and iterate",
    ],
    link: "/frameworks/analytics-framework",
  },
  {
    title: "Agentic System Design Framework",
    category: "ai-systems",
    description:
      "A structured approach to designing agent-driven systems that plan, act, evaluate, and iterate under uncertainty.",
    steps: [
      "Define agent objective and stopping criteria",
      "Design planning and control policy",
      "Structure tools, memory, and state",
      "Build evaluation loops and feedback signals",
    ],
    link: "/frameworks/agentic-system-design-framework",
  },
  {
    title: "Agentic Systems Analytics Framework",
    category: "ai-systems",
    description:
      "A structured approach to measuring how agentic systems make decisions, iterate, and produce useful outcomes.",
    steps: [
      "Measure decision quality across the system loop",
      "Track efficiency of iterations and execution",
      "Evaluate alignment between system outputs and outcomes",
      "Balance quality, cost, and reliability",
    ],
    link: "/frameworks/agentic-systems-analytics",
  },
];

var APPLIED_IN_PRACTICE = {
  "zillow-decision-tracker": {
    title: "Zillow — Decision Tracker Analytics",
    description: "See how this framework is applied to measure decision-making and conversion.",
    cta: "View Case ->",
    link: "https://www.notion.so/Analytics-Zillow-Decision-Space-3283bb18cbd980f4a551d5b0dfe47828?source=copy_link",
  },
  "agentic-system-analytics": {
    title: "Agentic System Analytics",
    description:
      "See how this framework is applied to measure planner decisions, query quality, scoring effectiveness, and loop efficiency in an agentic system.",
    cta: "View Case ->",
    link: "https://www.notion.so/Agentic-System-Analytics-32f3bb18cbd9809d8a29ccf69659e7c4?source=copy_link",
  },
};

function renderAppliedInPracticeCards() {
  var slots = document.querySelectorAll('[data-component="applied-in-practice"]');
  if (!slots || !slots.length) return;
  slots.forEach(function (slot) {
    var key = slot.getAttribute("data-applied-key") || "";
    var config = APPLIED_IN_PRACTICE[key];
    if (!config) return;
    var label = slot.getAttribute("data-applied-label") || "";
    var labelHtml = label
      ? '<p class="framework-applied-card__eyebrow">' + escapeHtml(label) + "</p>"
      : "";
    slot.innerHTML =
      labelHtml +
      '<div class="framework-applied-card">' +
      '<h3 class="framework-applied-card__title">' + escapeHtml(config.title) + "</h3>" +
      '<p class="framework-applied-card__desc">' + escapeHtml(config.description) + "</p>" +
      '<a class="framework-applied-card__link" href="' + escapeHtml(config.link) + '" target="_blank" rel="noopener noreferrer">' +
      escapeHtml(config.cta) +
      "</a>" +
      "</div>";
  });
}

function renderFrameworksGrid() {
  var grid = document.getElementById("frameworksGrid");
  if (!grid || !FRAMEWORKS.length) return;
  var html = FRAMEWORKS.map(function (f) {
    var stepsHtml = (f.steps || []).map(function (s) {
      return "<li>" + escapeHtml(s) + "</li>";
    }).join("");
    return (
      '<article class="card card--framework" data-filter="' + escapeHtml(f.category) + '" data-link="' + escapeHtml(f.link) + '" tabindex="0" role="link" aria-label="' + escapeHtml(f.title) + '">' +
        '<h3 class="framework-card__title"><a class="framework-card__title-link" href="' + escapeHtml(f.link) + '">' + escapeHtml(f.title) + "</a></h3>" +
        '<p class="framework-card__desc">' + escapeHtml(f.description) + "</p>" +
        '<ul class="bullets bullets--tight">' + stepsHtml + "</ul>" +
      "</article>"
    );
  }).join("");
  grid.innerHTML = html;
}

/** Writing: category slug "tech-business" or "personal" for filtering. */
var WRITING_POSTS = [
  {
    title: "You Don’t Have an AI Problem. You Have a Workflow Problem.",
    category: "Workflow Design",
    description:
      "Many AI features fail because workflow design is weak. The model often is not the core issue.",
    intensity: "high",
    wordCount: 701,
    publishedDate: "Mar 31, 2026",
    readTime: "4 min read",
    link: "you-dont-have-an-ai-problem-you-have-a-workflow-problem.html",
  },
  {
    title: "The Best Prompt Is a System, Not a Sentence",
    category: "AI Systems",
    description:
      "Strong AI output depends on context, retrieval, constraints, and feedback loops far more than a single clever prompt.",
    intensity: "high",
    wordCount: 707,
    publishedDate: "Mar 26, 2026",
    readTime: "4 min read",
    link: "best-prompt-is-a-system-not-a-sentence.html",
  },
  {
    title: "Your AI Feature Is Competing Against Doing Nothing",
    category: "Product Strategy",
    description:
      "Most AI features lose to inertia, old habits, and workarounds unless they beat the path of least resistance.",
    intensity: "high",
    wordCount: 666,
    publishedDate: "Mar 19, 2026",
    readTime: "4 min read",
    link: "ai-feature-competing-against-doing-nothing.html",
  },
  {
    title: "“Good Enough” AI Beats “Perfect” AI",
    category: "Product Execution",
    description:
      "In production, speed, reliability, and usefulness often matter more than chasing perfect model output.",
    intensity: "medium",
    wordCount: 648,
    publishedDate: "Mar 11, 2026",
    readTime: "3 min read",
    link: "good-enough-ai-beats-perfect-ai.html",
  },
  {
    title: "Personalization Is One of the Most Defensible Uses of AI",
    category: "Personalization",
    description:
      "Generic AI output is getting commoditized. Personalization is where systems become truly useful and harder to replace.",
    intensity: "medium",
    wordCount: 687,
    publishedDate: "Feb 24, 2026",
    readTime: "4 min read",
    link: "personalization-defensible-ai.html",
  },
  {
    title: "Workflows First. Agents Second.",
    category: "Workflow Design",
    description:
      "Most AI demos feel magical. You type something vague; the system figures out what to do.",
    intensity: "low",
    wordCount: 227,
    publishedDate: "Feb 02, 2026",
    readTime: "2 min read",
    link: "workflows_first_agents_second.html",
  },
  {
    title: "AI Is Rarely the Product. It’s Usually the Cost Center.",
    category: "AI Economics",
    description: "Most AI demos look impressive. In production, the costs and complexity show up first.",
    intensity: "medium",
    wordCount: 530,
    publishedDate: "Jan 04, 2026",
    readTime: "3 min read",
    link: "ai_cost_center.html",
  },
];

function calculateReadTime(wordCount, intensity) {
  if (!wordCount) return "";
  var speed = 220;
  if (intensity === "low") speed = 250;
  if (intensity === "high") speed = 180;
  var minutes = Math.max(2, Math.ceil(wordCount / speed));
  return minutes + " min read";
}

function renderWritingGrid() {
  var grid = document.getElementById("writingGrid");
  if (!grid || !WRITING_POSTS.length) return;
  var html = WRITING_POSTS.map(function (post) {
    var link = post.link || "#";
    var tag = post.category || "Essay / Opinion";
    var publishedDate = post.publishedDate || "";
    var readTime = calculateReadTime(post.wordCount, post.intensity) || post.readTime || "";
    var filterValue = tag.toLowerCase().replace(/\s+/g, "-");
    var metaHtml =
      '<span class="writing-item__meta-cat">' + escapeHtml(tag) + "</span>" +
      (publishedDate ? '<span class="writing-item__meta-sep" aria-hidden="true">•</span><span class="writing-item__meta-read">' + escapeHtml(publishedDate) + "</span>" : "") +
      (readTime ? '<span class="writing-item__meta-sep" aria-hidden="true">•</span><span class="writing-item__meta-read">' + escapeHtml(readTime) + "</span>" : "");
    return (
      '<article class="writing-item" data-filter="' + escapeHtml(filterValue) + '" data-link="' + escapeHtml(link) + '" tabindex="0" role="link" aria-label="' + escapeHtml(post.title) + '">' +
        '<div class="writing-item__card">' +
          '<div class="writing-item__meta-row">' +
            metaHtml +
          "</div>" +
          '<h3 class="writing-item__title"><a class="writing-item__title-link" href="' + escapeHtml(link) + '">' + escapeHtml(post.title) + "</a></h3>" +
          (post.description ? '<p class="writing-item__description">' + escapeHtml(post.description) + "</p>" : "") +
        "</div>" +
      "</article>"
    );
  }).join("");
  grid.innerHTML = html;
}

const CASE_STUDIES = {
  ats: {
    title: "ATS-First Job Crawler",
    html: `<p><strong>Problem:</strong> Job discovery via aggregators is noisy and hard to trust. I wanted a deterministic source of truth that can feed AI scoring downstream.</p>`,
  },
  xray: {
    title: "X-Ray Hiring Collector",
    html: `<p><strong>Problem:</strong> Hiring signals are scattered across the web and quickly go stale. The goal was rapid signal capture for decision-making.</p>`,
  },
  playbook: {
    title: "AI Experiment Playbook",
    html: `<p><strong>Problem:</strong> AI features fail when teams ship demos instead of products. The playbook makes AI delivery repeatable and measurable.</p>`,
  },
};

/* Primary navigation: simple and explicit, no hidden hover menu state. */
function setNavOpen(open) {
  if (topbar) topbar.setAttribute("data-nav-open", open ? "true" : "false");
  if (navToggle) navToggle.setAttribute("aria-expanded", open ? "true" : "false");
}
if (navToggle && topbar) {
  navToggle.addEventListener("click", function () {
    var open = topbar.getAttribute("data-nav-open") === "true";
    setNavOpen(!open);
  });
}

document.addEventListener("click", function (e) {
  if (!topbar) return;
  if (topbar.getAttribute("data-nav-open") !== "true") return;
  if (e.target && e.target.closest && e.target.closest("#navWrap")) return;
  setNavOpen(false);
});

function openModal(projectKey) {
  if (!modal || !modalTitle || !modalContent) return;
  var payload = CASE_STUDIES[projectKey];
  if (!payload) return;
  modalTitle.textContent = payload.title;
  modalContent.innerHTML = payload.html;
  modal.showModal();
}
function openModalFromHash() {
  var hash = window.location.hash.slice(1);
  var match = hash.match(/^project-(ats|xray|playbook)$/);
  if (match) openModal(match[1]);
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", openModalFromHash);
} else {
  openModalFromHash();
}
window.addEventListener("hashchange", openModalFromHash);
window.openModal = openModal;

document.addEventListener("click", function (e) {
  var action = e.target.closest && e.target.closest("[data-action]");
  if (!action) return;
  if (action.getAttribute("data-action") === "closeModal" && modal) {
    modal.close();
  }
});
modal && modal.addEventListener("click", function (e) {
  if (e.target === modal) modal.close();
});

function initProjectFilters() {
  var tabs = document.querySelector(".projects-tabs");
  var grid = document.getElementById("projectsGrid");
  if (!tabs || !grid) return;
  var buttons = Array.prototype.slice.call(tabs.querySelectorAll(".projects-tabs__btn"));
  var cards = grid.querySelectorAll(".card--project[data-filter]");
  var numButtons = buttons.length;

  function setActive(btn) {
    buttons.forEach(function (b) {
      b.classList.remove("projects-tabs__btn--active");
      b.setAttribute("aria-selected", b === btn ? "true" : "false");
      b.setAttribute("tabindex", b === btn ? "0" : "-1");
    });
    btn.classList.add("projects-tabs__btn--active");
  }

  function applyFilter(value) {
    var visibleCount = 0;
    cards.forEach(function (card) {
      var filterVal = card.getAttribute("data-filter") || "";
      var show = value === "all" || filterVal === value;
      card.classList.toggle("is-hidden", !show);
      if (show) visibleCount++;
    });
    grid.setAttribute("aria-label", "Projects grid, " + visibleCount + " visible");
  }

  function activateTab(btn, updateHash) {
    var value = btn.getAttribute("data-filter");
    setActive(btn);
    applyFilter(value);
    if (updateHash !== false && window.history && window.history.replaceState) {
      var path = window.location.pathname || "projects.html";
      var newHash = value === "all" ? "" : value;
      window.history.replaceState(undefined, "", path + (newHash ? "#" + newHash : ""));
    }
  }

  var initialHash = window.location.hash.slice(1).toLowerCase();
  var validFilters = ["all", "ai", "product-teardown"];
  var initialBtn = null;
  if (initialHash && validFilters.indexOf(initialHash) !== -1) {
    buttons.some(function (b) {
      if (b.getAttribute("data-filter") === initialHash) {
        initialBtn = b;
        return true;
      }
    });
  }
  if (initialBtn) {
    activateTab(initialBtn, false);
  } else {
    applyFilter("all");
    var allBtn = buttons.filter(function (b) { return b.getAttribute("data-filter") === "all"; })[0];
    if (allBtn) activateTab(allBtn, false);
    else {
      buttons.forEach(function (b, i) {
        b.classList.remove("projects-tabs__btn--active");
        b.setAttribute("aria-selected", "false");
        b.setAttribute("tabindex", i === 0 ? "0" : "-1");
      });
    }
  }

  buttons.forEach(function (btn, i) {
    btn.addEventListener("click", function () {
      activateTab(btn, true);
    });
    btn.addEventListener("keydown", function (e) {
      var idx = buttons.indexOf(btn);
      var next;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        next = buttons[(idx + 1) % numButtons];
        next.focus();
        activateTab(next);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        next = buttons[(idx - 1 + numButtons) % numButtons];
        next.focus();
        activateTab(next);
      } else if (e.key === "Home") {
        e.preventDefault();
        next = buttons[0];
        next.focus();
        activateTab(next);
      } else if (e.key === "End") {
        e.preventDefault();
        next = buttons[numButtons - 1];
        next.focus();
        activateTab(next);
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        activateTab(btn, true);
      }
    });
  });

  window.addEventListener("hashchange", function () {
    var h = window.location.hash.slice(1).toLowerCase();
    if (validFilters.indexOf(h) !== -1) {
      buttons.some(function (b) {
        if (b.getAttribute("data-filter") === h) {
          activateTab(b, false);
          return true;
        }
      });
    }
  });
}

var FRAMEWORK_FILTER_SLUGS = ["discovery", "decisioning", "ai-systems"];

function initFrameworkFilters() {
  var tabs = document.querySelector(".framework-tabs");
  var grid = document.getElementById("frameworksGrid");
  if (!tabs || !grid) return;
  var buttons = Array.prototype.slice.call(tabs.querySelectorAll(".framework-tabs__btn"));
  var cards = grid.querySelectorAll(".card--framework[data-filter]");

  function setActive(btn) {
    buttons.forEach(function (b) {
      b.classList.remove("framework-tabs__btn--active");
      b.setAttribute("aria-selected", b === btn ? "true" : "false");
      b.setAttribute("tabindex", b === btn ? "0" : "-1");
    });
    if (btn) btn.classList.add("framework-tabs__btn--active");
  }

  function applyFilter(value) {
    cards.forEach(function (card) {
      var show = value === "all" || card.getAttribute("data-filter") === value;
      card.classList.toggle("is-hidden", !show);
    });
  }

  function activateTab(btn, updateHash) {
    var value = btn ? btn.getAttribute("data-filter") : "all";
    setActive(btn);
    applyFilter(value);
    if (updateHash !== false && window.history && window.history.replaceState) {
      var path = window.location.pathname || "frameworks.html";
      var newHash = value === "all" ? "" : value;
      window.history.replaceState(undefined, "", path + (newHash ? "#" + newHash : ""));
    }
  }

  var initialHash = window.location.hash.slice(1).toLowerCase();
  var initialBtn = null;
  if (initialHash && FRAMEWORK_FILTER_SLUGS.indexOf(initialHash) !== -1) {
    buttons.some(function (b) {
      if (b.getAttribute("data-filter") === initialHash) {
        initialBtn = b;
        return true;
      }
    });
  }
  if (initialBtn) {
    activateTab(initialBtn, false);
  } else {
    applyFilter("all");
    var allBtn = buttons.filter(function (b) { return b.getAttribute("data-filter") === "all"; })[0];
    if (allBtn) activateTab(allBtn, false);
    else setActive(null);
  }

  var numButtons = buttons.length;
  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      activateTab(btn, true);
    });
    btn.addEventListener("keydown", function (e) {
      var idx = buttons.indexOf(btn);
      var next;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        next = buttons[(idx + 1) % numButtons];
        next.focus();
        activateTab(next);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        next = buttons[(idx - 1 + numButtons) % numButtons];
        next.focus();
        activateTab(next);
      } else if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        next = e.key === "Home" ? buttons[0] : buttons[numButtons - 1];
        next.focus();
        activateTab(next);
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        activateTab(btn, true);
      }
    });
  });

  window.addEventListener("hashchange", function () {
    var h = window.location.hash.slice(1).toLowerCase();
    if (FRAMEWORK_FILTER_SLUGS.indexOf(h) !== -1) {
      buttons.some(function (b) {
        if (b.getAttribute("data-filter") === h) {
          activateTab(b, false);
          return true;
        }
      });
    }
  });
}

function initProjectsPage() {
  renderProjectsGrid();
  // Temporarily disabling tab filters; keep all cards visible.
  var cta = document.getElementById("viewAllProjectsCta");
  if (cta) {
    var path = window.location.pathname || "";
    var isHome = path === "" || path === "/" || /index\.html$/i.test(path);
    if (isHome) {
      cta.style.display = PROJECTS.length > 3 ? "inline-block" : "none";
    }
  }
}
function initFrameworksPage() {
  renderFrameworksGrid();
  // Temporarily disabling tab filters; keep all cards visible.

  var grid = document.getElementById("frameworksGrid");
  if (!grid) return;
  grid.addEventListener("click", function (e) {
    var card = e.target && e.target.closest ? e.target.closest(".card--framework[data-link]") : null;
    if (!card) return;
    if (e.target && e.target.closest && e.target.closest("a")) return;
    var href = card.getAttribute("data-link") || "";
    if (href) window.location.href = href;
  });
  grid.addEventListener("keydown", function (e) {
    var card = e.target && e.target.closest ? e.target.closest(".card--framework[data-link]") : null;
    if (!card) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      var href = card.getAttribute("data-link") || "";
      if (href) window.location.href = href;
    }
  });
}
var WRITING_FILTER_SLUGS = ["all", "tech-business", "personal"];

function initWritingFilters() {
  var tabs = document.querySelector(".writing-tabs");
  var grid = document.getElementById("writingGrid");
  if (!tabs || !grid) return;
  var buttons = Array.prototype.slice.call(tabs.querySelectorAll(".writing-tabs__btn"));
  var cards = grid.querySelectorAll(".writing-item[data-filter]");

  function setActive(btn) {
    buttons.forEach(function (b) {
      b.classList.remove("writing-tabs__btn--active");
      b.setAttribute("aria-selected", b === btn ? "true" : "false");
      b.setAttribute("tabindex", b === btn ? "0" : "-1");
    });
    if (btn) btn.classList.add("writing-tabs__btn--active");
  }

  function applyFilter(value) {
    cards.forEach(function (card) {
      var show = value === "all" || card.getAttribute("data-filter") === value;
      card.classList.toggle("is-hidden", !show);
    });
  }

  function activateTab(btn, updateHash) {
    var value = btn ? btn.getAttribute("data-filter") : "all";
    setActive(btn);
    applyFilter(value);
    if (updateHash !== false && window.history && window.history.replaceState) {
      var path = window.location.pathname || "writing.html";
      var newHash = value === "all" ? "" : value;
      window.history.replaceState(undefined, "", path + (newHash ? "#" + newHash : ""));
    }
  }

  var initialHash = window.location.hash.slice(1).toLowerCase();
  var validSlugs = ["tech-business", "personal"];
  var initialBtn = null;
  if (initialHash && validSlugs.indexOf(initialHash) !== -1) {
    buttons.some(function (b) {
      if (b.getAttribute("data-filter") === initialHash) {
        initialBtn = b;
        return true;
      }
    });
  }
  if (initialBtn) {
    activateTab(initialBtn, false);
  } else {
    var allBtn = buttons.filter(function (b) { return b.getAttribute("data-filter") === "all"; })[0];
    if (allBtn) activateTab(allBtn, false);
  }

  var numButtons = buttons.length;
  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      activateTab(btn, true);
    });
    btn.addEventListener("keydown", function (e) {
      var idx = buttons.indexOf(btn);
      var next;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        next = buttons[(idx + 1) % numButtons];
        next.focus();
        activateTab(next);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        next = buttons[(idx - 1 + numButtons) % numButtons];
        next.focus();
        activateTab(next);
      } else if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        next = e.key === "Home" ? buttons[0] : buttons[numButtons - 1];
        next.focus();
        activateTab(next);
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        activateTab(btn, true);
      }
    });
  });

  window.addEventListener("hashchange", function () {
    var h = window.location.hash.slice(1).toLowerCase();
    if (validSlugs.indexOf(h) !== -1) {
      buttons.some(function (b) {
        if (b.getAttribute("data-filter") === h) {
          activateTab(b, false);
          return true;
        }
      });
    }
  });
}

function initWritingPage() {
  renderWritingGrid();
  // Temporarily disabling tab filters; keep all cards visible.

  var grid = document.getElementById("writingGrid");
  if (!grid) return;

  grid.addEventListener("click", function (e) {
    var card = e.target && e.target.closest ? e.target.closest(".writing-item[data-link]") : null;
    if (!card) return;
    if (e.target && e.target.closest && e.target.closest("a")) return;
    var href = card.getAttribute("data-link") || "";
    if (href) window.location.href = href;
  });

  grid.addEventListener("keydown", function (e) {
    if (!(e.key === "Enter" || e.key === " ")) return;
    var card = e.target && e.target.closest ? e.target.closest(".writing-item[data-link]") : null;
    if (!card) return;
    e.preventDefault();
    var href = card.getAttribute("data-link") || "";
    if (href) window.location.href = href;
  });
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    initProjectsPage();
    if (document.getElementById("frameworksGrid")) initFrameworksPage();
    if (document.getElementById("writingGrid")) initWritingPage();
    renderAppliedInPracticeCards();
  });
} else {
  initProjectsPage();
  if (document.getElementById("frameworksGrid")) initFrameworksPage();
  if (document.getElementById("writingGrid")) initWritingPage();
  renderAppliedInPracticeCards();
}
