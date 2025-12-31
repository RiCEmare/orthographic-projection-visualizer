import { useThree, useFrame } from "@react-three/fiber";
import { useStore } from "../store/useStore";

/**
 * Continuously tracks and updates camera position and rotation in store
 * for debugging purposes in all modes (free view and animation)
 */
export function CameraTracker() {
	const { camera } = useThree();
	const { setCameraPosition, setCameraRotation } = useStore();

	useFrame(() => {
		setCameraPosition({
			x: Math.round(camera.position.x * 100) / 100,
			y: Math.round(camera.position.y * 100) / 100,
			z: Math.round(camera.position.z * 100) / 100,
		});

		// Convert rotation from radians to degrees.
		// We use the camera's actual rotation to verify the animation fix.
		setCameraRotation({
			x: Math.round(((camera.rotation.x * 180) / Math.PI) * 100) / 100,
			y: Math.round(((camera.rotation.y * 180) / Math.PI) * 100) / 100,
			z: Math.round(((camera.rotation.z * 180) / Math.PI) * 100) / 100,
			order: camera.rotation.order,
		});
	});

	return null;
}
