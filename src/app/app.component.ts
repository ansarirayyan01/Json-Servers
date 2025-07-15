import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UsersService } from './services/users.service';
import { User } from './interfaces/Users';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GetUsersComponent } from './get-users/get-users.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule, GetUsersComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'json-server';
  userList: User[] = [];
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

  addUser(user: User) {
    const duplicate = this.userList.some(u => u.email === user.email)

    if(duplicate){
      this.showDuplicatePopup = true;
      return
    }

    // Validate that all required fields are filled
    if (!user.name || !user.email || !user.age) {
      console.log('Form validation failed - missing required fields');
      return;
    }

    if (!this.selectUpdatedUser) {
      // Add new user
      this.userService.addUser(user).subscribe((data: User) => {
        this.userList.push(data);
        console.log('User added:', data);
      });
    } else {
      // Update existing user
      this.userService
        .updateUser(this.selectUpdatedUser!.id, user)
        .subscribe((data: User) => {
          // Update the user in the local array
          const index = this.userList.findIndex(
            (u) => u.id === this.selectUpdatedUser!.id
          );
          if (index !== -1) {
            this.userList[index] = data;
          }
          console.log('User updated:', data);
          // Reset the form and clear selected user
          this.selectUpdatedUser = undefined;
        });
    }
  }

  delUser(id: string) {
    this.userService.deleteUser(id).subscribe(() => {
      this.userList = this.userList.filter((user) => user.id !== id);
      console.log(`User with id ${id} deleted`);
    });
  }

  editUser(id: string) {
    this.userService.getSelectedUser(id).subscribe((data: User) => {
      this.selectUpdatedUser = data;
      console.log('User selected for update:', data);
    });
  }

  cancelEdit() {
    this.selectUpdatedUser = undefined;
  }

  openDeletePopup(id: string) {
    this.userIdToDelete = id;
    this.showPopUp = true;
  }

  confirmDelete() {
    if (this.userIdToDelete) {
      this.delUser(this.userIdToDelete);
    }
    this.showPopUp = false;
    this.userIdToDelete = undefined;
  }

  cancelDelete() {
    this.showPopUp = false;
    this.userIdToDelete = undefined;
  }

  closeDuplicatePopup(){
    this.showDuplicatePopup = false;
  }
}
