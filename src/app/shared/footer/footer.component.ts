import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'footer-cmp',
    templateUrl: 'footer.component.html',
    standalone: false
})

export class FooterComponent{
    test : Date = new Date();
}
