import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Object3D } from "./components/Object3D";
import { FrontViewProjection } from "./components/FrontViewProjection";
import { VerticalPlane } from "./components/VerticalPlane";
import { HorizontalPlane } from "./components/HorizontalPlane";
import { RightProfilePlane } from "./components/RightProfilePlane";
import { LeftProfilePlane } from "./components/LeftProfilePlane";
import { CameraAnimation } from "./components/CameraAnimation";
import { CameraTracker } from "./components/CameraTracker";
import { PlaneIndicator } from "./components/PlaneIndicator";
import { ViewLabels } from "./components/ViewLabels";
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

				{/* Right Profile Plane (PP) - Right Side View */}
				<RightProfilePlane />

				{/* Left Profile Plane (PP) - Left Side View */}
				<LeftProfilePlane />

				{/* Front View Projection - Fixed on VP */}
				<FrontViewProjection />

				{/* Plane Indicator - Arrow and label pointing to active plane */}
				<PlaneIndicator />

				{/* View Labels - Shown at 100% unfold */}
				<ViewLabels />

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
