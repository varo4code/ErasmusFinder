import { Component, OnInit } from '@angular/core';
import { MapService } from 'src/app/services/map.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

declare var $: any;
declare var L: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {


  public paises = [];
  public datosuser = {
    latitud: 0,
    longitud: 0,
    pointer: L.layerGroup()
  };
  public marcadores = L.layerGroup();
  public mapa: any;
  public coordBuscada = {
    lati: 0,
    longi: 0
  };

  constructor(private servicioPaises: MapService, private servicioUsuarios: UsuariosService) { }

   ngOnInit() {
    this.cargarMarcadores(this.marcadores);
    this.servicioPaises.verPaises().subscribe(
      res => {
        res.forEach(pais => {
          const objeto = {
            label : pais.nombre,
            coord : [pais.latitud, pais.longitud]
          };
          this.paises.push(objeto);
        });
      },
      err => {
        console.log(err);
      }
    );

    this.cargarMapa(this.datosuser);
    this.updateDatos(this.datosuser);
  }

  updateDatos(datos: any) { // Actualizar datosuser
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition( function(position) {
        console.log(position);
        datos.latitud = position.coords.latitude;
        datos.longitud = position.coords.longitude;
      });
    }
  }


  autocompletar(lista: Array<any>, coor: any) {// AUTOCOMPLETAR CAMPOS DE BUSQUEDA
    console.log('FUNCION-> autocompletar()');

    $('#pais_buscado').autocomplete({
      source: lista,
      minLength: 2,
      classes: {
        'ui-autocomplete': 'lista_autocomplete',
        'ui-menu-item': 'elemento_autocomplete'
      },
      focus(event, ui) {
         event.preventDefault();
         $('#lati_buscada').val(ui.item.coord[0]);
         $('#long_buscada').val(ui.item.coord[1]);
         $('#pais_buscado').val(ui.item.label);
         coor.lati = ui.item.coord[0];
         coor.longi = ui.item.coord[1];
     },
     select(event, ui) {
         event.preventDefault();
         $('#lati_buscada').val(ui.item.coord[0]);
         $('#long_buscada').val(ui.item.coord[1]);
         $('#pais_buscado').val(ui.item.label);
         coor.lati = ui.item.coord[0];
         coor.longi = ui.item.coord[1];
      }
    });
  }


  cargarMapa(datos:any) {       // CREAR LOS MAPAS
    this.mapa = L.map('mapamundi');

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attributon: '&copy;<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.mapa);
    datos.pointer.addTo(this.mapa);
    this.marcadores.addTo(this.mapa);

    this.mapa.setZoom(10);
    this.cargarUbi(datos);
  }

  cargarMarcadores(marcas: any){  // CARGAR LOS MARCADORES DE LOS USUARIOS

    this.servicioUsuarios.getUsuarios().subscribe(
      res => {
        console.log(res);
        res.forEach(usu => {
          var mar = L.marker([usu.last_latitud, usu.last_longitud], {
            icon: L.icon({
                iconUrl: './assets/img/iconos/mapa/user-pointer.png',
                iconSize: [20, 20],
            })
        }).bindPopup('<h5>' + usu.nombre + ' ' + usu.apellidos + '</h5><br><a href="#">Ver perfil</a>');
          marcas.addLayer(mar);
        });
      },
      err => {
        console.log(err);
      });
    }

  cargarUbi(datos: any) {     // CARGAR MI UBICACION
    console.log('cargando Ubi');
    datos.pointer.clearLayers();
    this.mapa.locate({setView: true, maxZoom: 16})
        .on('locationfound', function(e) {

            var marcador = L.marker([e.latitude, e.longitude], {
                icon: L.icon({
                    iconUrl: './assets/img/iconos/mapa/you.png',
                    iconSize: [23, 23],
                }),
            }).bindPopup('<h5>Tu ubicacion</h5>');
            datos.latitud = e.latitude;
            datos.longitud = e.longitude;
            const radio = L.circleMarker([e.latitude, e.longitude], {
                radius: 20,
                weight: 1,
                color: 'white',
                fillColor: '#34ebb7',
                fillOpacity: 0.2
            });
            datos.pointer.addLayer(marcador);
            datos.pointer.addLayer(radio);
            console.log('datos', datos);
        })
       .on('locationerror', function(e){
            console.log(e);
            alert('Debes permitir la geolocalizacion');
        });

  }

  miUbi() { // BOTON MI UBICACION
    this.updateDatos(this.datosuser);
    console.log('MI UBI', this.datosuser.latitud, this.datosuser.longitud);
    this.mapa.flyTo([this.datosuser.latitud, this.datosuser.longitud], 15);
  }

  buscar() {  // BOTON BUSCAR
    const lon = $('#long_buscada').val();
    const lati = $('#lati_buscada').val();

    this.mapa.flyTo([lati, lon], 7);
  }

}