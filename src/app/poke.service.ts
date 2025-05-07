import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PokeService {
    private url = 'https://pokeapi.co/api/v2/pokemon';

    constructor(private http: HttpClient) {}

    getPokemons(limit: number = 15, offset: number = 0): Observable<any> {
        const urlWithParams = `${this.url}?limit=${limit}&offset=${offset}`;
        return this.http.get<any>(urlWithParams).pipe(
            tap(res => 
                res.results.map((resPokes: any) => {
                    this.http.get<any>(resPokes.url).subscribe(result => resPokes.status = result);
                })
            ),
            retry(2),
            catchError(this.handleError)
        );
    }
	

    // Manipulação de erros
    handleError(error: HttpErrorResponse) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Erro ocorreu no lado do client
            errorMessage = error.error.message;
        } else {
            // Erro ocorreu no lado do servidor
            errorMessage = `Código do erro: ${error.status}, mensagem: ${error.message}`;
        }
        console.log(errorMessage);
        return errorMessage;
    }
}