import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { SolutionPopupComponent } from './solution-popup/solution-popup.component';
import { HashListComponent } from './hash-list/hash-list.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatIconModule} from '@angular/material/icon';
import { AddHashPopupComponent } from './add-hash-popup/add-hash-popup.component';
import {MatSelectModule} from '@angular/material/select'; 


@NgModule({
  declarations: [
    AppComponent,
    SolutionPopupComponent,
    HashListComponent,
    ProfileComponent,
    AddHashPopupComponent
  ],
  imports: [
    MatIconModule,
    BrowserModule,
    CommonModule,
    FlexLayoutModule,
    MatDialogModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatSelectModule
  ],
  entryComponents: [SolutionPopupComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
