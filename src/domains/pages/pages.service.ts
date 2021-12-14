//Core
import { Injectable } from '@nestjs/common';
//Main
//Domains
import { CountriesService } from '../countries/countries.service';
import { CountryGraphQLModel } from '../countries/models/countries.model.GraphQL';
import { DistilleriesService } from '../distilleries/distilleries.service';
import { DistilleryDBModel } from '../distilleries/models/distilleries.model.DB';
import { RegionDBModel } from '../regions/models/regions.model.DB';
import { RegionsService } from '../regions/regions.service';
import { WhiskyDBModel } from '../whisky/models/whisky.model.DB';
import { WhiskyService } from '../whisky/whisky.service';
//Local
import {
  PageGraphQLModel,
  PagesTreeGraphQLModel,
  PageTreeCountryGraphQLModel,
  PageTreeDistilleryGraphQLModel,
  PageTreeRegionGraphQLModel,
  PageWhiskyGraphQLModel,
} from './models/pages.model.GraphQL';

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

  async pagesListTree(): Promise<PagesTreeGraphQLModel> {
    const countriesList = await this.countriesService.listAll();
    const countries: Promise<PageTreeCountryGraphQLModel[]> = Promise.all(
      countriesList.map(async (c: CountryGraphQLModel) => {
        const regionList: RegionDBModel[] =
          await this.regionsService.listByCountry(c.id);

        const regions: Promise<PageTreeRegionGraphQLModel[]> = Promise.all(
          regionList.map(async (r: RegionDBModel) => {
            const distilleriesList: DistilleryDBModel[] =
              await this.distilleriesService.listByRegion(r.id);

            const distilleries: Promise<PageTreeDistilleryGraphQLModel[]> =
              Promise.all(
                distilleriesList.map(async (d: DistilleryDBModel) => {
                  const whiskiesList: WhiskyDBModel[] =
                    await this.whiskyService.listByDistillery(d.id);

                  const whiskies: PageWhiskyGraphQLModel[] = whiskiesList.map(
                    (w: WhiskyDBModel) => {
                      return {
                        id: w.id,
                        name: w.name,
                        description: w.description,
                      };
                    },
                  );

                  return {
                    id: d.id,
                    name: d.name,
                    description: d.description,
                    whiskies: whiskies,
                  };
                }),
              );

            return {
              id: r.id,
              name: r.name,
              description: r.description,
              distilleries: await distilleries,
            };
          }),
        );

        return {
          id: c.id,
          name: c.name,
          description: c.description,
          regions: await regions,
        };
      }),
    );

    return {
      countries: await countries,
    };
  }
}
