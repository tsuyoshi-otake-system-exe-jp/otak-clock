export interface AlarmSettings {
    enabled: boolean;
    hour: number;
    minute: number;
    triggered: boolean;
}

export function createDefaultAlarm(): AlarmSettings {
    return {
        enabled: true,
        hour: 9,
        minute: 0,
        triggered: false
    };
}

export function formatTime(hour: number, minute: number): string {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}