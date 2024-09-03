import { Component, ViewEncapsulation } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { EditorModule } from "primeng/editor";

@Component({
  selector: "sp-create-post",
  standalone: true,
  imports: [EditorModule, ButtonModule, ReactiveFormsModule],
  templateUrl: "./create-post.component.html",
  styleUrl: "./create-post.component.scss",
  encapsulation: ViewEncapsulation.None,
})
export class CreatePostComponent {
  editorControl = new FormControl<string>("");

  constructor() {
    this.editorControl.valueChanges.subscribe({
      next: (value: string | null) => {
        console.log(value);
      },
    });
  }
}
