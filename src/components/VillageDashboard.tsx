import { useState, useEffect, useRef } from "react";
import { MdArrowOutward, MdCopyright, MdHome, MdMap, MdFileDownload, MdPlayArrow, MdSkipNext, MdRefresh } from "react-icons/md";
import { FaHome, FaTree, FaWind, FaHammer, FaAward, FaGraduationCap, FaHandsHelping, FaCog, FaUnlockAlt } from "react-icons/fa";
import TechStack from "./TechStack";
import VillageScene from "../canvas/VillageScene";
import Cursor from "./Cursor";
import SocialIcons from "./SocialIcons";
import { useGameStore } from "../store/useGameStore";
import "./styles/Village.css";

const projectTelemetry = [
  {
    id: "maitri",
    title: "MAITRI AI Companion",
    category: "Edge AI / Medical Robotics (Smart India Hackathon - ISRO)",
    problem: "ISRO astronauts experience severe psychological isolation during long spaceflight without reliable internet access to cloud-based therapies.",
    solution: "Developed an end-to-end, fully offline companion. It uses MobileNetV2 for real-time facial expressions, a GRU model for voice-based sentiment, and integrates a distilled BlenderBot NLP agent for cognitive behavioral therapy (CBT) and mindfulness sessions.",
    tools: "Python, PyTorch, OpenCV, TensorFlow Lite, Librosa, NLP (Distilled BlenderBot), Docker, ONNX Runtime",
    link: "https://github.com/Aayush-pixel29/MAITRI",
    image: "/maitri.jpg",
  },
  {
    id: "traffic",
    title: "AI Traffic Flow Analyzer",
    category: "Computer Vision / Smart Cities",
    problem: "Smart cities lack proactive tools to predict traffic congestion patterns and automatically pinpoint anomalous bottlenecks.",
    solution: "Built a complete ML system that extracts vehicle count timelines in real-time from video feeds using YOLOv8, forecasts traffic volume, and runs an Isolation Forest model to flag congestion anomalies.",
    tools: "Python, Ultralytics YOLOv8, OpenCV, Scikit-learn (Isolation Forest), Pandas, NumPy, Matplotlib",
    link: "https://github.com/Aayush-pixel29/AI-Traffic-Flow-Analyzer",
    image: "/traffic.jpg",
  },
  {
    id: "sign",
    title: "Sign Language & Emotion Engine",
    category: "Deep Learning / Assistive Technology",
    problem: "Hearing-impaired individuals experience communication barriers due to a lack of real-time gesture and emotion transcribers.",
    solution: "Designed a dual-input deep neural network running MediaPipe tracking, gesture classification, and facial sentiment analysis concurrently, deployed via a lightweight Flask microservice.",
    tools: "Python, TensorFlow, MediaPipe, Keras, Flask",
    link: "https://github.com/Aayush-pixel29/Real-Time-AI-Sign-Language-Emotion-Detector",
    image: "/sign-language.png",
  },
  {
    id: "cable",
    title: "IoT Underground Cable Faults",
    category: "Embedded Systems / Smart Grid",
    problem: "Power grid breaks in underground cables are hard to locate manually, causing prolonged grid downtime.",
    solution: "Developed an ATmega-based hardware unit connected to an ESP8266 module. It calculates exact fault locations using potential dividers, alerts technicians via GSM, and syncs telemetry to a cloud platform.",
    tools: "Embedded C, Atmel (ATmega) MCU, ESP8266 Wi-Fi, GSM Module, Potential Divider Network, Cloud Platform",
    link: "https://drive.google.com/drive/folders/1brQHI2ju_9VCsWMrJ1aiuH4VE-EFXqwR?usp=sharing",
    image: "/cable-fault.jpg",
  },
  {
    id: "recon",
    title: "Recon AI Surveillance",
    category: "Edge Computing / Surveillance CV",
    problem: "Intelligent tracking vectors fail to identify targets on edge cameras under low-visibility and night conditions.",
    solution: "Deployed optimized YOLOv5 target detection models on edge NVIDIA Jetson modules, managing real-time video streams via RTSP for automated threat tracing.",
    tools: "Python, YOLOv5, PyTorch, NVIDIA Jetson, RTSP",
    link: "https://github.com/Aayush-pixel29/Recon-AI-Prototype",
    image: "/recon-ai.jpg",
  },
  {
    id: "aura",
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
  const [isCrtOn, setIsCrtOn] = useState<boolean>(false);
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

  // Zustand Store
  const { phase, activeChallenge, setPhase, enterZone, leaveZone, solveChallenge, resetGame } = useGameStore();

  // Challenge Local State Parameters
  const [bioScanProgress, setBioScanProgress] = useState<number>(0);
  const [bioScanStatus, setBioScanStatus] = useState<string>("Scanning credentials...");
  const [harvestedSkills, setHarvestedSkills] = useState<string[]>([]);
  const [windmillGearsAlign, setWindmillGearsAlign] = useState<number>(0);
  const [blueprintDecryptPercent, setBlueprintDecryptPercent] = useState<number>(0);
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);

  // Trigger game overlay when activeSection changes in PLAYING mode
  useEffect(() => {
    if (phase === "PLAYING" && activeSection !== "overview") {
      enterZone(activeSection);
    }
  }, [activeSection, phase, enterZone]);

  // Telemetry Log stream interval
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

  // Update Quest status tags
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

  // Bioscan Progress simulation
  useEffect(() => {
    let scanTimer: any;
    if (activeChallenge === "about" && bioScanProgress < 100) {
      scanTimer = setTimeout(() => {
        setBioScanProgress((p) => {
          const next = p + Math.floor(Math.random() * 20) + 5;
          if (next >= 100) {
            setBioScanStatus("SCAN COMPLETED: AUTHORIZATION GRANTED.");
            return 100;
          }
          return next;
        });
      }, 300);
    }
    return () => clearTimeout(scanTimer);
  }, [activeChallenge, bioScanProgress]);

  // Decrypt Blueprints simulator
  useEffect(() => {
    let decryptTimer: any;
    if (isDecrypting && blueprintDecryptPercent < 100) {
      decryptTimer = setTimeout(() => {
        setBlueprintDecryptPercent((p) => {
          if (p >= 100) {
            setIsDecrypting(false);
            return 100;
          }
          return p + 10;
        });
      }, 150);
    }
    return () => clearTimeout(decryptTimer);
  }, [isDecrypting, blueprintDecryptPercent]);

  // Initialize/Reset challenge states when challenge changes
  useEffect(() => {
    if (activeChallenge) {
      setBioScanProgress(0);
      setBioScanStatus("Scanning credentials...");
      setHarvestedSkills([]);
      setWindmillGearsAlign(0);
      setBlueprintDecryptPercent(0);
      setIsDecrypting(false);
    }
  }, [activeChallenge]);

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
        enterZone("about");
        response = ["Relocating vector to [🏡 COZY COTTAGE]..."];
      } else if (zone === "orchard" || zone === "tech" || zone === "skills") {
        setActiveSection("tech");
        enterZone("tech");
        response = ["Relocating vector to [🌲 SKILL ORCHARD]..."];
      } else if (zone === "windmill" || zone === "experience") {
        setActiveSection("experience");
        enterZone("experience");
        response = ["Relocating vector to [💨 WINDMILL LOGS]..."];
      } else if (zone === "workshop" || zone === "projects" || zone === "work") {
        setActiveSection("projects");
        enterZone("projects");
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

  const handleHarvestFruit = (skill: string) => {
    if (!harvestedSkills.includes(skill)) {
      setHarvestedSkills((prev) => [...prev, skill]);
    }
  };



  // ----------------------------------------------------
  // RENDER PHASE: 1. INTRO CINEMATIC ARCADE SCREEN
  // ----------------------------------------------------
  if (phase === "INTRO") {
    return (
      <div className="arcade-intro-overlay">
        <Cursor />
        <div className="arcade-cabinet">
          <div className="arcade-crt-effect"></div>
          <div className="hud-header-glitch">AAYUSH_SIMULATOR_OS v2.6</div>
          <h1 className="arcade-title">AAYUSH SHELAR</h1>
          <h3 className="arcade-subtitle">AI & Embedded Systems Engineer</h3>
          
          <div className="arcade-status-grid">
            <div className="status-stat"><span>CPU CORES</span><span>8x THREADS</span></div>
            <div className="status-stat"><span>SYS_STATUS</span><span>ONLINE</span></div>
            <div className="status-stat"><span>LOC_MODEL</span><span>ACTIVE</span></div>
          </div>

          <p className="arcade-desc">
            Explore Aayush's professional milestones inside a 3D isometric village. Control your avatar using <strong>WASD / Arrow Keys</strong>, or click the signposts to travel, completing challenges at cottages and windmills to unseal achievements.
          </p>

          <div className="arcade-btn-group">
            <button 
              className="arcade-btn btn-primary"
              onClick={() => setPhase("PLAYING")}
              data-cursor="disable"
            >
              <MdPlayArrow style={{ fontSize: "20px" }} /> ENTER 3D PLAYABLE VILLAGE
            </button>
            <button 
              className="arcade-btn btn-secondary"
              onClick={() => setPhase("SKIP_MODE")}
              data-cursor="disable"
            >
              <MdSkipNext style={{ fontSize: "20px" }} /> SKIP GAMEPLAY / SHOW RESUME
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER PHASE: 2. SKIP MODE (FLAT SCANNING EXECUTIVE SUMMARY)
  // ----------------------------------------------------
  if (phase === "SKIP_MODE") {
    return (
      <div className={`village-main ${isCrtOn ? "crt-filter" : ""}`} style={{ background: "#0a0a0c" }}>
        <Cursor />
        <SocialIcons />

        {/* HUD header */}
        <header className="village-header">
          <div className="hud-quest" data-cursor="disable">
            <MdHome className="rpg-header-icon" />
            <span>EXECUTIVE SUMMARY MODE</span>
          </div>
          <div className="hud-player-status" data-cursor="disable">
            <button 
              className="availability-pulse crt-active-btn"
              onClick={() => setPhase("PLAYING")}
              style={{ cursor: "pointer", border: "none" }}
            >
              🕹️ RE-ENTER 3D GAMEPLAY
            </button>
            <button 
              className="availability-pulse"
              onClick={() => resetGame()}
              style={{ cursor: "pointer", border: "none" }}
            >
              <MdRefresh /> RESET PROGRESS
            </button>
          </div>
          <a href="mailto:shelaraayush535@gmail.com" className="hud-mail-btn" data-cursor="disable">
            Drop a Letter
          </a>
        </header>

        {/* Traditional navigation signposts */}
        <nav className="village-signpost">
          <div className="sign-board-top">VILLAGE MAP</div>
          <ul>
            {["overview", "about", "tech", "experience", "projects"].map((sec, idx) => (
              <li key={sec} className={activeSection === sec ? "active" : ""}>
                <button onClick={() => setActiveSection(sec)} data-cursor="disable">
                  {sec === "overview" && <MdMap className="sign-icon" />}
                  {sec === "about" && <FaHome className="sign-icon" />}
                  {sec === "tech" && <FaTree className="sign-icon" />}
                  {sec === "experience" && <FaWind className="sign-icon" />}
                  {sec === "projects" && <FaHammer className="sign-icon" />}
                  <span>[{idx}] {sec.toUpperCase()}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Parchment dialogue panels */}
        <main className="village-terminal" style={{ top: "100px", height: "calc(100vh - 200px)" }}>
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
                  <h4>PORTFOLIO OVERVIEW:</h4>
                  <ul>
                    <li>🏡 <strong>Cottage (About)</strong>: Education, Achievements & Profile details</li>
                    <li>🌲 <strong>Orchard (Skills)</strong>: Interactive physics bubble stack</li>
                    <li>💨 <strong>Windmill (History)</strong>: Chronological professional log</li>
                    <li>🔨 <strong>Workshop (Work)</strong>: 6 major case studies & GitHub links</li>
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
              <p className="rpg-subtitle">Biography databanks</p>
              <div className="divider-gold"></div>
              <div className="parchment-body scroll-parchment">
                <div className="rpg-section-card">
                  <h4 className="rpg-card-title"><FaGraduationCap /> EDUCATION</h4>
                  <p className="card-subtitle">Sharad Institute Of Technology College Of Engineering</p>
                  <p className="card-desc">
                    B.Tech in Electronic and Computer Engineering (2022 - Present)
                    <br />
                    <strong>GPA:</strong> 6.73 / 10.00
                    <br />
                    <strong>Key courses:</strong> Operating Systems, Data Structures, Artificial Intelligence, Computer Network, DBMS, Embedded Systems.
                  </p>
                </div>
                <div className="rpg-section-card">
                  <h4 className="rpg-card-title"><FaAward /> HONORS & AWARDS</h4>
                  <ul className="card-list">
                    <li>🏆 DIPEX State Level Exhibition Working Models (March 2025)</li>
                    <li>🏆 Runner's Up at Aquaquest Electrovert (November 2024)</li>
                  </ul>
                </div>
                <div className="rpg-section-card">
                  <h4 className="rpg-card-title"><FaHandsHelping /> VOLUNTEER WORK</h4>
                  <ul className="card-list">
                    <li>🤝 <strong>Event Head (DSC ECESA)</strong>: Trained over 1500 engineering students in Code Trix track.</li>
                    <li>🤝 <strong>Volunteer (ETESA Team Trinetra)</strong>: Directed workshops for 250+ student members.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSection === "tech" && (
            <div className="parchment-panel fade-in panel-wide">
              <h2>SKILL ORCHARD</h2>
              <p className="rpg-subtitle">Technical Competency</p>
              <div className="divider-gold"></div>
              <div className="parchment-body orchard-body">
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
                    <div className="meter-label"><span>Embedded Systems (AVR, ESP8266, IoT)</span> <span>82%</span></div>
                    <div className="meter-bar"><div className="meter-fill" style={{ width: "82%" }}></div></div>
                  </div>
                  <div className="skill-meter-item">
                    <div className="meter-label"><span>Web Development (React, NodeJS)</span> <span>80%</span></div>
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
              <p className="rpg-subtitle">Timeline Records</p>
              <div className="divider-gold"></div>
              <div className="parchment-body scroll-parchment">
                <div className="rpg-timeline">
                  <div className="rpg-timeline-item">
                    <div className="item-header"><span className="year">2026</span><span className="badge badge-active">ACTIVE</span></div>
                    <h4>Product Support Engineer Intern</h4>
                    <h5>SEDEMAC Mechatronics Ltd.</h5>
                    <p>Automotive electronics validation, troubleshooting systems, cross-functional mechatronics support.</p>
                  </div>
                  <div className="rpg-timeline-item">
                    <div className="item-header"><span className="year">2024</span><span className="badge">INTERN LOG</span></div>
                    <h4>Student Developer (Intern)</h4>
                    <h5>Rapid System</h5>
                    <p>Designed and serviced firmware and microcontrollers for dynamic balancing machines.</p>
                  </div>
                  <div className="rpg-timeline-item">
                    <div className="item-header"><span className="year">2022</span><span className="badge">ACADEMIC START</span></div>
                    <h4>Enrolled in sitcoe</h4>
                    <p>Began study in Electronic & Computer Engineering.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "projects" && (
            <div className="parchment-panel fade-in panel-extra-wide">
              <h2>WORKSHOP BLUEPRINTS</h2>
              <p className="rpg-subtitle">Case Studies</p>
              <div className="divider-gold"></div>
              <div className="parchment-body workshop-body">
                <div className="workshop-menu">
                  <ul>
                    {projectTelemetry.map((project, index) => (
                      <li key={index} className={selectedProject === index ? "selected" : ""}>
                        <button onClick={() => setSelectedProject(index)} data-cursor="disable">
                          📄 BLUEPRINT 0{index + 1}
                          <div>{project.title}</div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="blueprint-detail scroll-parchment" style={{ overflowY: "auto", paddingRight: "5px" }}>
                  <h3 style={{ color: "#7c2d12" }}>{projectTelemetry[selectedProject].title}</h3>
                  <span className="cat-lbl">{projectTelemetry[selectedProject].category}</span>
                  <div className="blueprint-img-border" style={{ height: "120px" }}>
                    <img src={projectTelemetry[selectedProject].image} alt={projectTelemetry[selectedProject].title} />
                  </div>
                  <div className="blueprint-desc">
                    <h5>THE PROBLEM:</h5>
                    <p className="description-spec">{projectTelemetry[selectedProject].problem}</p>
                    <h5 style={{ marginTop: "8px" }}>THE SOLUTION:</h5>
                    <p className="description-spec">{projectTelemetry[selectedProject].solution}</p>
                    <h5 style={{ marginTop: "8px" }}>TECH STACK:</h5>
                    <p className="tools-spec">{projectTelemetry[selectedProject].tools}</p>
                  </div>
                  <a href={projectTelemetry[selectedProject].link} target="_blank" rel="noreferrer" className="blueprint-link" style={{ marginTop: "12px" }}>
                    DECRYPT BLUEPRINT SOURCE <MdArrowOutward />
                  </a>
                </div>
              </div>
            </div>
          )}
        </main>

        <footer className="village-footer">
          <span><MdCopyright /> 2026 Aayush Shelar</span>
          <span>SYSTEM CHASSIS OPERATIONAL</span>
        </footer>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER PHASE: 3. PLAYING MODE (3D WEBGL GRAPHICS ENVIRONMENT)
  // ----------------------------------------------------
  return (
    <div className={`village-main ${isCrtOn ? "crt-filter" : ""}`}>
      <Cursor />
      <SocialIcons />
      
      {/* WebGL Canvas Background */}
      <VillageScene activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* HUD Header */}
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
          <button 
            className="availability-pulse"
            onClick={() => setPhase("SKIP_MODE")}
            style={{ cursor: "pointer", border: "none", marginLeft: "10px" }}
          >
            ⏩ SKIP GAMEPLAY
          </button>
        </div>
        <a href="mailto:shelaraayush535@gmail.com" className="hud-mail-btn" data-cursor="disable">
          Drop a Letter
        </a>
      </header>

      {/* Navigation signpost */}
      <nav className="village-signpost">
        <div className="sign-board-top">VILLAGE MAP</div>
        <ul>
          <li className={activeSection === "overview" ? "active" : ""}>
            <button onClick={() => { setActiveSection("overview"); leaveZone(); }} data-cursor="disable">
              <MdMap className="sign-icon" />
              <span>[0] VILLAGE SQUARE</span>
            </button>
          </li>
          <li className={activeSection === "about" ? "active" : ""}>
            <button onClick={() => { setActiveSection("about"); enterZone("about"); }} data-cursor="disable">
              <FaHome className="sign-icon" />
              <span>[1] COZY COTTAGE</span>
            </button>
          </li>
          <li className={activeSection === "tech" ? "active" : ""}>
            <button onClick={() => { setActiveSection("tech"); enterZone("tech"); }} data-cursor="disable">
              <FaTree className="sign-icon" />
              <span>[2] SKILL ORCHARD</span>
            </button>
          </li>
          <li className={activeSection === "experience" ? "active" : ""}>
            <button onClick={() => { setActiveSection("experience"); enterZone("experience"); }} data-cursor="disable">
              <FaWind className="sign-icon" />
              <span>[3] WINDMILL LOGS</span>
            </button>
          </li>
          <li className={activeSection === "projects" ? "active" : ""}>
            <button onClick={() => { setActiveSection("projects"); enterZone("projects"); }} data-cursor="disable">
              <FaHammer className="sign-icon" />
              <span>[4] WORKSHOP BLUEPRINTS</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Live Telemetry Ticker stream on right margin */}
      <div className="telemetry-log-ticker" data-cursor="disable">
        <div className="ticker-title">LIVE TELEMETRY STREAM</div>
        <div className="ticker-scroll">
          {tickerLogs.map((log, idx) => (
            <div key={idx} className="ticker-line fade-in">{log}</div>
          ))}
        </div>
      </div>

      {/* Active Challenge Modals Popup Overlay */}
      {phase === "OVERLAY_ACTIVE" && activeChallenge && (
        <div className="challenge-modal-backdrop">
          <div className="challenge-modal-panel fade-in">
            
            {/* 1. Cottage Challenge (ABOUT) */}
            {activeChallenge === "about" && (
              <>
                <h3 className="challenge-title">🏡 COTTAGE CHALLENGE: CREDENTIAL SCANNER</h3>
                <div className="scanner-body">
                  <div className="scanner-line"></div>
                  <div className="scanner-progress-bar">
                    <div className="scanner-fill" style={{ width: `${bioScanProgress}%` }}></div>
                  </div>
                  <p className="scanner-desc">{bioScanStatus}</p>
                </div>
                {bioScanProgress >= 100 ? (
                  <div className="challenge-unsealed-content">
                    <div className="rpg-section-card" style={{ background: "#ffffff" }}>
                      <h4 style={{ color: "#7c2d12", margin: "0 0 5px 0" }}><FaGraduationCap /> B.TECH EDUCATION</h4>
                      <p style={{ fontSize: "12px", color: "#5c3d2e", margin: 0 }}>
                        Electronic & Computer Engineering at SITCOE. GPA: 6.73 / 10.
                      </p>
                    </div>
                    <button 
                      className="blueprint-link" 
                      onClick={() => solveChallenge("about")}
                      style={{ marginTop: "12px" }}
                    >
                      <FaUnlockAlt /> UNSEAL COTTAGE BIOMETRICS
                    </button>
                  </div>
                ) : (
                  <div className="scan-loader-placeholder">Hold credentials before sensor...</div>
                )}
              </>
            )}

            {/* 2. Skill Orchard Challenge (SKILLS) */}
            {activeChallenge === "tech" && (
              <>
                <h3 className="challenge-title">🌲 ORCHARD CHALLENGE: HARVESTING TECHNICAL SKILLS</h3>
                <p className="challenge-desc">
                  Click and harvest at least 3 skill nodes to verify technical qualifications.
                </p>
                <div className="harvest-grid">
                  {["Python", "PyTorch", "C++", "Embedded C", "React"].map((skill) => (
                    <button 
                      key={skill}
                      onClick={() => handleHarvestFruit(skill)}
                      className={`harvest-btn ${harvestedSkills.includes(skill) ? "harvested" : ""}`}
                      disabled={harvestedSkills.includes(skill)}
                    >
                      {harvestedSkills.includes(skill) ? "🍎 " : "🌳 "} {skill}
                    </button>
                  ))}
                </div>
                <div className="harvest-score">
                  HARVESTED: {harvestedSkills.length} / 3 NODES
                </div>
                {harvestedSkills.length >= 3 && (
                  <button 
                    className="blueprint-link" 
                    onClick={() => solveChallenge("tech")}
                    style={{ marginTop: "15px" }}
                  >
                    <FaUnlockAlt /> VERIFY TECHNICAL FRUITS
                  </button>
                )}
              </>
            )}

            {/* 3. Windmill Challenge (EXPERIENCE) */}
            {activeChallenge === "experience" && (
              <>
                <h3 className="challenge-title">💨 WINDMILL CHALLENGE: TIMELINE GEAR SYNC</h3>
                <p className="challenge-desc">
                  Stabilize the rotating windmill timeline gears. Spin gears to match clock metrics.
                </p>
                <div className="gear-aligner-box">
                  <div className="gear-visual" style={{ animation: windmillGearsAlign >= 3 ? "none" : "spin 3s linear infinite" }}>
                    <FaCog style={{ fontSize: "50px", color: windmillGearsAlign >= 3 ? "#10b981" : "#d97706" }} />
                  </div>
                  <button 
                    className="blueprint-link"
                    onClick={() => setWindmillGearsAlign((g) => Math.min(g + 1, 3))}
                    disabled={windmillGearsAlign >= 3}
                    style={{ background: windmillGearsAlign >= 3 ? "#10b981" : "#d97706" }}
                  >
                    {windmillGearsAlign >= 3 ? "GEARS STABILIZED [OK]" : `ROTATE GEAR COG (${windmillGearsAlign}/3)`}
                  </button>
                </div>
                {windmillGearsAlign >= 3 && (
                  <button 
                    className="blueprint-link" 
                    onClick={() => solveChallenge("experience")}
                    style={{ marginTop: "15px" }}
                  >
                    <FaUnlockAlt /> UNLOCK INTERNSHIP TIMELINES
                  </button>
                )}
              </>
            )}

            {/* 4. Workshop Challenge (PROJECTS) */}
            {activeChallenge === "projects" && (
              <>
                <h3 className="challenge-title">🔨 WORKSHOP CHALLENGE: DECRYPT PROJECT ARCHIVES</h3>
                <p className="challenge-desc">
                  Select a project blueprint from the logs and initiate decryption to verify mechatronic metrics.
                </p>
                <div className="decrypt-box">
                  <select 
                    onChange={(e) => setSelectedProject(parseInt(e.target.value))}
                    value={selectedProject}
                    className="decrypt-selector"
                    disabled={isDecrypting}
                  >
                    {projectTelemetry.map((p, idx) => (
                      <option key={p.id} value={idx}>{p.title}</option>
                    ))}
                  </select>
                  
                  {blueprintDecryptPercent > 0 && (
                    <div className="scanner-progress-bar" style={{ margin: "12px 0" }}>
                      <div className="scanner-fill" style={{ width: `${blueprintDecryptPercent}%`, background: "#39FF14" }}></div>
                    </div>
                  )}

                  {!isDecrypting && blueprintDecryptPercent < 100 && (
                    <button 
                      className="blueprint-link"
                      onClick={() => { setIsDecrypting(true); setBlueprintDecryptPercent(0); }}
                    >
                      INITIATE BLUEPRINT DECRYPTION
                    </button>
                  )}

                  {blueprintDecryptPercent >= 100 && (
                    <div className="decrypted-result">
                      <p style={{ color: "#39FF14", fontSize: "11px", fontWeight: "bold", margin: "5px 0" }}>DECRYPTION COMPLETED // ACCESS GRANTED</p>
                      <button 
                        className="blueprint-link"
                        onClick={() => solveChallenge("projects")}
                      >
                        <FaUnlockAlt /> CONFIRM DECRYPTED blueprINTS
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            <button 
              className="challenge-close-btn"
              onClick={() => { leaveZone(); setActiveSection("overview"); }}
            >
              [X] ABORT MISSION
            </button>
          </div>
        </div>
      )}

      {/* Interactive Command Terminal */}
      <div className="rpg-terminal-console" data-cursor="disable">
        <div className="terminal-header">
          <div className="terminal-dot"></div>
          <span>Aayush_OS v2.6 // LOCAL INPUT MATRIX</span>
        </div>
        <div className="terminal-output">
          {terminalLogs.map((log, idx) => (
            <div key={idx} className="terminal-line">{log}</div>
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

      <footer className="village-footer">
        <span className="footer-left"><MdCopyright /> 2026 Aayush Shelar</span>
        <span className="footer-right">ALL VILLAGE PATHS OPERATIONAL // LVL 99</span>
      </footer>
    </div>
  );
}
