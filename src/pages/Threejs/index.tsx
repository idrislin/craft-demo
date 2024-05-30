import React, { useState, useRef } from "react";
import { Canvas, MeshProps, useFrame } from "react-three-fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

//* 立方体
const Box: React.FC<MeshProps> = (props) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const ref = useRef<THREE.Mesh | null>(null);

  // useFrame((_, delta) => {
  //   if (!ref.current) return;
  //   ref.current.rotation.x += delta;
  // });

  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={() => setClicked(!clicked)}
      onPointerOver={(event) => (event.stopPropagation(), setHovered(true))}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
};

//* 球体
const Sphere: React.FC<MeshProps> = (props) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const ref = useRef<THREE.Mesh | null>(null);

  // useFrame((_, delta) => {
  //   if (!ref.current) return;
  //   ref.current.rotation.x += delta;
  // });

  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={() => setClicked(!clicked)}
      onPointerOver={(event) => (event.stopPropagation(), setHovered(true))}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[1, 100, 100]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
};

const ThreeJSPage: React.FC = () => {
  return (
    <div>
      <Canvas style={{ height: "100vh" }}>
        <ambientLight intensity={Math.PI / 2} />{" "}
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Box position={[1.2, 0, 0]} />
        <Sphere position={[-1.2, 0, 0]} />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default ThreeJSPage;
