import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import { EnergyBalanceReport } from 'src/app/common/energy-balance-report';
import { EnergyBalanceService } from 'src/app/services/energy-balance.service';
import { ErrorHandlingService } from 'src/app/services/error-handling.service';
import { NotificationService } from 'src/app/services/notification.service';

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

  energyBalanceReport: EnergyBalanceReport;

  constructor(private energyBalanceService: EnergyBalanceService, private notificationService: NotificationService,
              private errorHandlingService: ErrorHandlingService) { }

  ngOnInit(): void {}

  onDateClick(res: any) {
    this.energyBalanceService.getEnergyBalanceReport(res.dateStr).subscribe(
      (response: EnergyBalanceReport) => {
        this.showEnergyBalanceReport(response);
      },
      (errorResponse: HttpErrorResponse) => {
        this.errorHandlingService.handleErrorResponse(errorResponse);
      }
    );
  }

  private showEnergyBalanceReport(energyBalanceReport: EnergyBalanceReport) {
    this.energyBalanceReport = energyBalanceReport;
    document.getElementById("energyBalanceReport-modal-open").click();
  }
}