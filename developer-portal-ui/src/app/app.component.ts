import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { LoginService } from '../services/login.service';
import { ConstantService } from '../services/constant.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private actRoute: ActivatedRoute,
    public dataService: DataService,
    public loginService: LoginService,
    public constantService: ConstantService
  ) {}

  goToPage(page) {
    this.router.navigateByUrl(`/${page}`);
  }

  onActivate(ev) {
    this.dataService.currentRouteUrl = this.actRoute[
      '_routerState'
    ].snapshot.url;
  }

  ngOnInit() {}
}
