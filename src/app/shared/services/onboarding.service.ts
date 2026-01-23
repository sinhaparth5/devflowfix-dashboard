import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  targetSelector?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  route?: string;
  action?: string;
  icon?: string;
}

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  route?: string;
  action?: () => void;
}

export interface OnboardingState {
  tourCompleted: boolean;
  tourDismissed: boolean;
  neverShowAgain: boolean;
  currentStep: number;
  completedTasks: string[];
  lastSeenAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  private readonly STORAGE_KEY = 'devflowfix_onboarding';
  private isBrowser: boolean;

  // Tour steps for the product walkthrough
  readonly tourSteps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to DevFlowFix!',
      description: 'Let\'s take a quick tour to help you get started with automated deployment failure resolution. This will only take a minute.',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
    },
    {
      id: 'dashboard',
      title: 'Your Analytics Dashboard',
      description: 'This is your command center. Monitor incident trends, success rates, and mean time to repair at a glance.',
      targetSelector: '[data-tour="metrics-cards"]',
      position: 'bottom',
      route: '/dashboard',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
    },
    {
      id: 'incidents',
      title: 'Incident Management',
      description: 'View and manage all deployment incidents. Our AI analyzes failures and suggests fixes automatically.',
      targetSelector: '[data-tour="sidebar-incidents"]',
      position: 'right',
      icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
    },
    {
      id: 'webhooks',
      title: 'Webhook Configuration',
      description: 'Connect your CI/CD pipelines by setting up webhooks. We support GitHub Actions, ArgoCD, and Kubernetes.',
      targetSelector: '[data-tour="sidebar-webhooks"]',
      position: 'right',
      icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
    },
    {
      id: 'pr-management',
      title: 'Pull Request Management',
      description: 'Review AI-generated fix PRs here. Approve, reject, or modify suggested fixes before merging.',
      targetSelector: '[data-tour="sidebar-pr"]',
      position: 'right',
      icon: 'M4 6h16M4 12h16M4 18h7'
    },
    {
      id: 'complete',
      title: 'You\'re All Set!',
      description: 'You\'ve completed the tour. Check out the setup checklist in the bottom right to finish configuring your account.',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  ];

  // Onboarding tasks/checklist
  readonly onboardingTasks: OnboardingTask[] = [
    {
      id: 'connect-github',
      title: 'Connect GitHub Account',
      description: 'Link your GitHub account to enable repository access',
      completed: false,
      route: '/dashboard/profile'
    },
    {
      id: 'setup-webhook',
      title: 'Set Up First Webhook',
      description: 'Configure a webhook to start receiving deployment events',
      completed: false,
      route: '/dashboard/webhooks'
    },
    {
      id: 'explore-incidents',
      title: 'Explore Incidents',
      description: 'View the incidents page to see how failures are tracked',
      completed: false,
      route: '/dashboard/incidents'
    },
    {
      id: 'review-analytics',
      title: 'Review Analytics',
      description: 'Check your dashboard to understand key metrics',
      completed: false,
      route: '/dashboard'
    }
  ];

  private stateSubject = new BehaviorSubject<OnboardingState>({
    tourCompleted: false,
    tourDismissed: false,
    neverShowAgain: false,
    currentStep: 0,
    completedTasks: [],
    lastSeenAt: 0
  });

  private tourActiveSubject = new BehaviorSubject<boolean>(false);
  private showProgressSubject = new BehaviorSubject<boolean>(true);

  state$ = this.stateSubject.asObservable();
  tourActive$ = this.tourActiveSubject.asObservable();
  showProgress$ = this.showProgressSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.loadState();
    }
  }

  private loadState(): void {
    if (!this.isBrowser) return;

    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as OnboardingState;
        this.stateSubject.next(parsed);

        // Show tour for new users or if they haven't completed/dismissed it
        // Never show if user selected "don't show again"
        if (!parsed.tourCompleted && !parsed.tourDismissed && !parsed.neverShowAgain) {
          // Delay showing the tour slightly for better UX
          setTimeout(() => this.startTour(), 1500);
        }
      } else {
        // New user - start tour after a delay
        setTimeout(() => this.startTour(), 2000);
      }
    } catch {
      // If there's an error, start fresh
      setTimeout(() => this.startTour(), 2000);
    }
  }

  private saveState(): void {
    if (!this.isBrowser) return;

    const state = this.stateSubject.value;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
  }

  startTour(): void {
    this.tourActiveSubject.next(true);
    this.updateState({ currentStep: 0 });
  }

  nextStep(): void {
    const state = this.stateSubject.value;
    const nextStep = state.currentStep + 1;

    if (nextStep >= this.tourSteps.length) {
      this.completeTour();
    } else {
      this.updateState({ currentStep: nextStep });
    }
  }

  previousStep(): void {
    const state = this.stateSubject.value;
    if (state.currentStep > 0) {
      this.updateState({ currentStep: state.currentStep - 1 });
    }
  }

  goToStep(stepIndex: number): void {
    if (stepIndex >= 0 && stepIndex < this.tourSteps.length) {
      this.updateState({ currentStep: stepIndex });
    }
  }

  completeTour(neverShowAgain: boolean = false): void {
    this.tourActiveSubject.next(false);
    this.updateState({
      tourCompleted: true,
      currentStep: 0,
      neverShowAgain
    });
  }

  dismissTour(neverShowAgain: boolean = false): void {
    this.tourActiveSubject.next(false);
    this.updateState({
      tourDismissed: true,
      neverShowAgain
    });
  }

  restartTour(): void {
    this.updateState({
      tourCompleted: false,
      tourDismissed: false,
      currentStep: 0
    });
    this.startTour();
  }

  completeTask(taskId: string): void {
    const state = this.stateSubject.value;
    if (!state.completedTasks.includes(taskId)) {
      this.updateState({
        completedTasks: [...state.completedTasks, taskId]
      });
    }
  }

  isTaskCompleted(taskId: string): boolean {
    return this.stateSubject.value.completedTasks.includes(taskId);
  }

  getCompletedTasksCount(): number {
    return this.stateSubject.value.completedTasks.length;
  }

  getProgressPercentage(): number {
    const totalTasks = this.onboardingTasks.length;
    const completedTasks = this.stateSubject.value.completedTasks.length;
    return Math.round((completedTasks / totalTasks) * 100);
  }

  hideProgress(): void {
    this.showProgressSubject.next(false);
  }

  showProgress(): void {
    this.showProgressSubject.next(true);
  }

  getCurrentStep(): OnboardingStep {
    const state = this.stateSubject.value;
    return this.tourSteps[state.currentStep];
  }

  isFirstStep(): boolean {
    return this.stateSubject.value.currentStep === 0;
  }

  isLastStep(): boolean {
    return this.stateSubject.value.currentStep === this.tourSteps.length - 1;
  }

  private updateState(partial: Partial<OnboardingState>): void {
    const current = this.stateSubject.value;
    const updated = {
      ...current,
      ...partial,
      lastSeenAt: Date.now()
    };
    this.stateSubject.next(updated);
    this.saveState();
  }

  // Check if user should see onboarding
  shouldShowOnboarding(): boolean {
    const state = this.stateSubject.value;
    return !state.tourCompleted && !state.tourDismissed && !state.neverShowAgain;
  }

  // Check if all tasks are complete
  isOnboardingComplete(): boolean {
    return this.stateSubject.value.completedTasks.length === this.onboardingTasks.length;
  }

  // Reset onboarding (for testing)
  resetOnboarding(): void {
    if (!this.isBrowser) return;

    localStorage.removeItem(this.STORAGE_KEY);
    this.stateSubject.next({
      tourCompleted: false,
      tourDismissed: false,
      neverShowAgain: false,
      currentStep: 0,
      completedTasks: [],
      lastSeenAt: 0
    });
    this.tourActiveSubject.next(false);
    this.showProgressSubject.next(true);
  }

  // Check if tour is permanently disabled
  isTourPermanentlyDisabled(): boolean {
    return this.stateSubject.value.neverShowAgain;
  }
}
