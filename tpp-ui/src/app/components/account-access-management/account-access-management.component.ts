import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Account} from '../../models/account.model';
import {User} from '../../models/user.model';
import {UserService} from '../../services/user.service';
import {merge, Observable, Subject, Subscription,} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountService} from '../../services/account.service';
import {InfoService} from '../../commons/info/info.service';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';
import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-account-access-management',
    templateUrl: './account-access-management.component.html',
    styleUrls: ['./account-access-management.component.scss']
})
export class AccountAccessManagementComponent implements OnInit, OnDestroy {
  private maxScaWeight = 100;
  private timeout = 3000;
  private dueTime = 200;

    constructor(private userService: UserService,
                private accountService: AccountService,
                private infoService: InfoService,
                private formBuilder: FormBuilder,
                private router: Router,
                private route: ActivatedRoute) {

        this.route.params.subscribe(params => {
            this.accountService.getAccount(params.id).subscribe((account: Account) => {
                this.account = account;
            });
        });
    }

    users: User[];
    account: Account;
    subscription = new Subscription();

    accountAccessForm: FormGroup;

    submitted = false;
    errorMessage = null;
    accessTypes = ['OWNER', 'READ', 'DISPOSE'];

    @ViewChild('instance', {static: true}) instance: NgbTypeahead;
    focus$ = new Subject<User[]>();
    click$ = new Subject<User[]>();

    ngOnInit() {
        this.listUsers();
        this.setupAccountAccessFormControl();
    }

    setupAccountAccessFormControl(): void {
        this.accountAccessForm = this.formBuilder.group({
            iban: [''],
            currency: [''],
            id: ['', Validators.required],
            scaWeight: [0, [Validators.required, Validators.min(0), Validators.max(this.maxScaWeight)]],
            accessType: ['READ', [Validators.required]],
            accountId: ['']
        });
    }

    listUsers() {
        const MAX_VALUE = 2147483647; // for getting all the available user
        this.userService.listUsers( 0 , MAX_VALUE).subscribe((resp: any) => {
            this.users = resp.users;
        });
    }

    onSubmit() {
        this.submitted = true;
        if (this.accountAccessForm.invalid) {
            return;
        }

        this.accountAccessForm.get('iban').setValue(this.account.iban);
        this.accountAccessForm.get('currency').setValue(this.account.currency);
        this.accountAccessForm.get('accountId').setValue(this.account.id);
        this.accountService.updateAccountAccessForUser(this.accountAccessForm.getRawValue()).subscribe(() => {
            this.infoService
                .openFeedback('Access to account ' + this.account.iban + ' successfully granted', {duration: 3000});

            setTimeout(() => {
                this.router.navigate(['/users/all'])
            }, this.timeout)

        });
    }

    search: (obs: Observable<string>) => Observable<User[]> = (text$: Observable<string>) => {
        const debouncedText$ = text$.pipe(debounceTime(this.dueTime), distinctUntilChanged());
        const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
        const inputFocus$ = this.focus$;
        return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$)
            .pipe(
                map((searchText: string) => (searchText === '' ? this.users : this.users.filter(user => user.login.toLowerCase()
                    .indexOf(searchText.toLowerCase()) > -1)))
            );
    };

    public inputFormatterValue = (user: User) => {
        if (user) {
            return user.login;
        }
        return user;
    };

    public resultFormatterValue = (user: User) => {
        if (user) {
            this.accountAccessForm.get('id').setValue(user.id);
            return user.login;
        }
        return user;
    };

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
