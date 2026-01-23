import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

// Event Interfaces matching the API
export interface CalendarEvent {
  id?: string;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  all_day?: boolean;
  color?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateEventRequest {
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  all_day?: boolean;
  color?: string;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  all_day?: boolean;
  color?: string;
}

export interface EventsListResponse {
  events: CalendarEvent[];
  total: number;
}

export interface EventFilters {
  start_date?: string;
  end_date?: string;
  user_id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private apiUrl = 'https://api.devflowfix.com/api/v1/events/';

  private eventsSubject = new BehaviorSubject<CalendarEvent[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  events$ = this.eventsSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get all events with optional filters
   */
  getEvents(filters?: EventFilters): Observable<EventsListResponse> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    let params = new HttpParams();
    if (filters) {
      if (filters.start_date) params = params.set('start_date', filters.start_date);
      if (filters.end_date) params = params.set('end_date', filters.end_date);
      if (filters.user_id) params = params.set('user_id', filters.user_id);
    }

    return this.http.get<EventsListResponse>(this.apiUrl, { params }).pipe(
      tap(response => {
        this.eventsSubject.next(response.events);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.errorSubject.next(error.message || 'Failed to load events');
        throw error;
      })
    );
  }

  /**
   * Get events for a specific month
   */
  getEventsByMonth(year: number, month: number): Observable<EventsListResponse> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.get<EventsListResponse>(`https://api.devflowfix.com/api/v1/events/month/${year}/${month}`).pipe(
      tap(response => {
        this.eventsSubject.next(response.events);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.errorSubject.next(error.message || 'Failed to load events');
        throw error;
      })
    );
  }

  /**
   * Get a single event by ID
   */
  getEvent(eventId: string): Observable<CalendarEvent> {
    return this.http.get<CalendarEvent>(`${this.apiUrl}${eventId}/`);
  }

  /**
   * Create a new event
   */
  createEvent(event: CreateEventRequest): Observable<CalendarEvent> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.post<CalendarEvent>(this.apiUrl, event).pipe(
      tap(newEvent => {
        const currentEvents = this.eventsSubject.value;
        this.eventsSubject.next([...currentEvents, newEvent]);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.errorSubject.next(error.message || 'Failed to create event');
        throw error;
      })
    );
  }

  /**
   * Update an existing event
   */
  updateEvent(eventId: string, event: UpdateEventRequest): Observable<CalendarEvent> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.put<CalendarEvent>(`${this.apiUrl}${eventId}/`, event).pipe(
      tap(updatedEvent => {
        const currentEvents = this.eventsSubject.value;
        const index = currentEvents.findIndex(e => e.id === eventId);
        if (index !== -1) {
          currentEvents[index] = updatedEvent;
          this.eventsSubject.next([...currentEvents]);
        }
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.errorSubject.next(error.message || 'Failed to update event');
        throw error;
      })
    );
  }

  /**
   * Delete an event
   */
  deleteEvent(eventId: string): Observable<void> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.delete<void>(`${this.apiUrl}${eventId}/`).pipe(
      tap(() => {
        const currentEvents = this.eventsSubject.value;
        this.eventsSubject.next(currentEvents.filter(e => e.id !== eventId));
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.errorSubject.next(error.message || 'Failed to delete event');
        throw error;
      })
    );
  }

  /**
   * Clear any errors
   */
  clearError(): void {
    this.errorSubject.next(null);
  }
}
