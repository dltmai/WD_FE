import * as THREE from "three";
import Experience from "./Experience.js";
import Baked from "./Baked.js";
import GoogleLeds from "./GoogleLeds.js";

import TopChair from "./TopChair.js";

import Screen from "./Screen.js";

export default class World {
  constructor(_options) {
    this.experience = new Experience();
    this.config = this.experience.config;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resources.on("groupEnd", (_group) => {
      if (_group.name === "base") {
        this.setBaked();
        this.setGoogleLeds();

        this.setTopChair();
        this.setScreens();
      }
    });
  }

  setBaked() {
    this.baked = new Baked();
  }

  setGoogleLeds() {
    this.googleLeds = new GoogleLeds();
  }

  setTopChair() {
    this.topChair = new TopChair();
  }

  setScreens() {
    this.pcScreen = new Screen(
      this.resources.items.pcScreenModel.scene.children[0],
      "/assets/image.png"
    );
    this.macScreen = new Screen(
      this.resources.items.macScreenModel.scene.children[0],
      "/assets/video.mp4"
    );
  }

  resize() {}

  update() {
    if (this.googleLeds) this.googleLeds.update();
    if (this.pcScreen) this.pcScreen.update();
    if (this.macScreen) this.macScreen.update();
    if (this.topChair) this.topChair.update();
    //if (this.bouncingLogo) this.bouncingLogo.update();
  }

  destroy() {}
}
