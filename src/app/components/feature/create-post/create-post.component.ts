import { Component } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { EditorModule } from "primeng/editor";

@Component({
  selector: "sp-create-post",
  standalone: true,
  imports: [EditorModule, ReactiveFormsModule],
  templateUrl: "./create-post.component.html",
  styleUrl: "./create-post.component.scss",
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
