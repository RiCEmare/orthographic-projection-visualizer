import { Edges } from "@react-three/drei";
import * as THREE from "three";

/**
 * Vertical Plane (VP) - The "wall" plane where the Front View is projected.
 * This plane is fixed and does not rotate during the unfolding animation.
 */
export function VerticalPlane() {
	return (
		<>
			<mesh
				position={[0, 0, 0]}
				rotation={[0, 0, 0]}>
				<planeGeometry args={[4, 8]} />
				<meshStandardMaterial
					color="#ff6b6b"
					transparent
					opacity={0.25}
					side={THREE.DoubleSide}
				/>
				<Edges
					color="#cc0000"
					linewidth={1.5}
				/>
			</mesh>
		</>
	);
}
