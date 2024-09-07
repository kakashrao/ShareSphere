import { HttpErrorResponse } from "@angular/common/http";
import {
  Component,
  inject,
  signal,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { Editor, EditorModule } from "primeng/editor";
import {
  FileProgressEvent,
  FileUploadErrorEvent,
  FileUploadEvent,
  FileUploadModule,
} from "primeng/fileupload";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputTextModule } from "primeng/inputtext";
import { OverlayPanel, OverlayPanelModule } from "primeng/overlaypanel";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { RippleModule } from "primeng/ripple";
import { ToastModule } from "primeng/toast";
import { Range } from "quill";
import Quill, { Delta } from "quill/core";

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
    ProgressSpinnerModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: "./create-post.component.html",
  styleUrl: "./create-post.component.scss",
  encapsulation: ViewEncapsulation.None,
})
export class CreatePostComponent {
  private messageService = inject(MessageService);
  @ViewChild("postEditor") editor!: Editor;

  isLoading = signal<boolean>(false);

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

  handleImageError(event: FileUploadErrorEvent) {
    let message = "Image upload failed, please try again.";

    if (event.error instanceof HttpErrorResponse) {
      message = (event.error as HttpErrorResponse).error.message;
    }

    this.messageService.add({
      closable: true,
      severity: "error",
      summary: "Error",
      detail: message,
      life: 3000,
    });
  }

  handleImageInProgress(event: FileProgressEvent) {
    if (event.progress === 0) {
      this.isLoading.set(true);
    } else if (event.progress === 100) {
      this.isLoading.set(false);
    }
  }

  handleImageUpload(event: FileUploadEvent) {
    console.log(event);
  }

  onUploadImages(event: { files: File[] }) {
    this.isLoading.set(true);

    const reader = new FileReader();

    reader.onload = (response: ProgressEvent) => {
      setTimeout(() => {
        const range = this.editor.quill.history.currentRange as Range;

        this.editor.quill.updateContents(
          new Delta()
            .retain(range?.index ?? 0)
            .delete(range?.length ?? 0)
            .insert({ image: (response.target as FileReader).result }),
          Quill.sources.USER
        );

        this.isLoading.set(false);
      }, 2000);
    };

    reader.readAsDataURL(event.files[0]);
  }
}
