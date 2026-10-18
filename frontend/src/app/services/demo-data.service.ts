import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, shareReplay } from 'rxjs';

export type DemoSector = {
  code: string; name: string; risk: number; level: string; areaHa: number;
  elevationM: number; ironOxides: number; ndvi: number; ndwi: number;
  signal: string; trendPct: number; recommendedAction: string;
};
export type DemoData = {
  context: { demo: boolean; source: string; siteName: string; dateAcquired: string;
    globalRisk: number; previousGlobalRisk: number; cloudPercentage: number;
    user: { name: string; role: string } };
  sectors: { demo: boolean; sectors: DemoSector[] };
  series: { source: string; months: string[]; sectors: Record<string,{
    risk: number[]; ironOxides: number[]; ndvi: number[]; ndwi: number[] }> };
  inspections: { source: string; routes: Array<{ id: string; type: string; sectorCodes: string[]; state: string }> };
  reports: { source: string; reports: Array<{ code: string; sectorCode: string }> };
};

/** Datos sintéticos locales: no se conecta con API de producción. */
@Injectable({ providedIn: 'root' })
export class DemoDataService {
  private http = inject(HttpClient);
  readonly data$ = forkJoin({
    context: this.http.get<DemoData['context']>('/assets/data/context.json'),
    sectors: this.http.get<DemoData['sectors']>('/assets/data/sectors.json'),
    series: this.http.get<DemoData['series']>('/assets/data/series.json'),
    inspections: this.http.get<DemoData['inspections']>('/assets/data/inspections.json'),
    reports: this.http.get<DemoData['reports']>('/assets/data/reports.json')
  }).pipe(shareReplay({ bufferSize: 1, refCount: false }));
}
