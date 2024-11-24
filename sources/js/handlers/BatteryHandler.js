export default class BatteryHandler {
  constructor() {
    this.initBattery();
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
    const level = Math.floor(battery.level * 100);
    const batteryIcon = document.querySelector(".battery-icon");
    const batteryText = document.querySelector(".text-xs");

    batteryText.textContent = level + "%";

    this.updateBatteryIcon(batteryIcon, level);

    if (battery.charging) {
      batteryText.textContent += " ⚡";
    }
  }

  updateBatteryIcon(icon, level) {
    icon.classList.remove("text-red-500", "text-yellow-500", "text-green-500");
    if (level <= 20) {
      icon.classList.add("text-red-500");
    } else if (level <= 50) {
      icon.classList.add("text-yellow-500");
    } else {
      icon.classList.add("text-green-500");
    }
  }
}
