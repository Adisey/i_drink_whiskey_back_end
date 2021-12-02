import { Injectable } from '@nestjs/common';

import { CountriesService } from '../countries/countries.service';
import { DistilleriesService } from '../distilleries/distilleries.service';
import { PageGraphQLModel } from './models/pages.model.GraphQL';
import { RegionsService } from '../regions/regions.service';
import { WhiskyService } from '../whisky/whisky.service';

@Injectable()
export class PagesService {
  constructor(
    private readonly countriesService: CountriesService,
    private readonly regionsService: RegionsService,
    private readonly distilleriesService: DistilleriesService,
    private readonly whiskyService: WhiskyService,
  ) {}

  async pagesList(): Promise<PageGraphQLModel[]> {
    const countriesList = await this.countriesService.listAll();
    const regionsList = await this.regionsService.listAll();
    const distilleriesList = await this.distilleriesService.listAll();
    const whiskiesList = await this.whiskyService.listAll();

    return [
      ...countriesList,
      ...regionsList,
      ...distilleriesList,
      ...whiskiesList,
    ];
  }
}
