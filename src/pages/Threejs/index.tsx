import React, { useState, useRef } from 'react';
import { Canvas, MeshProps, useThree } from 'react-three-fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

import { worldData } from './worldData copy';

//* 立方体
const Box: React.FC<MeshProps> = (props) => {
  // const [hovered, setHovered] = useState(false);
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
      // scale={clicked ? 1.5 : 1}
      onClick={() => setClicked(!clicked)}
      // onPointerOver={(event) => (event.stopPropagation(), setHovered(true))}
      // onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[4, 4, 4]} />
      <meshStandardMaterial color={clicked ? 'yellow' : 'red'} />
    </mesh>
  );
};

const CameraPosition: React.FC = () => {
  const { camera } = useThree();

  // 设置摄像头位置和方向
  React.useEffect(() => {
    camera.position.set(0, 500, 0); // x, y, z
    // camera.lookAt(new THREE.Vector3(0, 0, 0)); // 确保摄像头指向场景中心
  }, [camera]);

  return null;
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
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
};

const ThreeJSPage: React.FC = () => {
  // const { camera, gl } = useThree();

  const drawCubes = () => {
    const cubes = worldData.map((point: number[]) => {
      const [longitude, latitude] = point;
      // const x = Math.ceil((longitude / 180) * 100);
      // const z = Math.ceil(-(latitude / 90) * 50);
      const x = longitude;
      const z = latitude;

      return <Box key={`${x}-${z}`} position={[x, 0, z]} />;
    });
    return cubes;
  };

  return (
    <Canvas style={{ height: '100vh' }}>
      <OrbitControls enablePan={true} enableRotate={false} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <CameraPosition />
      {/* {worldData ? drawCubes(worldData) : null} */}
      {drawCubes()}
    </Canvas>
  );
  return (
    <div>
      <Canvas style={{ height: '100vh' }}>
        <ambientLight intensity={Math.PI / 2} />{' '}
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
