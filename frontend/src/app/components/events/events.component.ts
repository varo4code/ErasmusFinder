import { Component, OnInit } from '@angular/core';
import { EventosService } from 'src/app/services/eventos.service';

declare var $: any;

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  public lista_eventos: any;
  public id: any;

  constructor( public servicioEventos: EventosService) { }

  ngOnInit() {
    this.servicioEventos.getEventos().subscribe(
      res => {
        console.log(res);
        this.lista_eventos = res;
      },
      err => {
        console.log(err);
      }
    );
  }

  buscar() {
    const destino = $('#destino_buscado').val().toString();
    console.log(destino);
    this.servicioEventos.getEventosFiltrado(destino).subscribe(
      res => {
        console.log(res);
        this.lista_eventos = res;
      },
      err => {
        console.log(err);
      }
    );
  }
}
