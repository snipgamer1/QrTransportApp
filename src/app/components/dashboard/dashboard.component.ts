import { Component, EventEmitter, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import {
  NgxQrcodeStylingComponent,
  NgxQrcodeStylingService,
} from 'ngx-qrcode-styling';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from "../../services/auth.service";
import { Options } from 'ngx-qrcode-styling';





@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dataUser: any;

  userData: any;
  // elementType= NgxQrcodeElementTypes.CANVAS
  // correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH
  

 


  

  constructor(private afAuth: AngularFireAuth,
      private router: Router,
      private toastr: ToastrService,
      private auth: AuthService,
      public authService: AuthService,
      private testDI: NgxQrcodeStylingService
      ) { }

  ngOnInit(): void {
    // const user = this.afAuth.currentUser;
  //   this.afAuth.currentUser.then(user => {
  //     if(user) {
  //       this.dataUser = user;
  //     }
  // }) 
  
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
    console.log(this.authService.userData.uid)
  }
  

 
  

  
}


