import React, { useState, useRef, useEffect } from 'react';
import { Canvas, MeshProps, useThree } from 'react-three-fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

import SVGComponent from './sign.svg';
import { worldData } from './worldData';

//* 立方体
const Box: React.FC<MeshProps> = (props) => {
  const [clicked, setClicked] = useState(false);
  const ref = useRef<THREE.Mesh | null>(null);

  return (
    <mesh {...props} ref={ref} onClick={() => setClicked(!clicked)}>
      <boxGeometry args={[1.2, 0, 1.2]} />
      <meshStandardMaterial color={clicked ? '#eeff00' : '#4C4640'} />
    </mesh>
  );
};

const Rectangle: React.FC<{
  position: [number, number, number];
  color?: string;
}> = ({ position }) => {
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const geometry = new THREE.PlaneGeometry(1, 1);
  return (
    <mesh
      position={position}
      geometry={geometry}
      onClick={() => setClicked(!clicked)}
      onPointerOver={(event) => (event.stopPropagation(), setHovered(true))}
      onPointerOut={() => setHovered(false)}
    >
      <meshStandardMaterial
        color={clicked || hovered ? '#eeff00' : '#4C4640'}
      />
    </mesh>
  );
};

const SVGShape: React.FC<{
  svgUrl: string;
  position: [number, number, number];
}> = ({ svgUrl, position }) => {
  const [svgGroup, setSvgGroup] = useState<THREE.Group | null>(null);

  useEffect(() => {
    const loader = new SVGLoader();
    loader.load(svgUrl, (data) => {
      const paths = data.paths;
      const group = new THREE.Group();

      paths.forEach((path) => {
        const material = new THREE.MeshBasicMaterial({
          color: path.color,
          side: THREE.DoubleSide,
          depthWrite: false,
        });

        const shapes = SVGLoader.createShapes(path);
        shapes.forEach((shape) => {
          const geometry = new THREE.ShapeGeometry(shape);
          const mesh = new THREE.Mesh(geometry, material);
          group.add(mesh);
        });
      });

      setSvgGroup(group);
    });
  }, [svgUrl]);

  return svgGroup ? (
    <primitive object={svgGroup} scale={0.2} position={position} />
  ) : null;
};

const ClickHandler: React.FC<{ svgUrl: string }> = ({ svgUrl }) => {
  const { camera, gl } = useThree();
  const [positions, setPositions] = useState<[number, number, number][]>([]);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      // 将鼠标点击位置转换为标准化设备坐标 (NDC)
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
      console.log(mouse.current);

      // 使用射线投射器从摄像头发出射线
      raycaster.current.setFromCamera(mouse.current, camera);

      // 创建平面，射线与此平面相交
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // Y轴平面
      const intersection = new THREE.Vector3();
      raycaster.current.ray.intersectPlane(plane, intersection);

      // 将新位置添加到状态
      setPositions((prevPositions) => [
        ...prevPositions,
        [intersection.x, intersection.y, intersection.z],
      ]);
    };

    gl.domElement.addEventListener('click', handleClick);
    return () => gl.domElement.removeEventListener('click', handleClick);
  }, [camera, gl]);

  useEffect(() => {
    console.log(positions);
  }, [positions]);

  return null;
  // return (
  //   <>
  //     {positions.map((position, index) => (
  //       <SVGShape key={index} svgUrl={svgUrl} position={position} />
  //     ))}
  //   </>
  // );
};

const XYZAxes: React.FC<{ size: number }> = ({ size }) => {
  // 使用 Three.js 的 AxesHelper 创建坐标轴
  return <axesHelper args={[size]} />;
};

const CameraControls: React.FC = () => {
  const { camera } = useThree();
  React.useEffect(() => {
    camera.position.set(0, 0, 10);
    camera.lookAt(1000, 100, 100);
    camera.zoom = 0.05;
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
};

const ThreeJSPage: React.FC = () => {
  const drawCubes = () => {
    const cubes = worldData.map((point: number[]) => {
      const [longitude, latitude] = point;
      const x = longitude / 4 - 120;
      const z = latitude / 4 - 50;

      return <Rectangle key={`${x}-${z}`} position={[x, -z, 0]} />;
    });
    return cubes;
  };

  return (
    <div>
      <Canvas style={{ height: '100vh' }}>
        <OrbitControls enableRotate={false} enablePan />
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <XYZAxes size={100} />
        <ClickHandler svgUrl={SVGComponent} />
        <CameraControls />
        {drawCubes()}
      </Canvas>
    </div>
  );
};

export default ThreeJSPage;
