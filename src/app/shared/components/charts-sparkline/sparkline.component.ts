import { Component, Input, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { scaleLinear, scaleTime, scalePoint } from 'd3-scale';
import * as shape from 'd3-shape';

import { getUniqueXDomainValues } from '@swimlane/ngx-charts';

import {
  BaseChartComponent,
  ViewDimensions,
  ColorHelper,
  calculateViewDimensions
} from '@swimlane/ngx-charts';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ngx-charts-sparkline',
  template: `
    <ngx-charts-chart [view]="[width, height]" [showLegend]="false" [animations]="animations">
      <svg:g [attr.transform]="transform" class="line-chart chart">
        <svg:g>
          <svg:g *ngFor="let series of results; trackBy: trackBy">
            <svg:g
              ngx-charts-line-series
              [xScale]="xScale"
              [yScale]="yScale"
              [colors]="colors"
              [data]="series"
              [scaleType]="scaleType"
              [curve]="curve"
              [animations]="animations"
            />
          </svg:g>
        </svg:g>
      </svg:g>
    </ngx-charts-chart>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SparklineComponent extends BaseChartComponent {
  @Input() public autoScale = false;
  @Input() public curve: any = shape.curveBasis;
  @Input() public override schemeType: any = 'ordinal';
  @Input() public valueDomain: number[];
  @Input() public override animations: any = true;

  public dims: ViewDimensions;
  public xSet: any;
  public xDomain: any;
  public yDomain: any;
  public seriesDomain: any;
  public yScale: any;
  public xScale: any;
  public colors: ColorHelper;
  public scaleType: any;
  public transform: string;
  public margin = [0, 0, 0, 0];

  public override update(): void {
    super.update();

    this.dims = calculateViewDimensions({
      width: this.width,
      height: this.height,
      margins: this.margin,
      showXAxis: false,
      showYAxis: false,
      xAxisHeight: 0,
      yAxisWidth: 0,
      showXLabel: false,
      showYLabel: false,
      showLegend: false,
      legendType: this.schemeType
    });

    this.xDomain = this.getXDomain();

    this.yDomain = this.getYDomain();
    this.seriesDomain = this.getSeriesDomain();

    this.xScale = this.getXScale(this.xDomain, this.dims.width);
    this.yScale = this.getYScale(this.yDomain, this.dims.height);

    this.setColors();
    this.transform = `translate(${this.dims.xOffset} , ${this.margin[0]})`;
  }

  public getXDomain(): any[] {
    let values = getUniqueXDomainValues(this.results);

    this.scaleType = this.getScaleType(values);
    let domain = [];

    if (this.scaleType === 'time') {
      const min = Math.min(...values);
      const max = Math.max(...values);
      domain = [min, max];
    } else if (this.scaleType === 'linear') {
      values = values.map(v => Number(v));
      const min = Math.min(...values);
      const max = Math.max(...values);
      domain = [min, max];
    } else {
      domain = values;
    }

    this.xSet = values;
    return domain;
  }

  public getYDomain(): any[] {
    if (this.valueDomain) {
      return this.valueDomain;
    }

    const domain = [];

    for (const results of this.results) {
      for (const d of results.series) {
        if (domain.indexOf(d.value) < 0) {
          domain.push(d.value);
        }
        if (d.min !== undefined) {
          if (domain.indexOf(d.min) < 0) {
            domain.push(d.min);
          }
        }
        if (d.max !== undefined) {
          if (domain.indexOf(d.max) < 0) {
            domain.push(d.max);
          }
        }
      }
    }

    let min = Math.min(...domain);
    const max = Math.max(...domain);
    if (!this.autoScale) {
      min = Math.min(0, min);
    }

    return [min, max];
  }

  public getSeriesDomain(): any[] {
    return this.results.map((d: any) => d.name);
  }

  public getXScale(domain: any, width: any): any {
    let scale;

    if (this.scaleType === 'time') {
      scale = scaleTime().range([0, width]).domain(domain);
    } else if (this.scaleType === 'linear') {
      scale = scaleLinear().range([0, width]).domain(domain);
    } else if (this.scaleType === 'ordinal') {
      scale = scalePoint().range([0, width]).padding(0.1).domain(domain);
    }

    return scale;
  }

  public getYScale(domain: any, height: any): any {
    const scale = scaleLinear().range([height, 0]).domain(domain);

    return scale;
  }

  public getScaleType(values: any): string {
    let date = true;
    let num = true;

    for (const value of values) {
      if (!this.isDate(value)) {
        date = false;
      }

      if (typeof value !== 'number') {
        num = false;
      }
    }

    if (date) return 'time';
    if (num) return 'linear';
    return 'ordinal';
  }

  public isDate(value: any): boolean {
    if (value instanceof Date) {
      return true;
    }

    return false;
  }

  public trackBy(index: any, item: any): string {
    return item.name;
  }

  public setColors(): void {
    let domain;
    if (this.schemeType === 'ordinal') {
      domain = this.seriesDomain;
    } else {
      domain = this.yDomain;
    }

    this.colors = new ColorHelper(this.scheme, this.schemeType, domain, this.customColors);
  }
}
