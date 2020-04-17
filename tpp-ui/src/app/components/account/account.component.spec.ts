import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Account } from '../../models/account.model';
import { IconModule } from '../../commons/icon/icon.module';
import { InfoModule } from '../../commons/info/info.module';
import { InfoService } from '../../commons/info/info.service';
import { AccountStatus, AccountType, UsageType } from '../../models/account.model';
import { AccountService } from '../../services/account.service';
import { AccountComponent } from './account.component';
import { ConvertBalancePipe } from '../../pipes/convertBalance.pipe';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TppService } from '../../services/tpp.service';
import { Router } from '@angular/router';

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;
  let accountService: AccountService;
  let infoService: InfoService;
  let tppService: TppService;
  let modalService: NgbModal;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, InfoModule, IconModule],
      declarations: [AccountComponent, ConvertBalancePipe],
      providers: [AccountService, NgbModal, TppService, InfoService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    infoService = TestBed.get(InfoService);
    accountService = TestBed.get(AccountService);
    router = TestBed.get(Router);
    tppService = TestBed.get(TppService);
    modalService = TestBed.get(NgbModal);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAccountReport on ngOnInit', () => {
    const getAccountSpy = spyOn(accountService, 'getAccountReport').and.callThrough();

    component.ngOnInit();

    expect(getAccountSpy).toHaveBeenCalled();
  });

  it('should check if account is deleted', () => {
    component.accountReport = {
      details: {
        id: 'XXXXXX',
        iban: 'DE35653635635663',
        bban: 'BBBAN',
        pan: 'pan',
        maskedPan: 'maskedPan',
        currency: 'EUR',
        msisdn: 'MSISDN',
        name: 'Pupkin',
        product: 'Deposit',
        accountType: AccountType.CASH,
        accountStatus: AccountStatus.DELETED,
        bic: 'BIChgdgd',
        usageType: UsageType.PRIV,
        details: '',
        linkedAccounts: '',
        balances: [],
      },
      accesses: [
        {
          userLogin: 'xxxxx',
          scaWeight: 4,
        },
      ],
    };
    const deleteSpy = spyOn(tppService, 'deleteAccountTransactions').and.returnValue(of({ id: component.accountReport.details.id }));
    const infoServiceOpenFeedbackSpy = spyOn(infoService, 'openFeedback');

    component.deleteAccountTransactions();
    expect(deleteSpy).toHaveBeenCalledTimes(1);
    expect(infoServiceOpenFeedbackSpy).toHaveBeenCalledWith(
      `Transactions of ${component.accountReport.details.iban} successfully deleted`,
      {
        severity: 'info',
      }
    );
  });

  it('should go to account detail', () => {
    component.accountReport = {
      details: {
        id: 'XXXXXX',
        iban: 'DE35653635635663',
        bban: 'BBBAN',
        pan: 'pan',
        maskedPan: 'maskedPan',
        currency: 'EUR',
        msisdn: 'MSISDN',
        name: 'Pupkin',
        product: 'Deposit',
        accountType: AccountType.CASH,
        accountStatus: AccountStatus.DELETED || AccountStatus.BLOCKED,
        bic: 'BIChgdgd',
        usageType: UsageType.PRIV,
        details: '',
        linkedAccounts: '',
        balances: [],
      },
      accesses: [
        {
          userLogin: 'xxxxx',
          scaWeight: 4,
        },
      ],
    };
    const infoServiceOpenFeedbackSpy = spyOn(infoService, 'openFeedback');
    component.goToAccountDetail();
    expect(infoServiceOpenFeedbackSpy).toHaveBeenCalledWith('You can not Grant Accesses to a Deleted/Blocked account', {
      severity: 'error',
    });
  });

  it('should check if account is deleted', () => {
    component.accountReport = {
      details: {
        id: 'XXXXXX',
        iban: 'DE35653635635663',
        bban: 'BBBAN',
        pan: 'pan',
        maskedPan: 'maskedPan',
        currency: 'EUR',
        msisdn: 'MSISDN',
        name: 'Pupkin',
        product: 'Deposit',
        accountType: AccountType.CASH,
        accountStatus: AccountStatus.DELETED || AccountStatus.BLOCKED,
        bic: 'BIChgdgd',
        usageType: UsageType.PRIV,
        details: '',
        linkedAccounts: '',
        balances: [],
      },
      accesses: [
        {
          userLogin: 'xxxxx',
          scaWeight: 4,
        },
      ],
    };
    expect(component.isAccountDeleted).toBeFalsy();
  });

  it('should assign account-report after server call', () => {
    const accountReport = {
      details: {
        id: 'XXXXXX',
        iban: 'DE35653635635663',
        bban: 'BBBAN',
        pan: 'pan',
        maskedPan: 'maskedPan',
        currency: 'EUR',
        msisdn: 'MSISDN',
        name: 'Pupkin',
        product: 'Deposit',
        accountType: AccountType.CASH,
        accountStatus: AccountStatus.ENABLED,
        bic: 'BIChgdgd',
        usageType: UsageType.PRIV,
        details: '',
        linkedAccounts: '',
        balances: [],
      },
      accesses: [
        {
          userLogin: 'xxxxx',
          scaWeight: 4,
        },
      ],
    };

    spyOn(accountService, 'getAccountReport').and.returnValue(of(accountReport));
    component.getAccountReport();
    expect(component.getAccountReport).not.toBeUndefined();
  });
});
