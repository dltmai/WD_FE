export default class BatteryHandler {
  constructor() {
    this.batteryIcon = document.querySelector(".battery-icon");
    this.batteryText = document.querySelector(".battery-text");

    if (this.batteryIcon && this.batteryText) {
      this.initBattery();
    }
  }

  async initBattery() {
    if ("getBattery" in navigator) {
      const battery = await navigator.getBattery();
      this.updateBatteryStatus(battery);

      battery.addEventListener("levelchange", () =>
        this.updateBatteryStatus(battery)
      );
      battery.addEventListener("chargingchange", () =>
        this.updateBatteryStatus(battery)
      );
    }
  }

  updateBatteryStatus(battery) {
    if (!this.batteryIcon || !this.batteryText) return;

    const level = Math.floor(battery.level * 100);
    this.batteryText.textContent = level + "%";
    this.updateBatteryIcon(level);

    if (battery.charging) {
      this.batteryText.textContent += " ⚡";
    }
  }

  updateBatteryIcon(level) {
    if (!this.batteryIcon) return;

    this.batteryIcon.classList.remove(
      "text-red-500",
      "text-yellow-500",
      "text-green-500"
    );

    if (level <= 20) {
      this.batteryIcon.classList.add("text-red-500");
    } else if (level <= 50) {
      this.batteryIcon.classList.add("text-yellow-500");
    } else {
      this.batteryIcon.classList.add("text-green-500");
    }
  }
}
