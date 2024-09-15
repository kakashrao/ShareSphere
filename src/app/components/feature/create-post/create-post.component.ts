import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import {
  Component,
  inject,
  signal,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { MenuItem, MessageService } from "primeng/api";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { Editor, EditorModule } from "primeng/editor";
import {
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
import { SpeedDialModule } from "primeng/speeddial";
import { ToastModule } from "primeng/toast";
import { Range } from "quill";
import Quill, { Delta } from "quill/core";
import { environment } from "../../../../environments/environment";
import { Asset } from "../../../models/asset.model";
import { UploadService } from "../../../services/upload/upload.service";

@Component({
  selector: "sp-create-post",
  standalone: true,
  imports: [
    EditorModule,
    FileUploadModule,
    ConfirmPopupModule,
    OverlayPanelModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    RippleModule,
    ProgressSpinnerModule,
    ToastModule,
    RouterLink,
    ReactiveFormsModule,
    SpeedDialModule,
  ],
  providers: [UploadService],
  templateUrl: "./create-post.component.html",
  styleUrl: "./create-post.component.scss",
  encapsulation: ViewEncapsulation.None,
})
export class CreatePostComponent {
  private messageService = inject(MessageService);
  @ViewChild("postEditor") editor!: Editor;
  editorControl = new FormControl<string>("");

  imageApiUrl = `${environment.baseUrl}/api/assets/upload/posts`;

  isLoading = signal<boolean>(false);
  uploadedImages = signal<Asset[]>([]);

  actionItems: MenuItem[] = [
    { label: "Save", icon: "pi pi-save" },
    {
      label: "Publish",
      icon: "pi pi-upload",
      command: this.onPublish.bind(this),
    },
  ];

  openLinkOverlay(panel: OverlayPanel, event: MouseEvent) {
    const range = this.editor.quill.history.currentRange as Range;

    if (!range?.length) return;
    panel.toggle(event);
  }

  onAddLink(linkInput: HTMLInputElement, panel: OverlayPanel) {
    const range = this.editor.quill.history.currentRange as Range;

    this.editor.quill.updateContents(
      new Delta()
        .retain(range?.index ?? 0)
        .retain(range?.length ?? 0, { link: linkInput.value }),
      Quill.sources.USER
    );

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

    this.isLoading.set(false);
  }

  handleImageUpload(event: FileUploadEvent) {
    let files: Asset[] = [];

    if (event.originalEvent instanceof HttpResponse) {
      files = event.originalEvent.body.data;
    }

    if (files.length) {
      const range = this.editor.quill.history.currentRange as Range;

      this.editor.quill.updateContents(
        new Delta()
          .retain(range?.index ?? 0)
          .delete(range?.length ?? 0)
          .insert({ image: files[0].url }),
        Quill.sources.USER
      );

      this.uploadedImages.update((values) => [...values, ...files]);
    }

    this.isLoading.set(false);
  }

  onUploadImages(event: { files: File[] }) {
    // const editorContent = quill.root.innerHTML;
    // // Extract image URLs from the editor content
    // const currentImages = Array.from(editorContent.matchAll(/<img.*?src="(.*?)"/g)).map(match => match[1]);
    // // Determine images to delete (those in uploadedImages but not in currentImages)
    // const imagesToDelete = uploadedImages.filter(url => !currentImages.includes(url));
    // // Send delete request for unused images
    // fetch('/delete-images', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ images: imagesToDelete })
    // });
  }

  onPublish() {
    console.log(this.editorControl.value);
  }
}
