import { Routes } from '@angular/router';
import { StitchPageComponent } from './stitch-page.component';

export const routes: Routes = [
 {path:'',component:StitchPageComponent,data:{screen:'landing'}},
 {path:'login',component:StitchPageComponent,data:{screen:'login'}},
 {path:'registro',component:StitchPageComponent,data:{screen:'registro'}},
 {path:'recuperar-acceso',component:StitchPageComponent,data:{screen:'recuperar-acceso'}},
 {path:'app/panel-general',component:StitchPageComponent,data:{screen:'panel-general'}},
 {path:'app/sectores-priorizados',component:StitchPageComponent,data:{screen:'sectores-priorizados'}},
 {path:'app/rutas-de-inspeccion',component:StitchPageComponent,data:{screen:'rutas-de-inspeccion'}},
 {path:'app/analisis-temporal',component:StitchPageComponent,data:{screen:'analisis-temporal'}},
 {path:'app/informes',component:StitchPageComponent,data:{screen:'informes'}},
 {path:'app/configuracion',component:StitchPageComponent,data:{screen:'configuracion'}},
 {path:'app/perfil',component:StitchPageComponent,data:{screen:'perfil'}},
 {path:'**',redirectTo:''}
];