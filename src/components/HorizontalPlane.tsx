import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useStore } from "../store/useStore";
import { TopViewProjection } from "./TopViewProjection";
import { Edges } from "@react-three/drei";
import * as THREE from "three";

/**
 * Horizontal Plane (HP) - The "floor/ceiling" plane where the Top View is projected.
 *
 * CRITICAL IMPLEMENTATION:
 * This component represents the entire HP as a group that contains both:
 * 1. The visual plane mesh
 * 2. The TopViewProjection (which must NOT be animated separately)
 *
 * Position changes based on projection type:
 * - First Angle: HP is BELOW object (positive Z), unfolds downward
 * - Third Angle: HP is ABOVE object (negative Z), unfolds upward
 *
 * Mathematics:
 * - First Angle: Initial [-π/2, 0, 0] (horizontal below) → Final [0, 0, 0] (vertical)
 * - Third Angle: Initial [π/2, 0, 0] (horizontal above) → Final [0, 0, 0] (vertical)
 */
export function HorizontalPlane() {
	const { unfoldProgress, projectionType } = useStore();
	const groupRef = useRef<THREE.Group>(null);

	// Calculate rotation and position based on unfold progress and projection type
	// First Angle: -π/2 → 0 (unfolds downward)
	// Third Angle: π/2 → 0 (unfolds upward)
	const initialRotation =
		projectionType === "first-angle" ? -Math.PI / 2 : Math.PI / 2;
	const rotationX = initialRotation + unfoldProgress * -initialRotation;

	useFrame(() => {
		if (groupRef.current) {
			groupRef.current.rotation.x = rotationX;
		}
	});

	return (
		<group
			ref={groupRef}
			position={[0, 0, 0]}>
			{/* The HP plane mesh */}
			<mesh position={[0, 0, 0]}>
				<planeGeometry args={[4, 8]} />
				<meshStandardMaterial
					color="#4a9eff"
					transparent
					opacity={0.25}
					side={THREE.DoubleSide}
				/>
				<Edges
					color="#0066cc"
					linewidth={1.5}
				/>
			</mesh>

			{/* Top View Projection - moves with the plane during unfolding */}
			<TopViewProjection />
		</group>
	);
}
