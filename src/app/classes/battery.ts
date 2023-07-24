export class Battery {
  private readonly initial_usable_capacity!: number;
  private readonly nominal_capacity!: number;
  private readonly cycle_life!: number;
  private current_capacity: number = 0;
  private lifetime_charge: number = 0;
  private used_cycles: number = 0;

  public get ChargeLevel() {
    return this.current_capacity / this.UsableCapacity;
  }
  public get UsableCapacity(): number {
    return this.initial_usable_capacity - this.used_cycles * this.degradationPerCycle;
  }
  public get CurrentCycleUsage(): number {
    return (this.TotalCycles - this.RemainingCycles) / this.TotalCycles;
  }
  public get RemainingCycles(): number {
    return Math.round(this.cycle_life - this.used_cycles);
  }
  public get TotalCycles(): number {
    return this.cycle_life;
  }
  public get Health(): number { // Considered dead at 60% nominal capacity
    const sixtyP = this.nominal_capacity * 0.6;
    return (this.UsableCapacity - sixtyP) / (this.initial_usable_capacity - sixtyP)
  }
  private get degradationPerCycle(): number {
    return (this.initial_usable_capacity - this.initial_usable_capacity * 0.8) / this.cycle_life;
  }

  /**
   * A battery representation which can be charged/discharged up to its usable capacity
   * @param nominalCapacity The full capacity of the battery
   * @param usableCapacity The usable capacity of the battery (kWh)
   * @param cycleLife The number of charge/discharge cycles for the batteries rated lifetime
   */
  constructor (nominalCapacity: number, usableCapacity: number, cycleLife: number) {
    this.nominal_capacity = nominalCapacity;
    this.initial_usable_capacity = usableCapacity;
    this.cycle_life = cycleLife;
    this.current_capacity = usableCapacity/2; // Storage power
  }

  /**
   * Attempts to add charge to the battery
   * @param power The amount of power to add (kWh)
   * @returns The amount of power which could not be stored in the battery
   */
  public AddCharge(power: number): number {
    const newCapacity = this.current_capacity + power; // Add charge to current charge level
    this.current_capacity = Math.min(this.UsableCapacity, newCapacity); // Limit charge level by max capacity
    const unusedPower = newCapacity - this.current_capacity; // Power which couldn't be added to battery
    this.updateLifetimeCharges(power - unusedPower);
    return unusedPower // Return unused power
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

  private updateLifetimeCharges(power: number) {
    this.lifetime_charge += power;
    const cycleCost = power / this.UsableCapacity;
    this.used_cycles += cycleCost;
  }
}
