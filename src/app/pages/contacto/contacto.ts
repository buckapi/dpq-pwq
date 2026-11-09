import { Component, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
@Component({ selector:'app-contacto', imports:[RouterLink], templateUrl:'./contacto.html' })
export class Contacto {
  constructor() { inject(Meta).updateTag({name:'description',content:'Contacta a DPQ en Monterrey para solicitar información o cotizaciones.'}); }
  protected enviar(name: string, email: string, subject: string, message: string): void {
    const text = ['Hola, quiero solicitar información a DPQ.', `Nombre: ${name}`, `Correo: ${email}`, `Productos: ${subject}`, `Mensaje: ${message}`].join('\n');
    window.location.href = 'https://wa.me/528121410334?text=' + encodeURIComponent(text);
  }
}
