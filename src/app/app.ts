import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { HeaderComponent } from './layout/header-component/header-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeRoute', [
      transition('* <=> *', [
        style({ opacity: 0 }),
        animate('220ms ease-out', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class App {
  private readonly router = inject(Router);

  protected readonly routeAnimation = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );
}
