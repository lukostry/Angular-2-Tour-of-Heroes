import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';

import { Hero } from './hero';

import { ActivatedRoute } from '@angular/router';

import { HeroService } from './hero.service';

@Component({
  selector: 'my-hero-detail',
  templateUrl: 'app/hero-detail.component.html',
  styleUrls: ['app/hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit, OnDestroy {
  @Input() hero: Hero;
  @Output() close = new EventEmitter();
  error: any;
  sub: any;
  navigated = false; // true if navigated here

  constructor(
    private heroService: HeroService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      // In order to differentiate between add and edit we are adding a check to see if an id is passed in the url.
      // If the id is absent we bind HeroDetailComponent to an empty Hero object
      if (params['id'] !== undefined) {
        let id = +params['id'];
        this.navigated = true;
        this.heroService.getHero(id)
            .then(hero => this.hero = hero);
      } else { //Otherwise edits made through the UI will be bound back to the same hero property
        this.navigated = false;
        this.hero = new Hero();
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  save() {
    this.heroService
      .save(this.hero)
      .then(hero => {
        this.hero = hero; // saved hero, w/ id if new
        this.goBack(hero);
      })
      .catch(error => this.error = error); // TODO: Display error message
  }

  goBack(savedHero: Hero = null) {
      this.close.emit(savedHero); //we call emit to notify that we just added or modified a hero
      if (this.navigated) { window.history.back(); }
  }
}
