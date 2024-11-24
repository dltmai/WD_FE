import * as THREE from "three";

import Experience from "./Experience.js";
import vertexShader from "./shaders/baked/vertex.glsl";
import fragmentShader from "./shaders/baked/fragment.glsl";

export default class CoffeeSteam {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;
    this.time = this.experience.time;

    // Debug
    if (this.debug) {
      this.debugFolder = this.debug.addFolder({
        title: "baked",
        expanded: true,
      });
    }

    this.setModel();
  }

  setModel() {
    try {
      // Kiểm tra và log resources
      console.log("Resources items:", this.resources.items);

      // Khởi tạo model object
      this.model = {};

      // Xử lý texture
      const texture = this.resources.items.bakedDayTexture;
      if (!texture) {
        console.error("Texture not found in resources");
        return;
      }

      // Tạo bản sao của texture để tránh conflict
      this.model.texture = texture.clone();
      // Sử dụng THREE.sRGBEncoding thay vì gán trực tiếp
      this.model.texture.encoding = THREE.sRGBEncoding;
      this.model.texture.flipY = false;

      // Tạo material
      this.model.material = new THREE.MeshBasicMaterial({
        map: this.model.texture,
      });

      // Xử lý model
      const model = this.resources.items.roomModel;
      if (!model) {
        console.error("Model not found in resources");
        return;
      }

      this.model.mesh = model.scene;
      this.model.mesh.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = this.model.material;
        }
      });

      this.scene.add(this.model.mesh);
    } catch (error) {
      console.error("Error in setModel:", error);
    }
  }
}
