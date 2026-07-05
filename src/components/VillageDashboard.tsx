import { useState, useEffect, useRef } from "react";
import { MdArrowOutward, MdCopyright, MdHome, MdMap, MdFileDownload } from "react-icons/md";
import { FaHome, FaTree, FaWind, FaHammer, FaAward, FaGraduationCap, FaHandsHelping } from "react-icons/fa";
import TechStack from "./TechStack";
import VillageScene from "../canvas/VillageScene";
import Cursor from "./Cursor";
import SocialIcons from "./SocialIcons";
import "./styles/Village.css";

const projectTelemetry = [
  {
    title: "MAITRI AI Companion",
    category: "Edge AI / Medical Robotics (Smart India Hackathon - ISRO)",
    problem: "ISRO astronauts experience severe psychological isolation during long spaceflight without reliable internet access to cloud-based therapies.",
    solution: "Developed an end-to-end, fully offline companion. It uses MobileNetV2 for real-time facial expressions, a GRU model for voice-based sentiment, and integrates a distilled BlenderBot NLP agent for cognitive behavioral therapy (CBT) and mindfulness sessions.",
    tools: "Python, PyTorch, OpenCV, TensorFlow Lite, Librosa, NLP (Distilled BlenderBot), Docker, ONNX Runtime",
    link: "https://github.com/Aayush-pixel29/MAITRI",
    image: "/maitri.jpg",
  },
  {
    title: "AI Traffic Flow Analyzer",
    category: "Computer Vision / Smart Cities",
    problem: "Smart cities lack proactive tools to predict traffic congestion patterns and automatically pinpoint anomalous bottlenecks.",
    solution: "Built a complete ML system that extracts vehicle count timelines in real-time from video feeds using YOLOv8, forecasts traffic volume, and runs an Isolation Forest model to flag congestion anomalies.",
    tools: "Python, Ultralytics YOLOv8, OpenCV, Scikit-learn (Isolation Forest), Pandas, NumPy, Matplotlib",
    link: "https://github.com/Aayush-pixel29/AI-Traffic-Flow-Analyzer",
    image: "/traffic.jpg",
  },
  {
    title: "Sign Language & Emotion Engine",
    category: "Deep Learning / Assistive Technology",
    problem: "Hearing-impaired individuals experience communication barriers due to a lack of real-time gesture and emotion transcribers.",
    solution: "Designed a dual-input deep neural network running MediaPipe tracking, gesture classification, and facial sentiment analysis concurrently, deployed via a lightweight Flask microservice.",
    tools: "Python, TensorFlow, MediaPipe, Keras, Flask",
    link: "https://github.com/Aayush-pixel29/Real-Time-AI-Sign-Language-Emotion-Detector",
    image: "/sign-language.png",
  },
  {
    title: "IoT Underground Cable Faults",
    category: "Embedded Systems / Smart Grid",
    problem: "Power grid breaks in underground cables are hard to locate manually, causing prolonged grid downtime.",
    solution: "Developed an ATmega-based hardware unit connected to an ESP8266 module. It calculates exact fault locations using potential dividers, alerts technicians via GSM, and syncs telemetry to a cloud platform.",
    tools: "Embedded C, Atmel (ATmega) MCU, ESP8266 Wi-Fi, GSM Module, Potential Divider Network, Cloud Platform",
    link: "https://drive.google.com/drive/folders/1brQHI2ju_9VCsWMrJ1aiuH4VE-EFXqwR?usp=sharing",
    image: "/cable-fault.jpg",
  },
  {
    title: "Recon AI Surveillance",
    category: "Edge Computing / Surveillance CV",
    problem: "Intelligent tracking vectors fail to identify targets on edge cameras under low-visibility and night conditions.",
    solution: "Deployed optimized YOLOv5 target detection models on edge NVIDIA Jetson modules, managing real-time video streams via RTSP for automated threat tracing.",
    tools: "Python, YOLOv5, PyTorch, NVIDIA Jetson, RTSP",
    link: "https://github.com/Aayush-pixel29/Recon-AI-Prototype",
    image: "/recon-ai.jpg",
  },
  {
    title: "Aura Wellness Matrix",
    category: "Machine Learning / Mobile Health",
    problem: "Users need secure mood logs and anomaly tracking on mobile devices without sending private logs to external clouds.",
    solution: "Integrated a Scikit-learn model locally inside a React Native wrapper, communicating with a local FastAPI server to detect anomalies and categorize mental health scores safely.",
    tools: "Python, Scikit-learn, FastAPI, React Native",
    link: "https://github.com/Aayush-pixel29/aura-app",
    image: "/aura-app.jpg",
  },
];

const telemetryLogPool = [
  "[SYS] Loading YOLOv8 weights... Success",
  "[MAITRI] Monitoring sentiment vectors... Optimal",
  "[IoT] Cable sensor matrix ping... Status 200",
  "[YOLO] Classified Cottage: 0.99 Confidence",
  "[YOLO] Classified Windmill: 0.98 Confidence",
  "[SYS] Core temperature stabilized at 42°C",
  "[ML] Pipeline throughput: 62.4 FPS",
  "[SYS] Memory Allocation: 74% [OK]",
  "[AVR] Potential Divider calibration... Ready",
  "[NLP] Dialogue agents online. RAG DB loaded.",
];

export default function VillageDashboard() {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [selectedProject, setSelectedProject] = useState<number>(0);
  const [questTitle, setQuestTitle] = useState<string>("Active Quest: Explore the Village");
  
  // HUD Glitch filter state
  const [isCrtOn, setIsCrtOn] = useState<boolean>(false);
  
  // Ticker Logs
  const [tickerLogs, setTickerLogs] = useState<string[]>([
    "[SYS] Loading YOLOv8 weights... Success",
    "[MAITRI] Monitoring sentiment vectors... Optimal",
    "[IoT] Cable sensor matrix ping... Status 200",
  ]);

  // Terminal State
  const [terminalInput, setTerminalInput] = useState<string>("");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "Initializing Aayush_OS v2.6...",
    "Capabilities: Computer Vision, Embedded IoT, Local-first AI.",
    "Type 'help' for databank system commands.",
  ]);
  
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Telemetry stream interval
  useEffect(() => {
    const logInterval = setInterval(() => {
      const randomLog = telemetryLogPool[Math.floor(Math.random() * telemetryLogPool.length)];
      setTickerLogs((prev) => {
        const next = [...prev, randomLog];
        if (next.length > 8) {
          next.shift();
        }
        return next;
      });
    }, 2800);
    return () => clearInterval(logInterval);
  }, []);

  // Sync quest status titles
  useEffect(() => {
    switch (activeSection) {
      case "overview":
        setQuestTitle("Quest log: Explore the Village");
        break;
      case "about":
        setQuestTitle("Quest: Investigate Cottage Core");
        break;
      case "tech":
        setQuestTitle("Quest: Traverse the Skill Orchard");
        break;
      case "experience":
        setQuestTitle("Quest: Scale the Windmill Logs");
        break;
      case "projects":
        setQuestTitle("Quest: Browse Workshop Blueprint Archives");
        break;
      default:
        setQuestTitle("Quest: Walk the Pathway");
    }
  }, [activeSection]);

  // Terminal scroll helper
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs]);

  // Interactive Command Terminal logic
  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim();
    if (!cmd) return;

    const trimmed = cmd.toLowerCase();
    let response: string[] = [];

    if (trimmed === "help") {
      response = [
        "Available operations:",
        "  help         - Show OS operations",
        "  cat resume   - Output academic & experience logs",
        "  status       - Inspect mechatronic core diagnostics",
        "  goto <zone>  - Relocate: cottage | orchard | windmill | workshop | square",
        "  clear        - Flush terminal buffer",
      ];
    } else if (trimmed === "cat resume") {
      response = [
        "AAYUSH SHELAR - ELECTRONICS & COMPUTER ENGINEER",
        "GPA Coef: 6.73 / 10.00",
        "Timeline entries:",
        "  - SEDEMAC Mechatronics Ltd. [Support Engineer Intern, 2026]",
        "  - Rapid System [Developer Intern, 2024]",
        "Community: Event Head at DSC ECESA (1500+ Peers coached)",
      ];
    } else if (trimmed === "status") {
      response = [
        "OS Telemetry Status:",
        "  MEM_ALLOC       : 74% [OK]",
        "  SIGNAL_STRENGTH : 92% [OPTIMAL]",
        "  CORE_TEMP       : 42°C [STABLE]",
        "  LOCAL_MODEL     : ACTIVE (OFFLINE)",
      ];
    } else if (trimmed.startsWith("goto ")) {
      const zone = trimmed.replace("goto ", "").trim();
      if (zone === "cottage" || zone === "about") {
        setActiveSection("about");
        response = ["Relocating vector to [🏡 COZY COTTAGE]..."];
      } else if (zone === "orchard" || zone === "tech" || zone === "skills") {
        setActiveSection("tech");
        response = ["Relocating vector to [🌲 SKILL ORCHARD]..."];
      } else if (zone === "windmill" || zone === "experience") {
        setActiveSection("experience");
        response = ["Relocating vector to [💨 WINDMILL LOGS]..."];
      } else if (zone === "workshop" || zone === "projects" || zone === "work") {
        setActiveSection("projects");
        response = ["Relocating vector to [🔨 WORKSHOP BLUEPRINTS]..."];
      } else if (zone === "square" || zone === "overview" || zone === "map") {
        setActiveSection("overview");
        response = ["Relocating vector to [🗺️ VILLAGE SQUARE]..."];
      } else {
        response = [`Sector [${zone}] unrecognized. Select active nodes.`];
      }
    } else if (trimmed === "clear") {
      setTerminalLogs([]);
      setTerminalInput("");
      return;
    } else {
      response = [`Command '${cmd}' not recognized. Type 'help' for instructions.`];
    }

    setTerminalLogs((prev) => [...prev, `> ${cmd}`, ...response]);
    setTerminalInput("");
  };

  return (
    <div className={`village-main ${isCrtOn ? "crt-filter" : ""}`}>
      <Cursor />
      <SocialIcons />
      <VillageScene activeSection={activeSection} />

      {/* Retro RPG HUD Status Header */}
      <header className="village-header">
        <div className="hud-quest" data-cursor="disable">
          <MdHome className="rpg-header-icon" />
          <span>{questTitle}</span>
        </div>
        <div className="hud-player-status" data-cursor="disable">
          <button 
            className={`availability-pulse ${isCrtOn ? "crt-active-btn" : ""}`}
            onClick={() => setIsCrtOn(!isCrtOn)}
            style={{ cursor: "pointer", border: "none" }}
          >
            {isCrtOn ? "⚡ CRT MODE: ACTIVE" : "🟢 LOCAL HOST ONLY"}
          </button>
          <span>HP [██████████] 100%</span>
          <span>LVL [99] ARCHITECT</span>
        </div>
        <a href="mailto:shelaraayush535@gmail.com" className="hud-mail-btn" data-cursor="disable">
          Drop a Letter
        </a>
      </header>

      {/* Rustic Village Signpost Menu */}
      <nav className="village-signpost">
        <div className="sign-board-top">VILLAGE MAP</div>
        <ul>
          <li className={activeSection === "overview" ? "active" : ""}>
            <button onClick={() => setActiveSection("overview")} data-cursor="disable">
              <MdMap className="sign-icon" />
              <span>[0] VILLAGE SQUARE</span>
            </button>
          </li>
          <li className={activeSection === "about" ? "active" : ""}>
            <button onClick={() => setActiveSection("about")} data-cursor="disable">
              <FaHome className="sign-icon" />
              <span>[1] COZY COTTAGE</span>
            </button>
          </li>
          <li className={activeSection === "tech" ? "active" : ""}>
            <button onClick={() => setActiveSection("tech")} data-cursor="disable">
              <FaTree className="sign-icon" />
              <span>[2] SKILL ORCHARD</span>
            </button>
          </li>
          <li className={activeSection === "experience" ? "active" : ""}>
            <button onClick={() => setActiveSection("experience")} data-cursor="disable">
              <FaWind className="sign-icon" />
              <span>[3] WINDMILL LOGS</span>
            </button>
          </li>
          <li className={activeSection === "projects" ? "active" : ""}>
            <button onClick={() => setActiveSection("projects")} data-cursor="disable">
              <FaHammer className="sign-icon" />
              <span>[4] WORKSHOP BLUEPRINTS</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Vertical Telemetry Log Stream Ticker (Right Side) */}
      <div className="telemetry-log-ticker" data-cursor="disable">
        <div className="ticker-title">LIVE TELEMETRY STREAM</div>
        <div className="ticker-scroll">
          {tickerLogs.map((log, index) => (
            <div key={index} className="ticker-line fade-in">
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* RPG Dialog Parchment Paper Terminal */}
      <main className="village-terminal">
        {activeSection === "overview" && (
          <div className="parchment-panel fade-in">
            <h2>AAYUSH SHELAR</h2>
            <p className="rpg-subtitle" style={{ fontSize: "12px", color: "#b45309" }}>
              AI Engineer • Electronics & Computer Engineer • Full Stack Developer
            </p>
            <div className="divider-gold"></div>
            <div className="parchment-body">
              <p className="rpg-desc" style={{ fontSize: "14px", fontStyle: "italic", marginBottom: "15px" }}>
                Building offline AI models, mechatronic systems, edge computer vision platforms, and production-ready applications.
              </p>
              <div className="quest-log-box">
                <h4>ACTIVE QUESTS:</h4>
                <ul>
                  <li>🏡 <strong>Cottage (About)</strong>: Education, Achievements & Resume</li>
                  <li>🌲 <strong>Orchard (Skills)</strong>: Skill stats & interactive Canvas</li>
                  <li>💨 <strong>Windmill (History)</strong>: Vertical chronological timeline logs</li>
                  <li>🔨 <strong>Workshop (Work)</strong>: 6 detailed Project Case Studies</li>
                </ul>
              </div>
              <a
                href="/resume.pdf"
                download="Aayush_Shelar_Resume.pdf"
                className="blueprint-link"
                style={{ marginTop: "15px", display: "flex", gap: "8px", alignItems: "center", justifyContent: "center" }}
                data-cursor="disable"
              >
                <MdFileDownload style={{ fontSize: "16px" }} /> DOWNLOAD RESUME PDF
              </a>
            </div>
          </div>
        )}

        {activeSection === "about" && (
          <div className="parchment-panel fade-in">
            <h2>THE COTTAGE</h2>
            <p className="rpg-subtitle">Biometric telemetries</p>
            <div className="divider-gold"></div>
            <div className="parchment-body scroll-parchment">
              {/* Education Card */}
              <div className="rpg-section-card">
                <h4 className="rpg-card-title"><FaGraduationCap /> EDUCATION</h4>
                <p className="card-subtitle">Sharad Institute Of Technology College Of Engineering</p>
                <p className="card-desc">
                  B.Tech in Electronic and Computer Engineering (2022 - Present)
                  <br />
                  <strong>GPA Coefficient:</strong> 6.73 / 10.00
                  <br />
                  <strong>Courses:</strong> Operating Systems, Data Structures, Artificial Intelligence, Computer Network, DBMS, Embedded Systems.
                </p>
              </div>

              {/* Achievements Card */}
              <div className="rpg-section-card">
                <h4 className="rpg-card-title"><FaAward /> HONORS & AWARDS</h4>
                <ul className="card-list">
                  <li>🏆 Participated at DIPEX State Level Exhibition cum Competition of Working Models (March 2025)</li>
                  <li>🏆 Runner's Up at Aquaquest of Electrovert International Mega Event (November 2024)</li>
                </ul>
              </div>

              {/* Volunteer Card */}
              <div className="rpg-section-card">
                <h4 className="rpg-card-title"><FaHandsHelping /> VOLUNTEER WORK</h4>
                <ul className="card-list">
                  <li>🤝 <strong>Event Head (DSC ECESA)</strong>: Conducted offline training & the Code Trix track, reaching over 1500 engineering students.</li>
                  <li>🤝 <strong>Volunteer (ETESA Team Trinetra)</strong>: Organized technical workshops and seminars impacting 250+ students.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeSection === "tech" && (
          <div className="parchment-panel fade-in panel-wide">
            <h2>SKILL ORCHARD</h2>
            <p className="rpg-subtitle">Active Skill Array Parameters</p>
            <div className="divider-gold"></div>
            <div className="parchment-body orchard-body">
              {/* Skill Meters */}
              <div className="rpg-skill-meters">
                <div className="skill-meter-item">
                  <div className="meter-label"><span>AI / Deep Learning (PyTorch, TensorFlow)</span> <span>90%</span></div>
                  <div className="meter-bar"><div className="meter-fill" style={{ width: "90%" }}></div></div>
                </div>
                <div className="skill-meter-item">
                  <div className="meter-label"><span>Python (OpenCV, NLP, Scikit-learn)</span> <span>95%</span></div>
                  <div className="meter-bar"><div className="meter-fill" style={{ width: "95%" }}></div></div>
                </div>
                <div className="skill-meter-item">
                  <div className="meter-label"><span>C++ (Data Structures & Algorithms)</span> <span>85%</span></div>
                  <div className="meter-bar"><div className="meter-fill" style={{ width: "85%" }}></div></div>
                </div>
                <div className="skill-meter-item">
                  <div className="meter-label"><span>Embedded Systems & Firmware (AVR, ESP8266, IoT)</span> <span>82%</span></div>
                  <div className="meter-bar"><div className="meter-fill" style={{ width: "82%" }}></div></div>
                </div>
                <div className="skill-meter-item">
                  <div className="meter-label"><span>Web Development (React, NodeJS, HTML/CSS)</span> <span>80%</span></div>
                  <div className="meter-bar"><div className="meter-fill" style={{ width: "80%" }}></div></div>
                </div>
              </div>

              <div className="orchard-canvas-frame" style={{ marginTop: "15px" }}>
                <TechStack />
              </div>
            </div>
          </div>
        )}

        {activeSection === "experience" && (
          <div className="parchment-panel fade-in">
            <h2>WINDMILL LOGS</h2>
            <p className="rpg-subtitle">Vertical Chronological Map</p>
            <div className="divider-gold"></div>
            <div className="parchment-body scroll-parchment">
              <div className="rpg-timeline">
                {/* Now */}
                <div className="rpg-timeline-item">
                  <div className="item-header">
                    <span className="year">NOW</span>
                    <span className="badge badge-active">SEEKING ROLES</span>
                  </div>
                  <h4>Looking for AI / Embedded Engineer Jobs</h4>
                  <p>Available for immediate full-time software, AI, or firmware positions.</p>
                </div>

                {/* 2026 */}
                <div className="rpg-timeline-item">
                  <div className="item-header">
                    <span className="year">2026</span>
                    <span className="badge badge-active">ACTIVE</span>
                  </div>
                  <h4>Product Support Engineer Intern</h4>
                  <h5>SEDEMAC Mechatronics Ltd.</h5>
                  <p>
                    Assisted in testing and validating automotive electronic products, troubleshooting technical issues, preparing technical documentation, and supporting engineering teams. Gained hands-on experience with embedded automotive systems, quality assurance processes, and cross-functional collaboration.
                  </p>
                </div>

                {/* 2025 */}
                <div className="rpg-timeline-item">
                  <div className="item-header">
                    <span className="year">2025</span>
                    <span className="badge">PROJECT COMPLETED</span>
                  </div>
                  <h4>DIPEX Exhibition & Underground Grid Cable System</h4>
                  <p>
                    Presented mechatronic working models at the DIPEX State Level Competition. Built an Atmel-controlled ESP8266 underground fault locator.
                  </p>
                </div>

                {/* 2024 */}
                <div className="rpg-timeline-item">
                  <div className="item-header">
                    <span className="year">2024</span>
                    <span className="badge">INTERN LOG</span>
                  </div>
                  <h4>Student Developer (Intern)</h4>
                  <h5>Rapid System</h5>
                  <p>
                    Developed, tested, and serviced microcontroller boards and firmware configurations used in dynamic industrial balancing machines, gaining exposure to real-world industrial electronics.
                  </p>
                </div>

                {/* 2024 - Present */}
                <div className="rpg-timeline-item">
                  <div className="item-header">
                    <span className="year">2024 - PRESENT</span>
                    <span className="badge">COMMUNITY LOG</span>
                  </div>
                  <h4>Event Head</h4>
                  <h5>DSC ECESA</h5>
                  <p>
                    Led workshops, organized seminars, and orchestrated the Code Trix event, train-coaching over 1500 engineering peers.
                  </p>
                </div>

                {/* 2023 */}
                <div className="rpg-timeline-item">
                  <div className="item-header">
                    <span className="year">2023</span>
                    <span className="badge">VOLUNTEER LOG</span>
                  </div>
                  <h4>Volunteer (Team Trinetra) & Financial news Sentiment</h4>
                  <p>
                    Delivered workshops for 250+ students in IEETE. Built a financial news sentiment analyser utilizing NLTK/spaCy.
                  </p>
                </div>

                {/* 2022 */}
                <div className="rpg-timeline-item">
                  <div className="item-header">
                    <span className="year">2022</span>
                    <span className="badge">ACADEMIC LOG</span>
                  </div>
                  <h4>Started B.Tech in Electronic & Computer Engineering</h4>
                  <h5>Sharad Institute Of Technology College Of Engineering</h5>
                  <p>Began coursework focusing on computing systems, hardware interfaces, and machine learning.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "projects" && (
          <div className="parchment-panel fade-in panel-extra-wide">
            <h2>WORKSHOP BLUEPRINTS</h2>
            <p className="rpg-subtitle">Case Study Blueprints</p>
            <div className="divider-gold"></div>
            <div className="parchment-body workshop-body">
              {/* Left Selector signboards with corner crosshairs */}
              <div className="workshop-menu">
                <ul>
                  {projectTelemetry.map((project, index) => (
                    <li key={index} className={`workshop-card-container ${selectedProject === index ? "selected" : ""}`}>
                      <button 
                        onClick={() => setSelectedProject(index)} 
                        data-cursor="disable"
                        className="vision-card"
                      >
                        {/* HUD crosshairs on corners */}
                        <div className="ch ch-tl" />
                        <div className="ch ch-tr" />
                        <div className="ch ch-bl" />
                        <div className="ch ch-br" />

                        {/* YOLO annotation label overlay on hover */}
                        <div className="yolo-tag">
                          [CLASS: WORK_BLUEPRINT // CONF: 0.98]
                        </div>

                        <span>📄 BLUEPRINT 0{index + 1}</span>
                        <div>{project.title}</div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right parchment detail layout */}
              <div className="blueprint-detail scroll-parchment" style={{ overflowY: "auto", paddingRight: "5px" }}>
                <div style={{ marginBottom: "10px" }}>
                  <h3 style={{ fontSize: "20px", color: "#7c2d12", margin: 0 }}>{projectTelemetry[selectedProject].title}</h3>
                  <span className="cat-lbl">{projectTelemetry[selectedProject].category}</span>
                </div>
                
                <div className="blueprint-img-border">
                  <img
                    src={projectTelemetry[selectedProject].image}
                    alt={projectTelemetry[selectedProject].title}
                  />
                </div>

                <div className="blueprint-desc">
                  <h5>THE PROBLEM:</h5>
                  <p className="description-spec" style={{ marginBottom: "10px" }}>{projectTelemetry[selectedProject].problem}</p>
                  
                  <h5>THE SOLUTION:</h5>
                  <p className="description-spec" style={{ marginBottom: "10px" }}>{projectTelemetry[selectedProject].solution}</p>
                  
                  <h5>TECH SPECS:</h5>
                  <p className="tools-spec">{projectTelemetry[selectedProject].tools}</p>
                </div>

                <a
                  href={projectTelemetry[selectedProject].link}
                  target="_blank"
                  rel="noreferrer"
                  className="blueprint-link"
                  style={{ marginTop: "15px" }}
                  data-cursor="disable"
                >
                  DECRYPT BLUEPRINT SOURCE <MdArrowOutward />
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Zone 3: Interactive Command Terminal (Bottom CLI HUD) */}
      <div className="rpg-terminal-console" data-cursor="disable">
        <div className="terminal-header">
          <div className="terminal-dot"></div>
          <span>Aayush_OS v2.6 // LOCAL INPUT MATRIX</span>
        </div>
        <div className="terminal-output">
          {terminalLogs.map((log, index) => (
            <div key={index} className="terminal-line">
              {log}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>
        <form onSubmit={handleCommand} className="terminal-form">
          <span className="prompt-symbol">&gt;</span>
          <input
            type="text"
            value={terminalInput}
            onChange={(e) => setTerminalInput(e.target.value)}
            placeholder="Type 'help' to check databank operations..."
            className="terminal-input"
          />
        </form>
      </div>

      {/* Mailbox contact Dialog Box */}
      <footer className="village-footer">
        <span className="footer-left"><MdCopyright /> 2026 Aayush Shelar</span>
        <span className="footer-right">ALL VILLAGE PATHS OPERATIONAL // LVL 99</span>
      </footer>
    </div>
  );
}
