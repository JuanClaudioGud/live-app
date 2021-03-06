import { Component, OnInit, HostListener, ViewChildren, QueryList } from "@angular/core";
import { IonRouterOutlet, ModalController } from "@ionic/angular";
import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { TranslateService } from "@ngx-translate/core";
import { UserService } from "./service/user.service";
import { Router } from "@angular/router";
import { ChatService } from "./service/chat.service";
import { NotificationService } from "./service/notification.service";
import { ReusableComponentsIonic } from "./service/ionicHelpers.service";
import { CookieService } from "ngx-cookie-service";
import { Meta } from "@angular/platform-browser";
import { SIDEBAR_ITEMS } from "src/config/base";
import { getToken } from "./helpers/token";
import { Location } from "@angular/common";
import { FilesService } from "./service/files.service";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit {


  public selectedIndex = 0;

  // Contiene los items del sidebar menu
  public appPages = SIDEBAR_ITEMS;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public userService: UserService,
    private router: Router,
    public modalController: ModalController,
    public translate: TranslateService,
    public chatService: ChatService,
    public notificationService: NotificationService,
    public reusableCI: ReusableComponentsIonic,
    private cookieService: CookieService,
    private meta: Meta,
    public fileService: FilesService,
    public location: Location
  ) {
    this.initializeApp();

    this.langSettings();

    this.seo();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.backButtonEvent()
    });
  }

  logout() {
    this.userService.logout();
  }

  goTo(r) {
    this.router.navigate([r]);
  }

  ngOnInit() {}

  langSettings() {
    this.translate.addLangs([
      "es", // espaniol
      "en", // ingles
      "ca", // catalan
      "gl", // gallego
      "eu", // euskera
      "fr", // frances
      "de", // aleman
      "it", // italiano
      "pt", // portugues
      "ru", // ruso
      "zh", // chino
      "ja", // japones
      "ar", // arabe
      "hi", // hindu
    ]);
    this.translate.setDefaultLang("es");

    if (!this.cookieService.check("lang")) {
      this.translate.use("es");
      this.cookieService.set("lang", "es", { expires: 3000 });
    } else {
      this.translate.use(this.cookieService.get("lang"));
    }
  }

  seo() {
    this.meta.addTag(
      {
        property: "og:title",
        content: "Unete a Sportyeah ! La red social del deporte",
      },
      true
    );
    this.meta.addTag(
      { property: "og:url", content: "https://app.sportyeah.com" },
      true
    );
    this.meta.addTag({ property: "og:type", content: "article" }, true);
    this.meta.addTag(
      {
        property: "og:description",
        content:
          "Unete a la red social de los deportes y crea tendencia ! app.sportyeah.com",
      },
      true
    );
    this.meta.addTag(
      {
        property: "og:image",
        content: "https://i.ibb.co/g6TFj6G/Logo-TRANSPARENTE.png",
      },
      true
    );
  }

  
  admin() {
    window.location.replace(
      "https://admin.sportyeah.com/#/login?token=" + getToken()
    );
  }

  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  backButtonEvent() {

    this.platform.backButton.subscribe(() => {
      console.log(this.routerOutlets, this.router.url);

      this.modalController
        .dismiss()
        .then(() => {
        })
        .catch(() => {
          if (!this.cookieService.check("chat")) {
            this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
              if (this.router.url != "/dashboard") {
                // await this.router.navigate(['/']);
                this.location.back();
              } else if (this.router.url === "/dashboard") {
                if (
                  new Date().getTime() - this.lastTimeBackPress >=
                  this.timePeriodToExit
                ) {
                  this.lastTimeBackPress = new Date().getTime();
                } else {
                  navigator["app"].exitApp();
                }
              }
            });
          }
        });
    });
  }

}
