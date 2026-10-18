import { CommonModule, DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

/**
 * Adaptación funcional de las vistas exportadas por Google Stitch.
 * El HTML es parte fija y revisada del repositorio; nunca se interpola HTML de usuarios.
 * Los handlers inline de la exportación fueron eliminados y reemplazados por delegación
 * de eventos; no se evalúa código o acciones provenientes del DOM.
 */
@Component({
  selector: 'dar-stitch-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="dar-stitch-view" (click)="handleClick($event)" (submit)="handleSubmit($event)" (change)="handleChange($event)">
      <div *ngIf="loading" class="dar-route-loading" role="status">Cargando vista…</div>
      <div *ngIf="loadError" class="mx-auto p-6 max-w-xl" role="alert">
        <h1 class="text-2xl text-primary font-semibold">No se pudo cargar la página</h1>
        <p class="mt-3 text-gray-600">{{ loadError }}</p>
        <a href="/" class="underline text-secondary">Volver al inicio</a>
      </div>
      <div [innerHTML]="safeMarkup"></div>
    </main>
    <div *ngIf="toastText" class="dar-toast" [attr.role]="toastWarning ? 'alert' : 'status'" aria-live="polite" (click)="hideToast()">
      {{toastText}}
    </div>
  `
})
export class StitchPageComponent implements OnInit, OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly document = inject(DOCUMENT);
  private routeSubscription?: Subscription;
  private requestSubscription?: Subscription;
  private timer?: ReturnType<typeof setTimeout>;
  private screen = 'landing';

  safeMarkup: SafeHtml = '';
  loading = true;
  loadError = '';
  toastText = '';
  toastWarning = false;

  ngOnInit(): void {
    this.routeSubscription = this.route.data.subscribe(data => {
      this.screen = String(data['screen'] ?? 'landing');
      this.loadScreen();
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.requestSubscription?.unsubscribe();
    if (this.timer) clearTimeout(this.timer);
    this.document.body.className = '';
  }

  private loadScreen(): void {
    this.requestSubscription?.unsubscribe();
    this.loading = true;
    this.loadError = '';
    this.safeMarkup = '';
    this.document.body.className = '';
    const screen = this.screen;
    this.requestSubscription = this.http.get(`/assets/stitch/${screen}.html`, {responseType:'text'}).subscribe({
      next: markup => {
        const match = markup.match(/<!-- STITCH_BODY_CLASS: ([^>]*?) -->/);
        this.document.body.className = match?.[1] || 'bg-background-secondary font-body-md text-on-surface antialiased';
        // Only trusted, locally shipped Stitch HTML is ever loaded from our static assets.
        this.safeMarkup = this.sanitizer.bypassSecurityTrustHtml(markup);
        this.loading = false;
        this.cdr.detectChanges();
        this.decoratePage();
      },
      error: () => {
        this.loading = false;
        this.loadError = `No se encontró la vista '${screen}'. Compruebe los archivos estáticos.`;
        this.cdr.detectChanges();
      }
    });
  }

  private decoratePage(): void {
    const root = this.document.querySelector('.dar-stitch-view');
    if (!root) return;
    // Always synchronize sidebar active tab to the actual Angular route.
    root.querySelectorAll<HTMLElement>('aside nav a[data-path]').forEach(a => {
      const href = a.getAttribute('href');
      const active = href === this.router.url;
      a.classList.toggle('bg-secondary-soft', active);
      a.classList.toggle('text-primary-container', active);
      a.classList.toggle('font-semibold', active);
      if (active) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    // The original exported form supports a subset of interactions without a backend.
    if (this.screen === 'panel-general') {
      root.querySelectorAll<HTMLElement>('.layer-tab').forEach(tab => {
        tab.setAttribute('aria-pressed', String(tab.classList.contains('bg-primary-container')));
      });
    }
    // Tooltip meaning: the scientific values in the exported design are sample-only.
    const advisory = this.document.createElement('div');
    advisory.className = 'dar-placeholder-notice';
    advisory.setAttribute('data-demo-label', 'true');
    advisory.textContent = 'Vista de demostración · Los datos de Stitch son ilustrativos; pendiente conexión con FastAPI.';
    const pageContent = root.querySelector<HTMLElement>('.pl-\\[232px\\] main, .pl-\\[232px\\] > main, main:not(.dar-stitch-view)');
    if (this.screen.startsWith('panel-general') || ['sectores-priorizados','rutas-de-inspeccion','analisis-temporal','informes','configuracion','perfil'].includes(this.screen)) {
      (pageContent || root).appendChild(advisory);
    }
  }

  handleClick(event: MouseEvent): void {
    const origin = event.target as HTMLElement;
    const target = origin.closest<HTMLElement>('button, a, tr[data-stitch-action], [data-stitch-action], [role="button"]');
    if (!target) return;

    const anchor = target.closest<HTMLAnchorElement>('a[href]');
    if (anchor) {
      const href = anchor.getAttribute('href') || '';
      if (href.startsWith('/')) {
        event.preventDefault();
        if (anchor.dataset['logout'] === 'true') this.showToast('Sesión de demostración finalizada. La autenticación real requerirá FastAPI.');
        void this.router.navigateByUrl(href);
        return;
      }
      if (href === '#') {
        event.preventDefault();
        // Navigation placeholders are intentionally non-functional, not false success.
        this.showToast('Este enlace estará disponible tras integrar el servicio correspondiente.', true);
        return;
      }
    }

    const action = target.getAttribute('data-stitch-action') || '';
    if (action.includes("switchMode('drone')")) { this.switchInspectionMode('drone'); return; }
    if (action.includes("switchMode('ground')")) { this.switchInspectionMode('ground'); return; }
    if (/setAuthTab\('register'\)|toggleMode\('register'\)/.test(action)) {void this.router.navigateByUrl('/registro');return;}
    if (/setAuthTab\('login'\)|toggleMode\('login'\)/.test(action)) {void this.router.navigateByUrl('/login');return;}
    if (action.includes('togglePasswordVisibility')) {this.togglePassword('account-password');return;}
    if (action.includes("getElementById('auth-password')")) {this.togglePassword('auth-password');return;}
    if (action.includes('seleccionarSector(')) {
      this.selectSectorRow(target);
      return;
    }
    if (action.includes('column-menu-popover')) {
      this.document.getElementById('column-menu-popover')?.classList.toggle('hidden');
      return;
    }
    if (action.includes('mostrarModalFoto(')) {
      const match = action.match(/mostrarModalFoto\('([^']*)',\s*'([^']*)'\)/);
      const title = this.document.getElementById('modal-foto-titulo');
      const subtitle = this.document.getElementById('modal-foto-subtitulo');
      if(title)title.textContent = match?.[1] || 'Evidencia fotográfica';
      if(subtitle)subtitle.textContent = match?.[2] || '';
      this.document.getElementById('modal-foto-preview')?.classList.remove('hidden');
      return;
    }
    if (action.includes('cerrarModalFoto(')) { this.document.getElementById('modal-foto-preview')?.classList.add('hidden');return; }
    if (action.includes('modal-nuevo-informe')) {
      const modal=this.document.getElementById('modal-nuevo-informe');
      if(action.includes('remove(\'hidden\')'))modal?.classList.remove('hidden');
      else modal?.classList.add('hidden');
      return;
    }
    if (/descargar(Ficha|Recurso)\(/.test(action)) {this.missingBackend('La descarga de informes');return;}

    if (target.classList.contains('layer-tab')) { this.changeLayer(target);return; }
    if (target.classList.contains('password-toggle')) { this.togglePassword(target.getAttribute('data-target') || '');return; }
    if (target.id === 'toggle-mapbox-key') { this.togglePassword('mapbox-token');return; }
    if (target.id === 'toggle-llm-key') { this.togglePassword('llm-key');return; }
    if (target.id === 'toggle-sector-menu') {this.showToast('Seleccione un sector en la tabla o en el mapa. Los datos aún son de demostración.');return;}
    if (target.id === 'btn-save' || target.id === 'btn-save-profile') {this.missingBackend('Guardar los cambios');return;}
    if (target.id === 'btn-reset') {this.showToast('No se modificó ninguna configuración guardada.');return;}
    if (target.id === 'btn-update-pwd') {this.missingBackend('Cambiar la contraseña');return;}
    if (target.id === 'btn-terminate-sessions') {this.missingBackend('Cerrar otras sesiones');return;}
    if (target.id === 'link-forgot-pass') {void this.router.navigateByUrl('/recuperar-acceso');return;}
    if (target.id === 'file-input')return;

    if (target.matches('[aria-label="Notificaciones"]')) {this.toggleNotifications();return;}
    if (target.textContent?.toLowerCase().includes('descargar') && target.tagName==='BUTTON') {
      this.missingBackend('La exportación de archivos');return;
    }
    if (target.textContent?.toLowerCase().includes('generar orden') && target.tagName==='BUTTON') {
      this.missingBackend('La generación de órdenes de inspección');return;
    }
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    if (!form.reportValidity()) return;
    if (this.screen === 'login') {
      // Solo recorrido de prototipo: NO autentica ni crea una sesión real.
      void this.router.navigateByUrl('/app/panel-general');
    } else if (this.screen === 'registro') {
      const terms = form.querySelector<HTMLInputElement>('#terms-check');
      if (terms && !terms.checked) {this.showToast('Debe aceptar los términos para crear su cuenta.',true);return;}
      this.missingBackend('Validar la llave de producto y crear la cuenta');
    } else if (this.screen === 'recuperar-acceso') {
      this.missingBackend('Enviar el correo de recuperación');
    } else if (this.screen === 'perfil') {
      const one=form.querySelector<HTMLInputElement>('#new-password')?.value;
      const two=form.querySelector<HTMLInputElement>('#confirm-password')?.value;
      if (one !== two) {this.showToast('Las contraseñas no coinciden.',true);return;}
      this.missingBackend('Actualizar la contraseña');
    } else if (this.screen === 'informes') {
      this.missingBackend('Generar y registrar informes');
    } else {
      this.missingBackend('Enviar este formulario');
    }
  }

  handleChange(event: Event): void {
    const target=event.target as HTMLInputElement;
    if(target.type==='file') {
      const file = target.files?.[0];
      if(file) this.showToast(`Archivo seleccionado: ${file.name}. Para almacenarlo debe conectarse FastAPI.`);
    }
  }

  private switchInspectionMode(mode:'drone'|'ground'):void {
    const drone=this.document.getElementById('view-drone');
    const ground=this.document.getElementById('view-ground');
    drone?.classList.toggle('hidden',mode!=='drone');
    ground?.classList.toggle('hidden',mode!=='ground');
    drone?.classList.toggle('flex',mode==='drone');
    ground?.classList.toggle('flex',mode==='ground');
    for (const [name,id] of [['drone','tab-drone'],['ground','tab-ground']] as const) {
      const button=this.document.getElementById(id);
      const active=name===mode;
      button?.setAttribute('aria-selected',String(active));
      button?.classList.toggle('bg-surface-container-lowest',active);
      button?.classList.toggle('shadow-sm',active);
      button?.classList.toggle('text-primary',active);
    }
  }

  private changeLayer(selected:HTMLElement): void {
    this.document.querySelectorAll<HTMLElement>('.layer-tab').forEach(t => {
      const active=t===selected;
      t.classList.toggle('bg-primary-container',active);
      t.classList.toggle('text-on-primary',active);
      t.classList.toggle('shadow-sm',active);
      t.classList.toggle('bg-surface-container-lowest',!active);
      t.classList.toggle('text-text-body',!active);
      t.setAttribute('aria-pressed',String(active));
    });
    // IMPORTANT: switch styling only; real geospatial rasters require backend/map service.
    this.showToast('Capa seleccionada. La actualización de datos geoespaciales se conectará mediante FastAPI.');
  }

  private selectSectorRow(row:HTMLElement): void {
    this.document.querySelectorAll('tbody tr').forEach(el => {
      el.classList.remove('bg-secondary-soft','border-l-4','border-l-primary-container');
    });
    row.classList.add('bg-secondary-soft','border-l-4','border-l-primary-container');
  }

  private togglePassword(inputId:string):void {
    const input=this.document.getElementById(inputId) as HTMLInputElement|null;
    if(!input)return;
    input.type=input.type==='password'?'text':'password';
  }

  private toggleNotifications():void {
    const existing=this.document.getElementById('dar-notifications-popover');
    if(existing){existing.remove();return;}
    const popover=this.document.createElement('section');
    popover.id='dar-notifications-popover';
    popover.className='fixed top-16 right-6 w-80 z-[200] bg-white rounded-md p-5 shadow-xl border border-border-default';
    popover.setAttribute('role','dialog');
    popover.setAttribute('aria-label','Notificaciones');
    popover.innerHTML='<h2 class="font-semibold text-primary mb-2">Notificaciones</h2><p class="text-sm text-gray-600">Las alertas estarán disponibles cuando se conecten los datos del backend.</p>';
    this.document.body.appendChild(popover);
  }

  private missingBackend(action:string): void {
    this.showToast(`${action} requiere conexión con FastAPI. No se ha ejecutado ninguna operación real.`,true);
  }

  private showToast(message:string, warning=false):void {
    this.toastText=message;
    this.toastWarning=warning;
    this.cdr.detectChanges();
    if(this.timer)clearTimeout(this.timer);
    this.timer=setTimeout(()=>this.hideToast(),5000);
  }

  hideToast():void {
    this.toastText='';
    this.cdr.detectChanges();
  }
}