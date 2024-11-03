import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import { AES, enc } from 'crypto-js';

@Injectable({ providedIn: 'root' })
export class LocalService {
  private key = environment.lsKey;
  
  constructor() { }

  public setItem(key: string, value: string) {
    localStorage.setItem(key, this.encrypt(value));
  }

  public getEncItem(key: string) {
    const data = localStorage.getItem(key) || "";
    return this.decrypt(data);
  }

  public getItem(key: string) {
    return localStorage.getItem(key) || "";
  }

  public removeItem(key: string) {
    localStorage.removeItem(key);
  }

  public clearItems() {
    localStorage.clear();
  }

  private encrypt(txt: string): string {
    const encrypted = AES.encrypt(txt,  this.key).toString();
    const wordArray = enc.Base64.parse(encrypted);
    return enc.Hex.stringify(wordArray);
  }

  private decrypt(txtToDecrypt: string) {
    const wordArray = enc.Hex.parse(txtToDecrypt);
    const toDecrypt = enc.Base64.stringify(wordArray);
    return AES.decrypt(toDecrypt, this.key).toString(CryptoJS.enc.Utf8);
  }
}