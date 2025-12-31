import { useStore } from "../store/useStore";
import { Edges } from "@react-three/drei";

/**
 * Main 3D object that students will project onto planes.
 * Position changes based on projection type:
 * - First-angle: Object in first quadrant (positive x, y, z)
 * - Third-angle: Object in third quadrant (negative x, y, z)
 */
export function Object3D() {
	const { objectShape, projectionType, showObject } = useStore();

	if (!showObject) return null;

	// Position based on projection type
	// First-angle: [0, 2, 2] - projections centered on each plane face
	// Third-angle: [0, -2, -2] - projections centered on each plane face
	// x=0 centers on VP and HP, y=z ensures equal distance from all planes
	const position: [number, number, number] =
		projectionType === "first-angle" ? [0, 2, 2] : [0, -2, -2];

	return (
		<group position={position}>
			{objectShape === "cube" && (
				<mesh>
					<boxGeometry args={[1.5, 1.5, 1.5]} />
					<meshStandardMaterial
						color="#ffdd57"
						transparent
						opacity={0.8}
					/>
					<Edges
						color="#000000"
						linewidth={1.5}
					/>
				</mesh>
			)}

			{objectShape === "cylinder" && (
				<mesh>
					<cylinderGeometry args={[0.75, 0.75, 1.5, 32]} />
					<meshStandardMaterial
						color="#ffdd57"
						transparent
						opacity={0.8}
					/>
					<Edges
						color="#000000"
						linewidth={1.5}
						threshold={15}
					/>
				</mesh>
			)}

			{objectShape === "cone" && (
				<mesh>
					<coneGeometry args={[0.75, 1.5, 32]} />
					<meshStandardMaterial
						color="#ffdd57"
						transparent
						opacity={0.8}
					/>
					<Edges
						color="#000000"
						linewidth={1.5}
						threshold={15}
					/>
				</mesh>
			)}

			{objectShape === "complex" && (
				<>
					{/* Base cube */}
					<mesh position={[0, -0.5, 0]}>
						<boxGeometry args={[1.5, 0.8, 1.5]} />
						<meshStandardMaterial
							color="#ffdd57"
							transparent
							opacity={0.8}
						/>
						<Edges
							color="#000000"
							linewidth={1.5}
						/>
					</mesh>
					{/* Top cylinder */}
					<mesh position={[0, 0.5, 0]}>
						<cylinderGeometry args={[0.5, 0.5, 1, 32]} />
						<meshStandardMaterial
							color="#ffdd57"
							transparent
							opacity={0.8}
						/>
						<Edges
							color="#000000"
							linewidth={1.5}
							threshold={15}
						/>
					</mesh>
				</>
			)}
		</group>
	);
}
