import { Component, OnInit, ElementRef} from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-chofer',
  templateUrl: './chofer.component.html',
  styleUrls: ['./chofer.component.css']
})
export class ChoferComponent implements OnInit {

  constructor(
    private auth: AuthService,
    public authService: AuthService,

  ) {

   }

  ngOnInit(): void {
  }

  logOut() {
    this.auth.SignOut()
  }


   
}
