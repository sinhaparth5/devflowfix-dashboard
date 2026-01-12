import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { OnboardingService, OnboardingTask, OnboardingState } from '../../services/onboarding.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-onboarding-progress',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    @if (showProgress && !isComplete) {
      <div class="fixed bottom-6 right-6 z-[100] animate-slide-up">
        <!-- Collapsed state (just the button) -->
        @if (isCollapsed) {
          <button (click)="toggleCollapsed()"
                  class="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group">
            <!-- Circular progress -->
            <div class="relative w-10 h-10">
              <svg class="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                <path class="text-gray-200 dark:text-gray-700"
                      stroke="currentColor"
                      stroke-width="3"
                      fill="none"
                      d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831
                         a 15.9155 15.9155 0 0 1 0 -31.831"/>
                <path class="text-brand-500 transition-all duration-500"
                      stroke="currentColor"
                      stroke-width="3"
                      stroke-linecap="round"
                      fill="none"
                      [attr.stroke-dasharray]="progressPercentage + ', 100'"
                      d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831
                         a 15.9155 15.9155 0 0 1 0 -31.831"/>
              </svg>
              <span class="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">
                {{ completedCount }}/{{ totalTasks }}
              </span>
            </div>
            <div class="text-left">
              <p class="text-sm font-semibold text-gray-900 dark:text-white">Setup Progress</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ progressPercentage }}% complete</p>
            </div>
            <svg class="w-5 h-5 text-gray-400 group-hover:text-brand-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
            </svg>
          </button>
        } @else {
          <!-- Expanded state -->
          <div class="w-[360px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <!-- Header -->
            <div class="bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-4">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-white font-bold">Getting Started</h3>
                  <p class="text-white/80 text-sm">{{ progressPercentage }}% complete</p>
                </div>
                <div class="flex items-center gap-2">
                  <button (click)="restartTour()"
                          class="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          title="Restart tour">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                  </button>
                  <button (click)="toggleCollapsed()"
                          class="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>
                </div>
              </div>
              <!-- Progress bar -->
              <div class="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
                <div class="h-full bg-white rounded-full transition-all duration-500"
                     [style.width.%]="progressPercentage"></div>
              </div>
            </div>

            <!-- Task list -->
            <div class="p-4 max-h-[300px] overflow-y-auto">
              <ul class="space-y-2">
                @for (task of tasks; track task.id) {
                  <li>
                    <button (click)="handleTaskClick(task)"
                            class="w-full flex items-start gap-3 p-3 rounded-xl transition-all duration-200"
                            [class.bg-green-50]="isTaskCompleted(task.id)"
                            [class.dark:bg-green-900/20]="isTaskCompleted(task.id)"
                            [class.hover:bg-gray-50]="!isTaskCompleted(task.id)"
                            [class.dark:hover:bg-gray-700/50]="!isTaskCompleted(task.id)">
                      <!-- Checkbox -->
                      <div class="flex-shrink-0 mt-0.5">
                        @if (isTaskCompleted(task.id)) {
                          <div class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                            </svg>
                          </div>
                        } @else {
                          <div class="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-full group-hover:border-brand-500 transition-colors"></div>
                        }
                      </div>
                      <!-- Task info -->
                      <div class="flex-1 text-left">
                        <p class="text-sm font-medium"
                           [class.text-green-700]="isTaskCompleted(task.id)"
                           [class.dark:text-green-400]="isTaskCompleted(task.id)"
                           [class.text-gray-900]="!isTaskCompleted(task.id)"
                           [class.dark:text-white]="!isTaskCompleted(task.id)"
                           [class.line-through]="isTaskCompleted(task.id)">
                          {{ task.title }}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {{ task.description }}
                        </p>
                      </div>
                      <!-- Arrow icon for incomplete tasks -->
                      @if (!isTaskCompleted(task.id) && task.route) {
                        <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                      }
                    </button>
                  </li>
                }
              </ul>
            </div>

            <!-- Footer -->
            <div class="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
              <button (click)="hideProgress()"
                      class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                Hide progress checklist
              </button>
            </div>
          </div>
        }
      </div>
    }

    <!-- Completion celebration -->
    @if (showCelebration) {
      <div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
        <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md mx-4 text-center animate-bounce-in">
          <!-- Confetti icon -->
          <div class="w-20 h-20 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Setup Complete!
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            You've completed all the setup tasks. You're now ready to start using DevFlowFix to its full potential!
          </p>
          <button (click)="dismissCelebration()"
                  class="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-xl transition-colors">
            Let's Go!
          </button>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes slide-up {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes bounce-in {
      0% {
        transform: scale(0.3);
        opacity: 0;
      }
      50% {
        transform: scale(1.05);
      }
      70% {
        transform: scale(0.9);
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }

    .animate-slide-up {
      animation: slide-up 0.4s ease-out forwards;
    }

    .animate-fade-in {
      animation: fade-in 0.3s ease-out forwards;
    }

    .animate-bounce-in {
      animation: bounce-in 0.5s ease-out forwards;
    }
  `]
})
export class OnboardingProgressComponent implements OnInit, OnDestroy {
  tasks: OnboardingTask[] = [];
  totalTasks = 0;
  completedCount = 0;
  progressPercentage = 0;
  showProgress = true;
  isCollapsed = true;
  isComplete = false;
  showCelebration = false;

  private subscriptions: Subscription[] = [];
  private previousCompleteState = false;

  constructor(
    private onboardingService: OnboardingService,
    private router: Router
  ) {
    this.tasks = this.onboardingService.onboardingTasks;
    this.totalTasks = this.tasks.length;
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.onboardingService.state$.subscribe(state => {
        this.completedCount = state.completedTasks.length;
        this.progressPercentage = this.onboardingService.getProgressPercentage();
        this.isComplete = this.onboardingService.isOnboardingComplete();

        // Check if just completed all tasks
        if (this.isComplete && !this.previousCompleteState) {
          this.showCelebration = true;
        }
        this.previousCompleteState = this.isComplete;
      }),

      this.onboardingService.showProgress$.subscribe(show => {
        this.showProgress = show;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  isTaskCompleted(taskId: string): boolean {
    return this.onboardingService.isTaskCompleted(taskId);
  }

  handleTaskClick(task: OnboardingTask): void {
    if (!this.isTaskCompleted(task.id)) {
      // Mark task as completed
      this.onboardingService.completeTask(task.id);

      // Navigate to route if specified
      if (task.route) {
        this.router.navigate([task.route]);
      }

      // Execute custom action if specified
      if (task.action) {
        task.action();
      }
    } else if (task.route) {
      // If already completed, just navigate
      this.router.navigate([task.route]);
    }
  }

  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  hideProgress(): void {
    this.onboardingService.hideProgress();
  }

  restartTour(): void {
    this.onboardingService.restartTour();
  }

  dismissCelebration(): void {
    this.showCelebration = false;
    this.onboardingService.hideProgress();
  }
}
