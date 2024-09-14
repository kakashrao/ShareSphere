import { NgClass } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { LandingRoutingModule } from "./landing-routing.module";
import { LandingComponent } from "./landing.component";

@NgModule({
  declarations: [LandingComponent],
  imports: [LandingRoutingModule, RouterOutlet, NgClass],
})
export class LandingModule {}
