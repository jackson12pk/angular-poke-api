import { Component, OnInit, HostListener } from '@angular/core';
import { PokeService } from './poke.service';
import {  } from 'rxjs';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
	pokemons: any[] = [];
    currentPage = 0;
    limit: number = 15;
    loading: boolean = false;

    constructor(private pokeService: PokeService) {}

    ngOnInit(): void {
        this.loadPokemons();
    }

    loadPokemons() {
        if (this.loading) return; // Evita múltiplas chamadas simultâneas

        this.loading = true;
        this.pokeService.getPokemons(this.limit, this.currentPage * this.limit).subscribe(
            data => {
                this.pokemons = [...this.pokemons, ...data.results];
                this.currentPage++;
                this.loading = false;
            },
            error => {
                console.error(error);
                this.loading = false;
            }
        );
    }

    @HostListener('window:scroll', ['$event'])
    onScroll(): void {
        const scrollPosition = window.scrollY + window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (scrollPosition >= documentHeight - 1 && !this.loading) {
            this.loadPokemons();
        }
    }

}
