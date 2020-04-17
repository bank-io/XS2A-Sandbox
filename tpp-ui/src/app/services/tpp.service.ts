import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TppService {
  public url = `${environment.tppBackend}`;

  constructor(private http: HttpClient) {}

  deleteTpp() {
    return this.http.delete(this.url + '/self');
  }

  deleteAccountTransactions(accountId: string) {
    return this.http.delete(this.url + '/account/' + accountId);
  }
}
