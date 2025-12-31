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
	const { unfoldProgress, projectionType, highlightedPlane } = useStore();
	const groupRef = useRef<THREE.Group>(null);
	const frontMeshRef = useRef<THREE.Mesh>(null);
	const backMeshRef = useRef<THREE.Mesh>(null);
	const isHighlighted = highlightedPlane === "top";

	// Determine which half to highlight based on projection type
	const highlightFront = projectionType === "first-angle";
	const highlightBack = projectionType === "third-angle";

	// Calculate rotation based on unfold progress
	// Both angles rotate clockwise: -π/2 → 0
	const initialRotation = -Math.PI / 2;
	const rotationX = initialRotation + unfoldProgress * -initialRotation;

	useFrame(({ clock }) => {
		if (groupRef.current) {
			groupRef.current.rotation.x = rotationX;
		}
		if (isHighlighted) {
			const pulse = Math.sin(clock.getElapsedTime() * 3) * 0.2 + 0.3;
			if (frontMeshRef.current && highlightFront) {
				(
					frontMeshRef.current.material as THREE.MeshStandardMaterial
				).opacity = pulse;
			}
			if (backMeshRef.current && highlightBack) {
				(
					backMeshRef.current.material as THREE.MeshStandardMaterial
				).opacity = pulse;
			}
		}
	});

	return (
		<group
			ref={groupRef}
			position={[0, 0, 0]}>
			{/* The HP plane mesh - split into front and back halves */}
			{/* Front half (negative Y in local space, becomes -Z when horizontal) */}
			<mesh
				ref={frontMeshRef}
				position={[0, -2, 0]}>
				<planeGeometry args={[4, 4]} />
				<meshStandardMaterial
					color={
						isHighlighted && highlightFront ? "#ffff00" : "#4a9eff"
					}
					transparent
					opacity={isHighlighted && highlightFront ? 0.5 : 0.25}
					side={THREE.DoubleSide}
				/>
				<Edges
					color={
						isHighlighted && highlightFront ? "#ffaa00" : "#0066cc"
					}
					linewidth={isHighlighted && highlightFront ? 3 : 1.5}
				/>
			</mesh>

			{/* Back half (positive Y in local space, becomes +Z when horizontal) */}
			<mesh
				ref={backMeshRef}
				position={[0, 2, 0]}>
				<planeGeometry args={[4, 4]} />
				<meshStandardMaterial
					color={
						isHighlighted && highlightBack ? "#ffff00" : "#4a9eff"
					}
					transparent
					opacity={isHighlighted && highlightBack ? 0.5 : 0.25}
					side={THREE.DoubleSide}
				/>
				<Edges
					color={
						isHighlighted && highlightBack ? "#ffaa00" : "#0066cc"
					}
					linewidth={isHighlighted && highlightBack ? 3 : 1.5}
				/>
			</mesh>

			{/* Top View Projection - moves with the plane during unfolding */}
			<TopViewProjection />
		</group>
	);
}
