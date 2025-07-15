import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces/Users';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:3000/users');
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>('http://localhost:3000/users', user);
  }

  updateUser(id: string, user: User): Observable<User> {
    return this.http.put<User>(`http://localhost:3000/users/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:3000/users/${id}`);
  }

  getSelectedUser(id: string): Observable<User> {
    return this.http.get<User>(`http://localhost:3000/users/${id}`);
  }
}
