import Experience from "./Experience.js";
import * as THREE from "three";

export default class Navigation {
  constructor() {
    this.experience = new Experience();
    this.camera = this.experience.camera;
    this.config = this.experience.config;
    this.time = this.experience.time;
    console.log(this.camera);

    this.setView();
  }

  setView() {
    this.view = {};
    this.view.spherical = {};
    this.view.spherical.value = new THREE.Spherical(
      30,
      Math.PI * 0.35,
      -Math.PI * 0.25
    );
    this.view.spherical.smoothed = this.view.spherical.value.clone();
    this.view.spherical.smoothing = 0.005;

    this.view.target = new THREE.Vector3(0, 2, 0);

    this.view.drag = {};

    this.view.drag.delta = {};
    this.view.drag.delta.x = 0;
    this.view.drag.delta.y = 0;

    this.view.drag.previous = {};
    this.view.drag.previous.x = 0;
    this.view.drag.previous.y = 0;

    this.view.drag.sensitivity = 1;

    this.view.down = (_x, _y) => {
      this.view.drag.previous.x = _x;
      this.view.drag.previous.y = _y;
    };

    this.view.move = (_x, _y) => {
      this.view.drag.delta.x += _x - this.view.drag.previous.x;
      this.view.drag.delta.y += _y - this.view.drag.previous.y;

      this.view.drag.previous.x = _x;
      this.view.drag.previous.y = _y;
    };

    this.view.up = () => {};

    //Event di chuột
    this.view.onMouseDown = (_event) => {
      _event.preventDefault();
      this.view.down(_event.clientX, _event.clientY);
      window.addEventListener("mouseup", this.view.onMouseUp);
      window.addEventListener("mousemove", this.view.onMouseMove);
    };

    this.view.onMouseMove = (_event) => {
      this.view.move(_event.clientX, _event.clientY);
      console.log("onMouseMove", _event);
    };

    this.view.onMouseUp = (_event) => {
      this.view.up();
      window.removeEventListener("mouseup", this.view.onMouseUp);
      window.removeEventListener("mousemove", this.view.onMouseMove);
    };
    window.addEventListener("mousedown", this.view.onMouseDown);
  }

  update() {
    console.log(this.view.drag.delta.x);
    this.view.spherical.value.theta -=
      (this.view.drag.delta.x * this.view.drag.sensitivity) /
      this.config.smallestSide;
    this.view.spherical.value.phi -=
      (this.view.drag.delta.y * this.view.drag.sensitivity) /
      this.config.smallestSide;
    this.view.drag.delta.x = 0;
    this.view.drag.delta.y = 0;

    this.view.spherical.smoothed.phi +=
      (this.view.spherical.value.phi - this.view.spherical.smoothed.phi) *
      this.view.spherical.smoothing *
      this.time.delta;
    this.view.spherical.smoothed.theta +=
      (this.view.spherical.value.theta - this.view.spherical.smoothed.theta) *
      this.view.spherical.smoothing *
      this.time.delta;

    const viewPosition = new THREE.Vector3();
    viewPosition.setFromSpherical(this.view.spherical.smoothed);
    //console.log(viewPosition);
    console.log(this.view.drag.delta.x);

    this.camera.modes.default.instance.position.copy(viewPosition);

    this.camera.modes.default.instance.lookAt(this.view.target);
  }
}
