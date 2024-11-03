import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'percentSymbol' })
export class PercentagePipe implements PipeTransform {
  transform(value: number): string {
    return value + '%';
  }
}