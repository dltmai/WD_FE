import * as THREE from "three";

import Experience from "./Experience.js";

export default class Screen {
  constructor(_mesh, _sourcePath) {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;
    this.world = this.experience.world;

    this.mesh = _mesh;
    this.sourcePath = _sourcePath;

    this.setModel();
    this.setupHoverEffect();
  }

  setupHoverEffect() {
    // Thêm event listeners
    window.addEventListener("mousemove", (event) => {
      const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, this.experience.camera.instance);

      const intersects = raycaster.intersectObject(this.model.mesh);

      if (intersects.length > 0) {
        document.body.style.cursor = "pointer";
        this.model.mesh.material.opacity = 0.8;
      } else {
        document.body.style.cursor = "default";
        this.model.mesh.material.opacity = 1;
      }
    });

    // Sửa lại phần xử lý click để chuyển hướng sang screen.html
    window.addEventListener("click", (event) => {
      const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, this.experience.camera.instance);

      const intersects = raycaster.intersectObject(this.model.mesh);

      if (intersects.length > 0) {
        // Chuyển hướng sang screen.html
        window.location.href = "/screen.html";
      }
    });
  }

  setModel() {
    this.model = {};

    // Element
    if (this.sourcePath.endsWith(".mp4")) {
      // Video setup
      this.model.element = document.createElement("video");
      this.model.element.muted = true;
      this.model.element.loop = true;
      this.model.element.controls = true;
      this.model.element.playsInline = true;
      this.model.element.autoplay = true;
      this.model.element.src = this.sourcePath;
      this.model.element.play();

      // Texture
      this.model.texture = new THREE.VideoTexture(this.model.element);
    } else {
      // Image setup
      this.model.texture = new THREE.TextureLoader().load(this.sourcePath);
    }

    this.model.texture.encoding = THREE.sRGBEncoding;

    // Material
    this.model.material = new THREE.MeshBasicMaterial({
      map: this.model.texture,
    });

    // Mesh
    this.model.mesh = this.mesh;
    this.model.mesh.material = this.model.material;
    this.scene.add(this.model.mesh);
  }

  update() {
    // this.model.group.rotation.y = Math.sin(this.time.elapsed * 0.0005) * 0.5
  }
}
