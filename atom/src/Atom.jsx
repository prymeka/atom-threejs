import * as THREE from "three";
import { useState, useRef, useEffect, Suspense } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, CycleRaycast } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import positions from "./positions";

export default function Atom() {
  const [{ objects, cycle }, set] = useState({ objects: [], cycle: 0 });
  const radiusInner = 3;
  const radiusMiddle = 6;
  const radiusOuter = 9;
  const scale = 0.2;

  const innerColor = "#7fa3ff";
  const middleColor = "#6ec6ff";
  const outerColor = "#6efff2";
  return (
    <group>
      <ambientLight />
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      <Suspense fallback={null}>
        <Nucleus />
        <AtomicOrbit radius={radiusInner} color={"#ffd830"}>
          <Electron href={"#theoretical-physics"} color={innerColor} scale={scale} radius={radiusInner} start={0} speed={0.1} />
          <Electron href={"#theoretical-physics"} color={innerColor} scale={scale} radius={radiusInner} start={2*Math.PI/3} speed={0.1} />
          <Electron href={"#theoretical-physics"} color={innerColor} scale={scale} radius={radiusInner} start={-2*Math.PI/3} speed={0.1} />
        </AtomicOrbit>
        <AtomicOrbit radius={radiusMiddle} color={"#ff7e30"}>
          <Electron href={"#web-development"} color={middleColor} scale={scale} radius={radiusMiddle} start={0} speed={0.15} />
          <Electron href={"#web-development"} color={middleColor} scale={scale} radius={radiusMiddle} start={Math.PI/2} speed={0.15} />
          <Electron href={"#web-development"} color={middleColor} scale={scale} radius={radiusMiddle} start={Math.PI} speed={0.15} />
          <Electron href={"#web-development"} color={middleColor} scale={scale} radius={radiusMiddle} start={-Math.PI/2} speed={0.15} />
        </AtomicOrbit>
        <AtomicOrbit radius={radiusOuter} color={"#ff3232"}>
          <Electron href={"#artificial-intelligence"} color={outerColor} scale={scale} radius={radiusOuter} start={0} speed={0.08} />
          <Electron href={"#artificial-intelligence"} color={outerColor} scale={scale} radius={radiusOuter} start={Math.PI} speed={0.08} />
        </AtomicOrbit>
        <EffectComposer multisampling={8}>
          <Bloom kernelSize={3} luminanceThreshold={0.5} luminanceSmoothing={0.4} intensity={2.0} />
        </EffectComposer>
      </Suspense>
      <CycleRaycast onChanged={(objects, cycle) => set({ objects, cycle })} />
    </group>
  );
}

function Nucleus() {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  const handleOnPointerOver = () => setHovered(true);
  const handleOnPointerOut = () => setHovered(false);
  const handleOnClick = () => window.location.href = "#about-me";
  useFrame((_) => {
    if (!hovered) {
      ref.current.rotation.x += Math.sin(_.clock.elapsedTime/10)*0.005;
      ref.current.rotation.y += Math.sin(_.clock.elapsedTime/10)*0.005;
      ref.current.rotation.z += Math.sin(_.clock.elapsedTime/10)*0.005;
    }
  });
  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
  }, [hovered]);
  let blue = "#0000aa";
  let red = "#ee0000";
  let colors = [blue, red, red, red, red, blue, blue, red, blue, red, red, blue, blue, blue];

  return (
    <group ref={ref} onPointerOver={handleOnPointerOver} onPointerOut={handleOnPointerOut} onClick={handleOnClick}>
      <Nucleon position={positions[0]} color={colors[0]} />
      <Nucleon position={positions[1]} color={colors[1]} />
      <Nucleon position={positions[2]} color={colors[2]} />
      <Nucleon position={positions[3]} color={colors[3]} />
      <Nucleon position={positions[4]} color={colors[4]} />
      <Nucleon position={positions[5]} color={colors[5]} />
      <Nucleon position={positions[6]} color={colors[6]} />
      <Nucleon position={positions[7]} color={colors[7]} />
      <Nucleon position={positions[8]} color={colors[8]} />
      <Nucleon position={positions[9]} color={colors[9]} />
      <Nucleon position={positions[10]} color={colors[10]} />
      <Nucleon position={positions[11]} color={colors[11]} />
      <Nucleon position={positions[12]} color={colors[12]} />
      <Nucleon position={positions[13]} color={colors[13]} />
    </group>
  );
}

function Nucleon({ position, color }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

function AtomicOrbit({ radius, color, children }) {
  const ref = useRef();
  const vec = new THREE.Vector3();
  const { mouse } = useThree();
  useFrame(() => {
    vec.set(mouse.x * 2, mouse.y * 2, 3.5);
    ref.current.position.lerp(vec.set(mouse.x * 0.2, mouse.y * 0.2, 0), 0.1);
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, (-mouse.x * Math.PI) / 20, 0.1);
  });
  return (
    <group ref={ref}>
      <mesh>
        <torusGeometry args={[radius, 0.01, 16, 100]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {children}
    </group>
  );
}

function Electron({ href, color, scale, radius, start, speed }) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  const handleOnClick = () => window.location.href = href;
  useFrame((_) => {
    ref.current.scale.setScalar(hovered ? 2 * scale : scale);
    if (hovered) return;
    ref.current.position.x = radius * Math.cos(_.clock.elapsedTime * speed + start); 
    ref.current.position.y = radius * Math.sin(_.clock.elapsedTime * speed + start);
  });
  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
  }, [hovered]);
  return (
    <mesh
      ref={ref}
      scale={scale}
      onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
      onPointerOut={(e) => setHovered(false)}
      onClick={handleOnClick}
    >
      <sphereGeometry args={[1, 8, 8]} />
      <meshPhongMaterial color={color} toneMapped={false} emissive={color} emissiveIntensity={1.2} />
    </mesh>
  );
}
