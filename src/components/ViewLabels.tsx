import { Text } from "@react-three/drei";
import { useStore } from "../store/useStore";

/**
 * ViewLabels Component
 * Displays text labels for each view when unfolding animation is complete (100%)
 */
export function ViewLabels() {
	const { unfoldProgress, projectionType } = useStore();

	// Only show labels when unfold is at 100%
	if (unfoldProgress < 1) return null;

	return (
		<group>
			{/* Front View Label */}
			<Text
				position={
					projectionType === "first-angle"
						? [0, 4.5, 0]
						: [0, -4.5, 0]
				}
				fontSize={0.4}
				color="#000000"
				anchorX="center"
				anchorY="middle"
				outlineWidth={0.02}
				outlineColor="#ffffff">
				FRONT VIEW
			</Text>

			{/* Top View Label */}
			<Text
				position={
					projectionType === "first-angle"
						? [0, -4.5, 0]
						: [0, 4.5, 0]
				}
				fontSize={0.4}
				color="#000000"
				anchorX="center"
				anchorY="middle"
				outlineWidth={0.02}
				outlineColor="#ffffff">
				TOP VIEW
			</Text>

			{/* Right Side View Label */}
			<Text
				position={
					projectionType === "first-angle" ? [4, 4.5, 0] : [4, 0.5, 0]
				}
				fontSize={0.4}
				color="#000000"
				anchorX="center"
				anchorY="middle"
				outlineWidth={0.02}
				outlineColor="#ffffff">
				RIGHT SIDE VIEW
			</Text>
		</group>
	);
}
