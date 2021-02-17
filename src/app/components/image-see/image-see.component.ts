import { ModalController } from "@ionic/angular";
import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-image-see",
  templateUrl: "./image-see.component.html",
  styleUrls: ["./image-see.component.scss"],
})
export class ImageSeeComponent implements OnInit {
  @Input() data: any;
  constructor(public modalCtrl: ModalController) {}

  ngOnInit() {
    console.log(this.data);
  }

  send(url: any) {
    console.log(url);
    // this.img.content.next(url.webformatURL);
    this.modalCtrl.dismiss(url.webformatURL);
  }

  close() {
    this.modalCtrl.dismiss();
  }
}