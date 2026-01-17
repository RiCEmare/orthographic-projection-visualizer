import { Text } from "@react-three/drei";
import { useStore } from "../store/useStore";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

/**
 * PlaneIndicator - Shows an arrow and label pointing to the active plane
 * during the drawing sequence
 */
export function PlaneIndicator() {
	const { highlightedPlane, projectionType, workflowStep } = useStore();
	const arrowRef = useRef<THREE.Group>(null);

	// Animate floating/bobbing effect
	useFrame(({ clock }) => {
		if (
			arrowRef.current &&
			workflowStep === "drawing" &&
			highlightedPlane
		) {
			const offset = Math.sin(clock.getElapsedTime() * 2) * 0.1;
			arrowRef.current.position.y += offset * 0.01;
		}
	});

	// Only show during drawing workflow step
	if (workflowStep !== "drawing" || !highlightedPlane) {
		return null;
	}

	// Determine position, rotation, and label based on highlighted plane
	let position: [number, number, number];
	let arrowRotation: [number, number, number];
	let textPosition: [number, number, number];
	let textRotation: [number, number, number];
	let planeLabel: string;

	switch (highlightedPlane) {
		case "front":
			// Arrow on opposite side of VP (left side, pointing right toward plane)
			if (projectionType === "first-angle") {
				position = [-4, 2, 0];
				arrowRotation = [0, 0, Math.PI / 2];
				textPosition = [-4, 3, 0];
				textRotation = [0, 0, 0];
			} else {
				position = [-4, -2, 0];
				arrowRotation = [0, 0, Math.PI / 2];
				textPosition = [-4, -3, 0];
				textRotation = [0, 0, 0];
			}
			planeLabel = "Front View\non Vertical\nPlane (VP)";
			break;
		case "top":
			// Arrow on left side of HP
			if (projectionType === "first-angle") {
				// Point up toward the plane
				position = [-4, 0, 2];
				arrowRotation = [0, 0, Math.PI / 2];
				textPosition = [-4, 0, 3];
				textRotation = [-1.6, 0, 0];
			} else {
				// Point down toward the plane
				position = [-4, 0, -2];
				arrowRotation = [0, 0, Math.PI / 2];
				textPosition = [-4, 0, -3];
				textRotation = [-1.6, 0, 0];
			}
			planeLabel = "Top View\non Horizontal\nPlane (HP)";
			break;
		case "side":
			// Arrow on right side of profile plane (pointing backward toward z=0)
			if (projectionType === "first-angle") {
				position = [2, 2, 6];
				arrowRotation = [Math.PI / 2, 0, 0];
				textPosition = [2, 3, 6];
				textRotation = [0, -1.6, 0];
			} else {
				position = [2, -2, -6];
				arrowRotation = [-Math.PI / 2, 0, 0];
				textPosition = [2, -3, -6];
				textRotation = [0, 1.6, 0];
			}
			planeLabel = "RHS View\non Right Profile\nPlane (PP)";
			break;
		case "leftSide":
			// Arrow on left side of profile plane (pointing backward toward z=0)
			if (projectionType === "first-angle") {
				position = [-2, 2, 6];
				arrowRotation = [Math.PI / 2, 0, 0];
				textPosition = [-2, 3, 6];
				textRotation = [0, 1.6, 0];
			} else {
				position = [-2, -2, -6];
				arrowRotation = [-Math.PI / 2, 0, 0];
				textPosition = [-2, -3, -5.5];
				textRotation = [0, -1.6, 0];
			}
			planeLabel = "LHS View\non Left Profile\nPlane (PP)";
			break;
		default:
			return null;
	}

	return (
		<group ref={arrowRef}>
			{/* Arrow */}
			<group
				position={position}
				rotation={arrowRotation}>
				{/* Arrow shaft */}
				<mesh position={[0, -0.5, 0]}>
					<cylinderGeometry args={[0.05, 0.05, 1, 8]} />
					<meshStandardMaterial color="#ff6b00" />
				</mesh>
				{/* Arrow head */}
				<mesh
					position={[0, -1, 0]}
					rotation={[Math.PI, 0, 0]}>
					<coneGeometry args={[0.15, 0.3, 8]} />
					<meshStandardMaterial color="#ff6b00" />
				</mesh>
			</group>

			{/* Text label */}
			<Text
				position={textPosition}
				rotation={textRotation}
				fontSize={0.3}
				color="#ff6b00"
				anchorX="center"
				anchorY="middle"
				outlineWidth={0.02}
				outlineColor="#ffffff">
				{planeLabel}
			</Text>
		</group>
	);
}
