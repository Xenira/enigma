import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/enigma-common/user/user.service';

@Component({
  selector: 'enigma-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {}

  logout(): void {
    this.userService
      .logout()
      .subscribe(() => this.router.navigateByUrl('/welcome'));
  }
}
