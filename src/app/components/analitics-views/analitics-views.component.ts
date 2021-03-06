import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { UserService } from "../../service/user.service";
import { Chart } from "chart.js";
import { ViewsProfileService } from "../../service/views-profile.service";
import { TranslateService } from "@ngx-translate/core";
import * as moment from "moment";
import { PostService } from "../../service/post.service";
import { ToastController } from "@ionic/angular";
import { ViewsSponsorService } from "src/app/service/views-sponsor.service";
import { take } from "rxjs/operators";


@Component({
  selector: "app-analitics-views",
  templateUrl: "./analitics-views.component.html",
  styleUrls: ["./analitics-views.component.scss"],
})
export class AnaliticsViewsComponent implements OnInit {
  constructor(
    public userService: UserService,
    private viewsProfileService: ViewsProfileService,
    private translate: TranslateService,
    private cd: ChangeDetectorRef,
    private postService: PostService,
    public toastController: ToastController,
    public viewsSponsorService: ViewsSponsorService
  ) {}

  segement = 0;

  async presentToastWithOptions(message) {
    const toast = await this.toastController.create({
      header: this.translate.instant("analytics-views.information"),
      message: this.translate.instant(message),
      position: "top",
      color: "dark",
      duration: 10000,
      buttons: [
        {
          text: "Cerrar",
          role: "cancel",
          handler: () => {},
        },
      ],
    });
    toast.present();
  }
  working() {
    this.option = "working";
  }
  reactionId = [];
  commentId = [];

  //Datos para los post,en seccion de post
  todolosPost = [];
  likes = [];
  comments = [];
  shareds = [];
  interaccionActual = "";
  

  noData: boolean = false; // es false si no hay datos en la estadistica
  totalViewsPost = 0;
  sortable = [];
  count;
  postId = []; //se le introducen los id de las publicaciones
  //Separamos los campos en diferentes arrays
  allViews;
  postViews;
  chatViews;
  searchViews;
  profileViews;
  reactionViews;
  commentViews;
  bars;
  analyticsToShow;
  indexLast = 5;
  async logScrolling(ev) {
    let el = await ev.target.getScrollElement();
    if (el.scrollHeight - el.scrollTop < el.clientHeight + 400) {
      this.indexLast += 5;
    }
  }

  c = document.getElementById('areaPoplar') as HTMLCanvasElement

  ngOnInit() {
    this.viewsSponsorService
      .getSponsorView(this.userService.User._id)
      .subscribe((response: any) => {
        this.totalSponsor = response.length;
      });
    

    this.viewsProfileService
      .getProfileView(this.userService.User._id)
      .subscribe((views: any) => {
        if (views === null) {
          this.noData = false;
        } else {
          this.allViews = views;

          this.postViews = this.allViews.filter((post) => {
            //post.link = post.link.split('/')[2]
            return post.from == "post";
          });
          this.chatViews = this.allViews.filter((chat) => {
            return chat.from == "chat";
          });
          this.searchViews = this.allViews.filter((search) => {
            return search.from == "search";
          });
          this.profileViews = this.allViews.filter((profile) => {
            return profile.from == "profile";
          });
          this.reactionViews = this.allViews.filter((reaction) => {
            return reaction.from == "reaction";
          });
          this.commentViews = this.allViews.filter((comment) => {
            return comment.from == "comment";
          });

          this.pieData();
          // this.introduPost();
          // this.postUsersViews();
        }
      });
  }

  postInfoUser = [];
  // postUserInfo() {
  //   this.option = "postInfo";
  // }
  // async postUsersViews() {
  //   for (let elements of this.postViews) {
  //     let post = await this.getPost(elements.link.split("/")[2], 0);
  //     elements.link = post;
  //     this.postInfoUser.push(elements);
  //   }
  // }

  pieData() {
    this.analyticsToShowSponsor = undefined;

    this.segement = 0;
    if (this.allViews != undefined) {
      if (this.allViews.length != 0) {
        this.noData = true;
      }
      this.option = "all";
      if (this.allViews.length > 0) {
        this.analyticsToShow = "all";
      }

      this.cd.detectChanges();

      this.bars = new Chart("polarArea", {
        type: "polarArea",
        data: {
          labels: [
            this.translate.instant("analytics-views.post"),
            this.translate.instant("analytics-views.chat"),
            this.translate.instant("analytics-views.search"),
            this.translate.instant("analytics-views.profile"),
            this.translate.instant("analytics-views.reaction"),
            this.translate.instant("analytics-views.comment"),
          ],
          datasets: [
            {
              label: "All",
              data: [
                this.postViews.length,
                this.chatViews.length,
                this.searchViews.length,
                this.profileViews.length,
                this.reactionViews.length,
                this.commentViews.length,
              ],
              backgroundColor: [
                "rgb(56, 94, 129,0.6)",
                "rgb(38, 194, 129,0.6)",
                "rgb(212, 60, 60,0.6)",
                "rgb(106, 25, 181,0.6)",
                "rgb(56, 128, 255,0.6)",
                "rgb(238, 241, 48,0.6)",
              ], // array should have same number of elements as number of dataset
              borderColor: [
                "rgb(56, 94, 129,0.6)",
                "rgb(38, 194, 129,0.6)",
                "rgb(212, 60, 60,0.6)",
                "rgb(106, 25, 181,0.6)",
                "rgb(56, 128, 255,0.6)",
                "rgb(238, 241, 48,0.6)",
              ], // array should have same number of elements as number of dataset
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  stepSize: 1,
                },
              },
            ],
          },
        },
      });
    } else {
      this.option = "";
    }
  }

  week = moment(new Date()).startOf("week");
  weekEnd = moment(new Date()).endOf("week");
  lines;
  weeks;
  weekFormat;
  weekEndFormat;
  dia = moment(new Date());
  changeWeekAdd = undefined;
  generateWeek() {
    this.weekFormat = this.dia.startOf("week").format("YYYY-MM-DD");
    this.weekEndFormat = this.weekEnd.format("YYYY-MM-DD");
    this.viewsProfileService
      .getVisitsByWeek(this.userService.User._id, this.dia, "comment")
      .pipe(take(1))
      .subscribe((response: any) => {
        if (response.length == 0) {
          this.dataComment = [0, 0, 0, 0, 0, 0, 0];
        } else {
          this.dataComment = response;
        }
        this.viewsProfileService
          .getVisitsByWeek(this.userService.User._id, this.dia, "chat")
          .pipe(take(1))
          .subscribe((response: any) => {
            if (response.length == 0) {
              this.dataChat = [0, 0, 0, 0, 0, 0, 0];
            } else {
              this.dataChat = response;
            }

            this.viewsProfileService
              .getVisitsByWeek(this.userService.User._id, this.dia, "post")
              .pipe(take(1))
              .subscribe((response: any) => {
                if (response.length == 0) {
                  this.dataPost = [0, 0, 0, 0, 0, 0, 0];
                } else {
                  this.dataPost = response;
                }
                this.viewsProfileService
                  .getVisitsByWeek(
                    this.userService.User._id,
                    this.dia,
                    "profile"
                  )
                  .pipe(take(1))
                  .subscribe((response: any) => {
                    if (response.length == 0) {
                      this.dataProfile = [0, 0, 0, 0, 0, 0, 0];
                    } else {
                      this.dataProfile = response;
                    }

                    this.viewsProfileService
                      .getVisitsByWeek(
                        this.userService.User._id,
                        this.dia,
                        "search"
                      )
                      .pipe(take(1))
                      .subscribe((response: any) => {
                        if (response.length == 0) {
                          this.dataSearch = [0, 0, 0, 0, 0, 0, 0];
                        } else {
                          this.dataSearch = response;
                        }

                        this.viewsProfileService
                          .getVisitsByWeek(
                            this.userService.User._id,
                            this.dia,
                            "reaction"
                          )
                          .pipe(take(1))
                          .subscribe((response: any) => {
                            if (response.length == 0) {
                              this.dataReaction = [0, 0, 0, 0, 0, 0, 0];
                            } else {
                              this.dataReaction = response;
                            }
                            this.linesData();
                          });
                      });
                  });
              });
          });
      });
  }

  linesData() {
    this.analyticsToShow = "weeks";
    this.cd.detectChanges();

    this.lines = new Chart("lines", {
      type: "line",
      data: {
        labels: [
          this.translate.instant("days.0"),
          this.translate.instant("days.1"),
          this.translate.instant("days.2"),
          this.translate.instant("days.3"),
          this.translate.instant("days.4"),
          this.translate.instant("days.5"),
          this.translate.instant("days.6"),
        ],
        datasets: [
          {
            label: this.translate.instant("analytics-views.post"),
            data: this.dataPost,
            borderColor: "rgb(56, 94, 129)", // array should have same number of elements as number of dataset
            backgroundColor: "rgb(56, 94, 129, 0.1)", // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
          {
            label: this.translate.instant("analytics-views.chat"),
            data: this.dataChat,
            borderColor: "rgb(38, 194, 129)", // array should have same number of elements as number of dataset
            backgroundColor: "rgb(38, 194,129, 0.1)", // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
          {
            label: this.translate.instant("analytics-views.search"),
            data: this.dataSearch,
            borderColor: "rgb(241, 60, 60)", // array should have same number of elements as number of dataset
            backgroundColor: "rgb(214, 60,60, 0.1)", // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
          {
            label: this.translate.instant("analytics-views.profile"),
            data: this.dataProfile,
            borderColor: "rgb(106, 25, 181)", // array should have same number of elements as number of dataset
            backgroundColor: "rgb(106, 25, 181, 0.1)", // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
          {
            label: this.translate.instant("analytics-views.reaction"),
            data: this.dataReaction,
            borderColor: "rgb(56, 128, 255)", // array should have same number of elements as number of dataset
            backgroundColor: "rgb(56, 128, 255, 0.1)", // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
          {
            label: this.translate.instant("analytics-views.comment"),
            data: this.dataComment,
            borderColor: "rgb(238, 241, 48)", // array should have same number of elements as number of dataset
            backgroundColor: "rgb(238, 241, 48, 0.1)", // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                stepSize: 1,
              },
            },
          ],
        },
      },
    });
  }
  changeWeek(n) {
    this.dia = moment(this.dia).add(n, "weeks");
    this.week = moment(this.week).add(n, "weeks");
    this.weekEnd = moment(this.weekEnd).add(n, "weeks");
    this.changeWeekAdd = n;
    this.generateWeek();
  }

  years = [];
  daysYears = [];
  dateStart = moment(); //.add(1,'years')
  dateEnd = moment(); //.add(1,'years')
  data = [];
  dataPost = [];
  dataChat = [];
  dataSearch = [];
  dataProfile = [];
  dataReaction = [];
  dataComment = [];
  year = new Date().getFullYear();
  changeYearAdd = undefined;
  generateYear() {
    this.noData = false;
    this.years = [];
    /*  this.dateStart = moment(this.dateStart).add(-1,'years')
    this.dateEnd = moment(this.dateEnd).add(-1,'years') */
    // this.dateStart.set('year',moment().year());
    this.dateStart.set("month", 0);
    this.dateStart.set("date", 1);
    // this.dateEnd.set('year',(year.getFullYear()));
    this.dateEnd.set("month", 0);
    this.dateEnd.set("date", 0);
    this.dateEnd.add(11, "month");
    this.dateEnd.add(31, "days");

    while (this.dateEnd.diff(this.dateStart, "years") >= 0) {
      while (this.dateEnd.diff(this.dateStart, "months") >= 0) {
        while (this.dateEnd.diff(this.dateStart, "days") >= 0) {
          this.years.push({
            date: this.dateStart.format("YYYY-MM-DD"),
            post: 0,
            chat: 0,
            search: 0,
            profile: 0,
            reaction: 0,
            comment: 0,
          });
          //this.labels.push(this.dateStart.format('MM-DD'))
          this.dateStart.add(1, "days");
        }
        this.dateStart.add(1, "month");
      }
      this.dateStart.add(1, "year");
    }
    this.dateStart.add(-2, "years");
    this.dateStart.add(-1, "months");

    this.allViews.forEach((visits) => {
      let date = moment(new Date(visits.date)).format("YYYY-MM-DD");
      for (let key in this.years) {
        if (this.years[key].date == date) {
          this.noData = true;
        }
      }
    });

    this.linesDataYears();
  }

  linesDataYears() {
    this.analyticsToShow = "years";
    this.cd.detectChanges();
    this.dataPost = [];
    this.dataChat = [];
    this.dataSearch = [];
    this.dataProfile = [];
    this.dataReaction = [];
    this.dataComment = [];
    for (let i = 1; i <= 12; i++) {
      this.dataPost.push(0);
      this.dataChat.push(0);
      this.dataSearch.push(0);
      this.dataProfile.push(0);
      this.dataReaction.push(0);
      this.dataComment.push(0);
    }

    this.postViews.forEach((visits) => {
      let date = moment(new Date(visits.date)).format("YYYY-MM-DD");
      for (let key in this.years) {
        let mes = moment(new Date(this.years[key].date)).format("MM");
        if (this.years[key].date == date) {
          this.years[key].post += 1;
          this.dataPost[+mes - 1] += 1;
        }
      }
    });

    this.chatViews.forEach((visits) => {
      let date = moment(new Date(visits.date)).format("YYYY-MM-DD");
      for (let key in this.years) {
        let mes = moment(new Date(this.years[key].date)).format("MM");
        if (this.years[key].date == date) {
          this.years[key].chat += 1;
          this.dataChat[+mes - 1] += 1;
        }
      }
    });

    this.searchViews.forEach((visits) => {
      let date = moment(new Date(visits.date)).format("YYYY-MM-DD");
      for (let key in this.years) {
        let mes = moment(new Date(this.years[key].date)).format("MM");
        if (this.years[key].date == date) {
          this.years[key].search += 1;
          this.dataSearch[+mes - 1] += 1;
        }
      }
    });

    this.profileViews.forEach((visits) => {
      let date = moment(new Date(visits.date)).format("YYYY-MM-DD");
      for (let key in this.years) {
        let mes = moment(new Date(this.years[key].date)).format("MM");
        if (this.years[key].date == date) {
          this.years[key].profile += 1;
          this.dataProfile[+mes - 1] += 1;
        }
      }
    });

    this.reactionViews.forEach((visits) => {
      let date = moment(new Date(visits.date)).format("YYYY-MM-DD");
      for (let key in this.years) {
        let mes = moment(new Date(this.years[key].date)).format("MM");
        if (this.years[key].date == date) {
          this.years[key].reaction += 1;
          this.dataReaction[+mes - 1] += 1;
        }
      }
    });

    this.commentViews.forEach((visits) => {
      let date = moment(new Date(visits.date)).format("YYYY-MM-DD");
      for (let key in this.years) {
        let mes = moment(new Date(this.years[key].date)).format("MM");
        if (this.years[key].date == date) {
          this.years[key].comment += 1;
          this.dataComment[+mes - 1] += 1;
        }
      }
    });

    this.lines = new Chart("linesYear", {
      type: "line",
      data: {
        labels: [
          this.translate.instant("months.0"),
          this.translate.instant("months.1"),
          this.translate.instant("months.2"),
          this.translate.instant("months.3"),
          this.translate.instant("months.4"),
          this.translate.instant("months.5"),
          this.translate.instant("months.6"),
          this.translate.instant("months.7"),
          this.translate.instant("months.8"),
          this.translate.instant("months.9"),
          this.translate.instant("months.10"),
          this.translate.instant("months.11"),
        ],
        datasets: [
          {
            label: this.translate.instant("analytics-views.post"),
            data: this.dataPost,
            borderColor: "rgb(56, 94, 129)", // array should have same number of elements as number of dataset
            backgroundColor: "rgb(56, 94, 129, 0.1)", // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
          {
            label: this.translate.instant("analytics-views.chat"),
            data: this.dataChat,
            borderColor: "rgb(38, 194, 129)", // array should have same number of elements as number of dataset
            backgroundColor: "rgb(38, 194,129, 0.1)", // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
          {
            label: this.translate.instant("analytics-views.search"),
            data: this.dataSearch,
            borderColor: "rgb(241, 60, 60)", // array should have same number of elements as number of dataset
            backgroundColor: "rgb(214, 60,60, 0.1)", // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
          {
            label: this.translate.instant("analytics-views.profile"),
            data: this.dataProfile,
            borderColor: "rgb(106, 25, 181)", // array should have same number of elements as number of dataset
            backgroundColor: "rgb(106, 25, 181, 0.1)", // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
          {
            label: this.translate.instant("analytics-views.reaction"),
            data: this.dataReaction,
            borderColor: "rgb(56, 128, 255)", // array should have same number of elements as number of dataset
            backgroundColor: "rgb(56, 128, 255, 0.1)", // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
          {
            label: this.translate.instant("analytics-views.comment"),
            data: this.dataComment,
            borderColor: "rgb(238, 241, 48)", // array should have same number of elements as number of dataset
            backgroundColor: "rgb(238, 241, 48, 0.1)", // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                stepSize: 1,
              },
            },
          ],
        },
      },
    });
  }

  changeYear(n) {
    this.dateStart = moment(this.dateStart).add(n, "years");
    this.dateEnd = moment(this.dateEnd).add(n, "years");
    this.year = this.year + n;
    this.generateYear();
    this.changeYearAdd = n;
  }
  labelHours = [];
  hours = [];
  hourStart = moment().add(1, "days");
  hourEnd = moment().add(1, "days");
  day = moment().add(1, "days");
  linesHour;
  generateDay() {
    this.day = moment(this.hourStart).add(-1, "days");
    this.hourStart = moment(this.hourStart).add(-1, "days");
    this.hourEnd = moment(this.hourEnd).add(-1, "days");
    this.noData = false;
    this.hours = [];
    this.labelHours = [];
    this.hourStart.set("hours", 0);
    this.hourEnd.set("hours", 0);
    this.hourEnd.add(24, "hours");
    while (this.hourEnd.diff(this.hourStart, "hours") >= 1) {
      this.hours.push({
        date: this.hourStart.format("YYYY-MM-DD-HH"),
        post: 0,
        chat: 0,
        search: 0,
        profile: 0,
        reaction: 0,
        comment: 0,
      });
      this.hourStart.add(1, "hours");
    }

    this.allViews.forEach((visits) => {
      let date = moment(new Date(visits.date)).format("YYYY-MM-DD-HH");
      for (let key in this.hours) {
        if (this.hours[key].date == date) {
          this.noData = true;
        }
      }
    });

    this.linesHours();
  }

  linesHours() {
    this.analyticsToShow = "hours";
    this.cd.detectChanges();
    this.dataPost = [];
    this.dataChat = [];
    this.dataSearch = [];
    this.dataProfile = [];
    this.dataReaction = [];
    this.dataComment = [];
    for (let key in this.hours) {
      this.dataPost.push(0);
      this.dataChat.push(0);
      this.dataSearch.push(0);
      this.dataProfile.push(0);
      this.dataReaction.push(0);
      this.dataComment.push(0);
    }
    for (let i = 0; i <= this.hours.length; i++) {
      this.labelHours.push(i);
    }

    this.postViews.forEach((visits) => {
      let date = moment(new Date(visits.date)).format("YYYY-MM-DD-HH");
      for (let key in this.hours) {
        if (this.hours[key].date == date) {
          this.hours[key].post += 1;
          this.dataPost[key] += 1;
        }
      }
    });

    this.chatViews.forEach((visits) => {
      let date = moment(new Date(visits.date)).format("YYYY-MM-DD-HH");
      for (let key in this.hours) {
        if (this.hours[key].date == date) {
          this.hours[key].chat += 1;
          this.dataChat[key] += 1;
        }
      }
    });

    this.searchViews.forEach((visits) => {
      let date = moment(new Date(visits.date)).format("YYYY-MM-DD-HH");
      for (let key in this.hours) {
        if (this.hours[key].date == date) {
          this.hours[key].search += 1;
          this.dataSearch[key] += 1;
        }
      }
    });

    this.profileViews.forEach((visits) => {
      let date = moment(new Date(visits.date)).format("YYYY-MM-DD-HH");
      for (let key in this.hours) {
        if (this.hours[key].date == date) {
          this.hours[key].profile += 1;
          this.dataProfile[key] += 1;
        }
      }
    });

    this.reactionViews.forEach((visits) => {
      let date = moment(new Date(visits.date)).format("YYYY-MM-DD-HH");
      for (let key in this.hours) {
        if (this.hours[key].date == date) {
          this.hours[key].reaction += 1;
          this.dataReaction[key] += 1;
        }
      }
    });

    this.commentViews.forEach((visits) => {
      let date = moment(new Date(visits.date)).format("YYYY-MM-DD-HH");
      for (let key in this.hours) {
        if (this.hours[key].date == date) {
          this.hours[key].comment += 1;
          this.dataComment[key] += 1;
        }
      }
    });

    this.linesHour = new Chart("linesHour", {
      type: "line",
      data: {
        labels: this.labelHours,
        datasets: [
          {
            label: this.translate.instant("analytics-views.post"),
            data: this.dataPost,
            borderColor: "rgb(56, 94, 129)", // array should have same number of elements as number of dataset
            backgroundColor: "rgb(56, 94, 129, 0.1)", // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
          {
            label: this.translate.instant("analytics-views.chat"),
            data: this.dataChat,
            borderColor: "rgb(38, 194, 129)", // array should have same number of elements as number of dataset
            backgroundColor: "rgb(38, 194,129, 0.1)", // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
          {
            label: this.translate.instant("analytics-views.search"),
            data: this.dataSearch,
            borderColor: "rgb(241, 60, 60)", // array should have same number of elements as number of dataset
            backgroundColor: "rgb(214, 60,60, 0.1)", // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
          {
            label: this.translate.instant("analytics-views.profile"),
            data: this.dataProfile,
            borderColor: "rgb(106, 25, 181)", // array should have same number of elements as number of dataset
            backgroundColor: "rgb(106, 25, 181, 0.1)", // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
          {
            label: this.translate.instant("analytics-views.reaction"),
            data: this.dataReaction,
            borderColor: "rgb(56, 128, 255)", // array should have same number of elements as number of dataset
            backgroundColor: "rgb(56, 128, 255, 0.1)", // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
          {
            label: this.translate.instant("analytics-views.comment"),
            data: this.dataComment,
            borderColor: "rgb(238, 241, 48)", // array should have same number of elements as number of dataset
            backgroundColor: "rgb(238, 241, 48, 0.1)", // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                stepSize: 1,
              },
            },
          ],
        },
      },
    });
  }

  changeDay(n) {
    this.day = moment(this.day).add(n, "days");
    this.hourStart = moment(this.hourStart).add(n, "day");
    this.hourEnd = moment(this.hourEnd).add(n, "day");
    console.log(this.day);
    
    this.generateDay();
  }
  option: string = "";
  // postLines() {
  //   this.option = "post";
  //   this.segement = 1;
  // }

  months = [];
  month = moment();
  monthName;
  monthStart = moment();
  monthEnd = moment();
  labelMonths = [];
  changeMonthAdd = undefined;
  generateMonth() {
    this.noData = false;
    this.months = [];
    this.labelMonths = [];
    this.monthName = this.translate.instant(`months.${this.month.month()}`);
    this.monthStart.set("date", 1);
    this.monthEnd.add(1 - +this.monthEnd.format("DD"), "day");
    this.monthEnd.add(this.monthEnd.daysInMonth(), "day");
    this.monthEnd.add(-1, "day");

    while (this.monthEnd.diff(this.monthStart, "days") >= 0) {
      this.months.push({
        date: this.monthStart.format("YYYY-MM-DD"),
        post: 0,
        chat: 0,
        search: 0,
        profile: 0,
        reaction: 0,
        comment: 0,
      });
      this.monthStart.add(1, "days");
    }

    this.monthStart = moment(this.monthStart).add(-1, "month");

    this.allViews.forEach((visits) => {
      let date = moment(new Date(visits.date)).format("YYYY-MM-DD");
      for (let key in this.months) {
        if (this.months[key].date == date) {
          this.noData = true;
        }
      }
    });
    this.linesDataMonths();
  }

  linesDataMonths() {
    this.analyticsToShow = "months";
    this.cd.detectChanges();
    this.dataPost = [];
    this.dataChat = [];
    this.dataSearch = [];
    this.dataProfile = [];
    this.dataReaction = [];
    this.dataComment = [];
    for (let key in this.months) {
      this.dataPost.push(0);
      this.dataChat.push(0);
      this.dataSearch.push(0);
      this.dataProfile.push(0);
      this.dataReaction.push(0);
      this.dataComment.push(0);
    }
    for (let i = 1; i <= this.months.length; i++) {
      this.labelMonths.push(i);
    }
    this.postViews.forEach((visits) => {
      let date = moment(new Date(visits.date)).format("YYYY-MM-DD");
      for (let key in this.months) {
        if (this.months[key].date == date) {
          this.months[key].post += 1;
          this.dataPost[key] += 1;
        }
      }
    });
    this.chatViews.forEach((visits) => {
      let date = moment(new Date(visits.date)).format("YYYY-MM-DD");
      for (let key in this.months) {
        if (this.months[key].date == date) {
          this.months[key].chat += 1;
          this.dataChat[key] += 1;
        }
      }
    });

    this.searchViews.forEach((visits) => {
      let date = moment(new Date(visits.date)).format("YYYY-MM-DD");
      for (let key in this.months) {
        if (this.months[key].date == date) {
          this.months[key].search += 1;
          this.dataSearch[key] += 1;
        }
      }
    });

    this.profileViews.forEach((visits) => {
      let date = moment(new Date(visits.date)).format("YYYY-MM-DD");
      for (let key in this.months) {
        if (this.months[key].date == date) {
          this.months[key].profile += 1;
          this.dataProfile[key] += 1;
        }
      }
    });

    this.reactionViews.forEach((visits) => {
      let date = moment(new Date(visits.date)).format("YYYY-MM-DD");
      for (let key in this.months) {
        if (this.months[key].date == date) {
          this.months[key].reaction += 1;
          this.dataReaction[key] += 1;
        }
      }
    });

    this.commentViews.forEach((visits) => {
      let date = moment(new Date(visits.date)).format("YYYY-MM-DD");
      for (let key in this.months) {
        if (this.months[key].date == date) {
          this.months[key].comment += 1;
          this.dataComment[key] += 1;
        }
      }
    });

    this.lines = new Chart("linesMonth", {
      type: "line",
      data: {
        labels: this.labelMonths,
        datasets: [
          {
            label: this.translate.instant("analytics-views.post"),
            data: this.dataPost,
            borderColor: "rgb(56, 94, 129)", // array should have same number of elements as number of dataset
            backgroundColor: "rgb(56, 94, 129, 0.1)", // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
          {
            label: this.translate.instant("analytics-views.chat"),
            data: this.dataChat,
            borderColor: "rgb(38, 194, 129)", // array should have same number of elements as number of dataset
            backgroundColor: "rgb(38, 194,129, 0.1)", // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
          {
            label: this.translate.instant("analytics-views.search"),
            data: this.dataSearch,
            borderColor: "rgb(241, 60, 60)", // array should have same number of elements as number of dataset
            backgroundColor: "rgb(214, 60,60, 0.1)", // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
          {
            label: this.translate.instant("analytics-views.profile"),
            data: this.dataProfile,
            borderColor: "rgb(106, 25, 181)", // array should have same number of elements as number of dataset
            backgroundColor: "rgb(106, 25, 181, 0.1)", // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
          {
            label: this.translate.instant("analytics-views.reaction"),
            data: this.dataReaction,
            borderColor: "rgb(56, 128, 255)", // array should have same number of elements as number of dataset
            backgroundColor: "rgb(56, 128, 255, 0.1)", // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
          {
            label: this.translate.instant("analytics-views.comment"),
            data: this.dataComment,
            borderColor: "rgb(238, 241, 48)", // array should have same number of elements as number of dataset
            backgroundColor: "rgb(238, 241, 48, 0.1)", // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                stepSize: 1,
              },
            },
          ],
        },
      },
    });
  }

  changeMonth(n) {
    this.month = moment(this.month).add(n, "month");
    this.monthStart = moment(this.monthStart).add(n, "month");
    this.monthEnd = moment(this.monthEnd).add(n, "month");
    this.changeMonthAdd = n;
    this.generateMonth();
  }

  totalSponsor;
  analyticsToShowSponsor;
  Sponsor() {
    this.segement = 2;
    this.analyticsToShow = undefined;
    // this.option = 'analyticsSponsor'
    this.analyticsToShowSponsor = "hours";
  }
  sponsorDay() {
    this.analyticsToShowSponsor = "hours";
  }
  sponsorWeek() {
    this.analyticsToShowSponsor = "weeks";
  }
  sponsorMonth() {
    this.analyticsToShowSponsor = "months";
  }
  sponsorYear() {
    this.analyticsToShowSponsor = "years";
  }

  
  
//  sponsorSelect = this.userService.User.sponsors[0].name

}
