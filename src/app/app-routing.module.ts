import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "./guards/auth-guard.service";
import { LandingGuard } from "./guards/landing-guard.service";
import { SessionGuardService } from "./guards/session-guard.service";

const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "login",
    loadChildren: () =>
      import("./login/login.module").then((m) => m.LoginPageModule),
    canActivate: [SessionGuardService],
  },
  {
    path: "signup",
    loadChildren: () =>
      import("./signup/signup.module").then((m) => m.SignupPageModule),
    canActivate: [SessionGuardService],
  },
  {
    path: "dashboard",
    loadChildren: () =>
      import("./dashboard/dashboard.module").then((m) => m.DashboardPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: "forgot",
    loadChildren: () =>
      import("./forgot/forgot.module").then((m) => m.ForgotPageModule),
    canActivate: [SessionGuardService],
  },
  {
    path: "newpassword",
    loadChildren: () =>
      import("./newpassword/newpassword.module").then(
        (m) => m.NewpasswordPageModule
      ),
  },
  {
    path: "verification",
    loadChildren: () =>
      import("./verification/verification.module").then(
        (m) => m.VerificationPageModule
      ),
  },
  {
    path: "langs",
    loadChildren: () =>
      import("./langs/langs.module").then((m) => m.LangsPageModule),
  },
  {
    path: "challenges",
    loadChildren: () =>
      import("./challenges/challenges.module").then(
        (m) => m.ChallengesPageModule
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: "landing/:id",
    loadChildren: () =>
      import("./patrocinadores/landing/landing.module").then(
        (m) => m.LandingPageModule
      ),
    canActivate: [LandingGuard],
  },
  {
    path: "profile",
    loadChildren: () =>
      import("./profile/profile.module").then((m) => m.ProfilePageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: "chat",
    loadChildren: () =>
      import("./chat/chat.module").then((m) => m.ChatPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: "post/:id",
    loadChildren: () =>
      import("./post/post.module").then((m) => m.PostPageModule),
    canActivate: [LandingGuard],
  },
  {
    path: "user/:username",
    loadChildren: () =>
      import("./user/user.module").then((m) => m.UserPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: "notifications",
    loadChildren: () =>
      import("./notifications/notifications.module").then(
        (m) => m.NotificationsPageModule
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: "news",
    loadChildren: () =>
      import("./news/news/news.module").then((m) => m.NewsPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: "challenges",
    loadChildren: () =>
      import("./challenges/challenges.module").then(
        (m) => m.ChallengesPageModule
      ),
    canActivate: [AuthGuardService],
  },
 {
    path: "challenge/:id",
    loadChildren: () =>
      import("./challenge/challenge.module").then(
        (m) => m.ChallengePageModule
      ),
    canActivate: [AuthGuardService],
  },
 {
    path: "challenge/:username/:id",
    loadChildren: () =>
      import("./challenge/challenge.module").then(
        (m) => m.ChallengePageModule
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: 'ranking',
    loadChildren: () => import('./ranking/ranking.module').then( m => m.RankingPageModule),
    canActivate:[AuthGuardService]
  },
  {
    path:"**",
    loadChildren: () => import('./not-found/not-found.module').then( m => m.NotFoundPageModule)
  
  },
  {
    path: 'challenge',
    loadChildren: () => import('./challenge/challenge.module').then( m => m.ChallengePageModule)
  },

  

 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      initialNavigation: "enabled",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
