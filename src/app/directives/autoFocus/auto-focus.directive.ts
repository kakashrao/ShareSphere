import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  input,
} from "@angular/core";

@Directive({
  selector: "[spAutoFocus]",
  standalone: true,
})
export class AutoFocusDirective implements AfterViewInit {
  private host = inject(ElementRef);
  selector = input<"input" | "textarea">("input");

  ngAfterViewInit(): void {
    setTimeout(() => {
      const input: HTMLInputElement = this.host.nativeElement.querySelector(
        this.selector()
      );

      input && input.focus();
    });
  }
}
