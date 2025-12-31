import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Object3D } from "./components/Object3D";
import { FrontViewProjection } from "./components/FrontViewProjection";
import { VerticalPlane } from "./components/VerticalPlane";
import { HorizontalPlane } from "./components/HorizontalPlane";
import { ProfilePlane } from "./components/ProfilePlane";
import { CameraAnimation } from "./components/CameraAnimation";
import { CameraTracker } from "./components/CameraTracker";
import { PlaneIndicator } from "./components/PlaneIndicator";
import { UIControls } from "./components/UIControls";
import "./App.css";

/**
 * Main Application Component
 *
 * This application demonstrates orthographic projection through an interactive
 * unfolding simulation. It supports both First-Angle and Third-Angle projection
 * systems, showing how planes unfold to reveal the standard 2D layouts.
 */
function App() {
	return (
		<div style={{ width: "100vw", height: "100vh", position: "relative" }}>
			{/* UI Controls Panel */}
			<UIControls />

			{/* 3D Canvas */}
			<Canvas
				camera={{
					position: [-8, 6, 8],
					fov: 50,
				}}
				gl={{ antialias: true }}>
				{/* Lighting */}
				<ambientLight intensity={0.6} />
				<directionalLight
					position={[10, 10, 5]}
					intensity={0.8}
				/>
				<directionalLight
					position={[-10, -10, -5]}
					intensity={0.3}
				/>

				{/* 3D Object */}
				<Object3D />

				{/* Vertical Plane (VP) - Front View */}
				<VerticalPlane />

				{/* Horizontal Plane (HP) - Top View */}
				<HorizontalPlane />

				{/* Profile Plane (PP) - Right Side View */}
				<ProfilePlane />

				{/* Front View Projection - Fixed on VP */}
				<FrontViewProjection />

				{/* Plane Indicator - Arrow and label pointing to active plane */}
				<PlaneIndicator />

				{/* Camera Animation Controller */}
				<CameraAnimation />

				{/* Camera Position Tracker - Updates debug display in all modes */}
				<CameraTracker />

				{/* Camera Controls */}
				<OrbitControls
					enableDamping
					dampingFactor={0.05}
					minDistance={5}
					maxDistance={30}
				/>
			</Canvas>
		</div>
	);
}

export default App;
