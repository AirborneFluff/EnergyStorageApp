export interface Consumption {
  Consumption: number,
  Start: Date,
  End: Date
}

export interface ConsumptionJson {
  Consumption: number,
  Start: Date | string,
  End: Date | string
}
