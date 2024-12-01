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
      try {
        const battery = await navigator.getBattery();
        this.updateBatteryStatus(battery);

        battery.addEventListener("levelchange", () => {
          this.updateBatteryStatus(battery);
        });
        battery.addEventListener("chargingchange", () => {
          this.updateBatteryStatus(battery);
        });
      } catch (error) {
        console.error("Error accessing battery status:", error);
        this.showDefaultBattery();
      }
    } else {
      console.warn("Battery API is not supported on this browser.");
      this.showDefaultBattery();
    }
  }

  updateBatteryStatus(battery) {
    if (!this.batteryIcon || !this.batteryText) return;

    const level = Math.floor(battery.level * 100);

    this.batteryIcon.innerHTML = `
      <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="2" y="7" width="18" height="12" rx="2" ry="2" stroke-width="2"/>
        <rect x="20" y="10" width="2" height="6" stroke-width="2"/>
        <rect x="4" y="9" width="${14 * (level / 100)}" height="8" 
          fill="currentColor" stroke="none"/>
      </svg>
    `;

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

    this.batteryText.textContent = `${level}%`;
    if (battery.charging) {
      this.batteryText.textContent += " ⚡";
    }
  }

  showDefaultBattery() {
    if (!this.batteryIcon || !this.batteryText) return;

    this.batteryIcon.innerHTML = `
      <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="2" y="7" width="18" height="12" rx="2" ry="2" stroke-width="2"/>
        <rect x="20" y="10" width="2" height="6" stroke-width="2"/>
      </svg>
    `;
    this.batteryIcon.classList.add("text-gray-500");
    this.batteryText.textContent = "N/A";
  }
}
