import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  titleChange: EventEmitter<string> = new EventEmitter();
}
