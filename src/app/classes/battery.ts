export class Battery {
  private readonly usable_capacity!: number; // KiloWattHours
  private current_capacity: number = 0; // KiloWattHours

  public get ChargeLevel() {
    return this.current_capacity / this.usable_capacity;
  }

  /**
   * A battery representation which can be charged/discharged up to its usable capacity
   * @param usableCapacity The usable capacity of the battery (kWh)
   */
  constructor (usableCapacity: number) {
    this.usable_capacity = usableCapacity;
  }

  /**
   * Attempts to add charge to the battery
   * @param power The amount of power to add (kWh)
   * @returns The amount of power which could not be stored in the battery
   */
  public AddCharge(power: number): number {
    const newCapacity = this.current_capacity + power; // Add charge to current charge level
    this.current_capacity = Math.min(this.usable_capacity, newCapacity); // Limit charge level by max capacity
    return newCapacity - this.current_capacity // Return unused power
  }

  /**
   * Attempts to add charge to the battery
   * @param power The amount of power to remove (kWh)
   * @returns The amount of power which could not be supplied by the battery (kWh)
   */
  public RemoveCharge(power: number): number {
    const newCapacity = this.current_capacity - power; // Remove charge from current charge level
    this.current_capacity = Math.max(0, newCapacity); // Limit to 0% power
    return this.current_capacity - newCapacity // Return unavailable power
  }
}
