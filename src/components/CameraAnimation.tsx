import { useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useStore } from "../store/useStore";
import * as THREE from "three";

/**
 * Camera Animation Controller
 *
 * This component handles the sequential camera movements that demonstrate
 * how each orthographic projection is created:
 *
 * 1. Front View: Camera moves to front of object, shows projection on VP
 * 2. Top View: Camera moves to top of object, shows projection on HP
 * 3. Side View: Camera moves to side of object, shows projection on PP
 *
 * Each step:
 * - Moves camera to viewing position
 * - Shows the projection being created
 * - Returns camera to starting position
 */
export function CameraAnimation() {
	const { camera } = useThree();
	const {
		projectionAnimationStep,
		setProjectionAnimationStep,
		projectionType,
		setShowFrontView,
		setShowTopView,
		setShowSideView,
		setShowLeftSideView,
		flowPhase,
		setFlowPhase,
		setUnfoldProgress,
	} = useStore();

	const startPosition = useRef(new THREE.Vector3(-8, 6, 8));
	const startLookAt = useRef(new THREE.Vector3(0, 0, 0));
	const startUp = useRef(new THREE.Vector3(0, 1, 0));
	const targetPosition = useRef(new THREE.Vector3());
	const targetLookAt = useRef(new THREE.Vector3());
	const targetUp = useRef(new THREE.Vector3());
	const animationProgress = useRef(0);
	const isReturning = useRef(false);
	const stepDuration = 3; // seconds for each camera movement
	const unfoldTimer = useRef(0);
	const unfoldActive = useRef(false);
	const unfoldDuration = 3; // seconds to fully unfold

	useFrame((_, delta) => {
		const isUnfoldFlow = flowPhase === "unfolding";
		if (flowPhase === "setup" && unfoldActive.current) {
			unfoldActive.current = false;
			unfoldTimer.current = 0;
		}
		// Removed automatic unfold animation - user controls unfold with slider/animate button
		// if (unfoldActive.current) {
		// 	unfoldTimer.current += delta;
		// 	const progress = Math.min(unfoldTimer.current / unfoldDuration, 1);
		// 	setUnfoldProgress(progress);
		// 	if (progress >= 1) {
		// 		unfoldActive.current = false;
		// 		setFlowPhase("complete");
		// 	}
		// }

		const isCameraLockedForUnfold =
			flowPhase === "unfolding" &&
			unfoldActive.current &&
			projectionAnimationStep === "idle";
		if (isCameraLockedForUnfold) return;

		const activeStep = isUnfoldFlow ? "front" : projectionAnimationStep;

		if (activeStep === "idle") return;

		// Define target positions and up vectors based on animation step
		let target: THREE.Vector3;
		let lookAtTarget: THREE.Vector3;
		let upVector: THREE.Vector3;
		const objectPos =
			projectionType === "first-angle"
				? new THREE.Vector3(0, 2, 2)
				: new THREE.Vector3(0, -2, -2);

		switch (activeStep) {
			case "front":
				// Camera in front of object, looking at object with VP behind
				target = new THREE.Vector3(
					objectPos.x,
					objectPos.y,
					objectPos.z + 8
				);
				lookAtTarget = objectPos.clone();
				upVector = new THREE.Vector3(0, 1, 0); // Standard up vector
				break;
			case "top":
				// Camera above object, looking down at object with HP beneath
				// For top view, use -Z as up vector to avoid singularity when looking down Y-axis
				// This ensures the camera orientation is stable with Z rotation = 0
				target = new THREE.Vector3(
					objectPos.x,
					objectPos.y + 8,
					objectPos.z
				);
				lookAtTarget = objectPos.clone();
				upVector = new THREE.Vector3(0, 0, -1); // -Z up makes X axis point right
				break;
			case "side":
				// Camera to the side of object, looking at object with PP behind
				target = new THREE.Vector3(
					objectPos.x - 8,
					objectPos.y,
					objectPos.z
				);
				lookAtTarget = objectPos.clone();
				upVector = new THREE.Vector3(0, 1, 0); // Standard up vector
				break;
			case "leftSide":
				// Camera to the left side of object, looking at object with left PP behind
				target = new THREE.Vector3(
					objectPos.x + 8,
					objectPos.y,
					objectPos.z
				);
				lookAtTarget = objectPos.clone();
				upVector = new THREE.Vector3(0, 1, 0); // Standard up vector
				break;
			case "leftSide":
				// Camera to the left side of object, looking at object with left PP behind
				target = new THREE.Vector3(
					objectPos.x + 8,
					objectPos.y,
					objectPos.z
				);
				lookAtTarget = objectPos.clone();
				upVector = new THREE.Vector3(0, 1, 0); // Standard up vector
				break;
			default:
				return;
		}

		targetPosition.current.copy(target);
		targetLookAt.current.copy(lookAtTarget);
		targetUp.current.copy(upVector);

		// Animate camera movement
		animationProgress.current += delta / stepDuration;

		if (animationProgress.current >= 1) {
			if (!isReturning.current) {
				// Reached target position - set exact position and show projection
				camera.position.copy(targetPosition.current);
				camera.up.copy(targetUp.current);
				camera.rotation.order = "XYZ";
				camera.lookAt(targetLookAt.current);

				// Show the corresponding projection
				if (activeStep === "front") {
					setShowFrontView(true);
				} else if (activeStep === "top") {
					setShowTopView(true);
				} else if (activeStep === "side") {
					setShowSideView(true);
				} else if (activeStep === "leftSide") {
					setShowLeftSideView(true);
				}

				// If we are unfolding, stay put and drive plane animation
				if (isUnfoldFlow) {
					setProjectionAnimationStep("idle");
					unfoldTimer.current = 0;
					unfoldActive.current = true;
					setUnfoldProgress(0);
					return;
				}

				// Start returning to start position for regular view focus
				isReturning.current = true;
				animationProgress.current = 0;
			} else {
				// Returned to start position - finish task
				camera.position.copy(startPosition.current);
				camera.up.copy(startUp.current);
				camera.rotation.order = "XYZ";
				camera.lookAt(startLookAt.current);
				isReturning.current = false;
				animationProgress.current = 0;
				setProjectionAnimationStep("idle");
			}
		} else {
			// Smooth interpolation with easing
			const t = easeInOutCubic(animationProgress.current);

			// Temporary vectors for smooth lookAt and up interpolation
			const currentLookAt = new THREE.Vector3();
			const currentUp = new THREE.Vector3();

			if (!isReturning.current) {
				// Move from start to target
				camera.position.lerpVectors(
					startPosition.current,
					targetPosition.current,
					t
				);

				// Smoothly interpolate the up vector to avoid sudden orientation changes
				currentUp.lerpVectors(startUp.current, targetUp.current, t);
				camera.up.copy(currentUp);

				// All views: smoothly interpolate lookAt
				camera.rotation.order = "XYZ";
				currentLookAt.lerpVectors(
					startLookAt.current,
					targetLookAt.current,
					t
				);
				camera.lookAt(currentLookAt);
			} else {
				// Return from target to start
				camera.position.lerpVectors(
					targetPosition.current,
					startPosition.current,
					t
				);

				// Smoothly interpolate the up vector back to start
				currentUp.lerpVectors(targetUp.current, startUp.current, t);
				camera.up.copy(currentUp);

				camera.rotation.order = "XYZ";
				currentLookAt.lerpVectors(
					targetLookAt.current,
					startLookAt.current,
					t
				);
				camera.lookAt(currentLookAt);
			}
		}
	});

	return null;
}

// Easing function for smooth animation
function easeInOutCubic(t: number): number {
	return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
