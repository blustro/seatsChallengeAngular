import { Injectable } from '@angular/core';
import { Booking } from 'src/app/booking.interface';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  reservedSeats: string[] = [];
  availableSeatsList: string[] = [];
  rejectedBookings: string[] = [];
  isGroupBooked: string[] = [];
  isSeatBooked: string[] = [];

  constructor() {
    this.availableSeatsList = this.createAvailableSeat();
  }

  createAvailableSeat() {
    let availableSeats = [];

    for (let i = 0; i < 20; i++) {
      const getAlphabet = (i + 10).toString(36).toUpperCase();
      for (let j = 0; j < 100; j++) {
        const has0 = j < 9 ? `0${j + 1}` : j + 1;
        availableSeats.push(`${getAlphabet}${has0}`);
      }
    }
    return availableSeats;
  }

  isSeatAlreadyReserved(newBooking: Booking) {
    const SEAT_GAP = 2;

    let isSeatReserved = false;

    for (let index = 0; index < newBooking.bookingSize + 2; index++) {
      const isBookedSeat =
        this.reservedSeats.filter((reservedSeat) => {
          return reservedSeat === this.changePreferredSeat(newBooking, index);
        }).length > 0;

      if (isBookedSeat) {
        isSeatReserved = true;
        break;
      }
    }
    return isSeatReserved;
  }

  changePreferredSeat(booking: Booking, newBookingSize: number) {
    if (booking && booking.preferredSeat) {
      let nextSeat = parseInt(booking.preferredSeat.slice(1)) + newBookingSize;
      return `${booking.preferredSeat.slice(0, 1)}${
        nextSeat < 10 ? `0${nextSeat}` : `${nextSeat}`
      }`;
    }

    return '';
  }

  processBooking(booking: Booking) {
    const NEXT_SEAT = 1;
    const MAX_ROW_SIZE = 100;

    if (
      (booking.preferredSeat &&
        parseInt(booking.preferredSeat.slice(1)) > MAX_ROW_SIZE) ||
      booking.bookingSize < 1 ||
      booking.bookingSize > 5
    ) {
      this.rejectedBookings.push('Rejected Booking');
      return;
    }

    if (this.isSeatAlreadyReserved(booking)) {
      const suggestion = {
        ...booking,
        preferredSeat: this.changePreferredSeat(booking, NEXT_SEAT),
      };

      this.processBooking(suggestion);
    } else {
      if (this.checkPreviousSeatReserved(booking)) {
        const covidSpace = {
          ...booking,
          preferredSeat: this.changePreferredSeat(booking, NEXT_SEAT),
        };
        this.createNewSeatReservation(covidSpace);
      } else {
        this.createNewSeatReservation(booking);
      }
    }
  }

  checkPreviousSeatReserved(booking: Booking) {
    return (
      this.reservedSeats.filter(
        (reservedSeat) =>
          reservedSeat === this.changeToPreviousSeatReserved(booking)
      ).length > 0
    );
  }

  changeToPreviousSeatReserved(booking: Booking) {
    if (
      booking &&
      booking.preferredSeat &&
      parseInt(booking.preferredSeat.slice(1)) > 0
    ) {
      let previousSeat = parseInt(booking.preferredSeat.slice(1)) - 1;
      return `${booking.preferredSeat.slice(0, 1)}${
        previousSeat < 10 ? `0${previousSeat}` : `${previousSeat}`
      }`;
    }

    return '';
  }

  createNewSeatReservation(booking: Booking) {
    this.reservedSeats.push(`${booking.preferredSeat}`.replace(/\n.*$/gi, ''));
    this.reservedSeats.sort();

    console.log(`${booking.preferredSeat}:${booking.bookingName}`);

    if (booking.bookingSize > 2) {
      this.isGroupBooked.push('Groups');
    } else {
      this.isSeatBooked.push('Seat');
    }

    if (booking.bookingSize > 1) {
      this.reservationNextSeats(booking);
    }
    this.removeSeatInAvailableSeatList(booking.preferredSeat);
  }

  reservationNextSeats(booking: Booking) {
    for (let index = 1; index < booking.bookingSize; index++) {
      const newBooking = {
        ...booking,
        preferredSeat: this.changePreferredSeat(booking, index),
        bookingSize: booking.bookingSize - index,
      };

      if (this.isSeatAvailable(newBooking.preferredSeat)) {
        this.createNewSeatReservation(newBooking);
      }
    }
  }

  removeSeatInAvailableSeatList(preferredSeat: string) {
    if (preferredSeat) {
      this.availableSeatsList = this.availableSeatsList.filter(
        (availableSeat) => availableSeat !== preferredSeat
      );
    }
  }

  isSeatAvailable(preferredSeat: string) {
    return (
      this.availableSeatsList.filter(
        (availableSeat) => availableSeat === preferredSeat
      ).length > 0
    );
  }

  suggestNewSeatReservation(booking: Booking) {
    const newBooking = {
      ...booking,
      preferredSeat: this.changePreferredSeat(booking, 2),
    };
    const seatAvailable = this.isSeatAvailable(
      this.changePreferredSeat(newBooking, 2)
    );

    if (seatAvailable) {
      this.processBooking(newBooking);
    }
  }
}
