import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface VillageSceneProps {
  activeSection: string;
}

// Coordinates mapping for destinations in the village
const nodeCoords: Record<string, THREE.Vector3> = {
  overview: new THREE.Vector3(0, 0, 0),
  about: new THREE.Vector3(-3.5, 0, -2.5),
  tech: new THREE.Vector3(3.2, 0, -2.0),
  experience: new THREE.Vector3(-2.0, 0, 3.0),
  projects: new THREE.Vector3(3.0, 0, 2.5),
};

// RPG Camera tracking controller following character
function CameraController({ activeSection, characterPos }: { activeSection: string; characterPos: THREE.Vector3 }) {
  const { camera } = useThree();
  const lookTarget = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    // 1. Position camera relative to the active target/character
    let offset = new THREE.Vector3(0, 5, 8); // Overview camera offset
    
    if (activeSection === "about") {
      offset.set(-1.8, 3.2, 4.5);
    } else if (activeSection === "tech") {
      offset.set(1.8, 3.2, 4.5);
    } else if (activeSection === "experience") {
      offset.set(-1.5, 3.5, 5.0);
    } else if (activeSection === "projects") {
      offset.set(1.5, 3.5, 5.0);
    }

    const targetCamPos = new THREE.Vector3().copy(characterPos).add(offset);
    camera.position.lerp(targetCamPos, 0.05);

    // 2. Camera looks at character pos
    lookTarget.current.lerp(characterPos, 0.05);
    camera.lookAt(lookTarget.current);
  });

  return null;
}

// The Walking Avatar (The Boy / Explorer / Agent Vector)
function ExplorerAvatar({ targetPos, characterPos }: { targetPos: THREE.Vector3; characterPos: THREE.Vector3 }) {
  const avatarRef = useRef<THREE.Group>(null);
  const bobRef = useRef<number>(0);

  useFrame((state) => {
    const dist = characterPos.distanceTo(targetPos);
    
    if (dist > 0.05) {
      // Lerp character position towards target
      characterPos.lerp(targetPos, 0.06);
      
      // Face character in travel direction
      if (avatarRef.current) {
        const dir = new THREE.Vector3().subVectors(targetPos, characterPos).normalize();
        const targetRotation = Math.atan2(dir.x, dir.z);
        
        // Interpolate rotation angle
        avatarRef.current.rotation.y = THREE.MathUtils.lerp(
          avatarRef.current.rotation.y,
          targetRotation,
          0.1
        );

        // Bob character vertically to simulate walking footsteps
        bobRef.current += state.clock.getDelta() * 12;
        avatarRef.current.position.y = Math.abs(Math.sin(bobRef.current)) * 0.12;
      }
    } else {
      // Return character to ground level when idle
      if (avatarRef.current) {
        avatarRef.current.position.y = THREE.MathUtils.lerp(avatarRef.current.position.y, 0, 0.1);
      }
    }

    // Update physical coordinates
    if (avatarRef.current) {
      avatarRef.current.position.x = characterPos.x;
      avatarRef.current.position.z = characterPos.z;
    }
  });

  return (
    <group ref={avatarRef}>
      {/* Torso */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.13, 0.45, 8]} />
        <meshStandardMaterial color="#1d4ed8" roughness={0.5} />
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
          <meshStandardMaterial color="#f59e0b" roughness={0.8} />
        </mesh>
      </group>

      {/* Holographic scanning aura */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.9, 8]} />
        <meshBasicMaterial color="#39FF14" wireframe opacity={0.12} transparent />
      </mesh>

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

// 3D Holographic Cozy Cottage (ABOUT)
function CozyCottage() {
  return (
    <group position={[-3.5, 0, -2.5]}>
      {/* House body */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 1.0, 1.2]} />
        <meshStandardMaterial color="#2d3748" roughness={0.7} />
      </mesh>
      {/* House wireframe bounding overlay */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.62, 1.02, 1.22]} />
        <meshBasicMaterial color="#39FF14" wireframe opacity={0.15} transparent />
      </mesh>
      {/* Chimney */}
      <mesh position={[-0.5, 1.1, -0.3]} castShadow>
        <boxGeometry args={[0.25, 0.6, 0.25]} />
        <meshStandardMaterial color="#9a3412" />
      </mesh>
      {/* Peaked roof */}
      <mesh position={[0, 1.15, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.3, 0.7, 4]} />
        <meshStandardMaterial color="#e76f51" roughness={0.5} />
      </mesh>
      {/* Roof wireframe overlay */}
      <mesh position={[0, 1.15, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.32, 0.72, 4]} />
        <meshBasicMaterial color="#39FF14" wireframe opacity={0.15} transparent />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.35, 0.61]}>
        <planeGeometry args={[0.35, 0.65]} />
        <meshStandardMaterial color="#7c2d12" />
      </mesh>
      {/* Glowing Warm Windows */}
      <mesh position={[-0.5, 0.6, 0.61]}>
        <planeGeometry args={[0.25, 0.25]} />
        <meshBasicMaterial color="#39FF14" />
      </mesh>
      <mesh position={[0.5, 0.6, 0.61]}>
        <planeGeometry args={[0.25, 0.25]} />
        <meshBasicMaterial color="#39FF14" />
      </mesh>
    </group>
  );
}

// 3D Holographic Chronology Windmill (EXPERIENCE)
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
        <meshStandardMaterial color="#4a5568" roughness={0.8} />
      </mesh>
      {/* Tower base wireframe overlay */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.52, 0.82, 2.22, 8]} />
        <meshBasicMaterial color="#39FF14" wireframe opacity={0.15} transparent />
      </mesh>
      {/* Conical cap */}
      <mesh position={[0, 2.4, 0]} castShadow>
        <coneGeometry args={[0.62, 0.5, 8]} />
        <meshStandardMaterial color="#1a202c" />
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

// 3D Holographic Projects Workshop (PROJECTS)
function ProjectWorkshop() {
  return (
    <group position={[3.0, 0, 2.5]}>
      {/* Workshop main hall */}
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 1.1, 1.6]} />
        <meshStandardMaterial color="#1a202c" roughness={0.6} />
      </mesh>
      {/* Workshop wireframe overlay */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[1.82, 1.12, 1.62]} />
        <meshBasicMaterial color="#39FF14" wireframe opacity={0.15} transparent />
      </mesh>
      {/* Peaked A-frame roof */}
      <mesh position={[0, 1.25, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <boxGeometry args={[1.3, 1.3, 1.7]} />
        <meshStandardMaterial color="#2d3748" roughness={0.5} />
      </mesh>
      {/* Double wooden barn doors */}
      <mesh position={[0, 0.35, 0.81]}>
        <planeGeometry args={[0.7, 0.7]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>
      {/* Front lights */}
      <mesh position={[0, 0.8, 0.82]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color="#39FF14" />
      </mesh>
    </group>
  );
}

// 3D Skill Orchard / Forest Trees (SKILLS)
function SkillOrchard() {
  const trees = [
    { pos: [2.5, 0, -2.5], color: "#39FF14", scale: 0.6, type: "cherry" }, // neon yolo green
    { pos: [3.6, 0, -2.0], color: "#00F0FF", scale: 0.5, type: "autumn" },  // cyan tracking
    { pos: [1.8, 0, -1.8], color: "#39FF14", scale: 0.55, type: "pine" },  
    { pos: [2.8, 0, -1.2], color: "#00F0FF", scale: 0.45, type: "golden" } 
  ];

  return (
    <group>
      {trees.map((tree, index) => (
        <group key={index} position={new THREE.Vector3(tree.pos[0], tree.pos[1], tree.pos[2])}>
          {/* Wood trunk */}
          <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.1, 0.8, 8]} />
            <meshStandardMaterial color="#451a03" roughness={0.9} />
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
          {/* Hologram wireframe overlay */}
          <mesh position={[0, 0.9, 0]}>
            <sphereGeometry args={[0.45, 8, 8]} />
            <meshBasicMaterial color="#39FF14" wireframe opacity={0.12} transparent />
          </mesh>
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
          <meshStandardMaterial color="#4a5568" />
        </mesh>
        {/* Legs */}
        <mesh position={[-0.3, -0.1, 0]}>
          <boxGeometry args={[0.04, 0.2, 0.3]} />
          <meshStandardMaterial color="#1a202c" />
        </mesh>
        <mesh position={[0.3, -0.1, 0]}>
          <boxGeometry args={[0.04, 0.2, 0.3]} />
          <meshStandardMaterial color="#1a202c" />
        </mesh>
      </group>

      {/* Red Post Box */}
      <group position={[-0.6, 0, 0]}>
        {/* Post */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
          <meshStandardMaterial color="#4a5568" />
        </mesh>
        {/* Mailbox container */}
        <mesh position={[0, 0.65, 0]} castShadow>
          <boxGeometry args={[0.18, 0.22, 0.28]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} />
        </mesh>
        {/* Flag indicator */}
        <mesh position={[0.1, 0.72, 0.05]}>
          <boxGeometry args={[0.01, 0.1, 0.03]} />
          <meshBasicMaterial color="#39FF14" />
        </mesh>
      </group>
    </group>
  );
}

// Winding Dirt Pathways connecting locations
function DirtPaths() {
  return (
    <group>
      {/* Dark Matrix base plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[25, 25]} />
        <meshStandardMaterial color="#0a0a0c" roughness={0.9} />
      </mesh>

      {/* Green cyber grid helper */}
      <gridHelper args={[26, 26, "#1f5f1f", "#111115"]} position={[0, -0.01, 0]} />

      {/* Dirt path planes layered just above ground (styled dark green-gray traces) */}
      {/* Center to Cottage */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.7, 0.001, -1.2]}>
        <planeGeometry args={[3.2, 0.65]} />
        <meshStandardMaterial color="#142618" roughness={0.9} />
      </mesh>
      {/* Center to Windmill */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.0, 0.001, 1.5]}>
        <planeGeometry args={[0.65, 3.0]} />
        <meshStandardMaterial color="#142618" roughness={0.9} />
      </mesh>
      {/* Center to Projects */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.5, 0.001, 1.2]}>
        <planeGeometry args={[3.0, 0.65]} />
        <meshStandardMaterial color="#142618" roughness={0.9} />
      </mesh>
      {/* Center to Skills */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.6, 0.001, -1.0]}>
        <planeGeometry args={[3.2, 0.65]} />
        <meshStandardMaterial color="#142618" roughness={0.9} />
      </mesh>
      {/* Center to Mailbox */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 2.0]}>
        <planeGeometry args={[0.65, 4.0]} />
        <meshStandardMaterial color="#142618" roughness={0.9} />
      </mesh>
    </group>
  );
}

// Glowing Fireflies hovering over Orchard/Cottage
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
          <meshBasicMaterial color="#39FF14" />
        </mesh>
      ))}
    </group>
  );
}

export default function VillageScene({ activeSection }: VillageSceneProps) {
  // Main coordinate tracking vector
  const targetPos = useMemo(() => nodeCoords[activeSection] || nodeCoords.overview, [activeSection]);
  const characterPos = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0, pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 5, 8], fov: 50 }}
        style={{ background: "transparent" }}
        shadows
      >
        <ambientLight intensity={0.25} color="#1f5f1f" />
        {/* Soft Cybernetic Neon Lights */}
        <directionalLight
          position={[8, 12, 4]}
          intensity={1.5}
          color="#39FF14"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        {/* Soft Cyan fill light */}
        <directionalLight position={[-8, -5, -4]} intensity={0.5} color="#00F0FF" />
        
        <CameraController activeSection={activeSection} characterPos={characterPos} />
        <DirtPaths />
        <CozyCottage />
        <Windmill />
        <ProjectWorkshop />
        <SkillOrchard />
        <Mailbox />
        <Fireflies />
        
        <ExplorerAvatar targetPos={targetPos} characterPos={characterPos} />
      </Canvas>
    </div>
  );
}
