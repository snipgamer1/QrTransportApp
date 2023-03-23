export interface UserI {
    uid: string,
    correo: string,
    role: 'usuario' | 'chofer'| 'admin',
    saldo: number,
}