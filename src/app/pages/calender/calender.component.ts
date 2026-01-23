import { KeyValuePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { EventInput, CalendarOptions, DateSelectArg, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ModalComponent } from '../../shared/components/ui/modal/modal.component';
import { EventsService, CalendarEvent, CreateEventRequest, UpdateEventRequest } from '../../shared/services/events.service';
import { Subscription } from 'rxjs';

interface FullCalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
    apiId?: string;
    description?: string;
  };
}

// Map API colors to calendar color classes
const COLOR_MAP: Record<string, string> = {
  'danger': 'Danger',
  'success': 'Success',
  'primary': 'Primary',
  'warning': 'Warning',
  'red': 'Danger',
  'green': 'Success',
  'blue': 'Primary',
  'yellow': 'Warning',
  'orange': 'Warning'
};

const REVERSE_COLOR_MAP: Record<string, string> = {
  'Danger': 'danger',
  'Success': 'success',
  'Primary': 'primary',
  'Warning': 'warning'
};

@Component({
  selector: 'app-calender',
  imports: [
    CommonModule,
    FormsModule,
    KeyValuePipe,
    FullCalendarModule,
    ModalComponent
  ],
  templateUrl: './calender.component.html',
  styles: ``
})
export class CalenderComponent implements OnInit, OnDestroy {

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  events: FullCalendarEvent[] = [];
  selectedEvent: FullCalendarEvent | null = null;
  eventTitle = '';
  eventStartDate = '';
  eventEndDate = '';
  eventLevel = '';
  eventDescription = '';
  isOpen = false;
  isLoading = false;
  isSaving = false;
  error: string | null = null;

  calendarsEvents: Record<string, string> = {
    Danger: 'danger',
    Success: 'success',
    Primary: 'primary',
    Warning: 'warning'
  };

  calendarOptions!: CalendarOptions;
  private subscriptions: Subscription[] = [];

  constructor(private eventsService: EventsService) {}

  ngOnInit() {
    this.initCalendarOptions();
    this.loadEvents();

    // Subscribe to loading and error states
    this.subscriptions.push(
      this.eventsService.loading$.subscribe(loading => {
        this.isLoading = loading;
      }),
      this.eventsService.error$.subscribe(error => {
        this.error = error;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initCalendarOptions() {
    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next addEventButton',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      selectable: true,
      events: this.events,
      select: (info) => this.handleDateSelect(info),
      eventClick: (info) => this.handleEventClick(info),
      datesSet: (dateInfo) => this.handleDatesSet(dateInfo),
      customButtons: {
        addEventButton: {
          text: 'Add Event +',
          click: () => this.openModal()
        }
      },
      eventContent: (arg) => this.renderEventContent(arg),
      loading: (isLoading) => {
        this.isLoading = isLoading;
      }
    };
  }

  private loadEvents() {
    this.eventsService.getEvents().subscribe({
      next: (response) => {
        this.events = this.mapApiEventsToCalendar(response.events);
        this.updateCalendarEvents();
      },
      error: (err) => {
        console.error('Failed to load events:', err);
        this.error = 'Failed to load events. Please try again.';
      }
    });
  }

  private handleDatesSet(dateInfo: any) {
    // Load events for the visible date range
    const year = dateInfo.start.getFullYear();
    const month = dateInfo.start.getMonth() + 1;

    this.eventsService.getEventsByMonth(year, month).subscribe({
      next: (response) => {
        this.events = this.mapApiEventsToCalendar(response.events);
        this.updateCalendarEvents();
      },
      error: (err) => {
        console.error('Failed to load events for month:', err);
      }
    });
  }

  private mapApiEventsToCalendar(apiEvents: CalendarEvent[]): FullCalendarEvent[] {
    return apiEvents.map(event => ({
      id: event.id || Date.now().toString(),
      title: event.title,
      start: event.start_date,
      end: event.end_date,
      allDay: event.all_day ?? true,
      extendedProps: {
        calendar: COLOR_MAP[event.color?.toLowerCase() || 'primary'] || 'Primary',
        apiId: event.id,
        description: event.description
      }
    }));
  }

  private mapCalendarEventToApi(event: FullCalendarEvent): CreateEventRequest | UpdateEventRequest {
    return {
      title: this.eventTitle,
      description: this.eventDescription,
      start_date: this.eventStartDate,
      end_date: this.eventEndDate || undefined,
      all_day: true,
      color: REVERSE_COLOR_MAP[this.eventLevel] || 'primary'
    };
  }

  private updateCalendarEvents() {
    if (this.calendarComponent) {
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.removeAllEvents();
      this.events.forEach(event => calendarApi.addEvent(event));
    } else {
      this.calendarOptions = {
        ...this.calendarOptions,
        events: this.events
      };
    }
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.resetModalFields();
    this.eventStartDate = selectInfo.startStr;
    this.eventEndDate = selectInfo.endStr || selectInfo.startStr;
    this.openModal();
  }

  handleEventClick(clickInfo: EventClickArg) {
    const event = clickInfo.event as any;
    this.selectedEvent = {
      id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr,
      extendedProps: {
        calendar: event.extendedProps.calendar,
        apiId: event.extendedProps.apiId,
        description: event.extendedProps.description
      }
    };
    this.eventTitle = event.title;
    this.eventStartDate = event.startStr;
    this.eventEndDate = event.endStr || '';
    this.eventLevel = event.extendedProps.calendar;
    this.eventDescription = event.extendedProps.description || '';
    this.openModal();
  }

  handleAddOrUpdateEvent() {
    if (!this.eventTitle.trim()) {
      this.error = 'Please enter an event title';
      return;
    }

    if (!this.eventStartDate) {
      this.error = 'Please select a start date';
      return;
    }

    this.isSaving = true;
    this.error = null;

    if (this.selectedEvent && this.selectedEvent.extendedProps.apiId) {
      // Update existing event
      const updateData: UpdateEventRequest = {
        title: this.eventTitle,
        description: this.eventDescription,
        start_date: this.eventStartDate,
        end_date: this.eventEndDate || undefined,
        all_day: true,
        color: REVERSE_COLOR_MAP[this.eventLevel] || 'primary'
      };

      this.eventsService.updateEvent(this.selectedEvent.extendedProps.apiId, updateData).subscribe({
        next: (updatedEvent) => {
          // Update local events array
          this.events = this.events.map(ev =>
            ev.extendedProps.apiId === this.selectedEvent!.extendedProps.apiId
              ? {
                  id: ev.id,
                  title: this.eventTitle,
                  start: this.eventStartDate,
                  end: this.eventEndDate,
                  allDay: true,
                  extendedProps: {
                    calendar: this.eventLevel,
                    apiId: updatedEvent.id,
                    description: this.eventDescription
                  }
                }
              : ev
          );
          this.updateCalendarEvents();
          this.isSaving = false;
          this.closeModal();
        },
        error: (err) => {
          console.error('Failed to update event:', err);
          this.error = 'Failed to update event. Please try again.';
          this.isSaving = false;
        }
      });
    } else {
      // Create new event
      const createData: CreateEventRequest = {
        title: this.eventTitle,
        description: this.eventDescription,
        start_date: this.eventStartDate,
        end_date: this.eventEndDate || undefined,
        all_day: true,
        color: REVERSE_COLOR_MAP[this.eventLevel] || 'primary'
      };

      this.eventsService.createEvent(createData).subscribe({
        next: (newEvent) => {
          const calendarEvent: FullCalendarEvent = {
            id: newEvent.id || Date.now().toString(),
            title: this.eventTitle,
            start: this.eventStartDate,
            end: this.eventEndDate,
            allDay: true,
            extendedProps: {
              calendar: this.eventLevel,
              apiId: newEvent.id,
              description: this.eventDescription
            }
          };
          this.events = [...this.events, calendarEvent];
          this.updateCalendarEvents();
          this.isSaving = false;
          this.closeModal();
        },
        error: (err) => {
          console.error('Failed to create event:', err);
          this.error = 'Failed to create event. Please try again.';
          this.isSaving = false;
        }
      });
    }
  }

  handleDeleteEvent() {
    if (!this.selectedEvent?.extendedProps.apiId) {
      return;
    }

    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    this.isSaving = true;
    this.error = null;

    this.eventsService.deleteEvent(this.selectedEvent.extendedProps.apiId).subscribe({
      next: () => {
        this.events = this.events.filter(
          ev => ev.extendedProps.apiId !== this.selectedEvent!.extendedProps.apiId
        );
        this.updateCalendarEvents();
        this.isSaving = false;
        this.closeModal();
      },
      error: (err) => {
        console.error('Failed to delete event:', err);
        this.error = 'Failed to delete event. Please try again.';
        this.isSaving = false;
      }
    });
  }

  resetModalFields() {
    this.eventTitle = '';
    this.eventStartDate = '';
    this.eventEndDate = '';
    this.eventLevel = 'Primary';
    this.eventDescription = '';
    this.selectedEvent = null;
    this.error = null;
  }

  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
    this.resetModalFields();
  }

  renderEventContent(eventInfo: any) {
    const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar?.toLowerCase()}`;
    return {
      html: `
        <div class="event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm">
          <div class="fc-daygrid-event-dot"></div>
          <div class="fc-event-time">${eventInfo.timeText || ''}</div>
          <div class="fc-event-title">${eventInfo.event.title}</div>
        </div>
      `
    };
  }
}
