import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `
  <div class="min-h-screen flex items-center justify-center"
       style="background-color: var(--color-juridico-900)">
    <h1 class="text-4xl text-white">
      Tailwind utilities + CSS vars funcionan
    </h1>
  </div>
`,
})
export class App {
  title = 'frontend';
}
