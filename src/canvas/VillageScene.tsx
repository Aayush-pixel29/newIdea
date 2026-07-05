import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface VillageSceneProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

// Coordinates mapping for destinations in the village
const nodeCoords: Record<string, THREE.Vector3> = {
  overview: new THREE.Vector3(0, 0, 0),
  about: new THREE.Vector3(-3.5, 0, -2.5),
  tech: new THREE.Vector3(3.2, 0, -2.0),
  experience: new THREE.Vector3(-2.0, 0, 3.0),
  projects: new THREE.Vector3(3.0, 0, 2.5),
};

// Keyboard listener hook for WASD & Arrow controls
function useKeyboardControls() {
  const [movement, setMovement] = useState({
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "w":
        case "arrowup":
          setMovement((m) => ({ ...m, moveForward: true }));
          break;
        case "s":
        case "arrowdown":
          setMovement((m) => ({ ...m, moveBackward: true }));
          break;
        case "a":
        case "arrowleft":
          setMovement((m) => ({ ...m, moveLeft: true }));
          break;
        case "d":
        case "arrowright":
          setMovement((m) => ({ ...m, moveRight: true }));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "w":
        case "arrowup":
          setMovement((m) => ({ ...m, moveForward: false }));
          break;
        case "s":
        case "arrowdown":
          setMovement((m) => ({ ...m, moveBackward: false }));
          break;
        case "a":
        case "arrowleft":
          setMovement((m) => ({ ...m, moveLeft: false }));
          break;
        case "d":
        case "arrowright":
          setMovement((m) => ({ ...m, moveRight: false }));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return movement;
}

// RPG Camera tracking controller following character
function CameraController({ characterPos }: { characterPos: THREE.Vector3 }) {
  const { camera } = useThree();
  const lookTarget = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    // Smoothly follow character with offset
    const offset = new THREE.Vector3(0, 4.8, 7.2);
    const targetCamPos = new THREE.Vector3().copy(characterPos).add(offset);
    camera.position.lerp(targetCamPos, 0.05);

    // Look at character
    lookTarget.current.lerp(characterPos, 0.05);
    camera.lookAt(lookTarget.current);
  });

  return null;
}

// 3D Hiring Manager NPC Guide
function HiringManager() {
  const managerRef = useRef<THREE.Group>(null);
  
  // Subtle breathing vertical animation
  useFrame((state) => {
    if (managerRef.current) {
      managerRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.02;
    }
  });

  return (
    <group ref={managerRef} position={[0, 0, 1.2]}>
      {/* Floating HTML Nameplate */}
      <Html position={[0, 1.15, 0]} center>
        <div className="npc-nameplate">
          <div className="npc-title">[NPC] HIRING MANAGER</div>
          <div className="npc-subtitle">Walk Close to Talk</div>
        </div>
      </Html>

      {/* Suit Torso */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.13, 0.45, 8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} />
      </mesh>
      
      {/* Shirt Collar & Tie */}
      <mesh position={[0, 0.55, 0.08]}>
        <boxGeometry args={[0.06, 0.1, 0.02]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0.45, 0.09]}>
        <boxGeometry args={[0.025, 0.18, 0.025]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.6} />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 0.78, -0.05]}>
        <boxGeometry args={[0.22, 0.12, 0.22]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>

      {/* Briefcase */}
      <mesh position={[0.26, 0.12, 0]} castShadow>
        <boxGeometry args={[0.1, 0.2, 0.22]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh position={[0.26, 0.24, 0]}>
        <boxGeometry args={[0.02, 0.04, 0.08]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>

      {/* Little feet */}
      <mesh position={[-0.07, 0.05, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#020617" />
      </mesh>
      <mesh position={[0.07, 0.05, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#020617" />
      </mesh>
    </group>
  );
}

// The Controllable Explorer Character
function ExplorerAvatar({ 
  targetPos, 
  characterPos,
  activeSection,
  setActiveSection 
}: { 
  targetPos: THREE.Vector3; 
  characterPos: THREE.Vector3;
  activeSection: string;
  setActiveSection: (section: string) => void;
}) {
  const avatarRef = useRef<THREE.Group>(null);
  const bobRef = useRef<number>(0);
  const keys = useKeyboardControls();

  useFrame((state) => {
    const isMovingWithKeys = keys.moveForward || keys.moveBackward || keys.moveLeft || keys.moveRight;

    if (isMovingWithKeys) {
      // 1. Manual Keyboard Traversal
      const dir = new THREE.Vector3(0, 0, 0);
      if (keys.moveForward) dir.z -= 1;
      if (keys.moveBackward) dir.z += 1;
      if (keys.moveLeft) dir.x -= 1;
      if (keys.moveRight) dir.x += 1;

      if (dir.lengthSq() > 0) {
        dir.normalize().multiplyScalar(0.08); // Speed coefficient
        characterPos.add(dir);
        
        // Boundaries clamps
        characterPos.x = THREE.MathUtils.clamp(characterPos.x, -8, 8);
        characterPos.z = THREE.MathUtils.clamp(characterPos.z, -8, 8);

        // Rotate face angle
        const targetRotation = Math.atan2(dir.x, dir.z);
        if (avatarRef.current) {
          avatarRef.current.rotation.y = THREE.MathUtils.lerp(
            avatarRef.current.rotation.y,
            targetRotation,
            0.15
          );
        }

        // Bob vertical footsteps
        bobRef.current += state.clock.getDelta() * 14;
        if (avatarRef.current) {
          avatarRef.current.position.y = Math.abs(Math.sin(bobRef.current)) * 0.12;
        }
      }

      // Check proximity to trigger section logs on overlay dashboard
      let closestSection = activeSection;
      let minDistance = 1.25;

      Object.entries(nodeCoords).forEach(([section, pos]) => {
        // Offset NPC proximity check
        const dist = characterPos.distanceTo(pos);
        if (dist < minDistance) {
          closestSection = section;
        }
      });

      if (closestSection !== activeSection) {
        setActiveSection(closestSection);
      }

    } else {
      // 2. Automated Path Travel (Lerping to active click coordinates)
      const dist = characterPos.distanceTo(targetPos);
      
      if (dist > 0.05) {
        characterPos.lerp(targetPos, 0.06);
        
        if (avatarRef.current) {
          const dir = new THREE.Vector3().subVectors(targetPos, characterPos).normalize();
          const targetRotation = Math.atan2(dir.x, dir.z);
          avatarRef.current.rotation.y = THREE.MathUtils.lerp(
            avatarRef.current.rotation.y,
            targetRotation,
            0.1
          );

          bobRef.current += state.clock.getDelta() * 12;
          avatarRef.current.position.y = Math.abs(Math.sin(bobRef.current)) * 0.12;
        }
      } else {
        // Return avatar to ground when idle
        if (avatarRef.current) {
          avatarRef.current.position.y = THREE.MathUtils.lerp(avatarRef.current.position.y, 0, 0.1);
        }
      }
    }

    // Bind physical coordinates
    if (avatarRef.current) {
      avatarRef.current.position.x = characterPos.x;
      avatarRef.current.position.z = characterPos.z;
    }
  });

  return (
    <group ref={avatarRef}>
      {/* Floating HTML Nameplate */}
      <Html position={[0, 1.1, 0]} center>
        <div className="player-nameplate">
          AAYUSH (LVL 99)
        </div>
      </Html>

      {/* Torso */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.13, 0.45, 8]} />
        <meshStandardMaterial color="#ea580c" roughness={0.5} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.6} />
      </mesh>

      {/* Straw Hat */}
      <group position={[0, 0.8, 0]}>
        <mesh rotation={[Math.PI / 12, 0, 0]} castShadow>
          <coneGeometry args={[0.3, 0.08, 12]} />
          <meshStandardMaterial color="#ca8a04" roughness={0.8} />
        </mesh>
      </group>

      {/* Little feet */}
      <mesh position={[-0.07, 0.05, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.07, 0.05, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
    </group>
  );
}

// 3D Cozy Cottage (ABOUT)
function CozyCottage() {
  return (
    <group position={[-3.5, 0, -2.5]}>
      {/* House body */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 1.0, 1.2]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.7} />
      </mesh>
      {/* Chimney */}
      <mesh position={[-0.5, 1.1, -0.3]} castShadow>
        <boxGeometry args={[0.25, 0.6, 0.25]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      {/* Peaked roof */}
      <mesh position={[0, 1.15, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.3, 0.7, 4]} />
        <meshStandardMaterial color="#ea580c" roughness={0.5} />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.35, 0.61]}>
        <planeGeometry args={[0.35, 0.65]} />
        <meshStandardMaterial color="#7c2d12" />
      </mesh>
      {/* Windows */}
      <mesh position={[-0.5, 0.6, 0.61]}>
        <planeGeometry args={[0.25, 0.25]} />
        <meshStandardMaterial color="#fef08a" />
      </mesh>
      <mesh position={[0.5, 0.6, 0.61]}>
        <planeGeometry args={[0.25, 0.25]} />
        <meshStandardMaterial color="#fef08a" />
      </mesh>
    </group>
  );
}

// 3D Chronology Windmill (EXPERIENCE)
function Windmill() {
  const sailRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (sailRef.current) {
      sailRef.current.rotation.z = state.clock.getElapsedTime() * 0.9;
    }
  });

  return (
    <group position={[-2.0, 0, 3.0]}>
      {/* Tower base */}
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.8, 2.2, 8]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>
      {/* Conical cap */}
      <mesh position={[0, 2.4, 0]} castShadow>
        <coneGeometry args={[0.62, 0.5, 8]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      {/* Rotating sails assembly */}
      <group ref={sailRef} position={[0, 2.1, 0.52]}>
        {/* Hub center */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.12, 8]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        {/* 4 Blades */}
        {[0, 1, 2, 3].map((i) => (
          <group key={i} rotation={[0, 0, (i * Math.PI) / 2]}>
            {/* Wooden beam */}
            <mesh position={[0, 0.7, 0]} castShadow>
              <boxGeometry args={[0.04, 1.4, 0.02]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
            {/* Sail fabric canvas */}
            <mesh position={[0.12, 0.8, 0.01]}>
              <boxGeometry args={[0.2, 1.0, 0.005]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.9} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

// 3D Projects Workshop (PROJECTS)
function ProjectWorkshop() {
  return (
    <group position={[3.0, 0, 2.5]}>
      {/* Workshop main hall */}
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 1.1, 1.6]} />
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>
      {/* Peaked A-frame roof */}
      <mesh position={[0, 1.25, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <boxGeometry args={[1.3, 1.3, 1.7]} />
        <meshStandardMaterial color="#b45309" roughness={0.5} />
      </mesh>
      {/* Double wooden barn doors */}
      <mesh position={[0, 0.35, 0.81]}>
        <planeGeometry args={[0.7, 0.7]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>
    </group>
  );
}

// 3D Skill Orchard / Forest Trees (SKILLS)
function SkillOrchard() {
  const trees = [
    { pos: [2.5, 0, -2.5], color: "#ec4899", scale: 0.6, type: "cherry" }, 
    { pos: [3.6, 0, -2.0], color: "#fbbf24", scale: 0.5, type: "autumn" },  
    { pos: [1.8, 0, -1.8], color: "#14b8a6", scale: 0.55, type: "pine" },  
    { pos: [2.8, 0, -1.2], color: "#f97316", scale: 0.45, type: "golden" } 
  ];

  return (
    <group>
      {trees.map((tree, index) => (
        <group key={index} position={new THREE.Vector3(tree.pos[0], tree.pos[1], tree.pos[2])}>
          {/* Wood trunk */}
          <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.1, 0.8, 8]} />
            <meshStandardMaterial color="#78350f" roughness={0.9} />
          </mesh>
          {/* Foliage */}
          {tree.type === "pine" ? (
            <mesh position={[0, 0.9, 0]} castShadow>
              <coneGeometry args={[0.45, 0.9, 8]} />
              <meshStandardMaterial color={tree.color} roughness={0.8} />
            </mesh>
          ) : (
            <mesh position={[0, 0.9, 0]} castShadow>
              <sphereGeometry args={[0.42, 12, 12]} />
              <meshStandardMaterial color={tree.color} roughness={0.7} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

// 3D Postbox / Bench (CONTACT)
function Mailbox() {
  return (
    <group position={[0, 0, 4.0]}>
      {/* Wooden Bench */}
      <group position={[0.7, 0.15, 0]}>
        {/* Seat */}
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.05, 0.35]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        {/* Legs */}
        <mesh position={[-0.3, -0.1, 0]}>
          <boxGeometry args={[0.04, 0.2, 0.3]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>
        <mesh position={[0.3, -0.1, 0]}>
          <boxGeometry args={[0.04, 0.2, 0.3]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>
      </group>

      {/* Red Post Box */}
      <group position={[-0.6, 0, 0]}>
        {/* Post */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>
        {/* Mailbox container */}
        <mesh position={[0, 0.65, 0]} castShadow>
          <boxGeometry args={[0.18, 0.22, 0.28]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} />
        </mesh>
        {/* Flag indicator */}
        <mesh position={[0.1, 0.72, 0.05]}>
          <boxGeometry args={[0.01, 0.1, 0.03]} />
          <meshBasicMaterial color="#fbbf24" />
        </mesh>
      </group>
    </group>
  );
}

// Winding Pathways connecting locations
function DirtPaths() {
  return (
    <group>
      {/* Vibrant green cartoon grass base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#8fce00" roughness={0.9} />
      </mesh>

      {/* Clay-sandy dirt paths */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.7, 0.001, -1.2]}>
        <planeGeometry args={[3.2, 0.65]} />
        <meshStandardMaterial color="#ddb892" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.0, 0.001, 1.5]}>
        <planeGeometry args={[0.65, 3.0]} />
        <meshStandardMaterial color="#ddb892" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.5, 0.001, 1.2]}>
        <planeGeometry args={[3.0, 0.65]} />
        <meshStandardMaterial color="#ddb892" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.6, 0.001, -1.0]}>
        <planeGeometry args={[3.2, 0.65]} />
        <meshStandardMaterial color="#ddb892" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 2.0]}>
        <planeGeometry args={[0.65, 4.0]} />
        <meshStandardMaterial color="#ddb892" roughness={0.9} />
      </mesh>
    </group>
  );
}

// Glowing Fireflies hovering over Orchard/Cottage (Soft golden sparks)
function Fireflies() {
  const points = useMemo(() => {
    return Array.from({ length: 20 }).map(() => ({
      pos: new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(15),
        THREE.MathUtils.randFloat(0.3, 2.0),
        THREE.MathUtils.randFloatSpread(15)
      ),
      seed: Math.random() * 100,
    }));
  }, []);

  const meshRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    points.forEach((pt, i) => {
      const mesh = meshRefs.current[i];
      if (!mesh) return;
      const t = state.clock.getElapsedTime();
      mesh.position.y = pt.pos.y + Math.sin(t * 1.5 + pt.seed) * 0.25;
      mesh.position.x = pt.pos.x + Math.cos(t * 0.5 + pt.seed) * 0.15;
    });
  });

  return (
    <group>
      {points.map((pt, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) meshRefs.current[i] = el;
          }}
          position={pt.pos}
        >
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
      ))}
    </group>
  );
}

export default function VillageScene({ activeSection, setActiveSection }: VillageSceneProps) {
  // Target coordinates for automated click travel
  const targetPos = useMemo(() => nodeCoords[activeSection] || nodeCoords.overview, [activeSection]);
  
  // Shared persistent coordinates reference for explorer boy
  const characterPos = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0, pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 5, 8], fov: 50 }}
        style={{ background: "#e0f2fe" }}
        shadows
      >
        <ambientLight intensity={0.7} color="#ffffff" />
        {/* Sunny golden directional light */}
        <directionalLight
          position={[10, 18, 10]}
          intensity={1.8}
          color="#fffbf0"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        {/* Soft fill sky light */}
        <directionalLight position={[-8, -5, -4]} intensity={0.4} color="#bae6fd" />
        
        <CameraController characterPos={characterPos} />
        <DirtPaths />
        <CozyCottage />
        <Windmill />
        <ProjectWorkshop />
        <SkillOrchard />
        <Mailbox />
        <Fireflies />

        {/* 3D Hiring Manager NPC */}
        <HiringManager />
        
        <ExplorerAvatar 
          targetPos={targetPos} 
          characterPos={characterPos} 
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      </Canvas>
    </div>
  );
}
