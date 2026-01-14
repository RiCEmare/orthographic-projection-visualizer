import { Canvas } from "@react-three/fiber";
import { OrbitControls, Edges } from "@react-three/drei";
import { Suspense, useState } from "react";
import { STLModel } from "./STLModel";

interface ShapePreviewProps {
	shape: "cube" | "cylinder" | "cone" | "custom";
	customModelPath?: string | null;
	isHovered?: boolean;
}

/**
 * Small 3D preview of shapes for the UI selection menu
 */
export function ShapePreview({
	shape,
	customModelPath,
	isHovered = false,
}: ShapePreviewProps) {
	const [hasError, setHasError] = useState(false);

	if (hasError) {
		return (
			<div className="w-full h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden relative flex items-center justify-center">
				<div className="text-center p-2">
					<div className="text-red-500 text-2xl mb-1">⚠️</div>
					<div className="text-xs text-red-600 font-medium">
						Preview Failed
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden relative">
			<Canvas
				camera={{ position: [2, 2, 2], fov: 50 }}
				gl={{
					antialias: true,
					alpha: false,
					preserveDrawingBuffer: false,
				}}
				dpr={[1, 1.5]}
				onCreated={({ gl }) => {
					gl.domElement.addEventListener("webglcontextlost", (e) => {
						e.preventDefault();
						setHasError(true);
					});
				}}>
				<ambientLight intensity={0.6} />
				<directionalLight
					position={[5, 5, 5]}
					intensity={0.8}
				/>
				<Suspense
					fallback={
						<mesh>
							<boxGeometry args={[0.3, 0.3, 0.3]} />
							<meshStandardMaterial
								color="#cccccc"
								wireframe
							/>
						</mesh>
					}>
					{shape === "cube" && (
						<mesh>
							<boxGeometry args={[1, 1, 1]} />
							<meshStandardMaterial color="#ffdd57" />
							<Edges
								color="#000000"
								linewidth={1}
							/>
						</mesh>
					)}
					{shape === "cylinder" && (
						<mesh>
							<cylinderGeometry args={[0.5, 0.5, 1, 32]} />
							<meshStandardMaterial color="#ffdd57" />
							<Edges
								color="#000000"
								linewidth={1}
								threshold={15}
							/>
						</mesh>
					)}
					{shape === "cone" && (
						<mesh>
							<coneGeometry args={[0.5, 1, 32]} />
							<meshStandardMaterial color="#ffdd57" />
							<Edges
								color="#000000"
								linewidth={1}
								threshold={15}
							/>
						</mesh>
					)}
					{shape === "custom" && customModelPath && (
						<STLModel
							url={customModelPath}
							onError={() => setHasError(true)}
						/>
					)}
				</Suspense>
				<OrbitControls
					enableZoom={false}
					enablePan={false}
					enableRotate={false}
					autoRotate={isHovered}
					autoRotateSpeed={4}
					makeDefault
				/>
			</Canvas>
		</div>
	);
}
