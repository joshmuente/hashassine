import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { SolutionPopupComponent } from './solution-popup/solution-popup.component';

@NgModule({
  declarations: [
    AppComponent,
    SolutionPopupComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FlexLayoutModule,
    MatDialogModule,
    BrowserAnimationsModule
  ],
  entryComponents: [SolutionPopupComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
