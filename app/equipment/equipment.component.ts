import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { AuthGuard } from '../auth.guard';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css']
})
export class EquipmentComponent implements OnInit {
  
  navigateTo($event){
    if($event.target.value){
      this.router.navigate([$event.target.value]);
    }
  }

  constructor(private router:Router,private auth:AuthGuard) { }

  ngOnInit(): void {
  }

  logout():void{
    this.auth.logout();
  }

}
