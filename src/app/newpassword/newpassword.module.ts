import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewpasswordPageRoutingModule } from './newpassword-routing.module';

import { NewpasswordPage } from './newpassword.page';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsSharedModule } from '../shared-components/components-shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewpasswordPageRoutingModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    TranslateModule,
    ComponentsSharedModule
  ],
  declarations: [NewpasswordPage]
})
export class NewpasswordPageModule {}
