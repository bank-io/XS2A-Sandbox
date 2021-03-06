import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from './app.component';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {HttpClient} from '@angular/common/http';
import {Pipe, PipeTransform} from '@angular/core';
import {Router} from '@angular/router';
import {NgHttpLoaderModule} from 'ng-http-loader';
import {HttpLoaderFactory, LanguageService} from "./services/language.service";
import {DataService} from "./services/data.service";
import {CustomizeService} from "./services/customize.service";
import {NavComponent} from "./components/common/nav/nav.component";
import {FooterComponent} from "./components/common/footer/footer.component";
import {of} from "rxjs";
import {MarkdownModule, MarkdownService} from "ngx-markdown";
import {TrackingIdService} from "./services/tracking-id.service";

const TRANSLATIONS_EN = require('../assets/content/i18n/en.json');
const TRANSLATIONS_DE = require('../assets/content/i18n/de.json');
const TRANSLATIONS_ES = require('../assets/content/i18n/es.json');
const TRANSLATIONS_UA = require('../assets/content/i18n/ua.json');

describe('AppComponent', () => {
  let comp: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let translate: TranslateService;
  let http: HttpTestingController;
  let languageService: LanguageService;
  let dataService: DataService;
  let customizeService: CustomizeService;
  let router: Router;

  const DataServiceStub = {
    setRouterUrl: (val: string) => {
    },
    getRouterUrl: () => '',
  };

  const CustomizeServiceStub = {
    custom: () => false,
    currentTheme: of({
      globalSettings: {
        logo: '../assets/content/Logo_XS2ASandbox.png',
        footerLogo: '../assets/content/Logo_XS2ASandbox.png',
        cssVariables: {
          colorPrimary: '#054f72',
          colorSecondary: '#eed52f',
          fontFamily: 'Arial, sans-serif',
          headerBG: '#ffffff',
          headerFontColor: '#000000',
          footerBG: '#054f72',
          footerFontColor: '#ffffff',
        },
        facebook: 'https://www.facebook.com/adorsysGmbH/',
        linkedIn: 'https://www.linkedin.com/company/adorsys-gmbh-&-co-kg/',
      },
      contactInfo: {
        img: 'Rene.png',
        name: 'René Pongratz',
        position: 'Software Architect & Expert for API Management',
        email: 'psd2@adorsys.de',
      },
      officesInfo: [
        {
          city: 'Nürnberg',
          company: 'adorsys GmbH & Co. KG',
          addressFirstLine: 'Fürther Str. 246a, Gebäude 32 im 4.OG',
          addressSecondLine: '90429 Nürnberg',
          phone: '+49(0)911 360698-0',
          email: 'psd2@adorsys.de',
        },
        {
          city: 'Frankfurt',
          company: 'adorsys GmbH & Co. KG',
          addressFirstLine: 'Frankfurter Straße 63 - 69',
          addressSecondLine: '65760 Eschborn',
          email: 'frankfurt@adorsys.de',
          facebook: 'https://www.facebook.com/adorsysGmbH/',
          linkedIn:
            'https://www.linkedin.com/company/adorsys-gmbh-&-co-kg/',
        },
      ],
      tppSettings: {
        tppDefaultNokRedirectUrl: 'https://www.google.com',
        tppDefaultRedirectUrl:
          'https://adorsys-platform.de/solutions/xs2a-sandbox/',
      },
      supportedLanguages: ['en', 'ua', 'de', 'es'],
      pagesSettings: {
        contactPageSettings: {
          showContactCard: true,
          showQuestionsComponent: true
        },
        homePageSettings: {
          showQuestionsComponent: true,
          showProductHistory: true,
          showSlider: true
        },
        navigationBarSettings: {
          allowedNavigationSize: 3
        }
      }
    }),
    setStyling: (theme) => {
    },
    normalizeLanguages: (theme) => {
      return CustomizeServiceStub.currentTheme.toPromise()
    }
  };

  const LanguageServiceStub = {
    language: 'en',
    currentLanguage: of('en'),
    initializeTranslation: () => {
    },
    getLang: () => LanguageServiceStub.language,
  };

  const TrackingIdServiceStub = {
    trackingId: [{
      trackingId: ""
    }]
  };

  @Pipe({name: 'translate'})
  class TranslatePipe implements PipeTransform {
    transform(value) {
      const tmp = value.split('.');
      return tmp[1];
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        TranslatePipe,
        NavComponent,
        FooterComponent
      ],
      imports: [
        MarkdownModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
          },
        }),
        NgHttpLoaderModule.forRoot(),
      ],
      providers: [
        MarkdownService,
        TranslateService,
        {provide: TrackingIdService, useValue: TrackingIdServiceStub},
        {provide: DataService, useValue: DataServiceStub},
        {provide: CustomizeService, useValue: CustomizeServiceStub},
        {provide: LanguageService, useValue: LanguageServiceStub},
      ],
    })
      .compileComponents()
      .then(() => {
        translate = TestBed.get(TranslateService);
        http = TestBed.get(HttpTestingController);
        dataService = TestBed.get(DataService);
        customizeService = TestBed.get(CustomizeService);
        languageService = TestBed.get(LanguageService);
        router = TestBed.get(Router);
      });
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AppComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', async(() => {
    expect(comp).toBeTruthy();
  }));

})
;
