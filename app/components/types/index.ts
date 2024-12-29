export interface BlockedDateRangeType{
    start: Date;
    end: Date;
}

export interface SettingsType{
    blockedDays: number[];
    blockedDateRanges: BlockedDateRangeType[]
}