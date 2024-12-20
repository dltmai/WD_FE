import * as THREE from "three";
import Experience from "./Experience.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default class Camera {
  constructor(_options) {
    // Options
    this.experience = new Experience();
    this.config = this.experience.config;
    this.debug = this.experience.debug;
    this.time = this.experience.time;
    this.sizes = this.experience.sizes;
    this.targetElement = this.experience.targetElement;
    this.scene = this.experience.scene;

    // Set up
    this.mode = "default"; // defaultCamera \ debugCamera

    this.setInstance();
    this.setModes();
  }

  setInstance() {
    // Set up
    this.instance = new THREE.PerspectiveCamera(
      25,
      this.config.width / this.config.height,
      0.1,
      150
    );
    this.instance.rotation.reorder("YXZ");
    console.log("Vị trí camera mặc định:", this.instance.position);
    this.scene.add(this.instance);
  }

  setModes() {
    this.modes = {};

    // Default
    this.modes.default = {};
    this.modes.default.instance = this.instance.clone();
    this.modes.default.instance.rotation.reorder("YXZ");

    // Debug
    this.modes.debug = {};
    this.modes.debug.instance = this.instance.clone();
    this.modes.debug.instance.rotation.reorder("YXZ");
    this.modes.debug.instance.position.set(-15, 15, 15);

    // Thêm camera PCScreen
    this.modes.pcscreen = {};
    this.modes.pcscreen.instance = this.instance.clone();
    this.modes.pcscreen.instance.rotation.reorder("YXZ");
    this.modes.pcscreen.instance.position.set(0.3, 3.7, 0.3); // Giảm z từ 0.5 xuống 0.3
    this.modes.pcscreen.instance.lookAt(0.3, 3.676, 0); // Giữ nguyên điểm nhìn

    this.modes.debug.orbitControls = new OrbitControls(
      this.modes.debug.instance,
      this.targetElement
    );
    this.modes.debug.orbitControls.enabled = this.modes.debug.active;
    this.modes.debug.orbitControls.screenSpacePanning = true;
    this.modes.debug.orbitControls.enableKeys = false;
    this.modes.debug.orbitControls.zoomSpeed = 0.25;
    this.modes.debug.orbitControls.enableDamping = true;
    this.modes.debug.orbitControls.update();
  }

  resize() {
    this.instance.aspect = this.config.width / this.config.height;
    this.instance.updateProjectionMatrix();

    this.modes.default.instance.aspect = this.config.width / this.config.height;
    this.modes.default.instance.updateProjectionMatrix();

    this.modes.debug.instance.aspect = this.config.width / this.config.height;
    this.modes.debug.instance.updateProjectionMatrix();

    this.modes.pcscreen.instance.aspect =
      this.config.width / this.config.height;
    this.modes.pcscreen.instance.updateProjectionMatrix();
  }

  update() {
    // Update debug orbit controls
    this.modes.debug.orbitControls.update();

    // Apply coordinates
    this.instance.position.copy(this.modes[this.mode].instance.position);
    this.instance.quaternion.copy(this.modes[this.mode].instance.quaternion);
    this.instance.updateMatrixWorld(); // To be used in projection
  }

  destroy() {
    this.modes.debug.orbitControls.destroy();
  }
}
