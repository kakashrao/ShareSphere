import { NgClass } from "@angular/common";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import {
  Component,
  inject,
  model,
  signal,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { MenuItem, MessageService } from "primeng/api";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { DialogModule } from "primeng/dialog";
import { DividerModule } from "primeng/divider";
import { Editor, EditorModule } from "primeng/editor";
import {
  FileUploadErrorEvent,
  FileUploadEvent,
  FileUploadHandlerEvent,
  FileUploadModule,
} from "primeng/fileupload";
import { ImageModule } from "primeng/image";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { OverlayPanel, OverlayPanelModule } from "primeng/overlaypanel";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { RippleModule } from "primeng/ripple";
import { SpeedDialModule } from "primeng/speeddial";
import { StepperModule } from "primeng/stepper";
import { ToastModule } from "primeng/toast";
import { Range } from "quill";
import Quill, { Delta } from "quill/core";
import { catchError, switchMap, tap, throwError } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Asset } from "../../../models/asset.model";
import { Post, PostCreateRequest } from "../../../models/post.model";
import { PostService } from "../../../services/post/post.service";
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
    InputTextareaModule,
    RippleModule,
    ProgressSpinnerModule,
    ToastModule,
    RouterLink,
    FormsModule,
    SpeedDialModule,
    DialogModule,
    StepperModule,
    NgClass,
    ImageModule,
    DividerModule,
  ],
  providers: [UploadService],
  templateUrl: "./create-post.component.html",
  styleUrl: "./create-post.component.scss",
  encapsulation: ViewEncapsulation.None,
})
export class CreatePostComponent {
  private messageService = inject(MessageService);
  private uploadService = inject(UploadService);
  private postService = inject(PostService);
  @ViewChild("postEditor") editor!: Editor;
  content = model<string>("");
  title = model<string>("");
  summary = model<string>("");
  thumbnail = signal<string>("");
  thumbnailFile = signal<File | undefined>(undefined);

  imageApiUrl = `${environment.baseUrl}/api/assets/upload/posts`;

  isLoading = signal<boolean>(false);
  uploadedImages = signal<Asset[]>([]);
  showPublishDialog = signal(false);
  activeStep = model<number>(0);

  actionItems: MenuItem[] = [
    { label: "Save", icon: "pi pi-save" },
    {
      label: "Publish",
      icon: "pi pi-upload",
      command: this.onPublishIconClick.bind(this),
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

  setActiveIndex(index: number) {
    if (index > 0 && !this.title()) {
      this.messageService.add({
        closable: true,
        severity: "error",
        summary: "No Title!",
        detail: "Please add a title to proceed.",
        life: 3000,
      });
      return;
    }

    this.activeStep.set(index);
  }

  uploadThumbnail(event: FileUploadHandlerEvent) {
    if (event.files) {
      const reader = new FileReader();

      reader.onload = (event: ProgressEvent) => {
        this.thumbnail.set((event.target as FileReader).result as string);
      };

      reader.readAsDataURL(event.files[0]);
      this.thumbnailFile.set(event.files[0]);
    }
  }

  cancelThumbnail(callback: () => void) {
    this.thumbnail.set("");
    this.thumbnailFile.set(undefined);
    callback();
  }

  onPublishIconClick() {
    if (!this.content()) {
      this.messageService.add({
        closable: true,
        severity: "error",
        summary: "No Content!",
        detail: "Add some content to publish.",
        life: 3000,
      });
      return;
    }

    this.showPublishDialog.set(true);
  }

  onPublishPost(showModal: boolean = false) {
    const payload: PostCreateRequest = {
      title: this.title(),
      summary: this.summary(),
      content: this.content(),
    };

    if (!this.thumbnailFile && showModal) {
      // Ask for confirmation without thumbnail
    }

    if (!!this.thumbnailFile()) {
      this.uploadService
        .uploadAssets("thumbnails", this.thumbnailFile() as File)
        .pipe(
          switchMap((response) => {
            payload.thumbnail = response[0];
            return this._postPublishApi(payload).pipe(
              tap((response) => this._handlePostResponse(response)),
              catchError(this._handlePostError)
            );
          })
        )
        .subscribe();
    } else {
      this._postPublishApi(payload)
        .pipe(
          tap((response) => this._handlePostResponse(response)),
          catchError(this._handlePostError)
        )
        .subscribe();
    }
  }

  private _postPublishApi(payload: PostCreateRequest) {
    return this.postService.publishPost(payload);
  }

  private _handlePostResponse(response: Post) {
    this.messageService.add({
      closable: true,
      severity: "success",
      summary: "Congratulations!",
      detail: "Your post is successfully published.",
      life: 3000,
    });
  }

  private _handlePostError(error: any) {
    return throwError(() => error);
  }
}
