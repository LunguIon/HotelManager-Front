import {Component, OnInit} from '@angular/core';
import { Room } from './room';
import { RoomService } from './room.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
    public rooms: Room[] = [];
    public editRoom : Room | null = null;
    public deleteRoom : Room | null = null;

    constructor(private roomService: RoomService) {}
    ngOnInit() {
        this.getRooms();
    }

    public getRooms(): void {
        this.roomService.getRooms().subscribe(
            (response: Room[]) => {
                this.rooms = response;
            },
            (error: HttpErrorResponse) => {
                alert(error.message);
            }
        );
    }
    public onAddRoom(addForm: NgForm): void {
        document.getElementById('add-room-form')?.click();
        this.roomService.addRoom(addForm.value).subscribe(
          (response: Room) => {
            console.log(response);
            this.getRooms(); // Assuming you have a getRooms method to fetch and update the room list
            addForm.reset();
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
            addForm.reset();
          }
        );
      }
      
      public onUpdateRoom(room: Room): void {
        this.roomService.updateRoom(room).subscribe(
          (response: Room) => {
            console.log(response);
            this.getRooms();
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
        );
      }
      
      public onDeleteRoom(roomNumber: number): void {
        this.roomService.deleteRoom(roomNumber).subscribe(
          (response: void) => {
            console.log(response);
            this.getRooms();
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
        );
      }
      
      public searchRooms(key: string): void {
        console.log(key);
        const results: Room[] = [];
        for (const room of this.rooms) {
          if (
            room.roomType.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
            room.availability.toString().toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
            room.price.toString().toLowerCase().indexOf(key.toLowerCase()) !== -1
          ) {
            results.push(room);
          }
        }
        this.rooms = results;
        if (results.length === 0 || !key) {
          this.getRooms();
        }
      }
      
      public onOpenModal(room: Room | null, mode: string): void {
        const container = document.getElementById('main-container');
        const button = document.createElement('button');
        button.type = 'button';
        button.style.display = 'none';
        button.setAttribute('data-toggle', 'modal');
        if (mode === 'add') {
          button.setAttribute('data-target', '#addRoomModal');
        }
        if (mode === 'edit') {
          this.editRoom = room;
          button.setAttribute('data-target', '#updateRoomModal');
        }
        if (mode === 'delete') {
          this.deleteRoom = room;
          button.setAttribute('data-target', '#deleteRoomModal');
        }
        container?.appendChild(button);
        button.click();
      }

}
