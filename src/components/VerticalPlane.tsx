import { Edges } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "../store/useStore";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

/**
 * Vertical Plane (VP) - The "wall" plane where the Front View is projected.
 * This plane is fixed and does not rotate during the unfolding animation.
 */
export function VerticalPlane() {
	const { highlightedPlane, projectionType } = useStore();
	const topMeshRef = useRef<THREE.Mesh>(null);
	const bottomMeshRef = useRef<THREE.Mesh>(null);
	const isHighlighted = highlightedPlane === "front";

	// Determine which half to highlight based on projection type
	const highlightTop = projectionType === "first-angle";
	const highlightBottom = projectionType === "third-angle";

	// Animate highlight effect
	useFrame(({ clock }) => {
		if (isHighlighted) {
			const pulse = Math.sin(clock.getElapsedTime() * 3) * 0.2 + 0.3;
			if (topMeshRef.current && highlightTop) {
				(
					topMeshRef.current.material as THREE.MeshStandardMaterial
				).opacity = pulse;
			}
			if (bottomMeshRef.current && highlightBottom) {
				(
					bottomMeshRef.current.material as THREE.MeshStandardMaterial
				).opacity = pulse;
			}
		}
	});

	return (
		<>
			{/* Top half of VP */}
			<mesh
				ref={topMeshRef}
				position={[0, 2, 0]}
				rotation={[0, 0, 0]}>
				<planeGeometry args={[4, 4]} />
				<meshStandardMaterial
					color={
						isHighlighted && highlightTop ? "#ffff00" : "#ff6b6b"
					}
					transparent
					opacity={isHighlighted && highlightTop ? 0.5 : 0.25}
					side={THREE.DoubleSide}
				/>
				<Edges
					color={
						isHighlighted && highlightTop ? "#ffaa00" : "#cc0000"
					}
					linewidth={isHighlighted && highlightTop ? 3 : 1.5}
				/>
			</mesh>

			{/* Bottom half of VP */}
			<mesh
				ref={bottomMeshRef}
				position={[0, -2, 0]}
				rotation={[0, 0, 0]}>
				<planeGeometry args={[4, 4]} />
				<meshStandardMaterial
					color={
						isHighlighted && highlightBottom ? "#ffff00" : "#ff6b6b"
					}
					transparent
					opacity={isHighlighted && highlightBottom ? 0.5 : 0.25}
					side={THREE.DoubleSide}
				/>
				<Edges
					color={
						isHighlighted && highlightBottom ? "#ffaa00" : "#cc0000"
					}
					linewidth={isHighlighted && highlightBottom ? 3 : 1.5}
				/>
			</mesh>
		</>
	);
}
