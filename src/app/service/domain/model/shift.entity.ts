export class Shift {
  constructor(
    public readonly id: string,
    public name: string,
    public startTime: string,   // "06:00"
    public endTime: string,     // "14:00"
    public type: 'morning' | 'afternoon' | 'night',
  ) {}
}
