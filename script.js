/**
 * Apple-grade Interactive Engine for Boyke Dian Triwahyudhi's Profile
 * Features:
 * - Real-time Neural Mesh Canvas (Edge AI / Network Topology)
 * - Cursor Spotlight Ambient Glow
 * - 3D Perspective Tilt on Project Cards with Specular Highlights
 * - Intersection Observer Scroll Reveals & Rolling Metric Counters
 * - Interactive Project Inspection Modal with Architecture Tabs for ONIDIA, KAMA, and BOI
 * - Reactive Contact Form wired to Formspree & Martian-style Toast
 * - Mobile Navigation Drawer (hamburger, backdrop, scroll lock)
 * - Synthesized Web Audio Haptic Clicks (Optional Mute Toggle)
 */

document.addEventListener('DOMContentLoaded', () => {
  initNeuralCanvas();
  initCursorSpotlight();
  initScrollProgressAndNav();
  initScrollReveals();
  init3DCardTilt();
  initMetricCounters();
  initProjectModal();
  initContactForm();
  initAudioHaptics();
  initMobileNav();
});

/* ==========================================================================
   1. NEURAL CONSTELATION CANVAS (Edge Mesh & AI Synapse Simulation)
   ========================================================================== */
function initNeuralCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 35 : 65;
  const maxDistance = 140;

  let mouse = {
    x: null,
    y: null,
    radius: 160
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.8 + 1;
      this.baseAlpha = Math.random() * 0.35 + 0.15;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interaction (gentle repulsion)
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const dirX = dx / dist;
          const dirY = dy / dist;
          this.x -= dirX * force * 1.5;
          this.y -= dirY * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56, 189, 248, ${this.baseAlpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(56, 189, 248, 0.4)';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connection lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   2. CURSOR SPOTLIGHT AMBIENT GLOW
   ========================================================================== */
function initCursorSpotlight() {
  const spotlight = document.querySelector('.cursor-spotlight');
  if (!spotlight) return;

  window.addEventListener('mousemove', (e) => {
    spotlight.style.transform = `translate(${e.clientX - 300}px, ${e.clientY - 300}px)`;
  });
}

/* ==========================================================================
   3. SCROLL PROGRESS & DYNAMIC NAVBAR
   ========================================================================== */
function initScrollProgressAndNav() {
  const progressBar = document.querySelector('.scroll-progress-bar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${scrollPercent}%`;
    }

    // Nav active section highlight
    let currentSectionId = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 140;
      const height = sec.offsetHeight;
      if (scrollTop >= top && scrollTop < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   4. APPLE-STYLE SCROLL REVEALS
   ========================================================================== */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   5. 3D PERSPECTIVE TILT ON PROJECT CARDS
   ========================================================================== */
function init3DCardTilt() {
  const cards = document.querySelectorAll('.tilt-card');
  if (window.matchMedia('(hover: none)').matches) return;

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* ==========================================================================
   6. ROLLING METRIC COUNTERS
   ========================================================================== */
function initMetricCounters() {
  const metricValues = document.querySelectorAll('[data-counter]');

  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetNumber = parseFloat(target.getAttribute('data-counter'));
        const prefix = target.getAttribute('data-prefix') || '';
        const suffix = target.getAttribute('data-suffix') || '';
        const decimals = parseInt(target.getAttribute('data-decimals') || '0', 10);
        
        let start = 0;
        const duration = 1800;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentVal = start + (targetNumber - start) * easeProgress;

          target.textContent = `${prefix}${currentVal.toFixed(decimals)}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            target.textContent = `${prefix}${targetNumber.toFixed(decimals)}${suffix}`;
          }
        }

        requestAnimationFrame(updateCounter);
        obs.unobserve(target);
      }
    });
  }, { threshold: 0.2 });

  metricValues.forEach((el) => counterObserver.observe(el));
}

/* ==========================================================================
   7. PROJECT INSPECTION MODAL DATA & CONTROLLER FOR BOYKE'S PROJECTS
   - ONIDIA (OmNIpresent DIgital Amigo)
   - KAMA (Knowledge Augmented Mining Agent)
   - BOI (Raspberry Pi 5 + AI HAT+ 2)
   ========================================================================== */
const projectData = {
  project1: {
    title: "ONIDIA: OmNIpresent DIgital Amigo",
    tagline: "Visual Desktop AI Assistant • Screen-Aware Copilot",
    stats: "Vision Latency: 120ms | Context: Active Screen Stream | OS: Cross-Platform (macOS/Linux)",
    overview: "ONIDIA is an unobtrusive desktop visual assistant that observes your active workspace, extracts terminal errors and IDE bugs straight off your screen via OCR/VLM, and executes automated macros without requiring you to switch windows and copy-paste prompts into browser chat tabs.",
    architecture: `[Desktop Screen Capture Stream (PipeWire / CoreGraphics)]
                   |
                   v
       [Differential Frame Analysis] (Only processes pixel deltas)
                   |
                   v
       [Local Multimodal Vision-LLM + OCR Parser]
                   |
         +---------+---------+
         |                   |
[Terminal Error Explainer]  [Automated UI / Hotkey Dispatcher]`,
    telemetry: `> Active Screen FPS: 10 FPS (adaptive throttled when idle)
> Token Processing Latency: 120ms per screen query
> Local Privacy: 100% On-Device buffer (zero cloud pixel uploads)
> Auto-detected Stack Traces: Python, Go, Rust, K8s yaml`,
    codeSnippet: `// ONIDIA Desktop Frame Listener (Rust / Native Bridge)
pub fn process_display_delta(frame: &VideoFrame) -> Option<VlmContext> {
    if !has_significant_motion(frame) {
        return None; // Don't waste compute on static desktop
    }
    let bounding_boxes = ocr::extract_active_editor_regions(frame);
    let error_text = parser::find_stack_traces(&bounding_boxes);
    
    if let Some(err) = error_text {
        return Some(VlmContext::new("Explain stack trace and suggest fix", err));
    }
    None
}`
  },
  project2: {
    title: "KAMA: Knowledge Augmented Mining Agent",
    tagline: "RAG as a Service • Turnkey Knowledge Ingestion & Vector Search",
    stats: "Query Retrieval: 18ms | Hallucination Guard: 99.4% Grounded | API: REST & gRPC",
    overview: "KAMA eliminates the painful boilerplate of wiring up vector databases, text splitters, and rerankers. It is a turnkey RAG-as-a-service engine designed to ingest messy real-world files (PDFs, Markdown, Git repos, internal wikis), index them with hybrid dense/sparse search, and serve grounded answers with verifiable source citations.",
    architecture: `[Document Ingest API: PDF / Markdown / Docs]
                   |
                   v
       [Smart Markdown & AST Chunker]
                   |
       +-----------+-----------+
       |                       |
[Dense Vector Embeddings]  [Sparse BM25 Keyword Index]
       |                       |
       +-----------+-----------+
                   |
                   v
      [Reciprocal Rank Fusion (RRF) & Cross-Encoder]
                   |
                   v
      [Grounded Streaming Answer + Page Citations]`,
    telemetry: `> Ingestion Throughput: 450 pages/minute
> Vector Search Roundtrip: 18ms (p95)
> Citation Verifiability: 100% trace to original document chunk
> Hallucination Rejection: Active prompt boundary check`,
    codeSnippet: `from fastapi import FastAPI, UploadFile
from kama.retrieval import HybridRanker
from kama.grounding import CitationGuard

app = FastAPI(title="KAMA RAG as a Service")

@app.post("/v1/mine")
async def query_knowledge(prompt: str, tenant_id: str):
    # Retrieve top hybrid semantic + lexical candidates
    chunks = await HybridRanker.query(prompt, tenant_id, top_k=5)
    # Generate strictly grounded response with page numbers
    response = await CitationGuard.generate_with_citations(prompt, chunks)
    return {"answer": response.text, "citations": response.sources}`
  },
  project3: {
    title: "BOI: Raspberry Pi 5 + AI HAT+ 2 Edge Suite",
    tagline: "Local Edge Intelligence • 25W Powerhouse • Zero Cloud Dependency",
    stats: "NPU Acceleration: Hailo-8 (up to 26 TOPS) | Power: ~12 Watts | Cloud Subs: $0",
    overview: "Why pay monthly cloud subscriptions when you can run hardware-accelerated neural networks on a credit-card-sized board sitting right on your desk? BOI is a tailored collection of self-hosted AI utilities built specifically for the Raspberry Pi 5 and the official AI HAT+ 2, enabling private local speech-to-text, real-time vision, and lightweight LLMs.",
    architecture: `[Raspberry Pi 5 SBC (Broadcom BCM2712 Quad-core)]
                   |
          (PCIe Gen 3 M.2 Hat)
                   |
                   v
    [Raspberry Pi AI HAT+ 2 (Hailo NPU)]
                   |
    +--------------+--------------+
    |              |              |
[Vision Engine] [Whisper STT] [Local SLM Engine]
    |              |              |
    +--------------+--------------+
                   |
                   v
   [Local REST Gateway: Accessible across Home LAN]`,
    telemetry: `> Hardware: Raspberry Pi 5 (8GB) + AI HAT+ 2
> Hailo NPU Utilization: 32% under active object detection
> Idle Power Consumption: 4.8W | Peak Load: 12.2W
> Network Privacy: Fully Air-Gapped / Zero WAN packets emitted`,
    codeSnippet: `# Hailo RT Inference Runner on Raspberry Pi 5
import hailo_platform as hp

def run_edge_inference(hef_path, input_stream):
    vdevice = hp.VDevice()
    network_group = vdevice.configure(hef_path)
    
    # Process local camera/audio stream via hardware NPU
    with network_group.activate():
        for frame in input_stream:
            results = network_group.infer(frame)
            yield results`
  }
};

function initProjectModal() {
  const modalOverlay = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalMeta = document.getElementById('modal-meta');
  const modalContent = document.getElementById('modal-dynamic-content');
  const tabButtons = document.querySelectorAll('.modal-tab-btn');
  const openButtons = document.querySelectorAll('[data-project-target]');

  if (!modalOverlay) return;

  let currentProjectKey = 'project1';
  let activeTab = 'overview';

  function renderTabContent() {
    const data = projectData[currentProjectKey];
    if (!data) return;

    if (activeTab === 'overview') {
      modalContent.innerHTML = `
        <p style="font-size: 1.05rem; line-height: 1.7; color: var(--text-secondary); margin-bottom: 20px;">
          ${data.overview}
        </p>
        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px; margin-top: 16px;">
          <div style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--accent-cyan); margin-bottom: 6px;">PROJECT METRICS &amp; ENVIRONMENT</div>
          <div style="font-family: var(--font-mono); font-size: 0.95rem; color: #ffffff;">${data.stats}</div>
        </div>
      `;
    } else if (activeTab === 'architecture') {
      modalContent.innerHTML = `
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 12px;">Architecture Topology &amp; System Flow:</p>
        <pre class="code-terminal-block"><code>${data.architecture}</code></pre>
      `;
    } else if (activeTab === 'telemetry') {
      modalContent.innerHTML = `
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 12px;">Live Edge / Agent Telemetry:</p>
        <pre class="code-terminal-block" style="color: #4ade80;"><code>${data.telemetry}</code></pre>
      `;
    } else if (activeTab === 'code') {
      modalContent.innerHTML = `
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 12px;">Engine Logic &amp; Automation Snippet:</p>
        <pre class="code-terminal-block"><code>${escapeHTML(data.codeSnippet)}</code></pre>
      `;
    }
  }

  function escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  openButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      currentProjectKey = btn.getAttribute('data-project-target') || 'project1';
      const data = projectData[currentProjectKey];
      if (!data) return;

      modalTitle.textContent = data.title;
      modalMeta.textContent = data.tagline;
      activeTab = 'overview';

      tabButtons.forEach((b) => {
        b.classList.toggle('active', b.getAttribute('data-tab') === 'overview');
      });

      renderTabContent();
      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      playTone(520, 'sine', 0.1);
    });
  });

  tabButtons.forEach((tabBtn) => {
    tabBtn.addEventListener('click', () => {
      tabButtons.forEach((b) => b.classList.remove('active'));
      tabBtn.classList.add('active');
      activeTab = tabBtn.getAttribute('data-tab');
      renderTabContent();
      playTone(660, 'sine', 0.06);
    });
  });

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
    playTone(400, 'sine', 0.08);
  }

  modalCloseBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   8. CONTACT FORM -> FORMSPREE, WITH CASUAL MARTIAN-STYLE FEEDBACK
   ========================================================================== */
function initContactForm() {
  // Must stay in sync with the <form action="..."> in index.html.
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mgavjbre';

  const form = document.getElementById('contact-form');
  const toast = document.getElementById('form-toast');
  const toastMessage = document.getElementById('toast-message');
  const toastIcon = toast ? toast.querySelector('.toast-icon') : null;
  const submitBtn = document.getElementById('submit-btn');

  if (!form) return;

  const defaultBtnHtml = submitBtn.innerHTML;
  const loadingBtnHtml = `
    <svg style="animation: spin 1s linear infinite; width: 18px; height: 18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
      <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
    </svg>
    <span>Beaming transmission across space...</span>
  `;

  let toastTimer = null;

  function showToast(text, isError) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = text;
    toastIcon.textContent = isError ? '⚠️' : '🚀';
    toast.classList.toggle('error', !!isError);
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 5500);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !message) {
      showToast('Transmission blocked — I need a name, email, and message before I can beam this through.', true);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      showToast('That email address looks a little off. Mind double-checking it?', true);
      return;
    }

    // Let Formspree route replies straight back to the sender.
    document.getElementById('form-replyto').value = email;
    document.getElementById('form-subject-line').value =
      `New transmission from ${name} via babeh.com`;

    // High tech button submission state
    submitBtn.disabled = true;
    submitBtn.innerHTML = loadingBtnHtml;
    playTone(440, 'triangle', 0.15);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      let payload = {};
      try {
        payload = await response.json();
      } catch (parseErr) {
        // Non-JSON error body — the status check below still catches it.
      }

      if (!response.ok) {
        const detail = (payload.errors && payload.errors[0] && payload.errors[0].message) || '';
        throw new Error(detail || `Formspree responded with ${response.status}`);
      }

      // Delivered
      submitBtn.innerHTML = `<span style="color: #4ade80;">🚀 Transmission Landed Safely</span>`;
      playTone(880, 'sine', 0.2);
      showToast(`Transmission received, ${name}! Thanks for reaching out. I'll get back to you soon.`);

      form.reset();

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = defaultBtnHtml;
      }, 2500);
    } catch (err) {
      // Failed — restore the form so the message isn't lost and the user can retry.
      console.error('Formspree submission failed:', err);
      submitBtn.disabled = false;
      submitBtn.innerHTML = defaultBtnHtml;
      playTone(140, 'sawtooth', 0.25);
      showToast(`Signal lost, ${name}! The transmission didn't go through — please try again.`, true);
    }
  });
}

/* ==========================================================================
   9. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('mobile-drawer-backdrop');
  if (!toggleBtn || !drawer || !backdrop) return;

  const drawerLinks = drawer.querySelectorAll('a');
  const DESKTOP = window.matchMedia('(min-width: 769px)');

  function openMenu() {
    drawer.classList.add('show');
    document.body.classList.add('nav-open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.setAttribute('aria-label', 'Close menu');
    drawer.setAttribute('aria-hidden', 'false');
    // Wait a frame so the backdrop's opacity transition actually runs.
    requestAnimationFrame(() => backdrop.classList.add('show'));
    if (drawerLinks[0]) drawerLinks[0].focus();
  }

  function closeMenu(returnFocus) {
    if (!drawer.classList.contains('show')) return;
    drawer.classList.remove('show');
    backdrop.classList.remove('show');
    document.body.classList.remove('nav-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-label', 'Open menu');
    drawer.setAttribute('aria-hidden', 'true');
    if (returnFocus) toggleBtn.focus();
  }

  toggleBtn.addEventListener('click', () => {
    if (drawer.classList.contains('show')) closeMenu();
    else openMenu();
  });

  // Tapping the dimmed page, or any drawer link, dismisses the menu.
  backdrop.addEventListener('click', () => closeMenu());
  drawerLinks.forEach((link) => link.addEventListener('click', () => closeMenu()));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu(true);
  });

  // Rotating or resizing past the breakpoint hides the drawer via CSS — make
  // sure we never leave the body scroll-locked in that case.
  const onBreakpointChange = (e) => {
    if (e.matches) closeMenu();
  };
  if (DESKTOP.addEventListener) DESKTOP.addEventListener('change', onBreakpointChange);
  else if (DESKTOP.addListener) DESKTOP.addListener(onBreakpointChange);
}

/* ==========================================================================
   10. WEB AUDIO HAPTIC SYNTHESIZER
   ========================================================================== */
let audioCtx = null;
let soundMuted = false;

function initAudioHaptics() {
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundMuted = !soundMuted;
      soundToggleBtn.classList.toggle('muted', soundMuted);
      soundToggleBtn.title = soundMuted ? 'Sound Muted' : 'Sound Enabled';
      soundToggleBtn.innerHTML = soundMuted ? '🔇' : '🔊';
      if (!soundMuted) playTone(784, 'sine', 0.1);
    });
  }
}

function playTone(freq = 600, type = 'sine', duration = 0.1) {
  if (soundMuted) return;
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {
    // Audio handled
  }
}
