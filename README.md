# Otak Clock

This VSCode extension displays the date and time for two time zones from around the world.

## Features

### Time Zone Display
- Display two different time zones in the status bar
- Select from a comprehensive list of time zones grouped by region
- Time format: HH:mm:ss (24-hour)
- Hover to see detailed timezone information including date

### Alarm System
- Set multiple alarms with custom settings
- Features:
  - Flexible time settings (HH:mm format)
  - Optional labels for alarms
  - Repeat options (daily, specific days, or one-time)
  - Custom alarm sounds
  - Enable/disable individual alarms

## Usage

### Time Zones
1. Click on either time display in the status bar
2. Select a region from the dropdown
3. Choose a specific timezone

### Alarms
1. Click on the clock icon in the status bar ($(clock)) or use command palette
2. Select "Set Alarm Time" to create a new alarm
3. Configure alarm settings:
   - Time (HH:mm)
   - Label (optional)
   - Repeat pattern
   - Alarm sound
4. Manage alarms:
   - List all alarms
   - Edit existing alarms
   - Enable/disable alarms
   - Delete alarms

## Available Commands
- `Select Time Zone 1`: Change the first time zone
- `Select Time Zone 2`: Change the second time zone
- `Set Alarm Time`: Create a new alarm
- `Toggle Alarm`: Enable/disable an alarm
- `List Alarms`: View and manage all alarms
- `Edit Alarm`: Modify alarm settings
- `Delete Alarm`: Remove an alarm

## Extension Settings
The extension provides customization through VS Code settings:

```json
{
  "otakClock.alarmSounds": {
    "defaultAlarm": "sounds/default.mp3",
    "bell": "sounds/bell.mp3",
    "chime": "sounds/chime.mp3",
    "digital": "sounds/digital.mp3"
  }
}
```

## License
MIT