import { Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import {
  NgxQrcodeStylingComponent,
  NgxQrcodeStylingService,
} from 'ngx-qrcode-styling';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from "../../services/auth.service";






@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dataUser: any;
  userData: any;
  userId: any;
  // elementType= NgxQrcodeElementTypes.CANVAS
  // correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH
  // pagos: FormGroup;
  userRole: any; 
  isAdmin: any;
  usersaldo: any;
  useruid: any;



  

  constructor(private afAuth: AngularFireAuth,
      private router: Router,
      private toastr: ToastrService,
      private auth: AuthService,
      public authService: AuthService,
      private testDI: NgxQrcodeStylingService,
      private fb: FormBuilder,

      ) { 

        // this.pagos = this.fb.group({
        //   role: [''],
        // });
         this.pago();
      }
  

  ngOnInit(): void {
    // this.getCurrentUser()

    const user = this.afAuth.currentUser;
    this.afAuth.currentUser.then(user => {
      if(user) {
        this.dataUser = user;
      }
  }) 
  
  // this.authService.user$.subscribe(user => {
  //   if (user) {
  //     this.userId = user.uid;
  //     this.userService.getUserData(this.userId).subscribe(userData => {
  //       this.userData = userData;
  //     });
  //   }
  // });
  


  
  }
  

  logOut() {
    this.auth.SignOut()
  }

  delete() {
    this.afAuth.currentUser.then(user => {
      if(user) {
        this.dataUser = user;
        this.afAuth.currentUser.then(user => user?.delete());
        
      } else {
        this.router.navigate(['/login']);
        this.toastr.success('El usuario fue Eliminado con exito', 'Usuario Eliminado');
      }
    })
  }
  /**
   * Download
   */
  onDownload(qrcode: NgxQrcodeStylingComponent): void {
    qrcode.download('file-name.png').subscribe((res) => {
      // TO DO something!
      console.log('download:', res);
    });
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
  // getCurrentUser() {
  //   this.authService.isAuth().subscribe(auth => {
  //     if (auth) {
  //       const userUid = auth.uid;
  //       this.authService.isUserAdmin(userUid).subscribe(userRole => {
  //         this.isAdmin = Object.assign({}, userRole.roles).hasOwnProperty('admin');
  //         // this.isAdmin = true;
  //       })
  //     }
  //   })
  // }
  

 
  

  
}


