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
  {
    id: "complete-comedy-quiz",
    title: "Complete Comedy Quiz",
    category: "AI",
    summary:
      "An AI-powered quiz engine that generates dynamic comedy questions across formats. Designed for engagement, replayability, and fast content creation.",
    tags: ["RAG", "GAMIFICATION", "CONTENT"],
    demo: "#",
    caseStudy: "#",
    inProgress: true,
  },
  {
    id: "bicep-curl-form-corrector",
    title: "Bicep Curl Form Corrector",
    category: "AI",
    summary:
      "A real-time pose detection system that tracks bicep curl form and gives corrective feedback. Built to handle noisy inputs and deliver actionable guidance.",
    tags: ["COMPUTER VISION", "REAL-TIME FEEDBACK"],
    demo: "#",
    caseStudy: "#",
    inProgress: true,
  },
  {
    id: "lease-acceleration-workflow",
    title: "Lease Acceleration Workflow",
    category: "AI",
    summary:
      "An agent-driven workflow that identifies why listings are not leasing and recommends targeted actions. Focused on reducing time-to-lease through structured interventions.",
    tags: ["AGENTIC", "DECISIONING", "OPERATIONS"],
    demo: "#",
    caseStudy: "#",
    inProgress: true,
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
    var ctasHtml = p.inProgress
      ? '<span class="project-status project-status--in-progress">In Progess</span>'
      : '<a class="card__cta card__cta--primary" href="' + escapeHtml(demoUrl) + '"' + targetAttr + '>View demo →</a>' +
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
    section: "DEFINE",
    description: "Map the system before adding AI so the real bottleneck is visible.",
    steps: [
      "Clarify what must be true vs what can flex",
      "Map handoffs and failure points",
      "Identify the smallest change that unlocks the outcome",
    ],
    link: "/frameworks/frames",
  },
  {
    title: "PRD to System Framework",
    category: "decisioning",
    section: "DEFINE",
    description: "Turn a fuzzy idea into a buildable system with clear decisions.",
    steps: [
      "Define the user action and system response",
      "Draw the workflow and the edge cases",
      "List what not to build and why",
      "Set outcomes you can measure fast",
    ],
    link: "",
  },
  {
    title: "LLM System Design Framework",
    category: "ai-systems",
    section: "BUILD",
    description: "Make LLM behavior reliable inside a real product flow.",
    steps: [
      "Decide what the model owns vs what stays deterministic",
      "Shape inputs so the model sees the right state",
      "Design prompts as interfaces, not magic",
    ],
    link: "/frameworks/llm-system-design-framework",
  },
  {
    title: "Agentic System Design Framework",
    category: "ai-systems",
    section: "BUILD",
    description: "Handle uncertainty when the path can’t be defined upfront.",
    steps: [
      "Set a clear objective and stopping rule",
      "Constrain tools, memory, and state",
      "Add checkpoints to keep behavior stable",
    ],
    link: "/frameworks/agentic-system-design-framework",
  },
  {
    title: "Analytics Framework",
    category: "ai-systems",
    section: "MEASURE",
    description: "Measure whether the system moved outcomes, not just outputs.",
    steps: [
      "Define the real success event",
      "Track drop-off after the AI step",
      "Separate model quality from product impact",
    ],
    link: "/frameworks/analytics-framework",
  },
  {
    title: "Agentic Systems Analytics Framework",
    category: "ai-systems",
    section: "MEASURE",
    description: "Evaluate agent loops when outcomes depend on decisions over time.",
    steps: [
      "Measure decision quality across loop turns",
      "Track iteration cost, latency, and failures",
      "Compare outputs to real outcomes",
    ],
    link: "/frameworks/agentic-systems-analytics",
  },
  {
    title: "GTM Adoption Framework",
    category: "discovery",
    section: "ADOPT",
    description: "Replace default behavior and earn the first repeat action.",
    steps: [
      "Name the default habit you are replacing",
      "Reduce steps to first value",
      "Build trust signals where users hesitate",
    ],
    link: "",
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
  var order = ["DEFINE", "BUILD", "MEASURE", "ADOPT"];
  var html = order.map(function (section) {
    var items = FRAMEWORKS.filter(function (f) {
      return f.section === section;
    });
    if (!items.length) return "";
    var cardsHtml = items.map(function (f) {
    var hasLink = !!f.link;
    var stepsHtml = (f.steps || []).map(function (s) {
      return "<li>" + escapeHtml(s) + "</li>";
    }).join("");
    var cardAttrs =
      'class="card card--framework" data-filter="' + escapeHtml(f.category) + '" aria-label="' + escapeHtml(f.title) + '"' +
      (hasLink ? ' data-link="' + escapeHtml(f.link) + '" tabindex="0" role="link"' : "");
    var titleHtml = hasLink
      ? '<h3 class="framework-card__title"><a class="framework-card__title-link" href="' + escapeHtml(f.link) + '">' + escapeHtml(f.title) + "</a></h3>"
      : '<h3 class="framework-card__title">' + escapeHtml(f.title) + "</h3>";
    return (
      "<article " + cardAttrs + ">" +
        titleHtml +
        '<p class="framework-card__desc">' + escapeHtml(f.description) + "</p>" +
        '<ul class="bullets bullets--tight">' + stepsHtml + "</ul>" +
      "</article>"
    );
    }).join("");
    return (
      '<div class="frameworks-section" data-count="' + items.length + '">' +
        '<p class="frameworks-section__label">' + section + "</p>" +
        '<div class="frameworks-row">' + cardsHtml + "</div>" +
      "</div>"
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
      "Notes from building HireFeed: good signals were not enough until trust, context, and next action sat in the same flow.",
    intensity: "low",
    wordCount: 589,
    publishedDate: "Mar 31, 2026",
    readTime: "3 min read",
    link: "you-dont-have-an-ai-problem-you-have-a-workflow-problem.html",
  },
  {
    title: "The Best Prompt Is a System, Not a Sentence",
    category: "AI Systems",
    description:
      "Strong AI output depends on context, retrieval, constraints, and feedback loops far more than a single clever prompt.",
    intensity: "low",
    wordCount: 440,
    publishedDate: "Mar 26, 2026",
    readTime: "2 min read",
    link: "best-prompt-is-a-system-not-a-sentence.html",
  },
  {
    title: "Your AI Feature Is Competing Against Doing Nothing",
    category: "Product Strategy",
    description:
      "Even with better output, I watched people default to old habits when the switch felt costly.",
    intensity: "low",
    wordCount: 462,
    publishedDate: "Mar 19, 2026",
    readTime: "2 min read",
    link: "ai-feature-competing-against-doing-nothing.html",
  },
  {
    title: "“Good Enough” AI Beats “Perfect” AI",
    category: "Product Execution",
    description:
      "I saw better output lose to faster, simpler results that kept people moving.",
    intensity: "low",
    wordCount: 299,
    publishedDate: "Mar 11, 2026",
    readTime: "1 min read",
    link: "good-enough-ai-beats-perfect-ai.html",
  },
  {
    title: "Personalization Is One of the Most Defensible Uses of AI",
    category: "Personalization",
    description:
      "Generic output felt replaceable to me. It got sticky only when the system adapted to my context and memory.",
    intensity: "low",
    wordCount: 359,
    publishedDate: "Feb 24, 2026",
    readTime: "2 min read",
    link: "personalization-defensible-ai.html",
  },
  {
    title: "Workflows First. Agents Second.",
    category: "Workflow Design",
    description:
      "I kept reaching for agents until slower responses and harder debugging pushed me back to workflows.",
    intensity: "low",
    wordCount: 191,
    publishedDate: "Feb 02, 2026",
    readTime: "1 min read",
    link: "workflows_first_agents_second.html",
  },
  {
    title: "AI Is Rarely the Product. It’s Usually the Cost Center.",
    category: "AI Economics",
    description: "What looked magical in demos felt costly once latency, edge cases, and reliability showed up.",
    intensity: "low",
    wordCount: 424,
    publishedDate: "Jan 04, 2026",
    readTime: "2 min read",
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

function hasMotionReact() {
  return !!(
    typeof window !== "undefined" &&
    window.React &&
    window.ReactDOM &&
    window.Motion &&
    window.Motion.motion
  );
}

function getOrCreateReactRoot(el) {
  if (!el) return null;
  if (!el.__reactRoot) {
    el.__reactRoot = window.ReactDOM.createRoot(el);
  }
  return el.__reactRoot;
}

function renderHeroWithMotion() {
  if (!hasMotionReact()) return false;
  var mount = document.getElementById("heroMotionRoot");
  if (!mount) return false;

  var React = window.React;
  var h = React.createElement;
  var motion = window.Motion.motion;
  var root = getOrCreateReactRoot(mount);
  if (!root) return false;

  root.render(
    h(
      motion.div,
      {
        className: "container hero__grid hero__grid--v2",
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: "easeOut" },
      },
      h(
        "aside",
        { className: "hero__art", "aria-label": "Portrait" },
        h(
          "div",
          { className: "hero__portrait-wrap" },
          h("img", {
            className: "hero__portrait",
            src: "./hero-portrait.png",
            alt: "Tanmay K",
            width: 400,
            height: 533,
          })
        )
      ),
      h(
        "div",
        { className: "hero__copy hero__copy--animate" },
        h(
          "p",
          { className: "hero__title hero__title--v2 hero__title-line1" },
          "Thinking. ",
          h("span", { className: "hero__title-accent" }, "Rethinking."),
          " Building."
        ),
        h(
          "p",
          { className: "hero__about", id: "heroAbout", style: { opacity: 1 } },
          "MBA @ UW Foster · Product at Amazon & Sephora · Data at Lowe’s"
        ),
        h(
          "p",
          { className: "hero__about hero__about--lines", id: "heroAbout2", style: { opacity: 1 } },
          "→ Exploring how AI systems decide and how we decide about them.",
          h("br"),
          "→ Focused on solving messy problems and making sound tradeoffs.",
          h("br"),
          "→ Building product systems that are useful and usable."
        )
      )
    )
  );

  return true;
}

function renderProjectsGridWithMotion(list) {
  if (!hasMotionReact()) return false;
  var grid = document.getElementById("projectsGrid");
  if (!grid) return false;

  var React = window.React;
  var h = React.createElement;
  var motion = window.Motion.motion;
  var root = getOrCreateReactRoot(grid);
  if (!root) return false;

  function projectCard(p, index) {
    var tags = p.tags && p.tags.length ? p.tags : [p.category];
    var caseStudyUrl = p.caseStudy || "#";
    var demoUrl = p.demo || "#";
    var targetAttrs = { target: "_blank", rel: "noopener noreferrer" };

    return h(
      motion.article,
      {
        key: p.id || p.title || index,
        className: "card card--project",
        "data-filter": (p.category || "").toLowerCase().replace(/\s+/g, "-"),
        initial: { opacity: 0, y: 8 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.28, ease: "easeOut", delay: index * 0.08 },
        whileHover: { y: -4, scale: 1.015 },
      },
      h(
        "div",
        { className: "card__top" },
        h("span", { className: "card__title-link" }, p.title),
        h(
          "div",
          { className: "pill-row" },
          tags.map(function (tag, i) {
            return h("span", { key: i, className: "pill pill--soft" }, tag);
          })
        )
      ),
      h("p", { className: "card__summary" }, p.summary),
      h(
        "div",
        { className: "card__ctas" },
        p.inProgress
          ? h("span", { className: "project-status project-status--in-progress" }, "In Progess")
          : [
              h(
                motion.a,
                Object.assign(
                  {
                    key: "demo",
                    className: "card__cta card__cta--primary",
                    href: demoUrl,
                    whileHover: { scale: 1.02, filter: "brightness(1.03)" },
                    whileTap: { scale: 0.97 },
                  },
                  targetAttrs
                ),
                "View demo →"
              ),
              h(
                motion.a,
                Object.assign(
                  {
                    key: "case",
                    className: "card__cta card__cta--secondary",
                    href: caseStudyUrl,
                    whileHover: { scale: 1.01 },
                    whileTap: { scale: 0.97 },
                  },
                  targetAttrs
                ),
                "View case study →"
              ),
            ]
      )
    );
  }

  root.render(
    h(
      window.Motion.AnimatePresence,
      { mode: "wait" },
      list.map(projectCard)
    )
  );

  return true;
}

function renderWritingListWithMotion(targetId, posts) {
  if (!hasMotionReact()) return false;
  var grid = document.getElementById(targetId);
  if (!grid) return false;

  var React = window.React;
  var h = React.createElement;
  var motion = window.Motion.motion;
  var root = getOrCreateReactRoot(grid);
  if (!root) return false;

  function row(post, index) {
    var link = post.link || "#";
    var tag = post.category || "Essay / Opinion";
    var publishedDate = post.publishedDate || "";
    var readTime = calculateReadTime(post.wordCount, post.intensity) || post.readTime || "";
    var filterValue = tag.toLowerCase().replace(/\s+/g, "-");

    return h(
      motion.article,
      {
        key: link || post.title || index,
        className: "writing-item",
        "data-filter": filterValue,
        "data-link": link,
        tabIndex: 0,
        role: "link",
        "aria-label": post.title,
        initial: { opacity: 0, y: 8 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.24, ease: "easeOut", delay: index * 0.06 },
        whileHover: { x: 2 },
      },
      h(
        "div",
        { className: "writing-item__card" },
        h(
          "div",
          { className: "writing-item__header-row" },
          h(
            "div",
            { className: "writing-item__meta-row" },
            h("span", { className: "writing-item__meta-date" }, publishedDate),
            h("span", { className: "writing-item__meta-read" }, readTime)
          ),
          h(
            "h3",
            { className: "writing-item__title" },
            h(
              "a",
              { className: "writing-item__title-link", href: link },
              post.title
            )
          ),
          h("span", { className: "writing-item__tag-pill" }, tag)
        )
      )
    );
  }

  root.render(
    h(
      window.Motion.AnimatePresence,
      { mode: "wait" },
      posts.map(row)
    )
  );

  return true;
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
      '<span class="writing-item__meta-date">' + escapeHtml(publishedDate) + "</span>" +
      '<span class="writing-item__meta-read">' + escapeHtml(readTime) + "</span>";
    return (
      '<article class="writing-item" data-filter="' + escapeHtml(filterValue) + '" data-link="' + escapeHtml(link) + '" tabindex="0" role="link" aria-label="' + escapeHtml(post.title) + '">' +
        '<div class="writing-item__card">' +
          '<div class="writing-item__header-row">' +
            '<div class="writing-item__meta-row">' +
              metaHtml +
            "</div>" +
            '<h3 class="writing-item__title"><a class="writing-item__title-link" href="' + escapeHtml(link) + '">' + escapeHtml(post.title) + "</a></h3>" +
            '<span class="writing-item__tag-pill">' + escapeHtml(tag) + "</span>" +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }).join("");
  grid.innerHTML = html;
}

function renderHomeJournalGrid() {
  var grid = document.getElementById("homeJournalGrid");
  if (!grid || !WRITING_POSTS.length) return;
  var featuredLinks = [
    "you-dont-have-an-ai-problem-you-have-a-workflow-problem.html",
    "best-prompt-is-a-system-not-a-sentence.html",
    "good-enough-ai-beats-perfect-ai.html",
  ];
  var featured = featuredLinks.map(function (link) {
    return WRITING_POSTS.find(function (post) { return post.link === link; });
  }).filter(Boolean);
  if (!featured.length) return;

  var html = featured.map(function (post) {
    var link = post.link || "#";
    var tag = post.category || "Essay / Opinion";
    var publishedDate = post.publishedDate || "";
    var readTime = calculateReadTime(post.wordCount, post.intensity) || post.readTime || "";
    var metaHtml =
      '<span class="writing-item__meta-date">' + escapeHtml(publishedDate) + "</span>" +
      '<span class="writing-item__meta-read">' + escapeHtml(readTime) + "</span>";
    return (
      '<article class="writing-item" data-link="' + escapeHtml(link) + '" tabindex="0" role="link" aria-label="' + escapeHtml(post.title) + '">' +
        '<div class="writing-item__card">' +
          '<div class="writing-item__header-row">' +
            '<div class="writing-item__meta-row">' +
              metaHtml +
            "</div>" +
            '<h3 class="writing-item__title"><a class="writing-item__title-link" href="' + escapeHtml(link) + '">' + escapeHtml(post.title) + "</a></h3>" +
            '<span class="writing-item__tag-pill">' + escapeHtml(tag) + "</span>" +
          "</div>" +
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
  var path = window.location.pathname || "";
  var isHome = path === "" || path === "/" || /index\.html$/i.test(path);
  var projectList = isHome ? PROJECTS.slice(0, 3) : PROJECTS;

  if (hasMotionReact()) {
    renderHeroWithMotion();
    if (!renderProjectsGridWithMotion(projectList)) renderProjectsGrid();
    var featuredLinks = [
      "you-dont-have-an-ai-problem-you-have-a-workflow-problem.html",
      "best-prompt-is-a-system-not-a-sentence.html",
      "good-enough-ai-beats-perfect-ai.html",
    ];
    var featured = featuredLinks.map(function (link) {
      return WRITING_POSTS.find(function (post) { return post.link === link; });
    }).filter(Boolean);
    if (!renderWritingListWithMotion("homeJournalGrid", featured)) renderHomeJournalGrid();
  } else {
    renderProjectsGrid();
    renderHomeJournalGrid();
  }
  // Temporarily disabling tab filters; keep all cards visible.
  var cta = document.getElementById("viewAllProjectsCta");
  if (cta) {
    if (isHome) {
      cta.style.display = PROJECTS.length > 3 ? "inline-block" : "none";
    }
  }
  var homeJournalGrid = document.getElementById("homeJournalGrid");
  if (homeJournalGrid) {
    homeJournalGrid.addEventListener("click", function (e) {
      var card = e.target && e.target.closest ? e.target.closest(".writing-item[data-link]") : null;
      if (!card) return;
      if (e.target && e.target.closest && e.target.closest("a")) return;
      var href = card.getAttribute("data-link") || "";
      if (href) window.location.href = href;
    });
    homeJournalGrid.addEventListener("keydown", function (e) {
      var card = e.target && e.target.closest ? e.target.closest(".writing-item[data-link]") : null;
      if (!card) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        var href = card.getAttribute("data-link") || "";
        if (href) window.location.href = href;
      }
    });
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
  if (!renderWritingListWithMotion("writingGrid", WRITING_POSTS)) renderWritingGrid();
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

function initPremiumMotion() {
  if (hasMotionReact()) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var hero = document.querySelector(".hero");
  if (hero) {
    hero.classList.add("motion-hero");
    requestAnimationFrame(function () {
      hero.classList.add("is-visible");
    });
  }

  var projectCards = Array.prototype.slice.call(document.querySelectorAll("#projectsGrid .card--project"));
  var journalRows = Array.prototype.slice.call(
    document.querySelectorAll("#homeJournalGrid .writing-item, #writingGrid .writing-item")
  );

  function markReveal(items, stepDelay) {
    items.forEach(function (el, index) {
      el.classList.add("motion-reveal");
      el.style.transitionDelay = (index * stepDelay).toFixed(2) + "s";
    });
  }

  markReveal(projectCards, 0.08);
  markReveal(journalRows, 0.06);

  var revealTargets = projectCards.concat(journalRows);
  if (!revealTargets.length) return;

  var observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  revealTargets.forEach(function (el) {
    observer.observe(el);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    initProjectsPage();
    if (document.getElementById("frameworksGrid")) initFrameworksPage();
    if (document.getElementById("writingGrid")) initWritingPage();
    renderAppliedInPracticeCards();
    initPremiumMotion();
  });
} else {
  initProjectsPage();
  if (document.getElementById("frameworksGrid")) initFrameworksPage();
  if (document.getElementById("writingGrid")) initWritingPage();
  renderAppliedInPracticeCards();
  initPremiumMotion();
}
