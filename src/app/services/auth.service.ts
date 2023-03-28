import { Injectable, NgZone } from '@angular/core';
import { UserI } from '../models/models';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { map, Observable } from 'rxjs';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; // Save logged in user data
  usersaldo: any;
  useruid: any;
  chofersaldo: any;
  choferuid: any;
  
  

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    // private db: AngularFireDatabase
    private firebase: AngularFireDatabase

  ) {
    /* Guardar datos de usuario en almacenamiento local cuando
    iniciado sesión y configuración nula cuando se cierra la sesión */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['dashboard']);
          }
        });
        
      })

  }

  // Sign up with email/password
  SignUp(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
        // this.SendVerificationMail();
        this.SetUserData(result.user);
        this.insertRegister(result.user);
      })
  }

  // // Send email verfificaiton when new user sign up
  // SendVerificationMail() {
  //   return this.afAuth.currentUser
  //     .then((u: any) => u.sendEmailVerification())
  //     .then(() => {
  //       this.router.navigate(['verify-email-address']);
  //     });
  // }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  // Devuelve verdadero cuando el usuario inicia sesión y se verifica el correo electrónico
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null  ? true : false;
  }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider()).then((res: any) => {
      this.router.navigate(['dashboard']);
    });
  }

  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.router.navigate(['dashboard']);

        this.SetUserData(result.user);
      })
      .catch((error) => {
        window.alert(error);
      });
  }
 

 /* Configuración de datos de usuario al iniciar sesión con nombre de usuario/contraseña,
  regístrese con nombre de usuario/contraseña e inicie sesión con autenticación social
  proveedor en la base de datos de Firestore usando AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: UserI = {
      uid: user.uid,
      correo: user.email,
      role: 'usuario',
      saldo: 8
      // displayName: user.displayName,
      // photoURL: user.photoURL,
      // emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    });
  }

  insertRegister(userId: any){

    // this.firebase.object(this.collection).set({...user});

    this.firebase.list('register').push({
      uid: userId.uid,

    });

  }
  isAuth() {
    return this.afAuth.authState.pipe(map(auth => auth));
  }

  consultar(userId: any): Observable<any>{
    // this.firebase.object(this.collection).set({...user});

    return this.firebase.list(`register/${userId}`).valueChanges();

  }
  
  
  getUserData(userId: any ) {
    this.isUserAdmin(userId).subscribe(userData => {
      this.usersaldo  = userData.saldo -8;
      return this.usersaldo;
      

    });
    
    if(this.usersaldo < 0){
      //saldo insuficiente
      this.error()

    }else{
      this.setsaldo(userId).catch((error) => {
        this.error()
      });
      this.sucess();
      this.setsaldochofer();
      // this.insertRegister(userId);

    }
    
    
  }
  setsaldochofer(){
    this.afAuth.currentUser.then(user => {
      if(user) {
        this.isUserAdmin(this.userData.uid).subscribe(userData => {
          this.chofersaldo = userData.saldo + 8;
          this.choferuid = userData.uid;

        return this.chofersaldo, this.choferuid;
        });
        
      } 
    })

    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      'users/' + this.choferuid
    );
    const userData= {
      saldo: this.chofersaldo

    };
    return userRef.update(userData
    );
  }

  setsaldo(userId: any){
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${userId}`
    );
    const userData= {
      saldo: this.usersaldo

    };
    return userRef.update(userData
    );
  }


  sucess(){
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Acceso Correcto',
      showConfirmButton: false,
      timer: 1500
    })
  }
  error(){
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'Saldo Insuficiente',
      showConfirmButton: false,
      timer: 1500
    })
  }
  


  isUserAdmin(userUid: any) {
    return this.afs.doc<any>(`users/${userUid}`).valueChanges();
  }

  // inserttickets(userId: any){
  //   this.isUserAdmin(userId).subscribe(userData => {
  //     this.useruid  = userData.uid;
  //     console.log(this.useruid);

  //     return this.useruid;

  //   });
    
  //   // this.firebase.object(this.collection).set({...user});

  //   this.firebase.list('tickets').push({
  //     uid: this.useruid,
  //   });

  // }

  




}

