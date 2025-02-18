<p align="center">
  <h1 align="center">otak-clock</h1>
  <p align="center">Dual time-zone clocks on the VS Code status bar.</p>
</p>

---

This extension displays the current time for two different time zones right in your Visual Studio Code status bar with real-time updates. Whether you’re coordinating with global teams or tracking time across continents, **otak-clock** gives you an at-a-glance view of two selected regions without needing to leave your editor.

# Features
- **Dual Time Zone Display:**  
  View the current time for two separate time zones simultaneously.
- **Real-Time Updates:**  
  Clocks update every second, ensuring you always see the precise time.
- **Time Zone Selection:**  
  Easily change either time zone with intuitive commands:
  - `otak-clock.selectTimeZone1` for the first clock (Default: UTC)
  - `otak-clock.selectTimeZone2` for the second clock (Default: Asia/Tokyo)
- **Global Time Zone Support:**  
  Supports a wide range of regions with correct UTC offsets and automatic Daylight Saving Time adjustments.

# Usage
![](images/otak-clock.png)

1. **Click the desired clock item** in the status bar.
2. **Select a region** from the list to filter the available time zones.
3. **Choose your preferred time zone.**  
   The display updates immediately with the selected time zone’s current time.

You can also access the time zone change commands via the Command Palette (F1):
- `otak-clock.selectTimeZone1`
- `otak-clock.selectTimeZone2`

## Requirements
- **Visual Studio Code:** Version 1.90.0 or higher
- **Node.js:** Utilized as part of the VS Code extension runtime

## Extension Settings
This extension configures its behavior exclusively through built-in commands. There are no additional settings exposed in the VS Code settings UI.

## Troubleshooting
If you experience issues with time displays:
1. Ensure that VS Code is updated to the required version.
2. Confirm that there are no lingering unsaved changes or interruptions in the extension process.
3. Try reselecting the time zone via the Command Palette if the display seems unresponsive.

## License
MIT License - see the [LICENSE](./LICENSE) file for details.

---

For more information, visit the [GitHub repository](https://github.com/tsuyoshi-otake-system-exe-jp/otak-clock).