import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { Edges } from "@react-three/drei";
import * as THREE from "three";

interface STLModelProps {
	url: string;
	onError?: () => void;
}

/**
 * Component to load and display an STL model
 * Note: This component must be wrapped in a Suspense boundary
 */
export function STLModel({ url }: STLModelProps) {
	const geometry = useLoader(STLLoader, url);

	// Center the geometry
	geometry.computeBoundingBox();
	const boundingBox = geometry.boundingBox;
	if (boundingBox) {
		const center = new THREE.Vector3();
		boundingBox.getCenter(center);
		geometry.translate(-center.x, -center.y, -center.z);
	}

	// Normalize size to fit within a reasonable scale
	geometry.computeBoundingSphere();
	const scale = geometry.boundingSphere
		? 2.5 / (geometry.boundingSphere.radius * 2)
		: 1;

	return (
		<mesh
			geometry={geometry}
			scale={[scale, scale, scale]}>
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
	);
}
