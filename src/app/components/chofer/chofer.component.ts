import { Component, OnInit, ElementRef} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-chofer',
  templateUrl: './chofer.component.html',
  styleUrls: ['./chofer.component.css']
})
export class ChoferComponent implements OnInit {
  dataUser: any;
  userData: any;
  userId: any;

  userRole: any; 
  isAdmin: any;
  usersaldo: any;
  useruid: any;

  qr: FormGroup;
  qruid: any;


  constructor(
    private afAuth: AngularFireAuth,
    private auth: AuthService,
    private router: Router,
    public authService: AuthService,
    private fb: FormBuilder,


  ) {
    this.qr = this.fb.group({
      text: [''],
    })

    this.pago();


   }

  ngOnInit(): void {
    const user = this.afAuth.currentUser;
    this.afAuth.currentUser.then(user => {
      if(user) {
        this.dataUser = user;
      }
  }) 
  }

  logOut() {
    this.auth.SignOut()
  }
  pago(){
    
    this.afAuth.currentUser.then(user => {
      if(user) {
        this.authService.isUserAdmin(this.auth.userData.uid).subscribe(userData => {
          this.userRole = userData.role;
          this.usersaldo = userData.saldo;
          this.useruid = userData.uid;

          
          
          console.log('User role:', this.userRole);
           if(this.userRole === 'chofer'){
             this.router.navigate(['/chofer']);
           }
        return this.userRole;
        return this.usersaldo;
        

        });
        
      } 
    })
  }

  envio(){
    this.qruid = this.qr.value.text;
    console.log(this.qruid);

    this.authService.getUserData(this.qruid);

    this.resetForm(); 

    

    
    
  }


   resetForm() {
        this.qr.reset();
    }
}
