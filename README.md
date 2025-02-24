<p align="center">
  <h1 align="center">otak-clock</h1>
  <p align="center">
    VSCode extension for displaying dual time zones with alarm functionality - Supports all global time zones with intuitive interface and visual notifications.
  </p>
</p>

---

## Usage

For Time Zone Display:

![Time Zone Display](images/otak-clock.png)

1. Click on either time display in the status bar
2. Select a region from the dropdown menu
3. Choose a specific timezone from the available options
4. The extension will:
   - Display the selected time zone in 24-hour format (HH:mm:ss)
   - Show detailed timezone information on hover
   - Update in real-time
   - Maintain your preferences between sessions

For Setting Alarms:

1. Click the bell icon ($(bell)) in the status bar
2. Enter your desired alarm time in HH:mm format
3. The alarm will:
   - Display in the status bar for quick reference
   - Trigger visual notifications at the specified time
   - Auto-dismiss after notification
   - Maintain a simple, one-alarm-at-a-time system

## Features

otak-clock is a powerful VSCode extension that provides dual time zone display and alarm functionality for developers working across different time zones.

### Key Features

- **Dual Time Zone Display**:
  - Real-time display of two different time zones
  - Comprehensive list of time zones grouped by region
  - 24-hour time format (HH:mm:ss)
  - Detailed timezone information on hover
  - Persistent timezone preferences

- **Simple Alarm System**:
  - Single alarm with visual notifications
  - Easy time setting (HH:mm format)
  - Status bar alarm time display
  - Visual notification feedback
  - Auto-dismissing notifications

- **Status Bar Integration**:
  - Clean and intuitive interface
  - Quick access to time zone selection
  - Clear alarm status indicators
  - Efficient screen space usage

## Commands

- **`otak-clock.selectTimeZone1`**: Change the first time zone
- **`otak-clock.selectTimeZone2`**: Change the second time zone
- **`otak-clock.setAlarm`**: Set a new alarm time

## Extension Settings

This extension is designed to be simple and user-friendly with no additional configuration required. All features are accessible through the status bar interface:

- Time zone displays can be clicked to change settings
- Alarm icon shows current status and settings
- Visual indicators for active alarms

### Status Bar Indicators

- $(bell) HH:mm - Shows active alarm and its time
- $(bell) $(add) - Indicates no active alarm, clickable to set
- HH:mm:ss - Current time in selected time zones

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

For more information, visit the [GitHub repository](https://github.com/tsuyoshi-otake-system-exe-jp/otak-clock).