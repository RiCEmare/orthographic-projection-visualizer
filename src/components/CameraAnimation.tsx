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
		setCameraAnimationProgress,
	} = useStore();

	const startPosition = useRef(new THREE.Vector3(-8, 6, 8));
	const startLookAt = useRef(new THREE.Vector3(0, 0, 0));
	const startUp = useRef(new THREE.Vector3(0, 1, 0));
	const targetPosition = useRef(new THREE.Vector3());
	const targetLookAt = useRef(new THREE.Vector3());
	const targetUp = useRef(new THREE.Vector3());
	const animationProgress = useRef(0);
	const isReturning = useRef(false);
	const lastProgressUpdate = useRef(0);
	const stepDuration = 3; // seconds for each camera movement
	const pauseDuration = 1; // seconds to pause at target position (increased by 1 second)
	const pauseTimer = useRef(0);
	const isPaused = useRef(false);
	const unfoldTimer = useRef(0);
	const unfoldActive = useRef(false);
	const unfoldCompleteTriggered = useRef(false);
	const hasResetCamera = useRef(false);

	useFrame((_, delta) => {
		const isUnfoldFlow = flowPhase === "unfolding";
		const { unfoldProgress } = useStore.getState();

		// Reset camera and animation state only ONCE when returning to setup phase
		if (
			flowPhase === "setup" &&
			projectionAnimationStep === "idle" &&
			!hasResetCamera.current
		) {
			// Reset camera to initial position
			camera.position.set(-8, 6, 8);
			camera.up.set(0, 1, 0);
			camera.rotation.order = "XYZ";
			camera.lookAt(0, 0, 0);

			// Reset all animation refs
			animationProgress.current = 0;
			isReturning.current = false;
			pauseTimer.current = 0;
			isPaused.current = false;
			unfoldTimer.current = 0;
			unfoldActive.current = false;
			unfoldCompleteTriggered.current = false;
			hasResetCamera.current = true;
			lastProgressUpdate.current = 0;
			setCameraAnimationProgress(0);
		}

		// Clear the reset flag when leaving setup phase
		if (flowPhase !== "setup") {
			hasResetCamera.current = false;
		}

		// Trigger camera movement when unfold reaches 100%
		if (
			isUnfoldFlow &&
			unfoldProgress >= 1 &&
			!unfoldCompleteTriggered.current &&
			projectionAnimationStep === "idle"
		) {
			unfoldCompleteTriggered.current = true;
			setProjectionAnimationStep("frontViewFlat");
		}

		// Reset trigger when leaving unfold phase
		if (!isUnfoldFlow && unfoldCompleteTriggered.current) {
			unfoldCompleteTriggered.current = false;
		}
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

		const activeStep = projectionAnimationStep;

		if (activeStep === "idle") {
			if (lastProgressUpdate.current !== 0) {
				lastProgressUpdate.current = 0;
				setCameraAnimationProgress(0);
			}
			return;
		}

		// Special handling for frontViewFlat - move to front view with y=0 after unfold completes
		if (activeStep === "frontViewFlat") {
			animationProgress.current += delta / stepDuration;
			const t = easeInOutCubic(Math.min(animationProgress.current, 1));

			const frontViewFlatPosition = new THREE.Vector3(0, 0, 14);
			const frontViewFlatLookAt = new THREE.Vector3(0, 0, 0);
			const frontViewFlatUp = new THREE.Vector3(0, 1, 0);

			if (animationProgress.current >= 1) {
				// Reached front view flat position
				camera.position.copy(frontViewFlatPosition);
				camera.up.copy(frontViewFlatUp);
				camera.rotation.order = "XYZ";
				camera.lookAt(frontViewFlatLookAt);
				animationProgress.current = 0;
				setProjectionAnimationStep("idle");
				setFlowPhase("complete");
			} else {
				// Animate from current position to front view flat
				const currentLookAt = new THREE.Vector3();
				const currentUp = new THREE.Vector3();

				camera.position.lerpVectors(
					camera.position.clone(),
					frontViewFlatPosition,
					t
				);
				currentUp.lerpVectors(camera.up, frontViewFlatUp, t);
				camera.up.copy(currentUp);
				camera.rotation.order = "XYZ";

				const currentDirection = new THREE.Vector3();
				camera.getWorldDirection(currentDirection);
				const currentTarget = camera.position
					.clone()
					.add(currentDirection);
				currentLookAt.lerpVectors(
					currentTarget,
					frontViewFlatLookAt,
					t
				);
				camera.lookAt(currentLookAt);
			}
			return;
		}

		// Special handling for returnToStart - just animate back to initial position
		if (activeStep === "returnToStart") {
			animationProgress.current += delta / stepDuration;
			const t = easeInOutCubic(Math.min(animationProgress.current, 1));

			if (animationProgress.current >= 1) {
				// Reached start position
				camera.position.copy(startPosition.current);
				camera.up.copy(startUp.current);
				camera.rotation.order = "XYZ";
				camera.lookAt(startLookAt.current);
				animationProgress.current = 0;
				setProjectionAnimationStep("idle");
			} else {
				// Animate from current position to start
				const currentLookAt = new THREE.Vector3();
				const currentUp = new THREE.Vector3();

				camera.position.lerp(startPosition.current, t * 0.1);
				currentUp.lerpVectors(camera.up, startUp.current, t);
				camera.up.copy(currentUp);
				camera.rotation.order = "XYZ";

				// Get current lookAt by using camera's direction
				const currentDirection = new THREE.Vector3();
				camera.getWorldDirection(currentDirection);
				const currentTarget = camera.position
					.clone()
					.add(currentDirection);
				currentLookAt.lerpVectors(
					currentTarget,
					startLookAt.current,
					t
				);
				camera.lookAt(currentLookAt);
			}
			return;
		}

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
			default:
				return;
		}

		targetPosition.current.copy(target);
		targetLookAt.current.copy(lookAtTarget);
		targetUp.current.copy(upVector);

		// Animate camera movement
		if (!isPaused.current) {
			animationProgress.current += delta / stepDuration;
		}

		// Update camera animation progress for fade effects (throttled to avoid infinite updates)
		if (!isPaused.current) {
			const newProgress = isReturning.current
				? 1 - animationProgress.current
				: animationProgress.current;
			// Only update if progress changed significantly (more than 0.01)
			if (Math.abs(newProgress - lastProgressUpdate.current) > 0.01) {
				lastProgressUpdate.current = newProgress;
				setCameraAnimationProgress(newProgress);
			}
		} else {
			// Paused at target position
			if (lastProgressUpdate.current !== 1) {
				lastProgressUpdate.current = 1;
				setCameraAnimationProgress(1);
			}
		}

		if (animationProgress.current >= 1) {
			if (!isReturning.current && !isPaused.current) {
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

				// Start pause at target position
				isPaused.current = true;
				pauseTimer.current = 0;
			} else if (isPaused.current) {
				// During pause, maintain camera at target position
				pauseTimer.current += delta;
				camera.position.copy(targetPosition.current);
				camera.up.copy(targetUp.current);
				camera.rotation.order = "XYZ";
				camera.lookAt(targetLookAt.current);

				if (pauseTimer.current >= pauseDuration) {
					// Pause complete - start returning to start position
					isPaused.current = false;
					pauseTimer.current = 0;
					isReturning.current = true;
					animationProgress.current = 0;
				}
			} else {
				// Returned to start position - finish task
				camera.position.copy(startPosition.current);
				camera.up.copy(startUp.current);
				camera.rotation.order = "XYZ";
				camera.lookAt(startLookAt.current);
				isReturning.current = false;
				animationProgress.current = 0;
				lastProgressUpdate.current = 0;
				setCameraAnimationProgress(0);
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
