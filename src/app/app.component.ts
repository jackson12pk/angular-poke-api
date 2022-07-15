import { Component, OnInit } from '@angular/core';
import { PokeService } from './poke.service';
import {  } from 'rxjs';
import { Pokemons } from './poke';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  pokemons: any;

  constructor(private pokeService: PokeService){}

  ngOnInit(): void {
    this.getPokemons();
  }

  getPokemons() {
    this.pokeService.getPokemons().subscribe(
      resultado => {
        this.pokemons = resultado.results;
      },
      erro => {
        if(erro.status == 400) {
          console.log(erro);
        }
      }
    );
  }


}
