import { Component, OnInit, ViewChild  } from '@angular/core';
//import { FormBuilder, FormControl,FormGroup} from '@angular/forms';
import { TranslateService } from "@ngx-translate/core";
import { UserService } from "../../../service/user.service";
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import * as moment from 'moment';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { ActionSheetController, LoadingController, ModalController   } from '@ionic/angular';
import { JdvimageService } from 'src/app/service/jdvimage.service';
import { NewsService } from '../../../service/news.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

const { Camera ,Filesystem} = Plugins;

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {


constructor(
    private fb:FormBuilder,
    public userService: UserService,
    public translate: TranslateService,
    private modalCtrl:ModalController,
    private loading:LoadingController,
    private jdvImage:JdvimageService,
    private actionSheetCtrl:ActionSheetController,
    public newsService:NewsService,
    public toastController: ToastController,
    private router:Router,

  ) { }


  form = this.fb.group({
    user:['',[Validators.required]],
    headline:['',[Validators.required]],
    content:['',[Validators.required]],
    //image:['',[Validators.required]],
    principalImage:['',[Validators.required]],
    sport:['',[Validators.required]]
  })

  async presentToastWithOptions() {
    const toast = await this.toastController.create({
      message:this.translate.instant('news.published'),
      position: 'top',
      color: 'dark',
      duration: 3000,
    });
    toast.present();
  }

publicar(){
    this.form.value.principalImage = this.imagenSelected;
    this.form.value.user = this.userService.User._id 
    this.form.value.headline = this.titulo1;
    this.form.value.content = this.parrafos
    //this.form.value.image = this.arrayImagenes
    this.form.value.sport = this.deporte
    this.newsService.create(this.form.value).subscribe((response)=>{
      this.presentToastWithOptions()
      this.router.navigate(["news"])
    })
}
fecha = new Date().getDate() + '/'+ (new Date().getMonth()+1) + '/' + new Date().getFullYear()
editando:boolean=false//si esta editando el agregar es disabled
imagen;//imagen mostrada
number:number = 0//Posicion de el parrafo, pero no del array, 
positionEditactual:number=null; 
parrafoAntesEdicion;
parrafos=[];

  text1 = `Escribe el párrafo # ${this.parrafos.length+1} `;
  titulo1= ``;
  deporte= ``;
  sports=['soccer', 'basketball','tennis',
  'baseball','golf','running','volleyball',
  'swimming','boxing','table_tennis','rugby',
  'football','esport','various']

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  next(slides) {
    slides.slideNext();
  }

  prev(slides) {
    slides.slidePrev();
  }


  consol(){
  this.parrafos.push({parrafo:this.text1,position:this.parrafos.length,image:''})//title:this.titulo1,subtitle:this.deporte
  this.text1 = `Escribe el párrafo # ${this.parrafos.length+1} `
 
  /* this.titulo1= `Escribe el Titulo # ${this.parrafos.length+1} `;
  this.deporte= `Escribe el Subtitulo # ${this.parrafos.length+1} `; */
  console.log(this.parrafos)
}
selectParrafo(){
  this.text1 =  this.parrafos[this.number].parrafo
 /*  this.titulo1 =  this.parrafos[this.number].title
  this.deporte =  this.parrafos[this.number].subtitle */
  this.positionEditactual = this.number
  this.parrafoAntesEdicion = this.parrafos[this.number].parrafo
}

selectParrafoCards(position){
  this.number = position
  this.text1 =  this.parrafos[position].parrafo
 /*  this.titulo1 =  this.parrafos[position].title
  this.deporte =  this.parrafos[position].subtitle */
  this.positionEditactual = position
  this.parrafoAntesEdicion = this.parrafos[position].parrafo
  this.editando = true
}

EditParrafo(){
  this.parrafos[this.positionEditactual].parrafo = this.text1;
  this.parrafos[this.positionEditactual].title = this.titulo1;
 // this.parrafos[this.positionEditactual].subtitle = this.deporte;
  this.positionEditactual = null
  this.editando = false
  this.text1 = `Escribe el párrafo # ${this.parrafos.length+1} `
/*   this.titulo1= `Escribe el Título # ${this.parrafos.length+1} `;
  this.deporte= `Escribe el Subtítulo # ${this.parrafos.length+1} `; */
}
eliminarParrafo(){
  this.parrafos.splice(this.positionEditactual,1)
  for(let i= this.positionEditactual; i <= this.parrafos.length-1; i++){
    this.parrafos[i].position -= 1; 
  }
  this.positionEditactual = null
  this.editando = false
  if(this.number != 0 && this.number == this.parrafos.length){
    this.number -= 1
  }
  
  this.text1 = `Escribe el párrafo # ${this.parrafos.length+1} `
/*   this.titulo1= `Escribe el Título # ${this.parrafos.length+1} `;
  this.deporte= `Escribe el Subtítulo # ${this.parrafos.length+1} `; */
}
numberPositionSelect(number){
  this.number += number
}
cancelar(){
  this.positionEditactual = null
  this.parrafoAntesEdicion = null
  this.editando = false
  this.text1 = `Escribe el párrafo # ${this.parrafos.length+1} `
 /*  this.titulo1= `Escribe el Título # ${this.parrafos.length+1} `;
  this.deporte= `Escribe el Subtítulo # ${this.parrafos.length+1} `; */
}

////Imagenes
selectedImage(imag){
  this.imagen = imag;
}
/* deleteImage(){
  this.arrayImagenes = this.arrayImagenes.filter((imagenes)=>{
    return imagenes != this.imagen;
  })
  this.imagen = undefined
  if(this.arrayImagenes.length == 0 ){
    this.imagenSelected = undefined
  }
} */
goBackImage(){
  this.imagen = undefined
}

////////
arrayImagenes = [];
async takePhotoFrom(imagenType,i){
  let action = await this.actionSheetCtrl.create({
    header:this.translate.instant("img-options.header"),
    buttons:[
      {
      text:this.translate.instant("img-options.galery"),
      icon:'images',
      handler:()=>{
        if(imagenType=='principal'){
          this.takePrincipal(CameraSource.Photos)
        }else if('notPrincipal'){
          this.takePictures(CameraSource.Photos,i)
        }
      
      }
    },
    
    {
      text:this.translate.instant("cancel"),
      icon:'close',
      role:'cancel'
    }
  ]
  })
  action.present()
}


async takePictures(source,i) {
  let formData = new FormData()

 Camera.getPhoto({
    source,
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.DataUrl,
    
  })
  .then(async (image)=>{
    let loading = await this.loading.create({message:this.translate.instant('loading')})
    loading.present()
    let blob = this.DataURIToBlob(image.dataUrl);
    formData.append('image', blob)
    this.jdvImage.uploadImage(formData).toPromise()
    .then((url:string)=>{
      loading.dismiss()
      this.parrafos[i].image= url;
      this.openArray = false;
    })
    .catch((err)=>{
      loading.dismiss()
      console.error(err);
    })

    loading.dismiss()
  /* 
      this.jdvImage.uploadImage(formData).toPromise()
        .then((url:string)=>{
          loading.dismiss()
        this.userService.update({photo:url})
          .toPromise()
          .then((resp)=>{
            this.userService.User.photo = url
          }) 
        })
        .catch((err)=>{
          loading.dismiss()
          console.error(err);
          
        })*/
  })
  .catch((err)=>{})
}

async takePrincipal(source) {
  let formData = new FormData()

 Camera.getPhoto({
    source,
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.DataUrl,
    
  })
  .then(async (image)=>{
    let loading = await this.loading.create({message:this.translate.instant('loading')})
    loading.present()
    let blob = this.DataURIToBlob(image.dataUrl);
    formData.append('image', blob)
    this.jdvImage.uploadImage(formData).toPromise()
    .then((url:string)=>{
      loading.dismiss() 
      this.imagenSelected = url 
      this.open = false;  
    })
    .catch((err)=>{
      loading.dismiss()
      console.error(err);
    }) 
    loading.dismiss()
  })
  .catch((err)=>{})
}
deleteImagePrincipal(){
  this.imagenSelected = null
  this.open = false;
}





DataURIToBlob(dataURI: string) {
    
  const splitDataURI = dataURI.split(',')
  const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
  const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

  const ia = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i)

  return new Blob([ia], { type: mimeString })
}
//////

/////

////


imagenSelected
open= false
clickImage(){
  this.open=true;
}
closeImage(){
  this.open=false
}
takeImage(img){
  this.imagenSelected = img
  this.open=false
}


//OPEN ARRAY
openArray=false
imagenACambiar
clickImageArray(i){
  this.imagenACambiar = i
  this.openArray=true;
}
closeImageArray(){
  this.openArray=false
}
takeImageArray(img,i){
  let copia = this.arrayImagenes
  let actual = this.arrayImagenes[this.imagenACambiar]
  let nueva = this.arrayImagenes[i]
  this.arrayImagenes.splice(this.imagenACambiar,1,nueva)
  this.arrayImagenes.splice(i,1,actual)
  this.openArray=false
  this.imagenACambiar= undefined;
}

deleteImage(i){
 this.parrafos[i].image = '';
 this.openArray = false;
}

///Create Video
urlVideo = null
videoFile = null
closeVideo(){
  this.urlVideo = null
  this.videoFile = null
}
async uploadVideo($event){
  console.log(this.urlVideo)
  console.log(this.videoFile)
  this.urlVideo = URL.createObjectURL($event.target.files[0])
  this.videoFile = $event.target.files[0]
}




  ngOnInit(): void {
 
  }
  /* 

  ngOnInit() {}
console(){
 
}

texto;
  profileForm = new FormGroup({
    htmlContent1: new FormControl(''),
    htmlContent2: new FormControl(''),
  });

  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '0',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize','backgroundColor']
    ]
}; */

}
