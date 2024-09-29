import { NgClass } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { AvatarModule } from "primeng/avatar";
import { CardModule } from "primeng/card";

@Component({
  selector: "sp-post",
  standalone: true,
  imports: [CardModule, AvatarModule, NgClass],
  templateUrl: "./post.component.html",
  styleUrl: "./post.component.scss",
  encapsulation: ViewEncapsulation.None,
})
export class PostComponent {}
