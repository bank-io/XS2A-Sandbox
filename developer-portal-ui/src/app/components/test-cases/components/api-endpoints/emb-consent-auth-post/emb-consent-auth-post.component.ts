import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-emb-consent-auth-post',
  templateUrl: './emb-consent-auth-post.component.html',
})
export class EmbConsentAuthPostComponent implements OnInit {
  activeSegment = 'documentation';
  headers: object = {
    'TPP-Explicit-Authorisation-Preferred': 'false',
    'PSU-ID': 'YOUR_USER_LOGIN',
  };

  constructor() {}

  changeSegment(segment) {
    if (segment === 'documentation' || segment === 'play-data') {
      this.activeSegment = segment;
    }
  }

  ngOnInit() {}
}
