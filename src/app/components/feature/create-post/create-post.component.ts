import { Component, ViewChild, ViewEncapsulation } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { Editor, EditorModule } from "primeng/editor";
import { FileUploadModule } from "primeng/fileupload";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputTextModule } from "primeng/inputtext";
import { OverlayPanel, OverlayPanelModule } from "primeng/overlaypanel";
import { RippleModule } from "primeng/ripple";
import { Range } from "quill";

@Component({
  selector: "sp-create-post",
  standalone: true,
  imports: [
    EditorModule,
    ButtonModule,
    FileUploadModule,
    ConfirmPopupModule,
    OverlayPanelModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    RippleModule,
  ],
  providers: [],
  templateUrl: "./create-post.component.html",
  styleUrl: "./create-post.component.scss",
  encapsulation: ViewEncapsulation.None,
})
export class CreatePostComponent {
  @ViewChild("postEditor") editor!: Editor;

  openLinkOverlay(panel: OverlayPanel, event: MouseEvent) {
    const range = this.editor.quill.history.currentRange as Range;

    if (!range?.length) return;
    panel.toggle(event);
  }

  onAddLink(linkInput: HTMLInputElement, panel: OverlayPanel) {
    const range = this.editor.quill.history.currentRange as Range;

    this.editor.quill.formatText(range.index, range.length, {
      link: linkInput.value,
    });

    linkInput.value = "";
    panel.hide();
  }
}
