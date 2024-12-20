import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { clone } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService, EncrDecrService } from 'src/app/_services';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-default-login',
    templateUrl: './default-login.component.html',
    styleUrls: ['./default-login.component.css']
})
export class DefaultLoginComponent implements OnInit {
    loading = false;
    error = '';
    logUser: any;
    loginForm: any;
    logUsers: any;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private toastr: ToastrService,
        private titleService: Title,
        private EncrDecr: EncrDecrService
    ) {
        this.titleService.setTitle('CDC - Login');
        this.loginForm = this.formBuilder.group({ username: [null, Validators.required] });
    }

    ngOnInit(): void {
        const d: any = localStorage.getItem('userData');
        this.logUsers = JSON.parse(d);
        if (this.logUsers) {
            if (this.logUsers.role?.roleName == 'Admin') {
                this.router.navigate(['/admin/inbox']);
            } else if (this.logUsers.role?.roleName == 'User') {
                this.router.navigate(['/inbox']);
            } else if (this.logUsers.role?.roleName == 'Resolver') {
                this.router.navigate(['/inbox']);
            }
            else if (this.logUsers.role?.roleName == 'Approver') {
                this.router.navigate(['/assigned-ticket-list']);
                this.toastr.success('You are successfully logged in!');
            }
        }
    }

    onSubmit() {
        if (this.loginForm.invalid) {
            this.loginForm.controls['username'].markAsTouched();
            return;
        }

        let data: any = { loginUrl: this.loginForm.value.username };
        const subdomain = this.getSubdomainFromUrl(data.loginUrl).toLowerCase() ?? '';
        localStorage.setItem('loginUrl', subdomain ?? '');

        // Redirect logic
        const baseUrl = `${environment.ReqUrl}${environment.appUrl}`;
        const redirectUrl = subdomain ? `${environment.ReqUrl}${subdomain}.${environment.appUrl}` : baseUrl;

        window.location.href = redirectUrl;
    }

    getSubdomainFromUrl(loginUrl: string): string {
        try {
            let urlWithoutProtocol = loginUrl.replace(/(^\w+:|^)\/\//, '');
            const urlParts = urlWithoutProtocol.split(/[.:\/]+/);
            if (urlParts.length >= 1) {
                return urlParts[0].toLowerCase();
            } else {
                console.warn('Invalid login URL format.');
                return '';
            }
        } catch (error) {
            console.error('Error parsing the login URL:', error);
            return '';
        }
    }


    shouldShowError(controlName: string, errorName: string) {
        return (
            this.loginForm.controls[controlName].touched &&
            this.loginForm.controls[controlName].hasError(errorName)
        );
    }
}
