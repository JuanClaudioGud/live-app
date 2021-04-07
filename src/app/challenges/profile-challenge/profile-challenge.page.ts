import { take } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChallengeService } from 'src/app/service/challenge.service';
import { UserService } from 'src/app/service/user.service';
import { IUserDataResponse } from 'src/app/models/IUserDataResponse';
import { IUser } from 'src/app/models/IUser';
import { ReusableComponentsIonic } from 'src/app/service/ionicHelpers.service';

@Component({
  selector: 'app-profile-challenge',
  templateUrl: './profile-challenge.page.html',
  styleUrls: ['./profile-challenge.page.scss'],
})
export class ProfileChallengePage implements OnInit {
  user: IUser = null
  noUser: boolean = false

  constructor(
    public userService: UserService,
    public route: ActivatedRoute,
    public challengeService: ChallengeService,
    public reusableCI: ReusableComponentsIonic
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.userService.getUserByUsername(this.route.snapshot.params.username)
      .pipe(take(1)).subscribe((userData: IUserDataResponse)=>
        this.user = userData.user,err=> this.noUser = true
      )
  }

}