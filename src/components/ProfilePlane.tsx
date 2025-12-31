import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useStore } from "../store/useStore";
import { RightSideViewProjection } from "./RightSideViewProjection";
import { Edges } from "@react-three/drei";
import * as THREE from "three";

/**
 * Profile Plane (PP) - The side plane where the Right Side View is projected.
 *
 * CRITICAL IMPLEMENTATION:
 * This component represents the entire PP as a group that contains both:
 * 1. The visual plane mesh
 * 2. The RightSideViewProjection (which must NOT be animated separately)
 *
 * Position changes based on projection type:
 * - First Angle: PP is on the LEFT side (x = -2.5), rotates around Y-axis
 * - Third Angle: PP is on the RIGHT side (x = 2.5), rotates around Y-axis
 *
 * During unfolding, the entire group rotates around the Y-axis by ±90°,
 * demonstrating how the Right Side View moves to align with the other views.
 *
 * Mathematics:
 * - First Angle Initial: rotation [0, π/2, 0] (plane faces right)
 * - First Angle Final: rotation [0, 0, 0] (plane faces front, aligned with VP)
 * - Third Angle Initial: rotation [0, -π/2, 0] (plane faces left)
 * - Third Angle Final: rotation [0, 0, 0] (plane faces front, aligned with VP)
 */
export function ProfilePlane() {
	const { unfoldProgress, projectionType } = useStore();
	const groupRef = useRef<THREE.Group>(null);

	// Profile Plane is fixed at x = 2 (right side)
	const xPosition = 2;

	// Y and Z positions based on projection type
	// First-angle: upper right quadrant (y=2, z=2)
	// Third-angle: lower left quadrant (y=-2, z=-2)
	const yPosition = projectionType === "first-angle" ? 2 : -2;
	const zPosition = projectionType === "first-angle" ? 2 : -2;

	// Calculate rotation based on unfold progress and projection type
	// First Angle: π/2 → 0 (rotating from right-facing to front-facing)
	// Third Angle: -π/2 → 0 (rotating from left-facing to front-facing)
	const initialRotation =
		projectionType === "first-angle" ? Math.PI / 2 : -Math.PI / 2;
	const rotationY = initialRotation - unfoldProgress * initialRotation;

	useFrame(() => {
		if (groupRef.current) {
			groupRef.current.rotation.y = rotationY;
		}
	});

	return (
		<group
			ref={groupRef}
			position={[xPosition, yPosition, zPosition]}>
			{/* The PP plane mesh - upper right for first-angle, lower left for third-angle */}
			<mesh position={[0, 0, 0]}>
				<planeGeometry args={[4, 4]} />
				<meshStandardMaterial
					color="#90ee90"
					transparent
					opacity={0.25}
					side={THREE.DoubleSide}
				/>
				<Edges
					color="#00cc00"
					linewidth={1.5}
				/>
			</mesh>

			{/* Right Side View Projection - moves with the plane during unfolding */}
			<RightSideViewProjection />
		</group>
	);
}
