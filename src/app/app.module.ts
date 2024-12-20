import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorInterceptor } from './_helpers';
import { LoginComponent } from './_layouts/login/login.component';
import { DefoultComponent } from './_layouts/defoult/defoult.component';
import { SharedModule } from './shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ForgotPasswordComponent } from './_layouts/forgot-password/forgot-password.component';
import { SignUpComponent } from './_layouts/sign-up/sign-up.component';
import { EncrDecrService } from './_services/encr-decr.service';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from './_api/rxjs/api.service';
import { HttpService } from './_api/rxjs/http.service';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { rootReducer } from './State/reducers';
import { environment } from 'src/environments/environment';
import { InboxLayoutComponent } from './_layouts/inbox-layout/inbox-layout.component';
import { MainlayoutComponent } from './_layouts/mainlayout/mainlayout.component';
import { ResetPasswordComponent } from './_layouts/reset-password/reset-password.component';
import { NotFoundComponent } from './_layouts/not-found/not-found.component';
import { LocationStrategy, HashLocationStrategy, DatePipe } from '@angular/common';
import { AuthGaurdGuard } from './_helpers/auth-gaurd.guard';
import { GoogleMapsModule } from '@angular/google-maps';  // added
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PrivacyPolicyComponent } from './modules/privacy-policy/privacy-policy.component';
import { ContactUsComponent } from './_layouts/contact-us/contact-us.component';
import { SendCatalogueComponent } from './modules/send-catalogue/send-catalogue.component';
import { DefaultLoginComponent } from './modules/2024/default-login/default-login.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        DefoultComponent,
        ForgotPasswordComponent,
        SignUpComponent,
        InboxLayoutComponent,
        MainlayoutComponent,
        ResetPasswordComponent,
        NotFoundComponent,
        PrivacyPolicyComponent,
        ContactUsComponent,
        SendCatalogueComponent,
        DefaultLoginComponent,


    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        HttpClientModule,
        SharedModule,
        ReactiveFormsModule,
        ToastrModule.forRoot({
            progressBar: true,
            positionClass: 'toast-top-right',
            closeButton: true,
            timeOut: 3000,
            progressAnimation: 'increasing',
            preventDuplicates: true,
            disableTimeOut: false,
        }),
        BrowserAnimationsModule,
        NgbModule,
        StoreModule.forRoot(rootReducer),
        NgMultiSelectDropDownModule.forRoot(),
        StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
        GoogleMapsModule
    ],
    providers: [
        ApiService,
        HttpService,
        EncrDecrService,
        HttpClient,
        DatePipe,
        NgbActiveModal,
        AuthGaurdGuard,
        { provide: LocationStrategy, useClass: HashLocationStrategy }

        // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
