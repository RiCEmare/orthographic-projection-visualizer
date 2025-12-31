import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useStore } from "../store/useStore";
import { LeftSideViewProjection } from "./LeftSideViewProjection";
import { Edges } from "@react-three/drei";
import * as THREE from "three";

/**
 * Left Profile Plane (PP) - The side plane where the Left Side View is projected.
 *
 * CRITICAL IMPLEMENTATION:
 * This component represents the entire PP as a group that contains both:
 * 1. The visual plane mesh
 * 2. The LeftSideViewProjection (which must NOT be animated separately)
 *
 * Position changes based on projection type:
 * - First Angle: PP is on the RIGHT side (x = 2.5), rotates around Y-axis
 * - Third Angle: PP is on the LEFT side (x = -2.5), rotates around Y-axis
 *
 * During unfolding, the entire group rotates around the Y-axis by ±90°,
 * demonstrating how the Left Side View moves to align with the other views.
 *
 * Mathematics:
 * - First Angle Initial: rotation [0, -π/2, 0] (plane faces left)
 * - First Angle Final: rotation [0, 0, 0] (plane faces front, aligned with VP)
 * - Third Angle Initial: rotation [0, π/2, 0] (plane faces right)
 * - Third Angle Final: rotation [0, 0, 0] (plane faces front, aligned with VP)
 */
export function LeftProfilePlane() {
	const { unfoldProgress, projectionType, highlightedPlane } = useStore();
	const pivotGroupRef = useRef<THREE.Group>(null);
	const planeGroupRef = useRef<THREE.Group>(null);
	const meshRef = useRef<THREE.Mesh>(null);
	const isHighlighted = highlightedPlane === "leftSide";

	// Left Profile Plane position
	const xPosition = -2;
	const yPosition = projectionType === "first-angle" ? 2 : -2;
	const zPosition = 0;

	// Calculate rotation based on unfold progress and projection type
	const initialRotation =
		projectionType === "first-angle" ? Math.PI / 2 : -Math.PI / 2;
	const rotationY = initialRotation - unfoldProgress * initialRotation;

	useFrame(({ clock }) => {
		if (pivotGroupRef.current) {
			pivotGroupRef.current.rotation.y = rotationY;
		}
		if (meshRef.current && isHighlighted) {
			const pulse = Math.sin(clock.getElapsedTime() * 3) * 0.2 + 0.3;
			(meshRef.current.material as THREE.MeshStandardMaterial).opacity =
				pulse;
		}
	});

	return (
		// Pivot group at x=-2 (the rotation axis/hinge)
		<group
			ref={pivotGroupRef}
			position={[-2, yPosition, zPosition]}>
			{/* Plane group offset to x=-2 so it appears at correct position */}
			<group
				ref={planeGroupRef}
				position={[xPosition, 0, 0]}>
				<mesh
					ref={meshRef}
					position={[0, 0, 0]}>
					<planeGeometry args={[4, 4]} />
					<meshStandardMaterial
						color={isHighlighted ? "#ffff00" : "#90ee90"}
						transparent
						opacity={isHighlighted ? 0.5 : 0.25}
						side={THREE.DoubleSide}
					/>
					<Edges
						color={isHighlighted ? "#ffaa00" : "#00cc00"}
						linewidth={isHighlighted ? 3 : 1.5}
					/>
				</mesh>

				{/* Left Side View Projection - moves with the plane during unfolding */}
				<LeftSideViewProjection />
			</group>
		</group>
	);
}
