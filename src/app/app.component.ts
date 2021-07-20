import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { BookingService } from 'src/service/booking.service';
import { Booking } from 'src/app/booking.interface';

import bookings from '../assets/bookings.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  rows = new Array(20);
  columns = new Array(100);
  showDialog = false;
  preferredSeat = '';
  bookingName = '';
  bookingSize = '1';
  bookingSizeValues = ['1', '2', '3', '4', '5'];
  bookingJsonList: Booking[] = bookings;

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.proccessAllBookings();
  }

  proccessAllBookings = () => {
    this.bookingJsonList.forEach((booking) => {
      this.bookingService.processBooking(booking);
    });
  };

  checkBooked(letterIndex: number, numberIndex: number) {
    const seat = `${this.getLetter(letterIndex)}${this.getNumber(numberIndex)}`;
    const containsSeat =
      this.getReservedSeats().filter((reservedSeat) => reservedSeat === seat)
        .length > 0;
    return containsSeat ? 'red' : 'black';
  }

  closeDialog() {
    this.showDialog = false;
  }

  addNewSeat() {
    this.bookingService.processBooking({
      bookingName: this.bookingName,
      preferredSeat: this.preferredSeat,
      bookingSize: parseInt(this.bookingSize),
      bookingNumber: Math.floor(Math.random() * (350 - 300 + 1)) + 300,
    });

    this.closeDialog();
  }

  getLetter(index: number) {
    return (index + 10).toString(36).toUpperCase();
  }
  getNumber(index: number) {
    return index < 9 ? `0${index + 1}` : `${index + 1}`;
  }

  getReservedSeats() {
    return this.bookingService.reservedSeats;
  }

  getAvailableSeatsList() {
    return this.bookingService.availableSeatsList;
  }

  rejectedBookedSize() {
    return this.bookingService.rejectedBookings.length;
  }

  groupBookedSize() {
    return this.bookingService.isGroupBooked.length;
  }

  seatsBookedSize() {
    return this.bookingService.isSeatBooked.length;
  }
  availableBooksSize() {
    return this.bookingService.availableSeatsList.length;
  }
  openDialog(letterIndex: number, numberIndex: number) {
    const seat = `${this.getLetter(letterIndex)}${this.getNumber(numberIndex)}`;
    this.preferredSeat = seat;
    this.showDialog = true;
  }
}
