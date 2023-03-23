import { Component,Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {

  buttons: any[] = [];
  @Input() user: any;

  constructor(public route: Router,
    private auth: AuthService
    ) { }

  ngOnInit(): void {
    if (this.user.role === 'usuario') {
      this.buttons.push({ name: 'Inicio', iconClass: 'fas fa-home', routing: '/' });
      this.buttons.push({ name: 'Cuenta', iconClass: 'far fa-calendar-alt', routing: '/cuenta' });
      this.buttons.push({ name: 'Unidad', iconClass: 'fas fa-book-open', routing: '/unidad' });
      this.buttons.push({ name: 'Perfil', iconClass: 'fas fa-user-circle', routing: '/profile' });
    } else {
      this.buttons.push({ name: 'Inicio', iconClass: 'fas fa-home', routing: '/' });
      this.buttons.push({ name: 'Cuenta', iconClass: 'far fa-calendar-alt', routing: '/cuenta' });
      this.buttons.push({ name: 'Perfil', iconClass: 'fas fa-user-circle', routing: '/profile' });
    }
  }

  logOut() {
    this.auth.SignOut()
  }

}
