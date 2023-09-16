import { Canvas } from "@react-three/fiber";
import Atom from "./Atom";

export default function App() {
  return (
    <main>
      <Canvas dpr={[1, 1.5]} camera={{ fov: 30, near: 0.01, far: 300, position: [0, 0, 50] }}>
        <color attach="background" args={['black']} />
        <Atom />
      </Canvas>
    </main>
  )
}
