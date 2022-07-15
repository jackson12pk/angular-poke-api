import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { Pokemons} from './poke';



@Injectable({
  providedIn: 'root'
})
export class PokeService {

  url: string = 'https://pokeapi.co/api/v2/pokemon?&limit=300'

  constructor( private http: HttpClient ) { }

  getPokemons(): Observable<any>{
    return this.http.get<any>(this.url)
    .pipe(
      tap(
        res => {
          res.results.map(
            (resPokes: any) => {
              this.http.get<any>(resPokes.url).subscribe( res => resPokes.status = res)
            }
          )
        }
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
      errorMessage = `Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  };


}
