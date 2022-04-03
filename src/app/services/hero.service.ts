import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  public async getHero(heroId: number): Promise<any> {
    return this.http.get(`http://localhost:3000`, {
      params: {heroId: heroId.toString()}
    }).toPromise()
      .then((response) => response)
      .catch((error) => console.log(error));
  }

  public async sendEmail(subject: string, content: string, email: string): Promise<any> {
    const body = {subject, content, email};
    return this.http.post(`http://localhost:3000/email`, body)
      .subscribe((response) => response);

  }
}
