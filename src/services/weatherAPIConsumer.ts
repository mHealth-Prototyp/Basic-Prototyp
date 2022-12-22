import {Measurement, Parameter, Station} from 'src/model/interfaces';

import WEATHER_DATA from 'src/assets/weatherData.json';

class WeatherAPIConsumer {
  private readonly _stations: Station[];
  private readonly _parameters: Parameter[];
  private readonly _measurements: {[stationId: string]: Measurement[]};

  public constructor() {
    this._stations = (WEATHER_DATA as {stations: Station[]}).stations;
    this._parameters = (WEATHER_DATA as {parameters: Parameter[]}).parameters;
    this._measurements = {};
    for (const station of this.getStations()) {
      this._measurements[station.id] = (WEATHER_DATA as {measurements: Measurement[]}).measurements
        .filter((x) => x.station === station.id)
        .sort((a, b) => a.date - b.date);
    }
  }

  getStations(): Station[] {
    return this._stations;
  }

  getStation(id: string): Station | undefined {
    return this._stations.find((x) => x.id === id);
  }

  getParamaters(): Parameter[] {
    return this._parameters;
  }

  getParameter(code: string): Parameter | undefined {
    return this._parameters.find((x) => x.defaultCoding.code === code);
  }

  getValues(stationId: string, parameterCode: string, from: Date, to: Date, previous = false): [number, number][] {
    if (to.getFullYear() - from.getFullYear() === 0) {
      const utcFrom = this.get2021UTCDate(from);
      const utcTo = this.get2021UTCDate(to);
      const fromIndex = this._measurements[stationId].findIndex((x) => x.date === utcFrom);
      const toIndex = this._measurements[stationId].findIndex((x) => x.date === utcTo);

      const values: [number, number][] = [];

      for (let i = fromIndex; i <= toIndex; i++) {
        if (!previous) {
          values.push([
            this.getCurrentYearUTCDate(this._measurements[stationId][i].date),
            this._measurements[stationId][i].values.find((x) => x.parameter.code === parameterCode)?.value ?? -1
          ]);
        } else {
          values.push([
            this.getPreviousYearUTCDate(this._measurements[stationId][i].date),
            this._measurements[stationId][i].values.find((x) => x.parameter.code === parameterCode)?.value ?? -1
          ]);
        }
      }

      return values;
    } else {
      const previousYear = this.getValues(
        stationId,
        parameterCode,
        from,
        new Date(Date.UTC(from.getFullYear(), 11, 31)),
        true
      );
      const currentYear = this.getValues(stationId, parameterCode, new Date(Date.UTC(to.getFullYear(), 0, 1)), to);
      return [...previousYear, ...currentYear];
    }
  }

  getValue(stationId: string, parameterCode: string, date: Date): number {
    const utcDate = this.get2021UTCDate(date);
    const value = this._measurements[stationId]
      .find((x) => x.date === utcDate)
      ?.values.find((x) => x.parameter.code === parameterCode);
    if (value) {
      return value.value;
    } else {
      return -1;
    }
  }

  private get2021UTCDate(date: Date): number {
    return Date.UTC(2021, date.getMonth(), date.getDate());
  }

  private getCurrentYearUTCDate(date: number): number {
    const yet = new Date();
    const oldDate = new Date(date);
    return Date.UTC(yet.getFullYear(), oldDate.getUTCMonth(), oldDate.getUTCDate());
  }

  private getPreviousYearUTCDate(date: number): number {
    const yet = new Date();
    const oldDate = new Date(date);
    return Date.UTC(yet.getFullYear() - 1, oldDate.getUTCMonth(), oldDate.getUTCDate());
  }
}

export default WeatherAPIConsumer;
