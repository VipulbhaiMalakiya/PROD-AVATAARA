import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription, take } from 'rxjs';
import { ApiService } from 'src/app/_api/rxjs/api.service';
import { ChatReportMasterModel } from 'src/app/_models/chatReport';
import { AppService } from 'src/app/_services/app.service';

@Component({
    selector: 'app-escalation-depaetment-wise-report',
    templateUrl: './escalation-depaetment-wise-report.component.html',
    styleUrls: ['./escalation-depaetment-wise-report.component.css']
})
export class EscalationDepaetmentWiseReportComponent {
    isProceess: boolean = true;
    data: any[] = [];
    subscription?: Subscription;
    userData: any;
    masterName?: any;
    selectedValue?: any = 7;
    startDate?: any;
    endDate?: any;
    dateRangeError: boolean = false;
    totalRecord: any;
    term: any;
    page: number = 1;
    count: number = 0;
    tableSize: number = 7;
    tableSizes: any = [3, 6, 9, 12];
    constructor(
        private cd: ChangeDetectorRef,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private titleService: Title,
        private appService: AppService,
        private apiService: ApiService,
        private datePipe: DatePipe,
        private router: Router,

    ) {
        this.titleService.setTitle('CDC -Chat Report');
        const d: any = localStorage.getItem('userData');
        this.userData = JSON.parse(d);

        const oneWeekFromNow = new Date();
        this.endDate = this.datePipe.transform(
            oneWeekFromNow.toISOString().split('T')[0],
            'yyyy-MM-dd'
        );
        oneWeekFromNow.setDate(oneWeekFromNow.getDate() - 7);
        this.startDate = this.datePipe.transform(
            oneWeekFromNow.toISOString().split('T')[0],
            'yyyy-MM-dd'
        );
    }

    ngOnInit(): void {
        this.fatchData();
    }


    calculateIndex(page: number, index: number): number {
        return (page - 1) * this.tableSize + index + 1;
    }
    fatchData() {
        this.isProceess = true;
        var model: any = {
            startDate: this.datePipe.transform(this.startDate, 'yyyy-MM-dd'),
            endDate: this.datePipe.transform(this.endDate, 'yyyy-MM-dd'),
        };
        this.masterName = `/chatlist/escalation-depaetment-wise-report?startDate=${model.startDate}&endDate=${model.endDate}`;
        this.subscription = this.apiService
            .getAll(this.masterName)
            .pipe(take(1))
            .subscribe(
                (data) => {
                    if (data) {
                        console.log(data);

                        this.data = data.data;
                        this.count = this.data.length;
                        this.isProceess = false;
                        this.cd.detectChanges();
                    }
                },
                (error) => {
                    this.isProceess = false;
                }
            );
    }

    trackByFn(index: number, item: any): number {
        return item.categoryId;
    }

    onTableDataChange(event: any) {
        this.page = event;
    }
    onTableSizeChange(event: any): void {
        this.tableSize = event.target.value;
        this.page = 1;
    }
    onDownload() {
        const exportData = this.data.map((x) => {
            return {
                'Department': x?.departmentname || '',
                'Total Chat': x.totalAssChat || '',
                'Escalation': x?.escalation || 0,
                'Response': x?.response || '',
                'escalationSla': x?.escalationSla || '',
            };
        });
        const headers = [
            'Department',
            'Total Chat',
            'Escalation', 'Response', 'escalationSla'
        ];
        this.appService.exportAsExcelFile(exportData, 'Escalation Department Wise Report', headers);
    }

    sendMessage(dataItem: ChatReportMasterModel) {
        this.router.navigate([`/admin/inbox/${dataItem.customerId}`]);
        // window.location.href = `/admin/inbox/${dataItem.customerId}`
    }

    onValueChange(event: Event) {
        const target = event.target as HTMLSelectElement;
        this.selectedValue = target.value;
        const oneWeekFromNow = new Date();
        if (this.selectedValue === 'Today') {
            this.startDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'
            );
        } else if (this.selectedValue === 'Yesterday') {
            oneWeekFromNow.setDate(oneWeekFromNow.getDate() - 1);
            this.startDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'
            );
        } else if (this.selectedValue === '7') {
            oneWeekFromNow.setDate(oneWeekFromNow.getDate() - 7);
            this.startDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'
            );
        } else if (this.selectedValue === '30') {
            oneWeekFromNow.setDate(oneWeekFromNow.getDate() - 30);
            this.startDate = this.datePipe.transform(
                oneWeekFromNow.toISOString().split('T')[0],
                'yyyy-MM-dd'
            );
        }
        else if (this.selectedValue === 'custom data') {
            return;
        }

        this.isProceess = true;
        var model: any = {
            startDate: this.datePipe.transform(this.startDate, 'yyyy-MM-dd'),
            endDate: this.datePipe.transform(this.endDate, 'yyyy-MM-dd'),
        };
        this.masterName = `/chatlist/escalation-depaetment-wise-report?startDate=${model.startDate}&endDate=${model.endDate}`;
        this.subscription = this.apiService
            .getAll(this.masterName)
            .pipe(take(1))
            .subscribe(
                (data) => {
                    if (data) {
                        this.data = data.data;
                        this.isProceess = false;
                        this.cd.detectChanges();
                    }
                },
                (error) => {
                    this.isProceess = false;
                }
            );
    }

    submitDateRange() {
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        if (start > end) {
            this.dateRangeError = true;
        } else {
            this.dateRangeError = false;
            var model: any = {
                startDate: this.datePipe.transform(this.startDate, 'yyyy-MM-dd'),
                endDate: this.datePipe.transform(this.endDate, 'yyyy-MM-dd'),
            };
            this.masterName = `/chatlist/escalation-depaetment-wise-report?startDate=${model.startDate}&endDate=${model.endDate}`;
            this.isProceess = true;

            this.subscription = this.apiService
                .getAll(this.masterName)
                .pipe(take(1))
                .subscribe(
                    (data) => {
                        if (data) {
                            this.data = data.data;
                            this.isProceess = false;
                            this.cd.detectChanges();
                        }
                    },
                    (error) => {
                        this.isProceess = false;
                    }
                );
        }
    }
}
