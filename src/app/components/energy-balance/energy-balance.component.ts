import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';

@Component({
  selector: 'app-energy-balance',
  templateUrl: './energy-balance.component.html',
  styleUrls: ['./energy-balance.component.css']
})
export class EnergyBalanceComponent implements OnInit {

  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: '',
      center: 'title',
      right: 'prev,next today'
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    showNonCurrentDates: false,
    fixedWeekCount: false,
    contentHeight:"auto",
    dateClick: this.onDateClick.bind(this)
  };

  constructor() { }

  ngOnInit(): void {
    
  }

  onDateClick(res: any) {
    alert('Clicked on date : ' + res.dateStr);
  }

}