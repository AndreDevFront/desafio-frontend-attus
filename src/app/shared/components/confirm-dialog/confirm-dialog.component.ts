import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmDialogData {
  titulo: string;
  mensagem: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.titulo }}</h2>
    <mat-dialog-content>
      <p [innerHTML]="data.mensagem"></p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="fechar(false)">Cancelar</button>
      <button mat-flat-button color="warn" (click)="fechar(true)">Excluir</button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 { font-size: 1.1rem; font-weight: 600; }
    mat-dialog-content p { color: #555; line-height: 1.5; }
    mat-dialog-actions { gap: 8px; padding-bottom: 16px; }
  `],
})
export class ConfirmDialogComponent {
  readonly data    = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

  fechar(confirmado: boolean): void {
    this.dialogRef.close(confirmado);
  }
}
