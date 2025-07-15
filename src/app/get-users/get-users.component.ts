import { Component } from '@angular/core';
import { UsersService } from '../services/users.service';
import { User } from '../interfaces/Users';

@Component({
  selector: 'app-get-users',
  standalone: true,
  imports: [],
  templateUrl: './get-users.component.html',
  styleUrl: './get-users.component.css',
})
export class GetUsersComponent {
  userList: User[] =  [];
  selectUpdatedUser: User | undefined;
  showPopUp = false;
  showDuplicatePopup = false;
  userIdToDelete: string | undefined;

  constructor(private userService: UsersService) {}
  ngOnInit() {
    this.userService.getUsers().subscribe((data: User[]) => {
      this.userList = data;
    });
  }

  editUser(id: string) {
    this.userService.getSelectedUser(id).subscribe((data: User) => {
      this.selectUpdatedUser = data;
      console.log('User selected for update:', data);
    });
  }

  openDeletePopup(id: string) {
    this.userIdToDelete = id;
    this.showPopUp = true;
  }
}
