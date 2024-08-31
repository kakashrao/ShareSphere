import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WelcomeLoaderComponent } from "./components/shared/welcome-loader/welcome-loader.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, WelcomeLoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'share-sphere';
}
