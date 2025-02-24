import * as vscode from 'vscode';
import { flashStatusBars } from '../utils/color';
import { AlarmSettings, createDefaultAlarm, formatTime } from './AlarmSettings';

export class AlarmManager implements vscode.Disposable {
    private context: vscode.ExtensionContext;
    private statusBars: vscode.StatusBarItem[];
    private alarmStatusBar: vscode.StatusBarItem;
    private checkInterval: NodeJS.Timeout | undefined;
    private lastNotificationTime: number = 0;

    constructor(context: vscode.ExtensionContext, statusBars: vscode.StatusBarItem[]) {
        this.context = context;
        this.statusBars = statusBars;

        // アラーム設定用のステータスバーを作成
        this.alarmStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 98);
        this.alarmStatusBar.command = 'otak-clock.setAlarm';
        this.updateAlarmStatusBar();
        this.alarmStatusBar.show();

        context.subscriptions.push(this.alarmStatusBar);
        this.setupMidnightReset();
    }

    /**
     * アラーム設定を取得
     */
    private getAlarm(): AlarmSettings | undefined {
        return this.context.globalState.get<AlarmSettings>('alarm');
    }

    /**
     * アラーム設定を保存
     */
    private saveAlarm(alarm: AlarmSettings | undefined): void {
        this.context.globalState.update('alarm', alarm);
        this.updateAlarmStatusBar();
    }

    /**
     * 新しいアラームを設定
     */
    async setAlarm(): Promise<void> {
        const timeInput = await vscode.window.showInputBox({
            prompt: 'Set alarm time (HH:mm)',
            placeHolder: 'e.g., 09:00',
            validateInput: (value) => {
                const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
                return timeRegex.test(value) ? null : 'Please enter a valid time format (HH:mm)';
            }
        });

        if (!timeInput) {
            return;
        }

        const [hour, minute] = timeInput.split(':').map(Number);
        const alarm = createDefaultAlarm();
        alarm.hour = hour;
        alarm.minute = minute;

        this.saveAlarm(alarm);

        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Alarm set for ${formatTime(hour, minute)}`,
            cancellable: false
        }, () => new Promise(resolve => setTimeout(resolve, 3000)));
    }

    /**
     * アラームのチェックと通知
     */
    checkAlarms(): void {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        const alarm = this.getAlarm();
        if (!alarm || !alarm.enabled || alarm.triggered) {
            return;
        }

        if (alarm.hour === currentHour && alarm.minute === currentMinute) {
            // 同じ分内での重複通知を防ぐ
            const currentTime = Date.now();
            if (currentTime - this.lastNotificationTime < 60000) {
                return;
            }
            this.lastNotificationTime = currentTime;
            this.triggerAlarm(alarm);
        }
    }

    /**
     * アラームを発動
     */
    private triggerAlarm(alarm: AlarmSettings): void {
        // 5秒で自動的に消える通知を表示
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Alarm: ${formatTime(alarm.hour, alarm.minute)}`,
            cancellable: false
        }, () => new Promise(resolve => {
            alarm.triggered = true;
            this.saveAlarm(alarm);
            setTimeout(resolve, 5000);
        }));

        // ステータスバーを点滅
        flashStatusBars(this.statusBars);
    }

    /**
     * ステータスバーの表示を更新
     */
    private updateAlarmStatusBar(): void {
        const alarm = this.getAlarm();

        if (alarm?.enabled && !alarm.triggered) {
            this.alarmStatusBar.text = `$(bell) ${formatTime(alarm.hour, alarm.minute)}`;
            this.alarmStatusBar.tooltip = `Alarm set for ${formatTime(alarm.hour, alarm.minute)}\nClick to change`;
        } else {
            this.alarmStatusBar.text = '$(bell) $(add)';
            this.alarmStatusBar.tooltip = 'Click to set alarm';
        }
    }

    /**
     * 真夜中にアラームの状態をリセット
     */
    private setupMidnightReset(): void {
        this.checkInterval = setInterval(() => {
            const now = new Date();
            if (now.getHours() === 0 && now.getMinutes() === 0) {
                const alarm = this.getAlarm();
                if (alarm) {
                    alarm.triggered = false;
                    this.saveAlarm(alarm);
                }
            }
        }, 60000); // 1分ごとにチェック
    }

    /**
     * リソースの解放
     */
    dispose(): void {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }
        this.alarmStatusBar.dispose();
    }
}