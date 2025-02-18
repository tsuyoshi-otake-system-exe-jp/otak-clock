// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';

let defaultStatusBar: vscode.StatusBarItem;
let gmtStatusBar: vscode.StatusBarItem;
let updateInterval: NodeJS.Timeout;
let extensionContext: vscode.ExtensionContext;

interface TimeZoneInfo {
    label: string;
    timeZoneId: string; // IANA timezone ID
    region: string;
    baseUtcOffset: number;
}

// タイムゾーンのリスト（IANAタイムゾーンIDを使用）
const timeZones: TimeZoneInfo[] = [
    // Universal Time
    { label: 'Coordinated Universal Time', timeZoneId: 'UTC', region: 'Universal Time', baseUtcOffset: 0 },
    { label: 'Greenwich Mean Time', timeZoneId: 'Etc/GMT', region: 'Universal Time', baseUtcOffset: 0 },
    
    // Americas
    { label: 'Alaska (Anchorage)', timeZoneId: 'America/Anchorage', region: 'Americas', baseUtcOffset: -9 },
    { label: 'US Pacific (Los Angeles)', timeZoneId: 'America/Los_Angeles', region: 'Americas', baseUtcOffset: -8 },
    { label: 'US Mountain (Denver)', timeZoneId: 'America/Denver', region: 'Americas', baseUtcOffset: -7 },
    { label: 'US Central (Chicago)', timeZoneId: 'America/Chicago', region: 'Americas', baseUtcOffset: -6 },
    { label: 'US Eastern (New York)', timeZoneId: 'America/New_York', region: 'Americas', baseUtcOffset: -5 },
    { label: 'Canada (Toronto)', timeZoneId: 'America/Toronto', region: 'Americas', baseUtcOffset: -5 },
    { label: 'Mexico (Mexico City)', timeZoneId: 'America/Mexico_City', region: 'Americas', baseUtcOffset: -6 },
    { label: 'Brazil (Sao Paulo)', timeZoneId: 'America/Sao_Paulo', region: 'Americas', baseUtcOffset: -3 },
    { label: 'Argentina (Buenos Aires)', timeZoneId: 'America/Argentina/Buenos_Aires', region: 'Americas', baseUtcOffset: -3 },

    // Europe
    { label: 'UK (London)', timeZoneId: 'Europe/London', region: 'Europe', baseUtcOffset: 0 },
    { label: 'France (Paris)', timeZoneId: 'Europe/Paris', region: 'Europe', baseUtcOffset: 1 },
    { label: 'Germany (Berlin)', timeZoneId: 'Europe/Berlin', region: 'Europe', baseUtcOffset: 1 },
    { label: 'Italy (Rome)', timeZoneId: 'Europe/Rome', region: 'Europe', baseUtcOffset: 1 },
    { label: 'Spain (Madrid)', timeZoneId: 'Europe/Madrid', region: 'Europe', baseUtcOffset: 1 },
    { label: 'Switzerland (Zurich)', timeZoneId: 'Europe/Zurich', region: 'Europe', baseUtcOffset: 1 },
    { label: 'Russia (Moscow)', timeZoneId: 'Europe/Moscow', region: 'Europe', baseUtcOffset: 3 },

    // Africa & Middle East
    { label: 'Egypt (Cairo)', timeZoneId: 'Africa/Cairo', region: 'Africa & Middle East', baseUtcOffset: 2 },
    { label: 'Kenya (Nairobi)', timeZoneId: 'Africa/Nairobi', region: 'Africa & Middle East', baseUtcOffset: 3 },
    { label: 'Saudi Arabia (Riyadh)', timeZoneId: 'Asia/Riyadh', region: 'Africa & Middle East', baseUtcOffset: 3 },
    { label: 'UAE (Dubai)', timeZoneId: 'Asia/Dubai', region: 'Africa & Middle East', baseUtcOffset: 4 },
    { label: 'Iran (Tehran)', timeZoneId: 'Asia/Tehran', region: 'Africa & Middle East', baseUtcOffset: 3.5 },

    // Asia
    { label: 'India (New Delhi)', timeZoneId: 'Asia/Kolkata', region: 'Asia', baseUtcOffset: 5.5 },
    { label: 'Bangladesh (Dhaka)', timeZoneId: 'Asia/Dhaka', region: 'Asia', baseUtcOffset: 6 },
    { label: 'Thailand (Bangkok)', timeZoneId: 'Asia/Bangkok', region: 'Asia', baseUtcOffset: 7 },
    { label: 'Vietnam (Ho Chi Minh)', timeZoneId: 'Asia/Ho_Chi_Minh', region: 'Asia', baseUtcOffset: 7 },
    { label: 'Indonesia (Jakarta)', timeZoneId: 'Asia/Jakarta', region: 'Asia', baseUtcOffset: 7 },
    { label: 'Malaysia (Kuala Lumpur)', timeZoneId: 'Asia/Kuala_Lumpur', region: 'Asia', baseUtcOffset: 8 },
    { label: 'Singapore', timeZoneId: 'Asia/Singapore', region: 'Asia', baseUtcOffset: 8 },
    { label: 'China (Beijing)', timeZoneId: 'Asia/Shanghai', region: 'Asia', baseUtcOffset: 8 },
    { label: 'Hong Kong', timeZoneId: 'Asia/Hong_Kong', region: 'Asia', baseUtcOffset: 8 },
    { label: 'Taiwan (Taipei)', timeZoneId: 'Asia/Taipei', region: 'Asia', baseUtcOffset: 8 },
    { label: 'Philippines (Manila)', timeZoneId: 'Asia/Manila', region: 'Asia', baseUtcOffset: 8 },
    { label: 'Korea (Seoul)', timeZoneId: 'Asia/Seoul', region: 'Asia', baseUtcOffset: 9 },
    { label: 'Japan (Tokyo)', timeZoneId: 'Asia/Tokyo', region: 'Asia', baseUtcOffset: 9 },

    // Oceania
    { label: 'Australia (Perth)', timeZoneId: 'Australia/Perth', region: 'Oceania', baseUtcOffset: 8 },
    { label: 'Australia (Adelaide)', timeZoneId: 'Australia/Adelaide', region: 'Oceania', baseUtcOffset: 9.5 },
    { label: 'Australia (Sydney)', timeZoneId: 'Australia/Sydney', region: 'Oceania', baseUtcOffset: 10 },
    { label: 'Australia (Melbourne)', timeZoneId: 'Australia/Melbourne', region: 'Oceania', baseUtcOffset: 10 },
    { label: 'Australia (Brisbane)', timeZoneId: 'Australia/Brisbane', region: 'Oceania', baseUtcOffset: 10 },
    { label: 'New Zealand (Auckland)', timeZoneId: 'Pacific/Auckland', region: 'Oceania', baseUtcOffset: 12 }
];

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
    extensionContext = context;
    console.log('Congratulations, your extension "otak-clock" is now active!');

    // デフォルトのステータスバーアイテムを作成 (UTC)
    defaultStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    defaultStatusBar.command = 'otak-clock.selectTimeZone1';
    context.subscriptions.push(defaultStatusBar);

    // 2番目のステータスバーアイテムを作成（デフォルトはJST）
    gmtStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 99);
    gmtStatusBar.command = 'otak-clock.selectTimeZone2';
    context.subscriptions.push(gmtStatusBar);

    // コマンドを登録
    let disposable1 = vscode.commands.registerCommand('otak-clock.selectTimeZone1', async () => {
        const selectedTimeZone = await selectTimeZoneWithRegion();
        if (selectedTimeZone) {
            extensionContext.globalState.update('timeZone1', selectedTimeZone);
            updateClocks();
        }
    });

    let disposable2 = vscode.commands.registerCommand('otak-clock.selectTimeZone2', async () => {
        const selectedTimeZone = await selectTimeZoneWithRegion();
        if (selectedTimeZone) {
            extensionContext.globalState.update('timeZone2', selectedTimeZone);
            updateClocks();
        }
    });

    context.subscriptions.push(disposable1);
    context.subscriptions.push(disposable2);

    // 初期値を設定
    const initialTimeZone1 = extensionContext.globalState.get<TimeZoneInfo>('timeZone1');
    const initialTimeZone2 = extensionContext.globalState.get<TimeZoneInfo>('timeZone2');

    if (!initialTimeZone1) {
        extensionContext.globalState.update('timeZone1', timeZones.find(tz => tz.timeZoneId === 'UTC')); // UTC
    }
    if (!initialTimeZone2) {
        extensionContext.globalState.update('timeZone2', timeZones.find(tz => tz.timeZoneId === 'Asia/Tokyo')); // JST
    }

    // 時計を表示
    defaultStatusBar.show();
    gmtStatusBar.show();

    // 時計を更新
    updateClocks();

    // 1秒ごとに更新
    updateInterval = setInterval(updateClocks, 1000);
}

// This method is called when your extension is deactivated
export function deactivate() {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
}

// 地域選択を含むタイムゾーン選択関数
async function selectTimeZoneWithRegion(): Promise<TimeZoneInfo | undefined> {
    // まず地域を選択
    const regions = [...new Set(timeZones.map(tz => tz.region))].sort((a, b) => {
        if (a === 'Universal Time') return -1;
        if (b === 'Universal Time') return 1;
        return a.localeCompare(b);
    });

    const selectedRegion = await vscode.window.showQuickPick(regions, {
        placeHolder: 'Select Region'
    });

    if (!selectedRegion) {
        return undefined;
    }

    // 選択された地域のタイムゾーンを表示
    const timeZonesInRegion = timeZones.filter(tz => tz.region === selectedRegion);
    const selectedLabel = await vscode.window.showQuickPick(
        timeZonesInRegion.map(tz => ({
            label: tz.label,
            description: `(UTC${tz.baseUtcOffset >= 0 ? '+' : ''}${tz.baseUtcOffset}:00)`,
            detail: tz.timeZoneId
        })),
        {
            placeHolder: 'Select Timezone'
        }
    );

    if (!selectedLabel) {
        return undefined;
    }

    return timeZones.find(tz => tz.label === selectedLabel.label);
}

// 時計を更新する関数
function updateClocks() {
    const now = new Date();

    // 保存されているタイムゾーン設定を取得
    const timeZone1 = extensionContext.globalState.get<TimeZoneInfo>('timeZone1') ?? 
        timeZones.find(tz => tz.timeZoneId === 'UTC');
    
    const timeZone2 = extensionContext.globalState.get<TimeZoneInfo>('timeZone2') ?? 
        timeZones.find(tz => tz.timeZoneId === 'Asia/Tokyo');

    if (timeZone1) {
        const time1 = formatTimeWithTimeZone(now, timeZone1.timeZoneId);
        defaultStatusBar.text = time1;
        defaultStatusBar.tooltip = `${timeZone1.label} (${timeZone1.timeZoneId})\nUTC${timeZone1.baseUtcOffset >= 0 ? '+' : ''}${timeZone1.baseUtcOffset}:00`;
    }

    if (timeZone2) {
        const time2 = formatTimeWithTimeZone(now, timeZone2.timeZoneId);
        gmtStatusBar.text = time2;
        gmtStatusBar.tooltip = `${timeZone2.label} (${timeZone2.timeZoneId})\nUTC${timeZone2.baseUtcOffset >= 0 ? '+' : ''}${timeZone2.baseUtcOffset}:00`;
    }
}

// 指定したタイムゾーンでの時刻をフォーマットする関数
function formatTimeWithTimeZone(date: Date, timeZoneId: string): string {
    return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: timeZoneId
    }).format(date);
}

// サマータイム判定関数
function isCurrentlyDST(date: Date, timeZoneId: string): boolean {
    if (timeZoneId === 'UTC' || timeZoneId === 'Etc/GMT') {
        return false;
    }

    const january = new Date(date.getFullYear(), 0, 1);
    const july = new Date(date.getFullYear(), 6, 1);

    const januaryOffset = getTimezoneOffset(january, timeZoneId);
    const julyOffset = getTimezoneOffset(july, timeZoneId);
    const currentOffset = getTimezoneOffset(date, timeZoneId);

    // 夏時間の方がオフセットが大きい（時間が進む）
    return Math.max(januaryOffset, julyOffset) === currentOffset;
}

// タイムゾーンのオフセットを取得する関数
function getTimezoneOffset(date: Date, timeZoneId: string): number {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timeZoneId,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    
    const parts = formatter.formatToParts(date);
    const formatted = `${parts.find(p => p.type === 'year')?.value}-${parts.find(p => p.type === 'month')?.value}-${parts.find(p => p.type === 'day')?.value}T${parts.find(p => p.type === 'hour')?.value}:${parts.find(p => p.type === 'minute')?.value}:${parts.find(p => p.type === 'second')?.value}`;
    
    const localDate = new Date(formatted);
    const utcDate = new Date(date.toISOString());
    
    return (utcDate.getTime() - localDate.getTime()) / (60 * 1000);
}
