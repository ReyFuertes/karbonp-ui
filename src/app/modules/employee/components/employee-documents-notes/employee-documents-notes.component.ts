import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest, map, takeUntil } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { HttpClient } from '@angular/common/http';

import { IDocumentNote, IOptionItem } from 'src/app/models/generic.model';
import { fadeInAnimation } from 'src/app/shared/animations/fade-in.animation';
import { GenericFormControls } from 'src/app/shared/generics/form-control.generic';
import { AppState } from 'src/app/store';
import { IEmployee } from '../../employee.model';
import { checkFileSizeLimitExceeded, convertBase64ToBlob } from 'src/app/shared/util/document.util';
import { environment } from 'src/environments/environment';
import { getEmployeeDocumentsNotesByIdSelector, getEmployeeDocumentsNotesSelector, getSelectedEmployeeSelector } from '../../store/employee/employee.selector';
import { deleteEmployeeDocumentsNotesAction, updateDocumentsNotesAction } from '../../store/employee/employee.action';


@Component({
  selector: 'kp-employee-documents-notes',
  templateUrl: './employee-documents-notes.component.html',
  styleUrls: ['./employee-documents-notes.component.scss'],
  animations: [fadeInAnimation(300)]
})
export class EmployeeDocumentsNotesComponent extends GenericFormControls implements OnInit {
  @Output() public savedFormChanges = new EventEmitter<boolean>();
  @ViewChild("cd") public cd: ConfirmDialog | undefined;

  public isLoaded: boolean = false;
  public actionState: 'view' | 'edit' | 'add' = 'view';
  public currentSection: 'documents_notes' | '' = 'documents_notes';
  public categories: IOptionItem[] = [];
  public employee: IEmployee;
  public employeeDocumentsNotes: IDocumentNote[];
  public apiUrl: string = environment.apiUrl;

  constructor(
    private store: Store<AppState>,
    public fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    public confirmationService: ConfirmationService,
    private http: HttpClient
  ) {
    super();
    this.form = new FormGroup({
      id: new FormControl(undefined),
      name: new FormControl(undefined, [Validators.required]),
      employeeId: new FormControl(undefined),
      document: new FormControl(undefined, [Validators.required]),
      documentName: new FormControl(undefined),
      categoryId: new FormControl(undefined),
      note: new FormControl(undefined)
    });
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getSelectedEmployeeSelector)),
      this.store.pipe(select(getEmployeeDocumentsNotesSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([employee, employeeDocumentsNotes]) => {
        this.isLoaded = true;
        this.employee = employee;
        if (employeeDocumentsNotes?.length > 0) {
          this.employeeDocumentsNotes = employeeDocumentsNotes;
        }
      });
  }

  public onSaveChanges(): void {
    if (this.form.valid) {
      if (!this.form.value.id)
        delete this.form.value.id;
      this.store.dispatch(updateDocumentsNotesAction({
        payload: Object.assign({},
          this.form.value, {
          employeeId: this.form.value?.employeeId
            ? this.form.value?.employeeId
            : this.employee?.id
        })
      }))
      setTimeout(() => {
        this.savedFormChanges.emit(true);
        this.onCancel('documents_notes');
      }, 1000);
    }
  }
  
  public onCancel(section: any): void {
    this.actionState = 'view';
    this.currentSection = section;
  }

  public onAdd(section: any): void {
    this.form.reset();
    this.actionState = 'add';
    this.currentSection = section;
  }

  public onDocumentEdit(id: number): void {
    this.store.pipe(select(getEmployeeDocumentsNotesByIdSelector(id)),
      takeUntil(this.$unsubscribe))
      .subscribe((document: IDocumentNote) => {
        this.onAdd('documents_notes');
        if (document) {
          this.form.reset();
          this.form.patchValue(document);
        }
      });
  }

  public onDelete(item: IDocumentNote): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete this note? If an attachment is linked to this note it will also be deleted.`,
      accept: () => {
        this.store.dispatch(deleteEmployeeDocumentsNotesAction({
          id: item?.id.toString()
        }))
        setTimeout(() => {
          this.onCancel('documents_notes');
          this.savedFormChanges.emit(true);
        }, 300);
      },
      reject: () => {
        try {
          this.cd.reject();
        } catch (error) { console.log(error) }
      }
    });
  }

  public onDocumentChange(event: any): void {
    const reader = new FileReader();
    if (event.currentFiles && event.currentFiles.length) {
      const [file] = event.currentFiles;
      const fileSize = event.currentFiles[0].size;
      if (checkFileSizeLimitExceeded(fileSize))
        this.form.controls['document'].setErrors({ invalid: true });
      else {
        this.form.controls['document'].setErrors(null);
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.form.get("document").setValue(reader.result);
          this.form.get("documentName").setValue(event.currentFiles[0].name);
          this.cdRef.markForCheck();
        };
      }
    }
  }

  public downloadDocument(documentId: number): Observable<any> {
    return this.http.get(this.apiUrl + 'Document/DownloadDocument/' + documentId).pipe(
      map((response: any) => response)
    );
  }

  public downloadAttachment(documentId: number): void {
    this.http.get(this.apiUrl + 'Document/DownloadDocument/' + documentId).pipe(
      map((response: any) => {
        return response;
      })
    ).subscribe({
      next(response) {
        if (response && response.success && response.data) {
          const downloadedDocument = response.data;
          const file = downloadedDocument?.file;
          const fileName = downloadedDocument?.name;
          const convertedDocumentData = convertBase64ToBlob(file.fileContents, file.contentType);

          if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
            (window.navigator as any).msSaveOrOpenBlob(new Blob([convertedDocumentData], { type: file.contentType }), fileName);
          }
          else {
            const doc = document.createElement('a');
            doc.href = URL.createObjectURL(convertedDocumentData);
            doc.download = fileName
            document.body.appendChild(doc);
            doc.click();
            document.body.removeChild(doc);
          }
        }
      },
      error(err) {
        console.error(err);
      },
    })
  }
}
