import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';
import { MimodeloPerfil } from 'src/app/modelos/mimodeloPerfil';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public user: MimodeloPerfil;

  constructor(private router: Router, private formBuilder: FormBuilder, private serviceuser: UsuariosService) {

  }


  ngOnInit() {
    const idUser = localStorage.getItem('id');
    this.serviceuser.leerUser(idUser).subscribe(
      res => {
        if (!res[0]) {
          this.router.navigate(['/login']);
        }
        this.user = res[0];
        console.log(idUser);
        console.log(res);
        if (this.user.accessToken === localStorage.getItem('token')) {
          console.log('token correcto');
        } else {
          this.router.navigate(['/login']);
        }

      },
      err => {
        this.router.navigate(['/login']);
        console.log(err);
      }
    );
  }

}
